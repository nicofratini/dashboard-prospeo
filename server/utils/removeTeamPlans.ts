import type { H3Event } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~~/types/database.types';

/**
 * This function removes all plans for a user identified by their email and updates their subscription status.
 *
 * @param {string} email - The email of the user whose plans are to be removed.
 * @param {H3Event} event - The event object containing the request context.
 * @throws Will throw an error if the email is not provided or if any database operation fails.
 */
export default async (email: string, event: H3Event) => {
  const client = serverSupabaseServiceRole<Database>(event);

  if (!email) {
    console.error('Email not found');
    throw createError({
      statusCode: 500,
      statusMessage: 'Email not found',
    });
  }

  // Fetch the profile from the database
  const { data: profile, error } = await client
    .from('profiles')
    .select('profile_id,email')
    .eq('email', email)
    .single();

  if (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: `Profile with email ${email} cannot be found`,
    });
  }

  // deletes all plans for the user, even if there are multiple
  const { error: updateTeamPlanError } = await client
    .from('team_plans')
    .delete()
    .match({ profile_id: profile.profile_id });

  if (updateTeamPlanError) {
    console.error(updateTeamPlanError);
    throw createError({
      statusCode: 500,
      statusMessage: `Plans for profile ${profile.profile_id} cannot be deleted`,
    });
  }

  const { error: updateProfileError } = await client
    .from('profiles')
    .update({ is_subscribed: false })
    .eq('profile_id', profile.profile_id);

  if (updateProfileError) {
    console.error(updateProfileError);
    throw createError({
      statusCode: 500,
      statusMessage: `Profile ${profile.profile_id} cannot be updated`,
    });
  }
};
