<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  class?: HTMLAttributes['class'];
  icon?: string;
  description: string;
  href: string;
  cta: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    :key="name"
    :class="
      cn(
        'group relative col-span-3 flex flex-col justify-end overflow-hidden rounded-xl border border-border transform-gpu',
        props.class,
      )
    "
  >
    <slot name="background" />

    <div
      class="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10"
    >
      <component
        :is="icon"
        v-if="icon"
        class="size-12 origin-left transform-gpu text-muted-foreground transition-all duration-300 ease-in-out group-hover:scale-75"
      />
      <div
        v-else
        class="size-12 origin-left transform-gpu text-muted-foreground transition-all duration-300 ease-in-out group-hover:scale-75"
      />
      <h3 class="text-xl font-semibold text-foreground">
        {{ name }}
      </h3>
      <p class="max-w-lg text-foreground dark:text-muted-foreground">
        {{ description }}
      </p>
    </div>

    <div
      class="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
    >
      <Button
        variant="link"
        as-child
        size="sm"
        class="pointer-events-auto"
      >
        <a :href="href"> {{ cta }} → </a>
      </Button>
    </div>
    <div
      class="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-muted/15"
    />
  </div>
</template>
