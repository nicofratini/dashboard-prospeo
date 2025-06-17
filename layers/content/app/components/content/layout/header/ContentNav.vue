<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem
        v-for="(item, i) in nav"
        :key="i"
        class="relative"
      >
        <template v-if="item.links">
          <NavigationMenuTrigger class="bg-transparent font-semibold">
            {{ item.title }}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="w-[250px] p-2">
              <li
                v-for="link in item.links"
                :key="link.title"
              >
                <NuxtLink
                  :to="link.to"
                  :target="link.target"
                  class="mb-1 block w-full gap-2 rounded-md px-3 py-2 transition-all hover:bg-muted"
                >
                  <div>
                    {{ link.title }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ link.description }}
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </template>
        <NuxtLink
          v-else
          :to="item.to"
          :target="item.target"
        >
          <Icon
            v-if="item.showLinkIcon"
            name="mdi:arrow-top-right"
            class="absolute right-2 top-2 text-muted-foreground"
            size="13"
          />
          <div
            class="bg-transparent pr-6"
            :class="navigationMenuTriggerStyle()"
          >
            {{ item.title }}
          </div>
        </NuxtLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>

<script setup lang="ts">
import { navigationMenuTriggerStyle } from '~/components/ui/navigation-menu';

const { nav } = useAppConfig().boilerplateDocs.header;
</script>
