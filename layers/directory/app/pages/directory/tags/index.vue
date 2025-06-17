<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Browse by Tags',
  description: 'Explore our comprehensive collection of resources organized by tags. Find curated content to help you discover exactly what you need.',
  ogTitle: 'Browse by Tags | Resource Directory',
  ogDescription: 'Explore our comprehensive collection of resources organized by tags.',
  twitterCard: 'summary_large_image',
});

// Helper function to get tag icon
function getTagIcon(tagName: string): string {
  const tagIcons: Record<string, string> = {
    'AI': 'mdi:robot-outline',
    'Tools': 'mdi:tools',
    'Development': 'mdi:code-brackets',
    'Design': 'mdi:palette-outline',
    'Marketing': 'mdi:bullhorn-outline',
    'Productivity': 'mdi:check-circle-outline',
    'Business': 'mdi:briefcase-outline',
    'Finance': 'mdi:currency-usd',
    'Education': 'mdi:school-outline',
    'Health': 'mdi:heart-pulse',
    'Web': 'mdi:web',
    'UI': 'mdi:view-dashboard-outline',
    'UX': 'mdi:account-group-outline',
    'Mobile': 'mdi:cellphone',
    'Data': 'mdi:database',
    'Science': 'mdi:flask-outline',
    'DevOps': 'mdi:infinity',
    'CI/CD': 'mdi:sync',
    'Cloud': 'mdi:cloud-outline',
    'Infrastructure': 'mdi:server',
    'Security': 'mdi:shield-outline',
    'Privacy': 'mdi:lock-outline',
    'Blockchain': 'mdi:link-variant',
    'Crypto': 'mdi:currency-btc',
    'Frontend': 'mdi:monitor-dashboard',
    'Backend': 'mdi:server-network',
    'Database': 'mdi:database-outline',
    'API': 'mdi:api',
    'Open Source': 'mdi:open-source-initiative',
    'Tutorial': 'mdi:school',
    'Guide': 'mdi:map-marker-path',
    'Framework': 'mdi:view-grid-outline',
    'Library': 'mdi:bookshelf',
  };

  return tagIcons[tagName] || 'line-md:hash';
}

// Use composables for groups and tags
const { fetchTags } = useDirectoryTags();

const { data: tags, isLoading, error } = await fetchTags();
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header section with badge, gradient title, and search input -->
    <div class="mb-12 text-center relative">
      <!-- Back button -->
      <NuxtLink
        to="/directory"
        class="mb-4 inline-flex absolute left-0 items-center text-sm font-medium text-primary group"
      >
        <Icon
          name="line-md:arrow-left"
          class="mr-1 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
        />
        Back to Directory
      </NuxtLink>

      <!-- Gradient title -->
      <h1 class="mb-6 bg-gradient-to-r from-emerald-500 via-blue-300 to-indigo-600 bg-clip-text text-4xl font-brand text-transparent sm:text-5xl max-w-fit mx-auto">
        Browse by Tags
      </h1>
      <p class="mx-auto mb-8 max-w-2xl text-muted-foreground">
        Explore our comprehensive collection of resources organized by tags. Find curated content to help you discover exactly what you need.
      </p>
    </div>

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex justify-center py-12"
    >
      <div class="flex flex-col items-center">
        <Icon
          name="svg-spinners:12-dots-scale-rotate"
          mode="svg"
          class="h-12 w-12 animate-spin text-primary"
        />
        <p class="mt-4 text-gray-600 dark:text-gray-300">
          Loading tags...
        </p>
      </div>
    </div>

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
        @click="fetchTags"
      >
        Try Again
      </Button>
    </div>

    <!-- Tags grid -->
    <template v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <NuxtLink
          v-for="tag in tags"
          :key="tag.id"
          :to="`/directory/tags/${tag.slug}`"
          class="group block h-full"
        >
          <Card class="h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <CardHeader>
              <div class="mb-4 flex items-center">
                <div class="rounded-full p-2 bg-primary/10 text-primary mr-3 flex items-center justify-center">
                  <Icon
                    :name="getTagIcon(tag.name)"
                    class="size-5"
                  />
                </div>
                <CardTitle class="group-hover:text-primary">
                  {{ tag.name }}
                </CardTitle>
              </div>
              <CardDescription class="line-clamp-3">
                Browse resources tagged with {{ tag.name }}
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <div class="flex items-center text-sm text-primary">
                <span>Browse resources</span>
                <Icon
                  name="line-md:arrow-right"
                  class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </div>
            </CardFooter>
          </Card>
        </NuxtLink>
      </div>

      <!-- Empty state -->
      <div
        v-if="!isLoading && tags.length === 0"
        class="mt-8 text-center"
      >
        <Icon
          name="line-md:alert"
          class="mx-auto h-12 w-12 text-muted-foreground"
        />
        <h3 class="mt-2 text-lg font-medium text-foreground">
          No tags found
        </h3>
        <p class="mt-1 text-muted-foreground">
          There are no tags available at the moment.
        </p>
      </div>
    </template>
  </div>
</template>
