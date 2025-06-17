<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import type { DirectoryItem, DirectoryItemStatus } from '~/types';
import { useDirectoryService } from '~/services/directoryService';
import type { FilterOptions } from '~/services/directoryService';

// Directory service
const directoryService = useDirectoryService();

// Use composables for groups and tags
const { groups: categories, isLoading: categoriesLoading, fetchGroups } = useDirectoryGroups();
const { tags, isLoading: tagsLoading, fetchTags } = useDirectoryTags();

// State
const directoryItems = ref<DirectoryItem[]>([]);
const error = ref<string | null>(null);
const totalCount = ref(0);
const isLoading = ref(false);

// Filters
const activeCategories = ref<string[]>([]);
const activeTags = ref<string[]>([]);
const showFeaturedOnly = ref(false);
const searchQuery = ref('');
const isSearching = ref(false);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 12;

// Build filter options
const filterOptions = computed<FilterOptions>(() => {
  const options: FilterOptions = {
    limit: itemsPerPage,
    offset: (currentPage.value - 1) * itemsPerPage,
    status: 'published' as DirectoryItemStatus,
    orderBy: {
      column: 'created_at',
      ascending: false,
    },
  };

  // Add search filter
  if (searchQuery.value.trim()) {
    options.search = searchQuery.value.trim();
  }

  // Add category filter - only if there are selected categories
  if (activeCategories.value.length > 0) {
    options.groups = activeCategories.value;
  }

  // Add tag filter - only if there are selected tags
  if (activeTags.value.length > 0) {
    options.tags = activeTags.value;
  }

  // Add featured filter
  if (showFeaturedOnly.value) {
    options.featured = true;
  }

  return options;
});

// Function to fetch directory items with current filter options
const fetchDirectoryItems = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await directoryService.getItems(filterOptions.value);

    directoryItems.value = response.items;
    totalCount.value = response.count;
  }
  catch (err) {
    console.error('Error fetching directory items:', err);
    error.value = 'Failed to load directory items. Please try again.';
    directoryItems.value = [];
    totalCount.value = 0;
  }
  finally {
    isLoading.value = false;
    isSearching.value = false;
  }
};

// Create debounced search function (500ms delay)
const debouncedSearch = useDebounceFn(async () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  }
  else {
    await fetchDirectoryItems();
  }
}, 500);

// Watch for search query changes
watch(searchQuery, () => {
  isSearching.value = true;
  debouncedSearch();
});

// Handle category selection
const selectCategory = async (categoryId: string) => {
  // Find index of the category in the array
  const index = activeCategories.value.indexOf(categoryId);

  // If not found, add it; otherwise remove it
  if (index === -1) {
    activeCategories.value.push(categoryId);
  }
  else {
    activeCategories.value.splice(index, 1);
  }

  currentPage.value = 1;
  await fetchDirectoryItems();
};

// Handle tag selection
const selectTag = async (tagId: string) => {
  // Find index of the tag in the array
  const index = activeTags.value.indexOf(tagId);

  // If not found, add it; otherwise remove it
  if (index === -1) {
    activeTags.value.push(tagId);
  }
  else {
    activeTags.value.splice(index, 1);
  }

  currentPage.value = 1;
  await fetchDirectoryItems();
};

// Handle featured toggle
const toggleFeatured = async () => {
  showFeaturedOnly.value = !showFeaturedOnly.value;
  currentPage.value = 1;
  await fetchDirectoryItems();
};

// Handle page change
const changePage = async (page: number) => {
  currentPage.value = page;
  await fetchDirectoryItems();
};

// Reset filters and refresh data
const resetFilters = async () => {
  activeCategories.value = [];
  activeTags.value = [];
  showFeaturedOnly.value = false;
  searchQuery.value = '';
  currentPage.value = 1;
  await fetchDirectoryItems();
};

