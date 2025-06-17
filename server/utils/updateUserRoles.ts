import type { H3Event } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~~/types/database.types';

/**
 * This function updates the roles for a user identified by their email.
 *
 * @param email - The email of the user whose roles are to be updated.
 * @param productId - The ID of the product for which the role is to be updated.
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

  console.log('Updating roles for user with email:', email);

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

  // Fetch the profile role and role associated with the product ID
  const [{ data: profileRole, error: profileRoleError }, { data: role, error: roleError }] = await Promise.all([
    client.from('profile_roles').select('role_id').eq('profile_id', profile.profile_id).single(),
    client.from('roles').select().eq('product_id', productId).single(),
  ]);

  if (profileRoleError || roleError) {
    console.error(profileRoleError || roleError);
    throw createError({
      statusCode: 500,
      statusMessage: `Error fetching profile role or role for profile ${profile.profile_id}`,
    });
  }

  // Check if the user already has the role assigned
  if (profileRole.role_id === role.id) {
    console.log('Role is already assigned');
    throw createError({
      statusCode: 500,
      statusMessage: 'Role is already assigned',
    });
  }

  // Update the profile role
  const { error: profileRoleUpdateError } = await client
    .from('profile_roles')
    .update({ role_id: role.id })
    .eq('profile_id', profile.profile_id);

  if (profileRoleUpdateError) {
    console.error(profileRoleUpdateError);
    throw createError({
      statusCode: 500,
      statusMessage: `Profile role for profile ${profile.profile_id} cannot be updated`,
    });
  }
};
