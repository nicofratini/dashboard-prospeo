<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

defineProps<{ surround: ContentNavigationItem[] }>();
</script>

<template>
  <div class="mt-10 border-t pt-8 lg:flex lg:flex-row">
    <PrevNextButton
      :prev-next="surround?.[0]"
      side="left"
    />
    <span class="flex-1" />
    <PrevNextButton
      :prev-next="surround?.[1]"
      side="right"
    />
  </div>
</template>
