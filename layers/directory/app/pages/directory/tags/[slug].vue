<script setup lang="ts">
import { useDirectoryService } from '~/services/directoryService';

interface DirectoryCardItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  groups: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  featured: boolean;
  url: string;
}

interface DirectoryTag {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

const route = useRoute();

const { fetchTags, createSlug } = useDirectoryTags();
const directoryItems = ref<DirectoryCardItem[]>([]);
const error = ref<string | null>(null);
const isLoading = ref(true);
const directoryService = useDirectoryService();

// Fetch tags and find current tag
const { data: tags } = await fetchTags();
const currentTag = computed(() => tags.value?.find((tag: DirectoryTag) => tag.slug === route.params.slug as string));

// Fetch directory items for the current tag
async function fetchTagItems() {
  try {
    isLoading.value = true;
    error.value = null;

    if (!currentTag.value?.id) {
      directoryItems.value = [];
      return;
    }

    const response = await directoryService.getItemsByTag(currentTag.value.id);

    directoryItems.value = response.items.map(transformToCardItem) || [];
  }
  catch (err: any) {
    console.error('Error fetching tag items:', err);
    error.value = err?.message || 'Failed to load items for this tag';
    directoryItems.value = [];
  }
  finally {
    isLoading.value = false;
  }
}

// Transform directory item to card item
function transformToCardItem(item: any): DirectoryCardItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.image_url || '',
    tags: Array.isArray(item.tags)
      ? item.tags.map((tag: { name: string }) => tag.name)
      : [],
    groups: Array.isArray(item.groups)
      ? item.groups.map((group: { id: string; name: string }) => ({
          id: group.id,
          name: group.name,
          slug: createSlug(group.name),
        }))
      : [],
    featured: item.featured,
    url: item.url || '',
  };
}

// SEO metadata
useSeoMeta({
  title: computed(() => currentTag.value ? `${currentTag.value.name} Resources | Directory` : 'Tag Resources | Directory'),
  description: computed(() => currentTag.value
    ? `Browse resources tagged with ${currentTag.value.name}. Find tools, guides, and more.`
    : 'Browse our curated collection of resources by tag.'),
});

// Fetch items when component is mounted
await useAsyncData(`directory-items-${currentTag.value?.id}`, async () => {
  await fetchTagItems();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header section -->
    <div class="mb-12 text-center relative">
      <!-- Back button -->
      <NuxtLink
        to="/directory/tags"
        class="mb-4 inline-flex absolute left-0 items-center text-sm font-medium text-primary group"
      >
        <Icon
          name="line-md:arrow-left"
          class="mr-1 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
        />
        Back to All Tags
      </NuxtLink>

      <!-- Badge above title -->
      <div class="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        <Icon
          name="line-md:hash"
          class="mr-1 h-4 w-4"
        />
        {{ currentTag?.name || 'Tag' }}
      </div>

      <!-- Gradient title -->
      <h1 class="mb-6 bg-gradient-to-r from-emerald-500 via-blue-300 to-indigo-600 bg-clip-text text-4xl font-brand text-transparent sm:text-5xl max-w-fit mx-auto">
        {{ currentTag?.name }}
      </h1>

      <!-- Description -->
      <p
        v-if="currentTag?.description"
        class="mx-auto mb-8 max-w-2xl text-muted-foreground"
      >
        {{ currentTag.description }}
      </p>
      <p
        v-else
        class="mx-auto mb-8 max-w-2xl text-muted-foreground"
      >
        Discover a curated collection of resources, tools, and guides with this tag.
      </p>
    </div>

    <!-- Loading state - items skeleton -->
    <LazyDirectoryItemsSkeleton
      v-if="isLoading"
      :count="12"
    />

    <!-- Directory items content -->
    <template v-else>
      <!-- Responsive grid layout -->
      <div
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      >
        <LazyDirectoryCard
          v-for="item in directoryItems"
          :key="item.id"
          :item="item"
          class="h-full"
        />
      </div>

      <!-- Empty state -->
      <div
        v-if="directoryItems.length === 0"
        class="mt-8 text-center"
      >
        <Icon
          name="line-md:alert-circle"
          class="mx-auto h-12 w-12 text-muted-foreground"
        />
        <h3 class="mt-2 text-lg font-medium text-foreground">
          No items found
        </h3>
        <p class="mt-1 text-muted-foreground">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </div>
    </template>
  </div>
</template>
