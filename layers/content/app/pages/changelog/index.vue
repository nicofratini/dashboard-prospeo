<script setup lang="ts">
definePageMeta({
  layout: 'changelog',
  middleware: ['content-navigation-redirect'],
});

const { data: posts } = await useAsyncData('changelog', () =>
  queryCollection('changelog')
    .select('title', 'description', 'publishedAt', 'badge', 'image', 'authors', 'icon', 'path')
    .where('extension', '=', 'md')
    .order('publishedAt', 'DESC')
    .all(),
{
  transform: posts => posts?.map(post => ({
    titleLink: post.path,
    icon: post.icon || 'line-md:document-list',
    title: post.title,
    description: post.description,
    badge: post.badge.label,
    imgSrc: post.image.src,
    authors: post.authors,
    date: new Date(post.publishedAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  })) ?? [],
},
);
</script>

<template>
  <div class="container flex flex-col gap-6 justify-center items-center my-12 px-6 md:my-24 md:px-24">
    <h1 class="text-4xl text-center font-bold md:text-6xl">
      Changelog
    </h1>
    <p class="text-muted-foreground text-lg text-center">
      Follow the latest updates and improvements to the project.
    </p>
    <!--  <ContentChangelogList /> -->
    <StoryLine
      :card-alignment-horizontal="false"
      image-aspect-ratio="video"
      :items="posts"
    />
  </div>
</template>
