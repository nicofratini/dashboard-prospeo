<template>
  <li>
    <div v-if="link.children">
      <button
        class="flex h-8 w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary"
        @click="isOpen = !isOpen"
      >
        <Icon
          v-if="link.sidebar?.leftArrow"
          name="mdi:chevron-down"
          class="transition-transform"
          mode="svg"
          :class="[!isOpen && '-rotate-90']"
        />

        <Icon
          v-if="link.icon"
          :name="link.icon"
          mode="svg"
          :size="15"
        />

        <span class="truncate text-nowrap">
          {{ link.title }}
        </span>
        <span
          v-for="(badge, i) in link.navBadges"
          :key="i"
        >
          <Badge
            :variant="badge.variant"
            :type="badge.type"
            :size="badge.size ?? 'sm'"
          >
            {{ badge.value }}
          </Badge>
        </span>

        <Icon
          v-if="!link.sidebar?.leftArrow"
          name="mdi:chevron-down"
          class="ml-auto transition-transform"
          :class="[!isOpen && '-rotate-90']"
        />
      </button>
      <div
        v-show="isOpen"
        class="overflow-hidden"
      >
        <AsideTree
          :links="link.children"
          :level="level + 1"
        />
      </div>
    </div>
    <NuxtLink
      v-else
      :to="link.path"
      class="flex h-8 items-center gap-2 rounded-md p-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
      :class="[isActive && 'bg-muted !text-primary']"
    >
      <Icon
        v-if="link.icon"
        :name="link.icon"
        mode="svg"
        :size="15"
      />
      <span class="truncate text-nowrap">
        {{ link.title }}
      </span>
      <span
        v-for="(badge, i) in link.navBadges"
        :key="i"
      >
        <Badge
          :variant="badge.variant"
          :type="badge.type"
          :size="badge.size ?? 'sm'"
        >
          {{ badge.value }}
        </Badge>
      </span>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const props = defineProps<{
  link: ContentNavigationItem;
  level: number;
}>();

const { boilerplateDocs } = useAppConfig();

const collapsed = useCollapsedMap();
const isOpen = ref(collapsed.value.get(props.link.path) || (props.level < 1 && !boilerplateDocs.aside.collapse));
watch(isOpen, (v) => {
  collapsed.value.set(props.link.path, v);
});
const isActive = computed(() => props.link.path === useRoute().path);
</script>
