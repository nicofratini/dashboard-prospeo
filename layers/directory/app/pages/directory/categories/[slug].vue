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

interface DirectoryCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

const route = useRoute();

const { fetchGroups, createSlug, groups: categories } = useDirectoryGroups();

// Fetch categories and find current category
await fetchGroups();
const currentCategory = computed(() => categories.value?.find((category: DirectoryCategory) => category.slug === route.params.slug));
const directoryItems = ref<DirectoryCardItem[]>([]);
const error = ref<string | null>(null);
const directoryService = useDirectoryService();
const isLoading = ref(true);

// Fetch directory items
async function fetchCategoryItems() {
  try {
    isLoading.value = true;
    error.value = null;

    if (!currentCategory.value?.id) {
      directoryItems.value = [];
      return;
    }

    const response = await directoryService.getItemsByCategory(currentCategory.value.id);

    directoryItems.value = response.items.map(transformToCardItem) || [];
  }
  catch (err: any) {
    console.error('Error fetching category items:', err);
    error.value = err?.message || 'Failed to load items for this category';
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

useSeoMeta({
  title: computed(() => currentCategory.value ? `${currentCategory.value.name} Resources | Directory` : 'Category Resources | Directory'),
  description: computed(() => currentCategory.value
    ? `Browse resources in the ${currentCategory.value.name} category. Find tools, guides, and more.`
    : 'Browse our curated collection of resources by category.'),
});

// Fetch items when component is mounted
await useAsyncData(`directory-items-${currentCategory.value?.id}`, async () => {
  await fetchCategoryItems();
});

// Transition styles
const fadeTransition = {
  'enter-active-class': 'transition-opacity duration-300 ease-out',
  'enter-from-class': 'opacity-0',
  'enter-to-class': 'opacity-100',
  'leave-active-class': 'transition-opacity duration-200 ease-in',
  'leave-from-class': 'opacity-100',
  'leave-to-class': 'opacity-0',
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header section -->
    <div class="mb-12 text-center relative">
      <!-- Back button -->
      <NuxtLink
        to="/directory/categories"
        class="mb-4 inline-flex absolute left-0 items-center text-sm font-medium text-primary group"
      >
        <Icon
          name="line-md:arrow-left"
          class="mr-1 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
        />
        Back to All Categories
      </NuxtLink>

      <!-- Badge above title -->
      <div class="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        <Icon
          name="line-md:grid-3-filled"
          class="mr-1 h-4 w-4"
        />
        {{ currentCategory?.name || 'Category' }}
      </div>

      <!-- Gradient title -->
      <h1 class="mb-6 bg-gradient-to-r from-emerald-500 via-blue-300 to-indigo-600 bg-clip-text text-4xl font-brand text-transparent sm:text-5xl max-w-fit mx-auto">
        {{ currentCategory?.name }}
      </h1>

      <!-- Description -->
      <p
        v-if="currentCategory?.description"
        class="mx-auto mb-8 max-w-2xl text-muted-foreground"
      >
        {{ currentCategory.description }}
      </p>
      <p
        v-else
        class="mx-auto mb-8 max-w-2xl text-muted-foreground"
      >
        Discover a curated collection of resources, tools, and guides in this category.
      </p>
    </div>

    <!-- Content area with transitions -->
    <div class="relative">
      <!-- Loading state - items skeleton with transition -->
      <Transition v-bind="fadeTransition">
        <LazyDirectoryItemsSkeleton
          v-if="isLoading"
          key="skeleton"
          :count="12"
        />
      </Transition>

      <!-- Directory items content with transition -->
      <Transition v-bind="fadeTransition">
        <div
          v-if="!isLoading"
          key="content"
        >
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
              No resources are currently available in this category.
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
