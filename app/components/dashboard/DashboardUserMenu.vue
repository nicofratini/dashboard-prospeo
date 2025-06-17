<script setup lang="ts">
import { toast } from 'vue-sonner';
import { NuxtImg } from '#components';

const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const { profile, signedAvatarUrl } = useProfile();
const colorMode = useColorMode();

const { links, enableIcons } = useAppConfig().dashboardUserMenu;

const signOut = async () => {
  try {
    const { error } = await auth.signOut();
    if (error) {
      toast.error('Error', {
        description: error.message,
        closeButton: true,
      });
      return;
    }
    user.value = null;
    return navigateTo('/');
  }
  catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar class="h-8 w-8 rounded-lg">
          <LazyAvatarImage
            v-if="signedAvatarUrl"
            :src="signedAvatarUrl"
            :alt="profile?.full_name ?? 'User avatar'"
            :as="NuxtImg"
          />
          <LazyAvatarFallback class="flex items-center justify-center">
            <Icon
              name="mdi:user-circle"
              size="2rem"
            />
          </LazyAvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{ profile?.full_name ?? user?.user_metadata?.full_name }}</span>
          <span class="truncate text-xs">{{ user?.email }}</span>
        </div>
        <Icon
          name="mdi:chevron-up-down"
          class="ml-auto size-4"
        />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      side="bottom"
      align="end"
      :side-offset="4"
    >
      <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar class="h-8 w-8 rounded-lg">
            <LazyAvatarImage
              v-if="signedAvatarUrl"
              :src="signedAvatarUrl"
              :alt="profile?.full_name ?? 'User avatar'"
              :as="NuxtImg"
            />
            <LazyAvatarFallback class="flex items-center justify-center">
              <Icon
                name="mdi:user-circle"
                size="2rem"
              />
            </LazyAvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{ profile?.full_name }}</span>
            <span class="truncate text-xs">{{ user?.email }}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          v-for="(menuItem, i) in links"
          :key="i"
          as-child
        >
          <NuxtLink :to="menuItem.to">
            <Icon
              v-if="enableIcons && menuItem.icon"
              :name="menuItem.icon"
              class="mr-2"
              size="1rem"
            />
            {{ menuItem.title }}
            <DropdownMenuShortcut v-if="menuItem.shortcut">
              {{ menuItem.shortcut }}
            </DropdownMenuShortcut>
          </NuxtLink>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Icon
            name="line-md:moon-loop"
            mode="svg"
            class="mr-2"
            size="1rem"
          />
          <span>
            Theme
          </span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup v-model="colorMode.preference">
              <DropdownMenuRadioItem value="dark">
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="signOut">
        <Icon
          name="mdi:logout"
          class="mr-2"
          size="1rem"
        />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
