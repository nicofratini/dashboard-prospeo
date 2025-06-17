<script setup lang="ts">
definePageMeta({
  layout: 'blogs',
  middleware: ['content-navigation-redirect'],
});

const route = useRoute();

const { data } = await useAsyncData(route.path, () => Promise.all([
  queryCollection('blog').path(route.path).first(),
  queryCollectionItemSurroundings('blog', route.path, {
    fields: ['title', 'description', 'path'],
  }),
]), {
  transform: ([post, surround]) => ({ post, surround }),
});
if (!data.value || !data.value.post) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const post = computed(() => data.value?.post);
const surround = computed(() => data.value?.surround);

provide(route.path, post);

const title = post.value?.seo?.title || post.value?.title;
const description = post.value?.seo?.description || post.value?.description;

useHead(post.value.head || {}); // <-- Nuxt Schema.org

useSeoMeta({
  title: `${title ?? '404'}`,
  description: description,
  ogDescription: description,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: post.value?.ogImage,
});

if (post.value?.ogImage) {
  defineOgImage(post.value?.ogImage); // <-- Nuxt OG Image
}

const formatSchemaDate = (dateString: string | undefined) => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return date.toISOString();
};

// Add Schema.org structured data for the blog post
useSchemaOrg([
  // Define the article with BlogPosting type
  defineArticle({
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'datePublished': formatSchemaDate(post.value?.date),
    'dateModified': formatSchemaDate(post.value?.date),
    // Add authors if available
    ...(post.value?.authors?.length && {
      author: post.value.authors.map(author => ({
        '@type': 'Person',
        'name': author.name,
        'url': author.to,
        ...(author.avatar && { image: author.avatar.src }),
      })),
    }),
  }),
]);
</script>

<template>
  <div v-if="post">
    <div class="container mx-auto px-4 py-8 md:py-12">
      <!-- Blog Post Header -->
      <div class="max-w-3xl mb-10">
        <!-- Meta Info -->
        <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>{{ new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
          <span v-if="post.badge">•</span>
          <span
            v-if="post.badge"
            class="bg-muted px-2 py-1 rounded-full text-xs"
          >
            {{ post.badge.label }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          {{ post.title }}
        </h1>

        <!-- Description -->
        <p class="text-xl text-muted-foreground mb-8">
          {{ post.description }}
        </p>

        <!-- Authors -->
        <div
          v-if="post.authors?.length"
          class="flex items-center gap-4"
        >
          <div
            v-for="author in post.authors"
            :key="author.name"
            class="flex items-center gap-3"
          >
            <NuxtLink :to="author.to">
              <NuxtImg
                v-if="author.avatar"
                :src="author.avatar.src"
                :alt="author.name"
                class="size-10 rounded-full object-cover"
                loading="lazy"
                placeholder
              />
            </NuxtLink>
            <div class="flex flex-col">
              <NuxtLink
                :to="author.to"
                class="font-medium hover:text-primary transition-colors"
              >
                {{ author.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:grid lg:grid-cols-[1fr_200px] lg:gap-10 relative">
        <div class="mx-auto w-full min-w-0">
          <ContentBreadcrumb
            collection="blog"
            class="mb-6"
          />

          <article>
            <ContentRenderer
              v-if="post?.body"
              :value="post"
              class="docs-content prose dark:prose-invert max-w-none"
            />
          </article>

          <PrevNext :surround="surround ?? []" />
        </div>

        <div class="hidden text-sm lg:block">
          <div class="sticky top-[90px] h-[calc(100vh-3.5rem)] overflow-hidden">
            <Toc
              :is-small="false"
              :enable-toc-links="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
