import type { Stripe } from 'stripe';
import type { H3Event } from 'h3';
import { useServerStripe } from '#stripe/server';
import type { Plan } from '~~/types/billing.d.ts';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~~/types/database.types';

/**
 * Handles the completion of a Stripe checkout session.
 *
 * @param {string} id - The ID of the Stripe checkout session.
 * @param {Stripe} stripe - The Stripe instance.
 * @param {Plan[]} plans - The list of available plans.
 * @param {H3Event} event - The H3 event object.
 */
const handleCheckoutSessionCompleted = async (
  id: string,
  stripe: Stripe,
  plans: Plan[],
  event: H3Event,
) => {
  try {
    const client = serverSupabaseServiceRole<Database>(event);

    const session = await stripe.checkout.sessions.retrieve(id, { expand: ['line_items'] });

    const teamId = session?.client_reference_id;
    const email = session?.customer_details?.email;

    if (!teamId) {
      console.error('Team id not found');
      return;
    }
    if (!email) {
      console.error('Email not found');
      return;
    }

    const { data: team, error } = await client
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    if (!team) {
      console.error('Team not found for the provided team ID:', teamId);
      return;
    }

    // Get the product ID from the session's line items
    const productId = session?.line_items?.data[0]?.price?.product as string;

    // Check if the product ID exists in app config
    const isValidProduct = plans.some((plan: Plan) => plan?.productId === productId);

    if (!isValidProduct) {
      console.error('Retrieved productId does not exist in app config. Please check if the productId in app.config is correct.');
      return;
    }

    // Fetch the plan associated with the product ID
    const { data: plan, error: getPlanError } = await client
      .from('plans')
      .select()
      .eq('product_id', productId)
      .maybeSingle();

    if (getPlanError || !plan) {
      console.error(getPlanError || `Plan with productId:${productId} not found`);
      return;
    }

    // Check if the user already has a plan
    const { data: teamPlan, error: getTeamPlanError } = await client
      .from('team_plans')
      .select()
      .eq('plan_id', plan.id)
      .eq('team_id', team.id)
      .maybeSingle();

    if (getTeamPlanError) {
      console.error(getTeamPlanError);
      return;
    }

    if (teamPlan) {
      const { error: updateTeamPlanError } = await client
        .from('team_plans')
        .update({ ended_at: new Date().toISOString(), end_reason: 'upgrade' });

      if (updateTeamPlanError) {
        console.error(updateTeamPlanError);
        return;
      }
    }

    const { error: planInsertError } = await client.from('team_plans').insert({
      team_id: team.id,
      plan_id: plan.id,
      inbound_quota: plan.inbound_quota,
    });

    if (planInsertError) {
      console.error(planInsertError);
      return;
    }

    const { error: updateProfileError } = await client
      .from('teams')
      .update({
        is_subscribed: true,
        stripe_id: session.customer,
      })
      .eq('id', team.id);

    if (updateProfileError) {
      console.error(updateProfileError);
      return;
    }

    const { sendEmail } = emailServerClient(event);

    const { general: { contactEmail } } = useAppConfig();

    const { name } = useSiteConfig(event);

    // TODO Update email regarding our activity
    await sendEmail({
      from: `${name} <${contactEmail}>`,
      to: email,
      subject: `Welcome to ${name} - Your Purchase is Complete!`,
      html: '<p>Thank you for subscribing!</p>',
    });
  }
  catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription, stripe: Stripe, event: H3Event) => {
  try {
    // Get the Supabase client with service plan
    const client = serverSupabaseServiceRole<Database>(event);

    const { data: team, error } = await client
      .from('teams')
      .select('id')
      .eq('stripe_id', subscription.customer as string)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    const { error: updateTeamPlanError } = await client
      .from('team_plans')
      .update({ ended_at: new Date().toISOString(), end_reason: 'canceled' })
      .match({ team_id: team.id, ended_at: null });

    if (updateTeamPlanError) {
      console.error(updateTeamPlanError);
      return;
    }

    const { error: updateProfileError } = await client
      .from('teams')
      .update({ is_subscribed: false })
      .eq('id', team.id);

    if (updateProfileError) {
      console.error(updateProfileError);
      return;
    }
  }
  catch (err) {
    console.error('Error handling subscription update:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription, stripe: Stripe, event: H3Event) => {
  try {
    const client = serverSupabaseServiceRole<Database>(event);

    const { product: productId } = subscription.items.data[0]?.price || {};
    const { email } = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Response<Stripe.Customer>;

    if (!email) {
      console.error('Email not found');
      return;
    }

    const { data: team, error: teamError } = await client
      .from('teams')
      .select('id')
      .eq('stripe_id', subscription.customer.toString())
      .single();

    if (teamError) {
      console.error(teamError);
      return;
    }

    // Fetch the team plan and plan associated with the product ID
    const [{ data: teamPlan, error: teamPlanError }, { data: plan, error: planError }] = await Promise.all([
      client.from('team_plans').select('plan_id').match({ team_id: team.id, ended_at: null }).single(),
      client.from('plans').select().eq('product_id', productId as string).single(),
    ]);

    if (teamPlanError || planError) {
      console.error(teamPlanError || planError);
      return;
    }

    if (teamPlan.plan_id === plan.id && subscription.cancel_at_period_end && subscription.cancel_at) {
      // If plan should be canceled at the end of billing period
      const { error: teamPlanUpdateError } = await client
        .from('team_plans')
        .update({
          ended_at: new Date(subscription.cancel_at * 1000).toISOString(),
          end_reason: subscription.cancellation_details?.reason || 'canceled',
        })
        .match({ team_id: team.id, ended_at: null });
      if (teamPlanUpdateError) {
        console.error(teamPlanUpdateError);
        return;
      }
    }
    else if (teamPlan.plan_id !== plan.id) {
      // If the plan is different, we need to cancel it and add a new one
      const { error: teamPlanUpdateError } = await client
        .from('team_plans')
        .update({ ended_at: new Date().toISOString(), end_reason: 'upgrade' })
        .match({ team_id: team.id, ended_at: null });
      if (teamPlanUpdateError) {
        console.error(teamPlanUpdateError);
        return;
      }
      const { error: planInsertError } = await client.from('team_plans').insert({
        team_id: team.id,
        plan_id: plan.id,
        inbound_quota: plan.inbound_quota,
      });
      if (planInsertError) {
        console.error(planInsertError);
        return;
      }
    }
  }
  catch (err) {
    console.error('Error handling subscription update:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
};

/**
 * Defines the event handler for Stripe webhooks.
 *
 * @param {H3Event} event - The H3 event object.
 * @returns {Promise<string | { error: string }>} - The response message or error object.
 */
export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);
  const body = await readRawBody(event);
  const signature = getHeader(event, 'stripe-signature');

  if (!body || !signature) {
    return { error: !body ? 'Invalid request body!' : 'Stripe Signature Header is missing!' };
  }

  const { stripeWebhookSecret } = useRuntimeConfig(event);
  let stripeEvent: Stripe.Event;

  try {
    // Construct the Stripe event from the request body and signature
    // [TIP] You might need to change this to await stripe.webhooks.constructEventAsync in some cases. For example, when you're deploying to Cloudflare Workers.
    stripeEvent = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  }
  catch (err) {
    console.log(err);
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot construct event!',
    });
  }

  const { billing: { plans } }: { billing: { plans: Plan[] } } = useAppConfig();

  try {
    // Handle different types of Stripe events
    switch (stripeEvent?.type) {
      case 'checkout.session.completed': {
        await handleCheckoutSessionCompleted(stripeEvent.data.object.id, stripe, plans, event);
        console.log(`Checkout session ${stripeEvent.data.object.id} has been processed`);
        break;
      }
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object, stripe, event);
        console.log(`Subscription ${stripeEvent.data.object.id} has been deleted`);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object, stripe, event);
        console.log(`Subscription ${stripeEvent.data.object.id} has been updated`);
        break;
      default:
        console.log(`Unhandled event type ${stripeEvent?.type}`);
    }
  }
  catch (err) {
    console.log(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unexpected server error',
    });
  }

  return { received: true };
});
