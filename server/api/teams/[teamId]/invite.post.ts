import type { Database } from '~~/types/database.types';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    const teamId = getRouterParam(event, 'teamId');
    if (!teamId) {
      throw createError({
        statusCode: 400,
        message: 'Team ID is required',
      });
    }

    const body = await readBody(event);
    if (!body?.email) {
      throw createError({
        statusCode: 400,
        message: 'Email is required',
      });
    }

    const { email, role = 'regular' } = body;

    // Validate role
    const validRoles = ['admin', 'regular', 'viewer'];
    if (!validRoles.includes(role)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid role specified',
      });
    }

    const supabase = await serverSupabaseClient<Database>(event);

    // Check if user is admin of the team
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (membershipError || !membership || membership.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Only team admins can invite users',
      });
    }

    // Find user by email
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, email')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (profileError) {
      throw createError({
        statusCode: 500,
        message: profileError.message,
      });
    }

    if (!profiles || profiles.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'User with this email not found',
      });
    }

    const targetUserId = profiles[0].user_id;
    if (!targetUserId) {
      throw createError({
        statusCode: 400,
        message: 'Invalid user profile',
      });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id, is_active')
      .eq('team_id', teamId)
      .eq('user_id', targetUserId)
      .single();

    if (existingMember) {
      if (existingMember.is_active) {
        throw createError({
          statusCode: 409,
          message: 'User is already a member of this team',
        });
      } else {
        // Reactivate the membership
        const { data: reactivatedMember, error: reactivateError } = await supabase
          .from('team_members')
          .update({
            is_active: true,
            role,
            invited_by: user.id,
            joined_at: new Date().toISOString(),
          })
          .eq('id', existingMember.id)
          .select()
          .single();

        if (reactivateError) {
          throw createError({
            statusCode: 500,
            message: reactivateError.message,
          });
        }

        return {
          success: true,
          member: reactivatedMember,
          message: 'User has been re-invited to the team',
        };
      }
    }

    // Add user to team
    const { data: newMember, error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: targetUserId,
        role,
        invited_by: user.id,
      })
      .select()
      .single();

    if (memberError) {
      throw createError({
        statusCode: 500,
        message: memberError.message,
      });
    }

    // Update user's profile team_id if they don't have one
    const { data: targetProfile } = await supabase
      .from('profiles')
      .select('team_id')
      .eq('user_id', targetUserId)
      .single();

    if (targetProfile && !targetProfile.team_id) {
      await supabase
        .from('profiles')
        .update({ team_id: teamId })
        .eq('user_id', targetUserId);
    }

    return {
      success: true,
      member: newMember,
      message: 'User has been invited to the team',
    };
  } catch (error: any) {
    console.error('Error inviting user to team:', error);
    return {
      success: false,
      error: error.message || 'Failed to invite user to team',
    };
  }
});
