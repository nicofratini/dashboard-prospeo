<template>
  <div
    :class="
      cn(
        'row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-background border justify-between flex flex-col space-y-4',
        props.class,
      )
    "
  >
    <slot name="header" />
    <div class="transition duration-200 group-hover/bento:translate-x-2">
      <slot name="icon" />
      <div class="my-2 text-lg font-sans font-bold text-foreground">
        <slot name="title" />
      </div>
      <div class="font-sans font-normal text-muted-foreground">
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>
