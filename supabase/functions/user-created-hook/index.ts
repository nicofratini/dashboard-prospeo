import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { record } = await req.json();

    if (!record?.id || !record?.email) {
      throw new Error('Invalid user record');
    }

    console.log('Processing user creation for:', record.email);

    // Create user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        user_id: record.id,
        email: record.email,
        full_name: record.user_metadata?.full_name || null,
        username: record.user_metadata?.username || null,
        avatar_url: record.user_metadata?.avatar_url || null,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }

    console.log('Profile created successfully:', profile.user_id);

    // Create default team for the user
    const defaultTeamName = `${record.user_metadata?.full_name || record.email.split('@')[0]}'s Team`;

    const { data: team, error: teamError } = await supabaseClient
      .from('teams')
      .insert({
        name: defaultTeamName,
        description: 'Default team',
        created_by: record.id,
      })
      .select()
      .single();

    if (teamError) {
      console.error('Error creating default team:', teamError);
      throw teamError;
    }

    console.log('Default team created:', team.id);

    // Add user as admin of the default team
    const { error: memberError } = await supabaseClient
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: record.id,
        role: 'admin',
        invited_by: record.id,
      });

    if (memberError) {
      console.error('Error adding user to team:', memberError);
      throw memberError;
    }

    console.log('User added as admin to default team');

    // Update profile with team_id
    const { error: updateProfileError } = await supabaseClient
      .from('profiles')
      .update({ team_id: team.id })
      .eq('user_id', record.id);

    if (updateProfileError) {
      console.error('Error updating profile with team_id:', updateProfileError);
      throw updateProfileError;
    }

    console.log('Profile updated with team_id');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User profile and default team created successfully',
        profile_id: profile.user_id,
        team_id: team.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  }
  catch (error) {
    console.error('Error in user-created-hook:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
