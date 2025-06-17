<script setup lang="ts">
import { useDirectoryService } from '~/services/directoryService';
import type { DirectoryItem, DirectoryItemStatus } from '~/types';

// Define interface for directory item card
interface UserDirectoryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  likesCount: number;
  url: string | null;
  groups: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

// Constants
const STATUSES = {
  draft: { label: 'Draft', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  published: { label: 'Published', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  archived: { label: 'Archived', class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  pending: { label: 'Pending', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
};

// Services
const directoryService = useDirectoryService();

// State
const userItems = ref<UserDirectoryItem[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const user = useSupabaseUser();
const totalItems = ref(0);

// Simple pagination
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

// Sort and filter options
const sortBy = ref('created_at');
const sortOrder = ref('desc');
const statusFilter = ref<string | null>(null);

// Toggle sort order and refresh results
function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  updateSort(sortBy.value);
}

// Get display name for sort option
function getSortDisplayName(sortValue: string): string {
  const sortOptions = {
    created_at: 'Date Created',
    updated_at: 'Date Modified',
    title: 'Title',
    views_count: 'Views',
    likes_count: 'Likes',
  };

  return sortOptions[sortValue as keyof typeof sortOptions] || sortValue;
}

// Fetch user's directory items
async function fetchUserItems() {
  try {
    isLoading.value = true;
    error.value = null;

    if (!user.value?.id) {
      error.value = 'You must be logged in to view your resources';
      return;
    }

    const response = await directoryService.getItems({
      userId: user.value.id,
      limit: itemsPerPage,
      offset: (currentPage.value - 1) * itemsPerPage,
      orderBy: {
        column: sortBy.value as keyof DirectoryItem,
        ascending: sortOrder.value === 'asc',
      },
      status: statusFilter.value as DirectoryItemStatus || undefined,
    });

    totalItems.value = response.count;

    // Transform response to match our UI needs
    userItems.value = response.items.map((item: DirectoryItem) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      status: item.status,
      featured: item.featured,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      viewsCount: item.views_count,
      likesCount: item.likes_count,
      url: item.url,
      groups: item.groups || [],
      tags: item.tags || [],
    }));
  }
  catch (err: any) {
    console.error('Error fetching user items:', err);
    error.value = err?.message || 'Failed to load your resources';
    userItems.value = [];
  }
  finally {
    isLoading.value = false;
  }
}

// Handle page change
async function changePage(page: number) {
  currentPage.value = page;
  await fetchUserItems();
}

// Handle sort change
async function updateSort(value: any) {
  if (typeof value === 'string') {
    sortBy.value = value;
  }
  currentPage.value = 1; // Reset to first page
  await fetchUserItems();
}

// Handle status filter change
async function filterByStatus(value: any) {
  if (value === null || typeof value === 'string') {
    statusFilter.value = value;
  }
  currentPage.value = 1; // Reset to first page
  await fetchUserItems();
}

// Format date for display
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Fetch items on component mount
onMounted(fetchUserItems);

// SEO
useSeoMeta({
  title: 'My Resources | Directory Dashboard',
  description: 'Manage your submitted resources in the directory.',
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header section with title and create button -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          My Resources
        </h1>
        <p class="mt-1 text-muted-foreground">
          Manage and track all your submitted resources
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button
          as-child
          class="gap-2"
        >
          <NuxtLink to="/directory/submit">
            <Icon
              name="line-md:plus-circle"
              class="size-4"
            />
            Create New Resource
          </NuxtLink>
        </Button>
      </div>
    </div>

    <!-- Filter toolbar -->
    <div class="mb-6 flex justify-between flex-wrap items-center gap-2">
      <div class="flex items-center">
        <span class="text-sm font-medium text-muted-foreground mr-2">Status:</span>
        <Select
          v-model="statusFilter"
          @update:model-value="filterByStatus"
        >
          <SelectTrigger class="w-48">
            <SelectValue :placeholder="statusFilter === null ? 'All Statuses' : STATUSES[statusFilter as keyof typeof STATUSES]?.label || statusFilter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="null">
              All Statuses
            </SelectItem>
            <SelectItem value="draft">
              Draft
            </SelectItem>
            <SelectItem value="pending">
              Pending
            </SelectItem>
            <SelectItem value="published">
              Published
            </SelectItem>
            <SelectItem value="rejected">
              Rejected
            </SelectItem>
            <SelectItem value="archived">
              Archived
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex items-center">
        <span class="text-sm font-medium text-muted-foreground mr-2">Sort by:</span>
        <Select
          v-model="sortBy"
          @update:model-value="updateSort"
        >
          <SelectTrigger class="w-[180px]">
            <SelectValue :placeholder="getSortDisplayName(sortBy)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">
              Date Created
            </SelectItem>
            <SelectItem value="updated_at">
              Date Modified
            </SelectItem>
            <SelectItem value="title">
              Title
            </SelectItem>
            <SelectItem value="views_count">
              Views
            </SelectItem>
            <SelectItem value="likes_count">
              Likes
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          class="ml-2"
          @click="toggleSortOrder()"
        >
          <Icon
            :name="sortOrder === 'asc' ? 'line-md:arrow-up' : 'line-md:arrow-down'"
            mode="svg"
            class="size-4"
          />
        </Button>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="space-y-4"
    >
      <div
        v-for="i in itemsPerPage"
        :key="i"
        class="flex flex-col sm:flex-row border rounded-lg overflow-hidden animate-pulse"
      >
        <!-- Image skeleton -->
        <div class="w-full sm:w-2/5 xl:w-1/4 shrink-0 h-40 sm:h-auto bg-muted/60" />

        <!-- Content skeleton -->
        <div class="p-4 flex-grow flex flex-col">
          <!-- Status badge skeleton -->
          <div class="h-6 w-20 rounded bg-muted/60 mb-2" />

          <!-- Title and description skeleton -->
          <div class="h-7 w-3/4 bg-muted/60 rounded mb-2" />
          <div class="h-4 w-full bg-muted/60 rounded mb-3" />

          <!-- Tags skeleton - single row -->
          <div class="flex flex-wrap gap-1 mb-3">
            <div class="h-6 w-16 rounded bg-muted/60" />
            <div class="h-6 w-16 rounded bg-muted/60" />
          </div>

          <!-- Stats skeleton - simplified -->
          <div class="flex items-center gap-3 mt-auto">
            <div class="h-4 w-20 bg-muted/60 rounded" />
            <div class="h-4 w-12 bg-muted/60 rounded" />
          </div>
        </div>

        <!-- Actions skeleton - simplified -->
        <div class="flex sm:flex-col justify-end items-center gap-2 p-4 bg-muted/20">
          <div class="h-9 w-9 bg-muted/60 rounded-md" />
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="rounded-lg bg-destructive/10 p-6 text-center text-destructive"
    >
      <Icon
        name="line-md:alert"
        class="mx-auto size-10 mb-2"
      />
      <p class="text-lg font-medium">
        {{ error }}
      </p>
      <Button
        class="mt-4"
        @click="fetchUserItems"
      >
        Try Again
      </Button>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="userItems.length === 0"
      class="rounded-lg border border-dashed p-8 text-center"
    >
      <Icon
        name="line-md:clipboard-list"
        class="mx-auto size-12 text-muted-foreground mb-4"
      />
      <h3 class="text-lg font-medium">
        No resources found
      </h3>
      <p class="mt-1 text-muted-foreground">
        You haven't created any resources yet or none match your filters.
      </p>
      <NuxtLink
        to="/directory/submit"
        class="mt-4 inline-block"
      >
        <Button>Create Your First Resource</Button>
      </NuxtLink>
    </div>

    <!-- Resource items grid/list -->
    <div
      v-else
      class="space-y-4"
    >
      <div
        v-for="item in userItems"
        :key="item.id"
        class="flex flex-col sm:flex-row border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Resource image -->
        <div class="w-full sm:w-2/5 xl:w-1/4 shrink-0 sm:h-auto bg-muted">
          <NuxtImg
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.title"
            class="object-cover w-full h-full"
            loading="lazy"
            format="webp"
            placeholder
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-muted-foreground bg-muted"
          >
            <Icon
              name="line-md:image"
              class="size-8 sm:size-10"
            />
          </div>
        </div>

        <!-- Resource details -->
        <div class="p-4 flex-grow flex flex-col">
          <div class="flex flex-wrap gap-2 mb-2">
            <!-- Status badge -->
            <Badge
              :class="STATUSES[item.status as keyof typeof STATUSES]?.class || ''"
              variant="outline"
            >
              {{ STATUSES[item.status as keyof typeof STATUSES]?.label || item.status }}
            </Badge>

            <!-- Featured badge -->
            <Badge
              v-if="item.featured"
              variant="outline"
              class="bg-primary/10 text-primary border-primary/20"
            >
              Featured
            </Badge>
          </div>

          <h3 class="text-lg font-semibold mb-1">
            {{ item.title }}
          </h3>
          <p class="text-muted-foreground text-sm line-clamp-2 mb-2">
            {{ item.description }}
          </p>

          <!-- Categories and tags -->
          <div class="mb-2 flex flex-col gap-1">
            <!-- Groups on first line -->
            <div class="flex flex-wrap gap-1">
              <Badge
                v-for="group in item.groups"
                :key="group.id"
                variant="outline"
              >
                {{ group.name }}
              </Badge>
            </div>

            <!-- Tags on second line -->
            <div class="flex flex-wrap gap-1">
              <Badge
                v-for="tag in item.tags"
                :key="tag.id"
                variant="outline"
              >
                #{{ tag.name }}
              </Badge>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
            <span class="flex items-center gap-1">
              <Icon
                name="line-md:calendar"
                class="size-3"
              />
              {{ formatDate(item.createdAt) }}
            </span>
            <span class="flex items-center gap-1">
              <Icon
                name="mdi:eye"
                class="size-3"
              />
              {{ item.viewsCount }}
            </span>
            <span class="flex items-center gap-1">
              <Icon
                name="line-md:heart"
                class="size-3"
              />
              {{ item.likesCount }}
            </span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex sm:flex-col justify-end items-center gap-2 p-4 bg-muted/20">
          <TooltipProvider :delay-duration="0">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  as-child
                >
                  <NuxtLink :to="`/directory/dashboard/edit/${item.id}`">
                    <Icon
                      name="line-md:edit"
                      class="size-4"
                    />
                  </NuxtLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Edit resource
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-8"
    >
      <Pagination
        v-slot="{ page }"
        :items-per-page="itemsPerPage"
        :total="totalItems"
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
  </div>
</template>
