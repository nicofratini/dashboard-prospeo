import type { Order, Subscription } from '@lemonsqueezy/lemonsqueezy.js';
import type { H3Event } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~~/types/database.types';

const handleSuccessfulOrderCreation = async (order: Order, event: H3Event) => {
  try {
    const email = order.data.attributes.user_email;

    if (!email) {
      console.error('Email not found');
      return;
    }

    const client = serverSupabaseServiceRole<Database>(event);

    // Fetch the profile from the database
    let { data: profile, error } = await client
      .from('profiles')
      .select('profile_id,email,payment_user_id')
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
        .upsert({ email, payment_user_id: order.data.attributes.customer_id.toString() })
        .select('profile_id,email')
        .single());

      if (error || !profile) {
        console.error(error || 'Profile was not created');
        return;
      }
    }
    else if (!profile.payment_user_id) {
      const { error: updateError } = await client
        .from('profiles')
        .update({ payment_user_id: order.data.attributes.customer_id.toString() })
        .eq('profile_id', profile.profile_id);

      if (updateError) {
        console.error(updateError);
        return;
      }
    }

    const productId = order.data.attributes.first_order_item.product_id;

    // Fetch the role associated with the product ID
    const { data: role, error: getRoleError } = await client
      .from('roles')
      .select()
      .eq('product_id', productId.toString())
      .maybeSingle();

    if (getRoleError || !role) {
      console.error(getRoleError || `Role with productId:${productId}  not found`);
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

    // [TIP] Uncomment code below to add collaborator to the github repository after purchase. GITHUB_TOKEN is required.

    /* const { addCollaborator } = githubServerClient(event);

    const isSuccesfullyAdded = await addCollaborator(email);

    if (!isSuccesfullyAdded) {
      console.error('Failed to add collaborator');
      return;
    } */

    const { sendEmail } = emailServerClient(event);

    const { general: { contactEmail } } = useAppConfig();

    const { name } = useSiteConfig(event);

    await sendEmail({
      from: `${name} <${contactEmail}>`,
      to: email,
      subject: 'Welcome to Nuxtbe SaaS Starter Kit - Your Purchase is Complete!',
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

const handleSubscriptionExpired = async (subscription: Subscription, event: H3Event) => {
  try {
    const email = subscription.data.attributes.user_email;
    await removeUserRoles(email, event);
  }
  catch (err) {
    console.error('Error handling subscription expiration:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
};

const handleSubscriptionUpdated = async (subscription: Subscription, event: H3Event) => {
  try {
    const email = subscription.data.attributes.user_email;
    const productId = subscription.data.attributes.product_id;
    await updateUserRoles(email, productId, event);
  }
  catch (err) {
    console.error('Error handling subscription update:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
};

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event);
  const signatureHeader = getHeader(event, 'X-Signature');

  if (!body || !signatureHeader) {
    throw createError({
      statusCode: 400,
      statusMessage: !body ? 'Invalid request body!' : 'Stripe Signature Header is missing!',
    });
  }

  const { lemonsqueezyWebhookSecret } = useRuntimeConfig(event);

  if (!lemonsqueezyWebhookSecret) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook secret is missing!',
    });
  }

  try {
    validateSignature(lemonsqueezyWebhookSecret, body, signatureHeader);
  }
  catch (err) {
    console.error(err);
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot validate signature!',
    });
  }

  const parsedHookEvent = JSON.parse(body);

  try {
    switch (parsedHookEvent?.meta?.event_name) {
      case 'order_created': {
        /*
          This event is triggered when single payment or subscription has been successfully created. Which means
          the payment has been successfully processed, and I need to save it to the database.
        */
        if (parsedHookEvent.data.attributes.status === 'paid') {
          console.log(`Started processing order_created event with id: ${parsedHookEvent.data.id}`);
          await handleSuccessfulOrderCreation(parsedHookEvent as Order, event);
          console.log(`Successfully handled order_created event with id: ${parsedHookEvent.data.id}`);
        }
        break;
      }
      // Documentation: https://lemonsqueezy.com/docs/webhooks#subscription_plan_changed
      case 'subscription_plan_changed': {
        console.log(`Started processing subscription_plan_changed event with id: ${parsedHookEvent.data.id}`);
        await handleSubscriptionUpdated(parsedHookEvent as Subscription, event);
        console.log(`Successfully handled subscription_plan_changed event with id: ${parsedHookEvent.data.id}`);
        break;
      }
      case 'subscription_expired': {
        // [TIP] Lemon Squeezy has built-in recovery and dunning features to help you recover lost revenue from
        // abandoned carts and subscription payment failures.
        console.log(`Started processing subscription_updated:expired event with id: ${parsedHookEvent.data.id}`);
        await handleSubscriptionExpired(parsedHookEvent as Subscription, event);
        console.log(`Successfully handled subscription_updated:expired event with id: ${parsedHookEvent.data.id}`);
        break;
      }
      default:
        console.log(`Unhandled event type ${parsedHookEvent?.meta?.event_name}`);
    }
  }
  catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }

  return { received: true };
},
);
