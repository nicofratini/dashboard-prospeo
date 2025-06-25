<script setup lang=ts>
const {
  currentTeam,
  userTeams,
  switchTeam,
  createTeam,
} = useTeam();

// Navigation data
const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'mdi:home',

    },
    {
      title: 'Statistics',
      url: '/dashboard/statistics',
      icon: 'mdi:trending-up',

    },
    {
      title: 'Call History',
      url: '/dashboard/conversation-history',
      icon: 'mdi:discussion',

    },
    {
      title: 'Calendar',
      url: '/dashboard/calendar',
      icon: 'mdi:calendar-month',

    },
    {
      title: 'Inbound configuration',
      url: '#',
      icon: 'mdi:wrench',
      isActive: true,
      items: [
        {
          title: 'Agents',
          url: '/dashboard/inbound/agents',
        },
        {
          title: 'Knowledge Base',
          url: '/dashboard/inbound/knowledge-base',
        },
      ],
    },
    {
      title: 'Outbound campaigns',
      url: '/dashboard/outbound',
      icon: 'mdi:robot',
      items: [
        {
          title: 'Chat',
          url: '#',
        },
        {
          title: 'Image Gen',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '/docs/getting-started',
      icon: 'mdi:book-open-variant',
      items: [
        {
          title: 'Introduction',
          url: '/docs/getting-started/introduction',
        },
        {
          title: 'Technical Details',
          url: '/docs/getting-started/technical-details',
        },
        {
          title: 'Components',
          url: '/docs/components',
        },
        {
          title: 'Examples',
          url: '/docs/examples',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/dashboard/settings/general',
      icon: 'mdi:cog',
    },
  ],
};

const links = useBreadcrumbItems({
  hideRoot: true,
}).value.slice(1);

const selectedTeamId = ref(currentTeam.value?.id || '');
const showCreateModal = ref(false);
const newTeamName = ref('');
const newTeamDescription = ref('');
const isCreating = ref(false);

async function handleTeamSwitch(teamId: string) {
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
    selectedTeamId.value = currentTeam.value?.id || '';
  }
}

function handleNewTeamClick() {
  showCreateModal.value = true;
  selectedTeamId.value = currentTeam.value?.id || '';
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

// Get team display data
const getTeamIcon = (team: any) => {
  // You can customize this based on team settings or use a default
  return team?.avatar_url ? 'mdi:account-group' : 'mdi:office-building';
};

const getTeamPlan = (team: any) => {
  // You can get this from team settings or subscription data
  return team?.settings?.plan || 'Free';
};
</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div
                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
                  >
                    <Icon
                      :name="getTeamIcon(currentTeam)"
                      class="size-4 shrink-0"
                    />
                  </div>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ currentTeam?.name || 'No Team' }}</span>
                    <span class="truncate text-xs">{{ getTeamPlan(currentTeam) }}</span>
                  </div>
                  <Icon
                    name="mdi:chevron-up-down"
                    class="ml-auto"
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                :side-offset="4"
              >
                <DropdownMenuLabel class="text-xs text-muted-foreground">
                  Teams
                </DropdownMenuLabel>
                <template v-if="userTeams.length > 0">
                  <DropdownMenuItem
                    v-for="(team, index) in userTeams"
                    :key="team.id"
                    class="gap-2 p-2"
                    @click="handleTeamSwitch(team.id)"
                  >
                    <div class="flex size-6 items-center justify-center rounded-sm border">
                      <Icon
                        :name="getTeamIcon(team)"
                        class="size-4 shrink-0"
                      />
                    </div>
                    {{ team.name }}
                    <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </template>
                <div
                  v-else
                  class="px-2 py-1 text-xs text-muted-foreground"
                >
                  No teams available
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  class="gap-2 p-2"
                  @click="handleNewTeamClick"
                >
                  <div class="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Icon
                      name="mdi:plus"
                      class="size-4"
                    />
                  </div>
                  <div class="font-medium text-muted-foreground">
                    Add team
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible
              v-for="item in data.navMain"
              :key="item.title"
              as-child
              :default-open="item.isActive"
              class="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  v-if="!item.items"
                  as-child
                >
                  <NuxtLink :href="item.url">
                    <Icon
                      :name="item.icon"
                      class="size-4 shrink-0"
                    />
                    <span>{{ item.title }}</span>
                  </NuxtLink>
                </SidebarMenuButton>
                <CollapsibleTrigger
                  v-else
                  as-child
                >
                  <SidebarMenuButton :tooltip="item.title">
                    <Icon
                      :name="item.icon"
                      class="size-4 shrink-0"
                    />
                    <span>{{ item.title }}</span>
                    <Icon
                      name="mdi:chevron-right"
                      class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem
                      v-for="subItem in item.items"
                      :key="subItem.title"
                    >
                      <SidebarMenuSubButton as-child>
                        <NuxtLink :href="subItem.url">
                          <span>{{ subItem.title }}</span>
                        </NuxtLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Icon
                name="line-md:question-circle"
                mode="svg"
              />
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton as-child>
              <NuxtLink href="/contact">
                <Icon
                  name="line-md:chat"
                  mode="svg"
                  size="1rem"
                />
                <span>Feedback</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem class="mt-4">
            <DashboardUserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex justify-between w-full px-4">
          <div class="flex items-center gap-2">
            <SidebarTrigger class="-ml-1" />
            <Separator
              orientation="vertical"
              class="mr-2 h-4 hidden md:block"
            />
            <Breadcrumb class="hidden md:block">
              <BreadcrumbList>
                <template
                  v-for="(link, i) in links"
                  :key="i"
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                      <NuxtLink
                        :href="link.current ? undefined : link.to"
                        :class="link.current ? 'text-foreground' : ''"
                      >
                        {{ link.label }}
                      </NuxtLink>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator v-if="i < links.length - 1" />
                </template>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <HelpButton />
        </div>
      </header>

      <div class="p-4 pt-0">
        <slot />
      </div>
    </SidebarInset>
    <Teleport to="body">
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
    </Teleport>
  </SidebarProvider>
</template>
