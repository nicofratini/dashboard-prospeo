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

    const body = await readBody(event);
    if (!body?.name) {
      throw createError({
        statusCode: 400,
        message: 'Team name is required',
      });
    }

    const supabase = await serverSupabaseClient<Database>(event);

    // Create the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: body.name,
        description: body.description || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (teamError) {
      throw createError({
        statusCode: 500,
        message: teamError.message,
      });
    }

    // Add the creator as admin of the team
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'admin',
        invited_by: user.id,
      });

    if (memberError) {
      // If adding member fails, clean up the team
      await supabase.from('teams').delete().eq('id', team.id);
      throw createError({
        statusCode: 500,
        message: memberError.message,
      });
    }

    // Update user's profile to link to this team if they don't have one
    const { data: profile } = await supabase
      .from('profiles')
      .select('team_id')
      .eq('user_id', user.id)
      .single();

    if (profile && !profile.team_id) {
      await supabase
        .from('profiles')
        .update({ team_id: team.id })
        .eq('user_id', user.id);
    }

    return {
      success: true,
      team,
    };
  }
  catch (error: any) {
    console.error('Error creating team:', error);
    return {
      success: false,
      error: error.message || 'Failed to create team',
    };
  }
});
