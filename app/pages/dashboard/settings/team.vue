<template>
  <div class="container mx-auto py-8 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">
          Team Settings
        </h1>
        <p class="text-muted-foreground">
          Manage your team settings and members
        </p>
      </div>
      <TeamSelector />
    </div>

    <div
      v-if="currentTeam"
      class="grid gap-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
          <CardDescription>
            Update your team's basic information
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="team-name">
                Team Name
              </Label>
              <Input
                id="team-name"
                v-model="teamForm.name"
                placeholder="Enter team name"
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="team-description">
              Description
            </Label>
            <Textarea
              id="team-description"
              v-model="teamForm.description"
              placeholder="Enter team description"
              rows="3"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            :disabled="!hasPermission('admin') || isUpdating"
            @click="updateTeamInfo"
          >
            <Icon
              v-if="isUpdating"
              name="mdi:loading"
              class="w-4 h-4 mr-2 animate-spin"
            />
            Update Team
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardContent class="pt-6">
          <TeamMembers />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Team Statistics</CardTitle>
          <CardDescription>
            Overview of your team's activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 border rounded-lg">
              <div class="text-2xl font-bold">
                {{ teamMembers.length }}
              </div>
              <div class="text-sm text-muted-foreground">
                Total Members
              </div>
            </div>
            <div class="text-center p-4 border rounded-lg">
              <div class="text-2xl font-bold">
                {{ adminCount }}
              </div>
              <div class="text-sm text-muted-foreground">
                Admins
              </div>
            </div>
            <div class="text-center p-4 border rounded-lg">
              <div class="text-2xl font-bold">
                {{ formatDate(currentTeam.created_at) }}
              </div>
              <div class="text-sm text-muted-foreground">
                Created
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div
      v-else
      class="text-center py-12"
    >
      <Icon
        name="mdi:account-group"
        class="w-16 h-16 mx-auto text-muted-foreground mb-4"
      />
      <h2 class="text-xl font-semibold mb-2">
        No Team Selected
      </h2>
      <p class="text-muted-foreground mb-4">
        Please select a team or create a new one to manage settings.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const {
  currentTeam,
  teamMembers,
  hasPermission,
  updateTeam,
  fetchTeamMembers,
} = useTeam();

const teamForm = reactive({
  name: '',
  description: '',
});

const isUpdating = ref(false);

// Computed properties
const adminCount = computed(() => {
  return teamMembers.value.filter(member => member.role === 'admin').length;
});

// Watch for team changes and update form
watch(currentTeam, (newTeam) => {
  if (newTeam) {
    teamForm.name = newTeam.name;
    teamForm.description = newTeam.description || '';
  }
}, { immediate: true });

// Ensure team members are loaded when page is mounted
onMounted(() => {
  if (currentTeam.value && teamMembers.value.length === 0) {
    fetchTeamMembers(currentTeam.value.id).catch((error) => {
      console.error('Error fetching team members:', error);
    });
  }
});

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

async function updateTeamInfo() {
  if (!currentTeam.value || !hasPermission('admin')) return;

  try {
    isUpdating.value = true;
    await updateTeam(currentTeam.value.id, {
      name: teamForm.name,
      description: teamForm.description || null,
    });
  }
  catch (error) {
    console.error('Error updating team:', error);
  }
  finally {
    isUpdating.value = false;
  }
}
</script>
