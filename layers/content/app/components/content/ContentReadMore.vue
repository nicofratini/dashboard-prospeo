<template>
  <ContentAlert
    :to
    :target
    :icon
  >
    Read more at <span class="font-semibold">{{ computedTitle }}</span>
  </ContentAlert>
</template>

<script setup lang="ts">
const {
  title,
  to,
  icon = 'mdi:bookmark-outline',
} = defineProps<{
  title?: string;
  to: string;
  target?: Target;
  icon?: string;
}>();

const computedTitle = computed<string>(
  () => {
    if (title)
      return title;

    try {
      return useDocBreadcrumb(to).map(x => x.title).join(' > ');
    }
    catch {
      return to;
    }
  },
);
</script>
