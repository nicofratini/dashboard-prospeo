<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Browse by Categories',
  description: 'Explore our comprehensive collection of resources organized by categories. Find curated content to help you discover exactly what you need.',
  ogTitle: 'Browse by Categories | Resource Directory',
  ogDescription: 'Explore our comprehensive collection of resources organized by categories.',
  twitterCard: 'summary_large_image',
});

// Use composables for groups and tags
const { fetchGroups, groups: categories, isLoading, error } = useDirectoryGroups();

// Initial data fetch on page load
await fetchGroups();
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
      <h1 class="mb-6 bg-gradient-to-r from-emerald-500 via-blue-300 to-indigo-600 bg-clip-text text-4xl font-brand text-transparent sm:text-5xl sm:leading-tight max-w-fit mx-auto">
        Browse by Categories
      </h1>
      <p class="mx-auto mb-8 max-w-2xl text-muted-foreground">
        Explore our comprehensive collection of resources organized by categories. Find curated content to help you discover exactly what you need.
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
          Loading categories...
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
        @click="fetchGroups"
      >
        Try Again
      </Button>
    </div>

    <!-- Categories grid -->
    <template v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <NuxtLink
          v-for="category in categories.filter(c => c.id !== 'all')"
          :key="category.id"
          :to="`/directory/categories/${category.slug}`"
          class="group block h-full"
        >
          <Card class="h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <CardHeader>
              <div class="mb-4 flex items-center">
                <div class="rounded-full p-2 bg-primary/10 text-primary mr-3 flex items-center justify-center">
                  <Icon
                    name="line-md:grid-3-filled"
                    class="size-5"
                  />
                </div>
                <CardTitle class="group-hover:text-primary">
                  {{ category.name }}
                </CardTitle>
              </div>
              <CardDescription class="line-clamp-3">
                {{ category.description || `Browse resources in the ${category.name} category` }}
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
        v-if="!isLoading && categories.length <= 1"
        class="mt-8 text-center"
      >
        <Icon
          name="line-md:alert"
          class="mx-auto h-12 w-12 text-muted-foreground"
        />
        <h3 class="mt-2 text-lg font-medium text-foreground">
          No categories found
        </h3>
        <p class="mt-1 text-muted-foreground">
          There are no categories available at the moment.
        </p>
      </div>
    </template>
  </div>
</template>
