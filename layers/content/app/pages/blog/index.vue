<script setup lang="ts">
definePageMeta({
  layout: 'blogs',
  middleware: ['content-navigation-redirect'],
});

const { data: posts } = await useAsyncData('posts', () => queryCollection('blog')
  .select('title', 'description', 'path', 'date', 'badge', 'image', 'authors')
  .where('extension', '=', 'md')
  .order('date', 'DESC')
  .all());
</script>

<template>
  <div
    v-if="posts"
    class="container mx-auto px-4 py-8"
  >
    <ContentBlogList :posts="posts" />
  </div>
</template>
