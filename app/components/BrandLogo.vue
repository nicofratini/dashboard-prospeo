<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(defineProps<{
  src?: string;
  name?: string;
} & { class?: HTMLAttributes['class'] }>(), {
  src: '/logo.png',
  name: 'Brand Logo',
});
</script>

<template>
  <div class="flex flex-row gap-2 items-center justify-center">
    <NuxtImg
      :src="props.src"
      :alt="props.name"
      loading="lazy"
      :class="cn('size-10 min-w-10', props.class)"
    />
  </div>
</template>
