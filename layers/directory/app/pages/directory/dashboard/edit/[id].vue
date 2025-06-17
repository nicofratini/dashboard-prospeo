<script setup lang="ts">
// Route and router
const route = useRoute();
const id = route.params.id as string;

const { groups: categories, fetchGroups } = useDirectoryGroups();
const { tags, fetchTags } = useDirectoryTags();

// State
const isLoading = ref(true);
const error = ref<string | null>(null);

// Load categories and tags
async function loadData() {
  isLoading.value = true;
  error.value = null;

  try {
    await Promise.all([
      fetchGroups(),
      fetchTags(),
    ]);
  }
  catch (err) {
    console.error('Error loading form data:', err);
    error.value = err instanceof Error
      ? `Failed to load form data: ${err.message}`
      : 'An unknown error occurred while loading form data';
  }
  finally {
    isLoading.value = false;
  }
}

// Navigation handlers
function handleCancel() {
  navigateTo('/directory/dashboard');
}

function handleSave() {
  navigateTo('/directory/dashboard');
}

// Initialize
await loadData();

// SEO
useSeoMeta({
  title: 'Edit Directory Item',
  description: 'Edit a directory item in the directory.',
  ogTitle: 'Edit Directory Item',
  ogDescription: 'Edit a directory item in the directory.',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div class="container py-8">
    <div class="mb-6">
      <Button
        variant="outline"
        size="sm"
        class="group"
        @click="$router.back()"
      >
        <Icon
          name="line-md:arrow-left"
          class="size-4 transition-transform group-hover:-translate-x-1"
        />
        Back
      </Button>
      <h1 class="text-2xl font-bold mt-4">
        Edit Directory Item
      </h1>
    </div>

    <div
      v-if="isLoading"
      class="flex justify-center items-center py-12"
    >
      <Icon
        name="line-md:loading-twotone-loop"
        class="size-12 text-primary animate-spin"
      />
    </div>

    <Alert
      v-else-if="error"
      variant="destructive"
      class="mb-6"
    >
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {{ error }}
        <Button
          variant="outline"
          size="sm"
          class="mt-2"
          @click="loadData"
        >
          Retry
        </Button>
      </AlertDescription>
    </Alert>

    <div v-else>
      <!-- Form Container -->
      <Card>
        <CardContent class="pt-6">
          <DirectoryItemEditForm
            :id="id"
            :categories="categories"
            :tags="tags"
            :is-loading="isLoading"
            :on-save="handleSave"
            :on-cancel="handleCancel"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
