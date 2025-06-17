<script setup lang="ts">
import ContentTabs from '~/components/content/ContentTabs.vue';

const { inStack = false } = defineProps<{
  inStack?: boolean;
}>();

const _slots = useSlots();
function render() {
  const slots = _slots?.default?.() || [];
  return h(
    ContentTabs,
    {
      variant: 'card',
      inStack,
    },
    () => slots,
  );
}
</script>

<template>
  <render />
</template>
