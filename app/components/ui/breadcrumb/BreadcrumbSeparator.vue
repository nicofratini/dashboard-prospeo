<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <li
    role="presentation"
    aria-hidden="true"
    :class="cn('[&>svg]:size-4', props.class)"
  >
    <slot>
      <Icon
        name="mdi:chevron-right"
        mode="svg"
      />
    </slot>
  </li>
</template>
