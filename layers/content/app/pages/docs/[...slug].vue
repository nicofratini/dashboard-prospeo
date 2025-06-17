<script setup lang="ts">
definePageMeta({
  layout: 'docs',
  middleware: ['content-navigation-redirect'],
});

const route = useRoute();

const { data } = await useAsyncData(route.path, () => Promise.all([
  queryCollection('docs').path(route.path).first(),
  queryCollectionItemSurroundings('docs', route.path, {
    fields: ['title', 'description', 'path'],
  }),
]), {
  transform: ([page, surround]) => ({ page, surround }),
});
if (!data.value || !data.value.page) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const page = computed(() => data.value?.page);
const surround = computed(() => data.value?.surround);

provide(route.path, page);

const {
  toc: {
    enable: tocEnable,
  },
} = useAppConfig().boilerplateDocs;

const title = page.value?.seo?.title || page.value?.title;
const description = page.value?.seo?.description || page.value?.description;

useHead(page.value.head || {}); // <-- Nuxt Schema.org

useSeoMeta({
  title: `${title ?? '404'}`,
  description: description,
  ogDescription: description,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: page.value?.ogImage,
});

if (page.value?.ogImage) {
  defineOgImage(page.value?.ogImage); // <-- Nuxt OG Image
}

/* defineOgImageComponent('BoilerplateDocs', {
  title: page.value.title,
  description: page.value.description,
}); */
</script>

<template>
  <div>
    <ContentHeader />
    <div
      class="container flex-1 items-start px-4 pt-4 md:grid md:grid-cols-sidebar md:gap-6 md:px-8 md:pt-8 lg:grid-cols-sidebar-lg lg:gap-10"
    >
      <aside
        class="fixed top-[104px] z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:top-[90px] md:block"
      >
        <Aside :is-mobile="false" />
      </aside>
      <main>
        <div class="lg:grid lg:grid-cols-[1fr_200px] lg:gap-10 relative">
          <div class="mx-auto w-full min-w-0 flex flex-col gap-4">
            <ContentBreadcrumb />

            <article>
              <!--      Class docs-content is needed for toc active tabs highlighting. See useScrollspy.ts and TocTree.vue      -->
              <ContentRenderer
                v-if="page?.body"
                :value="page"
                class="docs-content"
              />
            </article>

            <PrevNext :surround="surround ?? []" />
          </div>

          <div
            v-if="tocEnable && (page?.body?.toc ?? true)"
            class="hidden text-sm lg:block"
          >
            <div class="sticky top-[90px] h-[calc(100vh-3.5rem)] overflow-hidden">
              <Toc :is-small="false" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
