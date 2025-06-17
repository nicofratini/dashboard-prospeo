<script setup lang="ts">
import { navigationMenuTriggerStyle } from '~/components/ui/navigation-menu';

const user = useSupabaseUser();
const isAuthReady = ref(false);

const { navigation, general: { name: siteName } } = useAppConfig();
const navigationLinks = navigation.links;

// Wait for auth to be ready
onMounted(() => {
  const { auth } = useSupabaseClient();
  const unsubscribe = auth.onAuthStateChange(() => {
    isAuthReady.value = true;
  });

  // Set a maximum wait time for auth initialization
  const timeout = setTimeout(() => {
    isAuthReady.value = true;
  }, 1000);

  onUnmounted(() => {
    clearTimeout(timeout);
    unsubscribe.data.subscription.unsubscribe();
  });
});
</script>

<template>
  <header class="flex flex-row justify-center items-center min-h-20 px-6 lg:px-12 sticky z-40">
    <div class="flex flex-row-reverse lg:flex-row h-20 w-full items-center justify-between gap-2 lg:px-8">
      <MobileNav />
      <div>
        <NuxtLink
          class="flex flex-row gap-2 items-center justify-center"
          to="/"
        >
          <BrandLogo />
          <span class="text-2xl font-extrabold text-foreground font-brand">
            {{ siteName }}
          </span>
        </NuxtLink>
      </div>
      <NavigationMenu
        :delay-duration="0"
        class="hidden lg:block"
      >
        <NavigationMenuList>
          <template
            v-for="(item, index) in navigationLinks"
            :key="index"
          >
            <NavigationMenuItem v-if="item.links">
              <NavigationMenuTrigger>
                {{ item.title }}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
                  <li
                    v-if="item.isMain"
                    class="row-span-3"
                  >
                    <NavigationMenuLink as-child>
                      <NuxtLink
                        class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <BrandLogo size="5rem" />
                        <div class="mb-2 mt-4 text-lg font-medium">
                          {{ siteName }}
                        </div>
                        <p class="text-sm leading-tight text-muted-foreground">
                          A boilerplate which will help you make your idea alive.
                        </p>
                      </NuxtLink>
                    </NavigationMenuLink>
                  </li>
                  <li
                    v-for="(subItem, subIndex) in item.links"
                    :key="subIndex"
                  >
                    <NavigationMenuLink as-child>
                      <NuxtLink
                        :to="subItem.to"
                        class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div class="flex items-center gap-2">
                          <Icon
                            v-if="subItem.icon"
                            :name="subItem.icon"
                            mode="svg"
                            class="size-5"
                          />
                          <div class="text-sm font-medium leading-none">
                            {{ subItem.title }}
                          </div>
                        </div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {{ subItem.description }}
                        </p>
                      </NuxtLink>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem v-else>
              <NavigationMenuLink
                as-child
                :class="navigationMenuTriggerStyle()"
              >
                <NuxtLink :to="item.to">
                  {{ item.title }}
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </template>
        </NavigationMenuList>
      </NavigationMenu>
      <div class="hidden lg:flex items-center justify-between gap-4">
        <ThemeToggle v-if="navigation.enableColorSwitch" />

        <!-- Show skeleton loader while auth is not ready -->
        <div
          v-if="!isAuthReady"
          class="flex items-center gap-4"
        >
          <Skeleton class="w-20 h-9 rounded-md" />
          <Skeleton class="size-9 rounded-full" />
        </div>

        <!-- Show actual content only when auth is ready -->
        <template v-else>
          <div
            v-if="!user"
            class="flex items-center justify-between gap-4"
          >
            <Button
              variant="ghost"
              as-child
            >
              <NuxtLink to="/sign-in">
                Sign in
              </NuxtLink>
            </Button>
            <Button as-child>
              <NuxtLink to="/sign-up">
                Sign up for Free
              </NuxtLink>
            </Button>
          </div>
          <div
            v-else
            class="flex items-center justify-center"
          >
            <UserMenu />
          </div>
        </template>
      </div>
    </div>
  </header>
</template>
