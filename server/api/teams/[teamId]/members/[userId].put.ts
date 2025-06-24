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
    const userId = getRouterParam(event, 'userId');

    if (!teamId || !userId) {
      throw createError({
        statusCode: 400,
        message: 'Team ID and User ID are required',
      });
    }

    const body = await readBody(event);
    if (!body?.role) {
      throw createError({
        statusCode: 400,
        message: 'Role is required',
      });
    }

    const { role } = body;

    // Validate role
    const validRoles = ['admin', 'regular', 'viewer'];
    if (!validRoles.includes(role)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid role specified',
      });
    }

    const supabase = await serverSupabaseClient<Database>(event);

    // Check if current user is admin of the team
    const { data: currentUserMembership, error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (membershipError || !currentUserMembership || currentUserMembership.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Only team admins can update member roles',
      });
    }

    // Check if target user is a member of the team
    const { data: targetMember, error: targetMemberError } = await supabase
      .from('team_members')
      .select('id, role, user_id')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (targetMemberError || !targetMember) {
      throw createError({
        statusCode: 404,
        message: 'User is not a member of this team',
      });
    }

    // Prevent user from changing their own role
    if (user.id === userId) {
      throw createError({
        statusCode: 400,
        message: 'You cannot change your own role',
      });
    }

    // Count current admins
    const { data: adminCount, error: adminCountError } = await supabase
      .from('team_members')
      .select('id', { count: 'exact' })
      .eq('team_id', teamId)
      .eq('role', 'admin')
      .eq('is_active', true);

    if (adminCountError) {
      throw createError({
        statusCode: 500,
        message: adminCountError.message,
      });
    }

    // Prevent removing the last admin
    if (targetMember.role === 'admin' && role !== 'admin' && (adminCount?.length || 0) <= 1) {
      throw createError({
        statusCode: 400,
        message: 'Cannot remove the last admin from the team',
      });
    }

    // Update the member's role
    const { data: updatedMember, error: updateError } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', targetMember.id)
      .select()
      .single();

    if (updateError) {
      throw createError({
        statusCode: 500,
        message: updateError.message,
      });
    }

    return {
      success: true,
      member: updatedMember,
      message: 'Member role updated successfully',
    };
  }
  catch (error: any) {
    console.error('Error updating member role:', error);
    return {
      success: false,
      error: error.message || 'Failed to update member role',
    };
  }
});
