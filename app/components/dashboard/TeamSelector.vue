<template>
  <div class="relative">
    <Select
      v-model="selectedTeamId"
      @update:model-value="handleTeamChange"
    >
      <SelectTrigger class="w-[200px]">
        <SelectValue :placeholder="currentTeam?.name || 'Select team'" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="team in userTeams"
          :key="team.id"
          :value="team.id"
        >
          {{ team.name }}
        </SelectItem>
        <SelectSeparator />
        <SelectItem
          value="create-new"
          class="text-primary"
        >
          <Icon
            name="mdi:plus"
            class="w-4 h-4 mr-2"
          />
          Create new team
        </SelectItem>
      </SelectContent>
    </Select>

    <!-- Create Team Modal -->
    <Dialog v-model:open="showCreateModal">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team to collaborate with others.
          </DialogDescription>
        </DialogHeader>
        <form
          class="space-y-4"
          @submit.prevent="handleCreateTeam"
        >
          <div class="space-y-2">
            <Label for="team-name">Team Name</Label>
            <Input
              id="team-name"
              v-model="newTeamName"
              placeholder="Enter team name"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="team-description">Description (optional)</Label>
            <Textarea
              id="team-description"
              v-model="newTeamDescription"
              placeholder="Enter team description"
              rows="3"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              @click="showCreateModal = false"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="isCreating"
            >
              <Icon
                v-if="isCreating"
                name="mdi:loading"
                class="w-4 h-4 mr-2 animate-spin"
              />
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
const { currentTeam, userTeams, switchTeam, createTeam } = useTeam();

const selectedTeamId = ref(currentTeam.value?.id || '');
const showCreateModal = ref(false);
const newTeamName = ref('');
const newTeamDescription = ref('');
const isCreating = ref(false);

// Update selected team when current team changes
watch(currentTeam, (newTeam) => {
  if (newTeam) {
    selectedTeamId.value = newTeam.id;
  }
}, { immediate: true });

async function handleTeamChange(teamId: string) {
  if (teamId === 'create-new') {
    showCreateModal.value = true;
    selectedTeamId.value = currentTeam.value?.id || '';
    return;
  }

  try {
    await switchTeam(teamId);
  }
  catch (error) {
    console.error('Error switching team:', error);
    // Reset selection on error
    selectedTeamId.value = currentTeam.value?.id || '';
  }
}

async function handleCreateTeam() {
  if (!newTeamName.value.trim()) return;

  try {
    isCreating.value = true;
    await createTeam({
      name: newTeamName.value.trim(),
      description: newTeamDescription.value.trim() || undefined,
    });

    // Reset form and close modal
    newTeamName.value = '';
    newTeamDescription.value = '';
    showCreateModal.value = false;
  }
  catch (error) {
    console.error('Error creating team:', error);
  }
  finally {
    isCreating.value = false;
  }
}
</script>
