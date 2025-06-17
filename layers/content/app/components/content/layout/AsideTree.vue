<template>
  <ul
    class="flex flex-col gap-1 py-1 "
    :class="[level > 0 && 'mx-3.5 border-l px-2.5']"
  >
    <template
      v-for="link in links"
      :key="link.id"
    >
      <AsideTreeItem
        :link="link"
        :level="level"
      />
    </template>
  </ul>
</template>

<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

defineProps<{
  links: ContentNavigationItem[] | null;
  level: number;
}>();
</script>
