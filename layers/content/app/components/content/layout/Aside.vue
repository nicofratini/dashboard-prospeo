<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

defineProps<{
  isMobile: boolean;
}>();

// Provide a default empty array if injection fails
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation-docs', ref([]));

const {
  boilerplateDocs: {
    search: {
      inAside,
    },
    aside: {
      useLevel,
    },
  },
} = useAppConfig();

const tree = computed(() => {
  const route = useRoute();
  const path = route.path.split('/');
  if (useLevel && path.length) {
    const leveledPath = path.slice(0, 3).join('/');
    const dir = navDirFromPath(leveledPath, navigation.value);
    return dir ?? [];
  }

  return navigation.value[0]?.children ?? [];
});

const path = computed(() => useRoute().path);
</script>

<template>
  <ScrollArea
    orientation="vertical"
    class="relative h-full overflow-hidden pr-6 text-sm md:pr-1"
    type="hover"
  >
    <ContentNavMobile
      v-if="isMobile"
      class="mb-5 border-b pb-2"
    />
    <LazyContentSearchButton v-if="inAside" />
    <ul
      v-if="useLevel"
      class="flex flex-col gap-1 border-b pb-4"
    >
      <li
        v-for="link in navigation?.[0]?.children"
        :key="link.id"
      >
        <NuxtLink
          :to="link.redirect ?? link.path"
          class="flex h-8 items-center gap-2 rounded-md p-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
          :class="[
            path.startsWith(link.path) && 'bg-muted !text-primary',
          ]"
        >
          <Icon
            v-if="link.icon"
            :name="link.icon"
            class="self-center"
            mode="svg"
            :size="16"
          />
          {{ link.title }}
        </NuxtLink>
      </li>
    </ul>
    <AsideTree
      :links="tree"
      :level="0"
      :class="[useLevel ? 'pt-4' : 'pt-1']"
    />
  </ScrollArea>
</template>
