import type { Database } from '~~/types/database.types';

type Team = Database['public']['Tables']['teams']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];
type TeamMemberWithProfile = Database['public']['Views']['team_members_with_profiles']['Row'];
type TeamMemberRole = Database['public']['Enums']['team_member_role'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface TeamWithMembers extends Team {
  team_members: (TeamMember & {
    profiles: Pick<Profile, 'full_name' | 'avatar_url' | 'email' | 'username'>;
  })[];
}

interface TeamApiResponse {
  success: boolean;
  team?: Team;
  teams?: Team[];
  members?: TeamMember[];
  error?: string;
}

export function useTeam() {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const currentTeam = useState<Team | null>('currentTeam', () => null);
  const userTeams = useState<Team[]>('userTeams', () => []);
  const teamMembers = useState<TeamMemberWithProfile[]>('teamMembers', () => []);
  const userTeamRole = useState<TeamMemberRole | null>('userTeamRole', () => null);
  const isLoading = useState('isLoadingTeam', () => false);

  // Fetch user's teams
  async function fetchUserTeams() {
    if (!user.value?.id) return;

    try {
      isLoading.value = true;

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          team_id,
          role,
          teams (
            id,
            name,
            description,
            avatar_url,
            settings,
            created_at,
            updated_at,
            created_by
          )
        `)
        .eq('user_id', user.value.id)
        .eq('is_active', true);

      if (error) throw error;

      const teams = data?.map(item => item.teams).filter(Boolean) as Team[];
      userTeams.value = teams;

      // Set current team if not set
      if (!currentTeam.value && teams.length > 0) {
        const firstTeam = teams[0];
        if (firstTeam) {
          currentTeam.value = firstTeam;
          // Get user role for current team
          const userMembership = data?.find(item => item.teams?.id === firstTeam.id);
          userTeamRole.value = userMembership?.role || null;

          // Fetch team members for the initial team
          await fetchTeamMembers(firstTeam.id);
        }
      }

      return teams;
    }
    catch (error) {
      console.error('Error fetching user teams:', error);
      throw error;
    }
    finally {
      isLoading.value = false;
    }
  }

  // Fetch team members
  async function fetchTeamMembers(teamId: string) {
    const { data, error } = await supabase
      .from('team_members_with_profiles')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_active', true)
      .order('joined_at', { ascending: true });

    if (error) throw error;

    teamMembers.value = data || [];
    return data;
  }

  // Switch current team
  async function switchTeam(teamId: string) {
    const team = userTeams.value.find(t => t.id === teamId);
    if (!team) throw new Error('Team not found');

    currentTeam.value = team;

    // Get user role for this team
    const { data, error } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.value!.id)
      .eq('is_active', true)
      .single();

    if (!error && data) {
      userTeamRole.value = data.role;
    }

    // Fetch team members
    await fetchTeamMembers(teamId);
  }

  // Create a new team
  async function createTeam(teamData: { name: string; description?: string }) {
    if (!user.value?.id) throw new Error('User not authenticated');

    try {
      const response = await $fetch<TeamApiResponse>('/api/teams', {
        method: 'POST',
        body: teamData,
      });

      if (!response.success || !response.team) {
        throw new Error(response.error || 'Failed to create team');
      }

      // Add to user teams
      userTeams.value.push(response.team);

      // Switch to new team
      await switchTeam(response.team.id);

      return response.team;
    }
    catch (error: any) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  // Update team
  async function updateTeam(teamId: string, updates: Partial<Team>) {
    try {
      const response = await $fetch<TeamApiResponse>(`/api/teams/${teamId}`, {
        method: 'PUT',
        body: updates,
      });

      if (!response.success || !response.team) {
        throw new Error(response.error || 'Failed to update team');
      }

      // Update in local state
      const teamIndex = userTeams.value.findIndex(t => t.id === teamId);
      if (teamIndex !== -1) {
        userTeams.value[teamIndex] = response.team;
      }

      if (currentTeam.value?.id === teamId) {
        currentTeam.value = response.team;
      }

      return response.team;
    }
    catch (error: any) {
      console.error('Error updating team:', error);
      throw error;
    }
  }

  // Invite user to team
  async function inviteUserToTeam(teamId: string, email: string, role: TeamMemberRole = 'regular') {
    try {
      const response = await $fetch<TeamApiResponse>(`/api/teams/${teamId}/invite`, {
        method: 'POST',
        body: { email, role },
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to invite user');
      }

      // Refresh team members
      await fetchTeamMembers(teamId);

      return response;
    }
    catch (error: any) {
      console.error('Error inviting user:', error);
      throw error;
    }
  }

  // Update team member role
  async function updateMemberRole(teamId: string, userId: string, role: TeamMemberRole) {
    try {
      const response = await $fetch<TeamApiResponse>(`/api/teams/${teamId}/members/${userId}`, {
        method: 'PUT',
        body: { role },
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to update member role');
      }

      // Refresh team members
      await fetchTeamMembers(teamId);

      return response;
    }
    catch (error: any) {
      console.error('Error updating member role:', error);
      throw error;
    }
  }

  // Remove team member
  async function removeMember(teamId: string, userId: string) {
    try {
      const response = await $fetch<TeamApiResponse>(`/api/teams/${teamId}/members/${userId}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to remove member');
      }

      // Refresh team members
      await fetchTeamMembers(teamId);

      return response;
    }
    catch (error: any) {
      console.error('Error removing member:', error);
      throw error;
    }
  }

  // Leave team
  async function leaveTeam(teamId: string) {
    if (!user.value?.id) throw new Error('User not authenticated');

    try {
      await removeMember(teamId, user.value.id);

      // Remove from local state
      userTeams.value = userTeams.value.filter(t => t.id !== teamId);

      // Switch to another team if this was current
      if (currentTeam.value?.id === teamId) {
        if (userTeams.value.length > 0) {
          const firstTeam = userTeams.value[0];
          if (firstTeam) {
            await switchTeam(firstTeam.id);
          }
        }
        else {
          currentTeam.value = null;
          userTeamRole.value = null;
          teamMembers.value = [];
        }
      }
    }
    catch (error: any) {
      console.error('Error leaving team:', error);
      throw error;
    }
  }

  // Check if user has permission
  function hasPermission(permission: 'admin' | 'write' | 'read'): boolean {
    if (!userTeamRole.value) return false;

    switch (permission) {
      case 'admin':
        return userTeamRole.value === 'admin';
      case 'write':
        return ['admin', 'regular'].includes(userTeamRole.value);
      case 'read':
        return ['admin', 'regular', 'viewer'].includes(userTeamRole.value);
      default:
        return false;
    }
  }

  // Initialize teams when user is available
  watchEffect(() => {
    if (user.value?.id && userTeams.value.length === 0) {
      fetchUserTeams().catch((error) => {
        console.error('Error initializing teams:', error);
      });
    }
  });

  return {
    // State
    currentTeam: readonly(currentTeam),
    userTeams: readonly(userTeams),
    teamMembers: readonly(teamMembers),
    userTeamRole: readonly(userTeamRole),
    isLoading: readonly(isLoading),

    // Actions
    fetchUserTeams,
    fetchTeamMembers,
    switchTeam,
    createTeam,
    updateTeam,
    inviteUserToTeam,
    updateMemberRole,
    removeMember,
    leaveTeam,
    hasPermission,
  };
}
