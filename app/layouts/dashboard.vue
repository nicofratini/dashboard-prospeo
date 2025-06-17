<script setup lang=ts>
// This is sample data.
const data = {
  teams: [
    {
      name: 'V Inc',
      logo: 'mdi:cosine-wave',
      plan: 'Enterprise',
    },
    {
      name: 'V Corp.',
      logo: 'mdi:apple-keyboard-command',
      plan: 'Startup',
    },
    {
      name: 'VS Corp.',
      logo: 'mdi:card-multiple-outline',
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Examples',
      url: '/dashboard/cards',
      icon: 'mdi:console',
      isActive: true,
      items: [
        {
          title: 'Cards',
          url: '/dashboard/cards',
        },
        {
          title: 'Charts',
          url: '/dashboard/charts',
        },
      ],
    },
    {
      title: 'Models',
      url: '/dashboard/chat-ai',
      icon: 'mdi:robot',
      items: [
        {
          title: 'Chat',
          url: '/dashboard/chat-ai',
        },
        {
          title: 'Image Gen',
          url: '/dashboard/image-ai',
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
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: 'mdi:vector-square',
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: 'mdi:chart-pie',
    },
    {
      name: 'Travel',
      url: '#',
      icon: 'mdi:map',
    },
  ],
};

const links = useBreadcrumbItems({
  hideRoot: true,
}).value.slice(1); // todo: fix this

const activeTeam = ref(data.teams[0]);

function setActiveTeam(team: typeof data.teams[number]) {
  activeTeam.value = team;
}
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
                      :name="activeTeam?.logo || 'mdi:square-rounded-outline'"
                      class="size-4 shrink-0"
                    />
                  </div>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ activeTeam?.name }}</span>
                    <span class="truncate text-xs">{{ activeTeam?.plan }}</span>
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
                <DropdownMenuItem
                  v-for="(team, index) in data.teams"
                  :key="team.name"
                  class="gap-2 p-2"
                  @click="setActiveTeam(team)"
                >
                  <div class="flex size-6 items-center justify-center rounded-sm border">
                    <Icon
                      :name="team.logo"
                      class="size-4 shrink-0"
                    />
                  </div>
                  {{ team.name }}
                  <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="gap-2 p-2">
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
        <SidebarGroup class="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="item in data.projects"
              :key="item.name"
            >
              <SidebarMenuButton as-child>
                <NuxtLink :href="item.url">
                  <Icon
                    :name="item.icon"
                    class="size-4 shrink-0"
                  />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <SidebarMenuAction show-on-hover>
                    <Icon
                      name="mdi:dots-horizontal"
                      class="size-4 shrink-0 text-sidebar-foreground/70"
                    />
                    <span class="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  class="w-48 rounded-lg"
                  side="bottom"
                  align="end"
                >
                  <DropdownMenuItem>
                    <Icon
                      name="mdi:folder"
                      class="size-4 shrink-0 text-muted-foreground mr-1"
                    />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon
                      name="mdi:share"
                      class="size-4 shrink-0 text-muted-foreground  mr-1"
                    />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Icon
                      name="mdi:delete"
                      class="size-4 shrink-0 text-muted-foreground mr-1"
                    />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton class="text-sidebar-foreground/70">
                <Icon
                  name="mdi:dots-horizontal"
                  class="size-4 shrink-0 text-sidebar-foreground/70"
                />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
  </SidebarProvider>
</template>
