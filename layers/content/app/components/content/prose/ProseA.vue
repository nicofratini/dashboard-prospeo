<template>
  <NuxtLink
    :href
    :target
    :external
    class="font-semibold underline underline-offset-4 text-primary hover:text-primary/80"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const {
  href = '',
  external = false,
} = defineProps<{
  href?: string;
  target?: Target;
  external?: boolean;
}>();
</script>
