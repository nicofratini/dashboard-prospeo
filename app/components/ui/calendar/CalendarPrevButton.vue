<script lang="ts" setup>
import { CalendarPrev, type CalendarPrevProps, useForwardProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = defineProps<CalendarPrevProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <CalendarPrev
    :class="cn(
      buttonVariants({ variant: 'outline' }),
      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot>
      <Icon
        name="mdi:chevron-left"
        class="h-4 w-4"
      />
    </slot>
  </CalendarPrev>
</template>
