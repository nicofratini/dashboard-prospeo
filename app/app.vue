<script setup lang="ts">
/**
 * Defines the Open Graph (OG) image component for social media sharing
 *
 * This component is used to generate dynamic Open Graph images for better social media sharing.
 * The generated image will be used when the page is shared on platforms like Twitter, Facebook, etc.
 * The image is generated server-side using the specified component and props. There're number of
 * tempalates which can be customized. Or a fully custom component can be created.
 */

defineOgImageComponent('Prospeo', {
  headline: '',
  title: 'Prospeo.ai',
  description: 'Prospeo.ai, the intelligent conversational assistant that answers your prospects 24/7, qualifies your leads, and boosts your real estate conversions.',
});

const { name: siteName } = useSiteConfig();

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
});

useSeoMeta({
  ogImage: '/og-image.png',
  titleTemplate: `%s | ${siteName}`,
  ogSiteName: siteName,
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :throttle="10" />
    <NuxtPage />
    <LazyToaster :duration="5000" />
  </NuxtLayout>
</template>
