<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation-changelog', () => queryCollectionNavigation('changelog'));

if (!navigation.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

provide('navigation-changelog', navigation);
</script>

<template>
  <div>
    <ContentHeader :enable-search="false" />
    <slot />
    <Footer />
  </div>
</template>
