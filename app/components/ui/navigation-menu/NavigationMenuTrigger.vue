<script setup lang="ts">
import {
  NavigationMenuTrigger,
  type NavigationMenuTriggerProps,
  useForwardProps,
} from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { navigationMenuTriggerStyle } from '.';
import { cn } from '@/lib/utils';

const props = defineProps<NavigationMenuTriggerProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <NavigationMenuTrigger
    v-bind="forwardedProps"
    :class="cn(navigationMenuTriggerStyle(), 'group', props.class)"
  >
    <slot />
    <Icon
      name="mdi:chevron-down"
      class="relative top-px ml-1 transition duration-200 group-data-[state=open]:rotate-180"
      mode="svg"
      aria-hidden="true"
    />
  </NavigationMenuTrigger>
</template>
