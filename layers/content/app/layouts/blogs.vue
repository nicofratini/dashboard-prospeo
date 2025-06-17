<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation-blog', () => queryCollectionNavigation('blog'));

if (!navigation.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

provide('navigation-blog', navigation);
</script>

<template>
  <div>
    <ContentHeader :enable-search="false" />
    <slot />
    <Footer />
  </div>
</template>
