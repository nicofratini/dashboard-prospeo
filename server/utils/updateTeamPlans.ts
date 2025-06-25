import type { H3Event } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~~/types/database.types';

/**
 * This function updates the plans for a user identified by their email.
 *
 * @param email - The email of the user whose plans are to be updated.
 * @param productId - The ID of the product for which the plan is to be updated.
 * @param event - The event object containing the request context.
 */
export default async (email: string, productId: number, event: H3Event) => {
  if (!email) {
    console.error('Email not found');
    throw createError({
      statusCode: 500,
      statusMessage: 'Email not found',
    });
  }

  console.log('Updating plans for user with email:', email);

  const client = serverSupabaseServiceRole<Database>(event);

  // Fetch the profile from the database
  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('profile_id,email')
    .eq('email', email)
    .single();

  if (profileError) {
    console.error(profileError);
    throw createError({
      statusCode: 500,
      statusMessage: `Profile with email ${email} cannot be found`,
    });
  }

  // Fetch the profile plan and plan associated with the product ID
  const [{ data: teamPlan, error: teamPlanError }, { data: plan, error: planError }] = await Promise.all([
    client.from('team_plans').select('plan_id').eq('profile_id', profile.profile_id).single(),
    client.from('plans').select().eq('product_id', productId).single(),
  ]);

  if (teamPlanError || planError) {
    console.error(teamPlanError || planError);
    throw createError({
      statusCode: 500,
      statusMessage: `Error fetching profile plan or plan for profile ${profile.profile_id}`,
    });
  }

  // Check if the user already has the plan assigned
  if (teamPlan.plan_id === plan.id) {
    console.log('Plan is already assigned');
    throw createError({
      statusCode: 500,
      statusMessage: 'Plan is already assigned',
    });
  }

  // Update the profile plan
  const { error: teamPlanUpdateError } = await client
    .from('team_plans')
    .update({ plan_id: plan.id })
    .eq('profile_id', profile.profile_id);

  if (teamPlanUpdateError) {
    console.error(teamPlanUpdateError);
    throw createError({
      statusCode: 500,
      statusMessage: `Profile plan for profile ${profile.profile_id} cannot be updated`,
    });
  }
};
