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
    // Get the Supabase client with service role
    const client = serverSupabaseServiceRole<Database>(event);

    // Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(id, { expand: ['line_items'] });

    // Get the customer's email from the session
    const email = session?.customer_details?.email;

    if (!email) {
      console.error('Email not found');
      return;
    }

    // Fetch the profile from the database
    let { data: profile, error } = await client
      .from('profiles')
      .select('profile_id,email')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    /**
         * If the profile does not exist, create a new one. It may be needed when you signed up with one email, but
         * then paid with Google Pay with another email. Or if you decided to allow payment for unregistered users.
     */
    if (!profile) {
      ({ data: profile, error } = await client
        .from('profiles')
        .upsert({ email })
        .select('profile_id,email')
        .single());

      if (error || !profile) {
        console.error(error || 'Profile was not created');
        return;
      }
    }

    // Get the product ID from the session's line items
    const productId = session?.line_items?.data[0]?.price?.product as string;

    // Check if the product ID exists in app config
    const isValidProduct = plans.some((plan: Plan) => plan?.productId === productId);

    if (!isValidProduct) {
      console.error('Retrieved productId does not exist in app config. Please check if the productId in app.config is correct.');
      return;
    }

    // Fetch the role associated with the product ID
    const { data: role, error: getRoleError } = await client
      .from('roles')
      .select()
      .eq('product_id', productId)
      .maybeSingle();

    if (getRoleError || !role) {
      console.error(getRoleError || `Role with productId:${productId} not found`);
      return;
    }

    // Check if the user already has a role
    const { data: profileRole, error: getProfileRoleError } = await client
      .from('profile_roles')
      .select()
      .eq('role_id', role.id)
      .eq('profile_id', profile.profile_id)
      .maybeSingle();

    if (getProfileRoleError) {
      console.error(getProfileRoleError);
      return;
    }

    if (!profileRole) {
      // Assign the role to the user
      const { error } = await client.from('profile_roles').insert({
        profile_id: profile.profile_id,
        role_id: role.id,
      });

      if (error) {
        console.error(error);
        return;
      }
    }

    const { sendEmail } = emailServerClient(event);

    const { general: { contactEmail } } = useAppConfig();

    const { name } = useSiteConfig(event);

    await sendEmail({
      from: `${name} <${contactEmail}>`,
      to: email,
      subject: `Welcome to ${name} - Your Purchase is Complete!`,
      html: '<p>Thank you for subscribing! You will be invited to the Git repository shortly.</p>',
    });

    const { error: updateProfileError } = await client
      .from('profiles')
      .update({ is_subscribed: true })
      .eq('profile_id', profile.profile_id);

    if (updateProfileError) {
      console.error(updateProfileError);
      return;
    }
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
    // Get the Supabase client with service role
    const client = serverSupabaseServiceRole<Database>(event);

    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Response<Stripe.Customer>;

    const email = customer?.email;

    if (!email) {
      console.error('Email not found');
      return;
    }

    // Fetch the profile from the database
    const { data: profile, error } = await client
      .from('profiles')
      .select('profile_id,email')
      .eq('email', email)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    // deletes all roles for the user, even if there are multiple
    const { error: updateProfileRoleError } = await client
      .from('profile_roles')
      .delete()
      .match({ profile_id: profile.profile_id });

    if (updateProfileRoleError) {
      console.error(updateProfileRoleError);
      return;
    }

    const { error: updateProfileError } = await client
      .from('profiles')
      .update({ is_subscribed: false })
      .eq('profile_id', profile.profile_id);

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

    // Fetch the profile from the database
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('profile_id,email')
      .eq('email', email)
      .single();

    if (profileError) {
      console.error(profileError);
      return;
    }

    // Fetch the profile role and role associated with the product ID
    const [{ data: profileRole, error: profileRoleError }, { data: role, error: roleError }] = await Promise.all([
      client.from('profile_roles').select('role_id').eq('profile_id', profile.profile_id).single(),
      client.from('roles').select().eq('product_id', productId as string).single(),
    ]);

    if (profileRoleError || roleError) {
      console.error(profileRoleError || roleError);
      return;
    }

    // Check if the user already has the role assigned
    if (profileRole.role_id === role.id) {
      console.log('Role is already assigned');
      return;
    }

    // Update the profile role
    const { error: profileRoleUpdateError } = await client
      .from('profile_roles')
      .update({ role_id: role.id })
      .eq('profile_id', profile.profile_id);

    if (profileRoleUpdateError) {
      console.error(profileRoleUpdateError);
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
