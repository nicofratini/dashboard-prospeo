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
    if (!body || Object.keys(body).length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Update data is required',
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
        message: 'Only team admins can update team settings',
      });
    }

    // Prepare update data (only allow certain fields)
    const allowedFields = ['name', 'description', 'avatar_url', 'settings'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No valid fields to update',
      });
    }

    // Update the team
    const { data: team, error: updateError } = await supabase
      .from('teams')
      .update(updateData)
      .eq('id', teamId)
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
      team,
    };
  }
  catch (error: any) {
    console.error('Error updating team:', error);
    return {
      success: false,
      error: error.message || 'Failed to update team',
    };
  }
});
