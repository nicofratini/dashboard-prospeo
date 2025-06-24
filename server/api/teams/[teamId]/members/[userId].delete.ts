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

    const supabase = await serverSupabaseClient<Database>(event);

    // Check if current user is admin of the team or removing themselves
    const { data: currentUserMembership, error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (membershipError || !currentUserMembership) {
      throw createError({
        statusCode: 403,
        message: 'You are not a member of this team',
      });
    }

    const isAdmin = currentUserMembership.role === 'admin';
    const isRemovingSelf = user.id === userId;

    // Only admins can remove others, anyone can remove themselves
    if (!isAdmin && !isRemovingSelf) {
      throw createError({
        statusCode: 403,
        message: 'Only team admins can remove other members',
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
    if (targetMember.role === 'admin' && (adminCount?.length || 0) <= 1) {
      throw createError({
        statusCode: 400,
        message: 'Cannot remove the last admin from the team',
      });
    }

    // Deactivate the member instead of deleting (for audit purposes)
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ is_active: false })
      .eq('id', targetMember.id);

    if (updateError) {
      throw createError({
        statusCode: 500,
        message: updateError.message,
      });
    }

    // If user is removing themselves and they have no other teams,
    // we should handle the team_id in their profile
    if (isRemovingSelf) {
      // Check if user has other active teams
      const { data: otherTeams, error: otherTeamsError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          teams (id, name)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .neq('team_id', teamId);

      if (!otherTeamsError && otherTeams && otherTeams.length > 0) {
        // User has other teams, switch to the first one
        const firstOtherTeam = otherTeams[0];
        if (firstOtherTeam.teams) {
          await supabase
            .from('profiles')
            .update({ team_id: firstOtherTeam.team_id })
            .eq('user_id', userId);
        }
      }
      else {
        // User has no other teams, clear team_id
        await supabase
          .from('profiles')
          .update({ team_id: null })
          .eq('user_id', userId);
      }
    }

    return {
      success: true,
      message: isRemovingSelf ? 'You have left the team' : 'Member removed from team',
    };
  }
  catch (error: any) {
    console.error('Error removing team member:', error);
    return {
      success: false,
      error: error.message || 'Failed to remove team member',
    };
  }
});
