<script setup lang="ts">
import { TagsInputItemDelete, type TagsInputItemDeleteProps, useForwardProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<TagsInputItemDeleteProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TagsInputItemDelete
    v-bind="forwardedProps"
    :class="cn('flex rounded bg-transparent mr-1', props.class)"
  >
    <slot>
      <Icon
        name="mdi:close"
        class="size-4"
      />
    </slot>
  </TagsInputItemDelete>
</template>