// Helper to format selected categories for display
const categoryDisplayText = computed(() => {
  if (activeCategories.value.length === 0) {
    return 'Categories';
  }

  if (activeCategories.value.length === 1) {
    const category = categories.value.find(c => c.id === activeCategories.value[0]);
    return category ? category.name : 'Categories';
  }

  // For multiple categories, show a count with AND logic indicator
  return `${activeCategories.value.length} categories (AND)`;
});

// Helper to format selected tags for display
const tagDisplayText = computed(() => {
  if (activeTags.value.length === 0) {
    return 'Tags';
  }

  if (activeTags.value.length === 1) {
    const tag = tags.value.find(t => t.id === activeTags.value[0]);
    return tag ? tag.name : 'Tags';
  }

  // For multiple tags, show a count with AND logic indicator
  return `${activeTags.value.length} tags (AND)`;
});

// Computed properties
const filteredItems = computed(() => directoryItems.value);
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage));

// Helper function to create a slug from a name
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
};

// Check if any data is loading
const isPageLoading = computed(() =>
  isLoading.value || categoriesLoading.value || tagsLoading.value,
);

await Promise.all([
  fetchGroups(),
  fetchTags(),
  fetchDirectoryItems(),
]);

// SEO
useSeoMeta({
  title: 'Resource Directory | Explore Our Collection',
  description: 'Discover a curated collection of resources, tools, and guides to help you on your journey.',
  ogTitle: 'Resource Directory | Explore Our Collection',
  ogDescription: 'Browse our curated directory of resources, tools, and guides.',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header section with badge, gradient title, and search input -->
    <div class="mb-12 text-center">
      <!-- Badge above title -->
      <div class="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        <Icon
          name="line-md:grid-3-filled"
          class="mr-1 h-4 w-4"
        />
        Resource Directory
      </div>

      <!-- Gradient title -->
      <h1 class="mb-6 bg-gradient-to-r from-emerald-500 via-blue-300 to-indigo-600 bg-clip-text text-4xl font-brand text-transparent sm:text-5xl max-w-fit mx-auto">
        Explore Our Directory
      </h1>
      <p class="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-gray-300">
        Discover a curated collection of resources, tools, and guides to help you on your journey.
      </p>

      <!-- Submit button -->
      <div class="mb-8">
        <Button
          as-child
          class="gap-2"
        >
          <NuxtLink to="/directory/submit">
            <Icon
              name="line-md:plus-circle"
              mode="svg"
              class="size-4"
            />
            Submit Resource
          </NuxtLink>
        </Button>
      </div>

      <!-- Search input with auto-search via debounce -->
      <div class="mx-auto mb-8 max-w-md">
        <div class="relative">
          <span class="absolute start-2 inset-y-0 flex items-center justify-center px-2">
            <Icon
              name="line-md:search"
              class="text-muted-foreground size-5"
            />
          </span>
          <Input
            v-model="searchQuery"
            placeholder="Search resources..."
            class="rounded-full pl-10"
          />
          <div
            v-if="isSearching"
            class="absolute size-5 right-3 top-1/2 -translate-y-1/2"
          >
            <Icon
              name="svg-spinners:ring-resize"
              class="size-5 text-muted-foreground animate-spin"
            />
          </div>
        </div>
      </div>

      <!-- Category filter buttons -->
      <div
        v-if="!categoriesLoading && categories.length > 0"
        class="flex flex-wrap justify-center gap-2 items-center"
      >
        <!-- Category dropdown -->
        <div class="flex items-center gap-1">
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                size="sm"
                class="flex items-center gap-1"
              >
                {{ categoryDisplayText }}
                <Icon
                  name="mdi:chevron-down"
                  mode="svg"
                  class="ml-1 h-4 w-4 shrink-0 opacity-50"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandEmpty>No category found.</CommandEmpty>
                <ScrollArea class="h-60">
                  <CommandGroup>
                    <CommandItem
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.name"
                      @select="() => selectCategory(category.id)"
                    >
                      <div class="flex items-center">
                        <Checkbox
                          :model-value="activeCategories.includes(category.id)"
                          class="mr-2 h-4 w-4"
                        />
                        {{ category.name }}
                      </div>
                    </CommandItem>
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <!-- Tags dropdown -->
        <div class="flex items-center gap-1">
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                size="sm"
                class="flex items-center gap-1"
              >
                {{ tagDisplayText }}
                <Icon
                  name="mdi:chevron-down"
                  mode="svg"
                  class="ml-1 h-4 w-4 shrink-0 opacity-50"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandEmpty>No tag found.</CommandEmpty>
                <ScrollArea class="h-60">
                  <CommandGroup>
                    <CommandItem
                      v-for="tag in tags"
                      :key="tag.id"
                      :value="tag.name"
                      @select="() => selectTag(tag.id)"
                    >
                      <div class="flex items-center">
                        <Checkbox
                          :model-value="activeTags.includes(tag.id)"
                          class="mr-2 h-4 w-4"
                        />
                        {{ tag.name }}
                      </div>
                    </CommandItem>
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <!-- Featured toggle -->
        <Button
          :variant="showFeaturedOnly ? 'default' : 'outline'"
          size="sm"
          class="flex items-center gap-1"
          @click="toggleFeatured"
        >
          <Icon
            name="line-md:star-filled"
            mode="svg"
            class="h-4 w-4 text-yellow-500"
          />
          Featured Only
        </Button>

        <!-- Reset filters button -->
        <Button
          variant="outline"
          size="sm"
          class="flex items-center gap-1"
          @click="resetFilters"
        >
          <Icon
            mode="svg"
            name="line-md:close-circle"
            class="h-4 w-4"
          />
          Reset Filters
        </Button>
      </div>
    </div>

    <!-- Loading state - items skeleton -->
    <LazyDirectoryItemsSkeleton
      v-if="isLoading && !error"
      :count="itemsPerPage"
    />

    <!-- Error state -->
    <div
      v-else-if="error"
      class="mx-auto max-w-md rounded-lg bg-destructive/10 p-4 text-center text-destructive"
    >
      <Icon
        name="line-md:alert"
        class="mx-auto mb-2 h-8 w-8 text-destructive"
      />
      <p>{{ error }}</p>
      <Button
        class="mt-4"
        @click="fetchDirectoryItems"
      >
        Try Again
      </Button>
    </div>

    <!-- Directory grid -->
    <template v-else-if="!isLoading">
      <!-- Responsive grid layout -->
      <div
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <DirectoryCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="{
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrl: item.image_url || undefined,
            tags: item.tags?.map((tag: any) => tag.name),
            groups: item.groups?.map((group: any) => ({
              id: group.id,
              name: group.name,
              slug: createSlug(group.name),
            })),
            featured: item.featured,
            url: item.url || undefined,
          }"
          class="h-full"
        />
      </div>

      <!-- Empty state when no items match filters -->
      <div
        v-if="!isPageLoading && filteredItems.length === 0"
        class="mt-8 text-center"
      >
        <Icon
          name="line-md:alert"
          class="mx-auto h-12 w-12 text-muted-foreground"
        />
        <h3 class="mt-2 text-lg font-medium text-foreground">
          No items found
        </h3>
        <p class="mt-1 text-muted-foreground">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
        <Button
          class="mt-4"
          variant="outline"
          @click="resetFilters"
        >
          Reset All Filters
        </Button>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="mt-8"
      >
        <Pagination
          v-slot="{ page }"
          :items-per-page="itemsPerPage"
          :total="totalCount"
          :sibling-count="1"
          show-edges
          :default-page="currentPage"
          @update:page="changePage"
        >
          <PaginationList
            v-slot="{ items }"
            class="flex items-center justify-center gap-1"
          >
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <Button
                  class="size-10 p-0"
                  :variant="item.value === page ? 'default' : 'outline'"
                >
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis
                v-else
                :key="item.type"
                :index="index"
              />
            </template>

            <PaginationNext />
            <PaginationLast />
          </PaginationList>
        </Pagination>
      </div>
    </template>
  </div>
</template>
