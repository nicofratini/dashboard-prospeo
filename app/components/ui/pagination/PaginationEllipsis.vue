<script setup lang="ts">
import { PaginationEllipsis, type PaginationEllipsisProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<PaginationEllipsisProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <PaginationEllipsis
    v-bind="delegatedProps"
    :class="cn('w-9 h-9 flex items-center justify-center', props.class)"
  >
    <slot>
      <Icon
        name="mdi:dots-horizontal"
        class="h-4 w-4"
      />
    </slot>
  </PaginationEllipsis>
</template>
