<script setup lang="ts">
import type { RadioGroupItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import {
  RadioGroupIndicator,
  RadioGroupItem,

  useForwardProps,
} from 'reka-ui';
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<RadioGroupItemProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <RadioGroupItem
    v-bind="forwardedProps"
    :class="
      cn(
        'peer aspect-square size-5 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-200',
        props.class,
      )
    "
  >
    <RadioGroupIndicator class="flex items-center justify-center transition-opacity duration-200 animate-in fade-in zoom-in-50">
      <Icon
        name="line-md:confirm"
        mode="svg"
        class="size-3.5 text-primary"
      />
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
