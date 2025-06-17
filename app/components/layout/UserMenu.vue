<script setup lang="ts">
import { NuxtImg } from '#components';

const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const { signedAvatarUrl } = useProfile();
const { shift_meta_a, shift_meta_d, meta_h, shift_meta_b, shift_q, option_meta_d } = useMagicKeys();

const { navigation: {
  userMenu,
} } = useAppConfig();

// @ts-expect-error because of the magic keys type issue
whenever(shift_meta_a, async () => {
  await navigateTo('/dashboard/settings/general');
});

// @ts-expect-error because of the magic keys type issue
whenever(shift_meta_d, async () => {
  await navigateTo('/dashboard');
});

// @ts-expect-error because of the magic keys type issue
whenever(option_meta_d, async () => {
  await navigateTo('/directory/dashboard');
});

// @ts-expect-error because of the magic keys type issue
whenever(meta_h, async () => {
  await navigateTo('/');
});

// @ts-expect-error because of the magic keys type issue
whenever(shift_meta_b, async () => {
  await navigateTo('/dashboard/settings/billing');
});

// @ts-expect-error because of the magic keys type issue
whenever(shift_q, async () => {
  await signOut();
});

const signOut = async () => {
  try {
    const { error } = await auth.signOut();
    if (error) {
      handleApiErrorWithToast(error, 'Could not sign out. Please try again later.');
      return;
    }
    user.value = null;
    return navigateTo('/');
  }
  catch (error) {
    console.error(error);
  }
};

/**
 * Opens the customer billing portal in a new window.
 * Makes a fetch request to get the portal URL and handles the navigation with toast notifications.
 * Shows loading state while fetching, success on redirect, and error message if request fails.
 */
const openCustomerPortal = async () => {
  toast
    .promise($fetch('/api/billing/portal-url'), {
      loading: 'Loading customer info...',
      success: (data: { url: string }) => {
        navigateTo(data.url, { external: true });
        return 'Redirecting...';
      },
      error: (error: Error) => {
        return error.message;
      },
      duration: 3000,
    });
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="relative size-8 rounded-full"
      >
        <Avatar class="border-background border-2">
          <AvatarImage
            v-if="signedAvatarUrl"
            :src="signedAvatarUrl"
            alt="User avatar"
            :as="NuxtImg"
            class="animate-in fade-in zoom-in-50"
          />
          <AvatarFallback>
            <Icon
              name="mdi:account-circle-outline"
              mode="svg"
              size="2rem"
            />
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-56"
      align="end"
    >
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col w-full space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ user?.user_metadata?.full_name ?? 'User' }}
          </p>
          <p class="text-xs leading-none text-muted-foreground truncate">
            {{ user?.email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          v-for="(menuItem, i) in userMenu.links"
          :key="i"
          as-child
        >
          <NuxtLink :to="menuItem.to">
            <Icon
              v-if="userMenu.enableIcons && menuItem.icon"
              :name="menuItem.icon"
              mode="svg"
              size="1rem"
            />
            {{ menuItem.title }}
            <DropdownMenuShortcut v-if="menuItem.shortcut">
              {{ menuItem.shortcut }}
            </DropdownMenuShortcut>
          </NuxtLink>
        </DropdownMenuItem>
        <!-- [TIP] May be uncommited to enable link to customer portal -->
        <!-- <DropdownMenuItem as-child>
          <NuxtLink @click="openCustomerPortal">
            <Icon
              name="mdi:credit-card-outline"
              mode="svg"
              class="mr-2"
              size="1rem"
            />
            Customer Portal
          </NuxtLink>
        </DropdownMenuItem> -->
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="signOut">
        <Icon
          v-if="userMenu.enableIcons"
          name="line-md:log-out"
          mode="svg"
          size="1rem"
        />
        Log out
        <DropdownMenuShortcut>⇧Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
