<script setup lang="ts">
import { PaginationLast, type PaginationLastProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import {
  Button,
} from '@/components/ui/button';

const props = withDefaults(defineProps<PaginationLastProps & { class?: HTMLAttributes['class'] }>(), {
  asChild: true,
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <PaginationLast v-bind="delegatedProps">
    <Button
      :class="cn('w-9 h-9 p-0', props.class)"
      variant="outline"
    >
      <slot>
        <Icon
          name="mdi:chevron-right"
          class="h-4 w-4"
        />
      </slot>
    </Button>
  </PaginationLast>
</template>
