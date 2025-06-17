import { getCustomer } from '@lemonsqueezy/lemonsqueezy.js';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { Database } from '~~/types/database.types';

/**
 * GET /api/billing/portal-url
 *
 * Get the customer portal URL for the authenticated user from Stripe orLemon Squeezy.
 * The portal URL allows customers to manage their subscriptions and billing information.
 *
 * @requires Authentication - User must be logged in
 * @requires Database - User must have an associated payment_user_id in profiles table
 * @requires Environment - LEMONSQUEEZY_API_KEY or STRIPE_SERVER_SECRET_KEY must be configured
 *
 * @throws {401} Unauthorized - If user is not authenticated
 * @throws {404} Not Found - If payment user or portal URL not found
 *
 * @returns {Object} Response
 * @returns {string} Response.url - The customer portal URL (valid for 24 hours)
 */
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  // Get authenticated user
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  // Get profile with payment_user_id
  const { data: profile, error } = await client
    .from('profiles')
    .select('payment_user_id')
    .eq('user_id', user.id)
    .single();

  if (error || !profile?.payment_user_id) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Payment user not found',
    });
  }

  const { billingProvider, customerPortalUrl } = useAppConfig().billing;

  if (billingProvider === 'lemonsqueezy') {
    setupServerLemonsqueezy(event);

    try {
      const { data: customer } = await getCustomer(profile.payment_user_id);
      const customerPortalUrl = customer?.data?.attributes?.urls?.customer_portal;

      if (!customerPortalUrl) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Customer portal URL not found',
        });
      }

      return {
        url: customerPortalUrl,
      };
    }
    catch (err) {
      console.error('Error fetching customer portal URL for Lemon Squeezy:', err);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to get customer portal URL',
      });
    }
  }
  else if (billingProvider === 'stripe') {
    if (!customerPortalUrl) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Customer portal URL not found',
      });
    }

    return {
      url: customerPortalUrl,
    };
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Billing provider not found',
  });
});
