<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">
          Team Members
        </h3>
        <p class="text-sm text-muted-foreground">
          Manage your team members and their roles
        </p>
      </div>
      <Button
        v-if="hasPermission('admin')"
        @click="showInviteModal = true"
      >
        <Icon
          name="mdi:account-plus"
          class="w-4 h-4 mr-2"
        />
        Invite Member
      </Button>
    </div>

    <!-- Members List -->
    <div class="space-y-3">
      <div
        v-for="member in teamMembers"
        :key="member.id"
        class="flex items-center justify-between p-4 border rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <Avatar class="h-10 w-10">
            <AvatarImage :src="member.avatar_url || ''" />
            <AvatarFallback>
              {{ getInitials(member.full_name || member.email || 'U') }}
            </AvatarFallback>
          </Avatar>
          <div>
            <p class="font-medium">
              {{ member.full_name || member.username || 'Unknown User' }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ member.email }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <Badge :variant="getRoleVariant(member.role)">
            {{ formatRole(member.role) }}
          </Badge>

          <DropdownMenu v-if="hasPermission('admin') && member.user_id !== user?.id">
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
              >
                <Icon
                  name="mdi:dots-vertical"
                  class="w-4 h-4"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                v-for="role in availableRoles"
                :key="role.value"
                :disabled="member.role === role.value"
                @click="updateMemberRole(member.user_id, role.value)"
              >
                {{ role.label }}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                class="text-destructive"
                @click="removeMember(member.user_id)"
              >
                <Icon
                  name="mdi:account-remove"
                  class="w-4 h-4 mr-2"
                />
                Remove from team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            v-if="member.user_id === user?.id"
            variant="outline"
            size="sm"
            @click="leaveTeam(currentTeam?.id!)"
          >
            Leave Team
          </Button>
        </div>
      </div>
    </div>

    <!-- Invite Member Modal -->
    <Dialog v-model:open="showInviteModal">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join your team.
          </DialogDescription>
        </DialogHeader>
        <form
          class="space-y-4"
          @submit.prevent="handleInviteMember"
        >
          <div class="space-y-2">
            <Label for="member-email">Email Address</Label>
            <Input
              id="member-email"
              v-model="inviteEmail"
              type="email"
              placeholder="Enter email address"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="member-role">Role</Label>
            <Select v-model="inviteRole">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="role in availableRoles"
                  :key="role.value"
                  :value="role.value"
                >
                  {{ role.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              @click="showInviteModal = false"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="isInviting"
            >
              <Icon
                v-if="isInviting"
                name="mdi:loading"
                class="w-4 h-4 mr-2 animate-spin"
              />
              Send Invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import type { Database } from '~~/types/database.types';

type TeamMemberRole = Database['public']['Enums']['team_member_role'];

const user = useSupabaseUser();
const {
  currentTeam,
  teamMembers,
  hasPermission,
  inviteUserToTeam,
  updateMemberRole: updateRole,
  removeMember: removeMemberFromTeam,
  leaveTeam: leaveCurrentTeam,
} = useTeam();

const showInviteModal = ref(false);
const inviteEmail = ref('');
const inviteRole = ref<TeamMemberRole>('regular');
const isInviting = ref(false);

const availableRoles = [
  { value: 'admin' as TeamMemberRole, label: 'Admin' },
  { value: 'regular' as TeamMemberRole, label: 'Regular' },
  { value: 'viewer' as TeamMemberRole, label: 'Viewer' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatRole(role: TeamMemberRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function getRoleVariant(role: TeamMemberRole) {
  switch (role) {
    case 'admin':
      return 'destructive';
    case 'regular':
      return 'default';
    case 'viewer':
      return 'secondary';
    default:
      return 'outline';
  }
}

async function handleInviteMember() {
  if (!currentTeam.value || !inviteEmail.value.trim()) return;

  try {
    isInviting.value = true;
    await inviteUserToTeam(currentTeam.value.id, inviteEmail.value.trim(), inviteRole.value);

    // Reset form and close modal
    inviteEmail.value = '';
    inviteRole.value = 'regular';
    showInviteModal.value = false;
  }
  catch (error) {
    console.error('Error inviting member:', error);
    toast.error('Error inviting member', {
      description: error.message,
    });
  }
  finally {
    isInviting.value = false;
  }
}

async function updateMemberRole(userId: string, role: TeamMemberRole) {
  if (!currentTeam.value) return;

  try {
    await updateRole(currentTeam.value.id, userId, role);
  }
  catch (error) {
    console.error('Error updating member role:', error);
    toast.error('Error updating member role', {
      description: error.message,
    });
  }
}

async function removeMember(userId: string) {
  if (!currentTeam.value) return;

  try {
    await removeMemberFromTeam(currentTeam.value.id, userId);
  }
  catch (error) {
    console.error('Error removing member:', error);
    toast.error('Error removing member', {
      description: error.message,
    });
  }
}

async function leaveTeam(teamId: string) {
  try {
    await leaveCurrentTeam(teamId);
  }
  catch (error) {
    console.error('Error leaving team:', error);
    toast.error('Error leaving team', {
      description: error.message,
    });
  }
}
</script>
