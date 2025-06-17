<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation-docs', () => queryCollectionNavigation('docs',
  ['title', 'icon', 'description', 'path', 'redirect', 'id']));

if (!navigation.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

provide('navigation-docs', navigation);
</script>

<template>
  <div>
    <slot />
    <Footer />
  </div>
</template>
