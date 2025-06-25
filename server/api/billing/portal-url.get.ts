import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { Database } from '~~/types/database.types';
import { useServerStripe } from '#stripe/server';

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
  const stripe = await useServerStripe(event);

  const { team_id } = await getQuery(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const { data: team, error } = await client
    .from('teams')
    .select('stripe_id')
    .eq('id', team_id)
    .single();

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: error || 'Missing stripe_id',
    });
  }

  const { baseUrl } = useRuntimeConfig().public;

  const session = await stripe.billingPortal.sessions.create({
    customer: team.stripe_id,
    return_url: `${baseUrl}/dashboard/settings/billing`,
  });

  return {
    url: session.url,
  };
});
