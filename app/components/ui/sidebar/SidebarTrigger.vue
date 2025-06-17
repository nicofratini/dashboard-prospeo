<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useSidebar } from './utils';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { toggleSidebar, open } = useSidebar();
</script>

<template>
  <Button
    data-sidebar="trigger"
    variant="ghost"
    size="icon"
    :class="cn('size-7', props.class)"
    @click="toggleSidebar"
  >
    <Icon
      :name="open ? 'line-md:menu-fold-left' : 'line-md:menu-unfold-right'"
      mode="svg"
      class="size-4"
    />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
