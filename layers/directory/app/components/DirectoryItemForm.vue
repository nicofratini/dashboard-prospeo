<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDirectoryService } from '~/services/directoryService';
import type { DirectoryItem, DirectoryGroup, DirectoryTag } from '~/types';

const props = defineProps<{
  initialData?: Partial<DirectoryItem>;
  submitLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'submit', item: Partial<DirectoryItem>, groupIds: string[], tagIds: string[]): void;
  (e: 'cancel'): void;
}>();

// Form data
const title = ref(props.initialData?.title || '');
const description = ref(props.initialData?.description || '');
const content = ref(props.initialData?.content || '');
const imageUrl = ref(props.initialData?.image_url || '');
const thumbnailUrl = ref(props.initialData?.thumbnail_url || '');
const url = ref(props.initialData?.url || '');
const featured = ref(props.initialData?.featured || false);
const selectedGroupIds = ref<string[]>(
  props.initialData?.groups?.map(group => group.id) || [],
);
const selectedTagIds = ref<string[]>(
  props.initialData?.tags?.map(tag => tag.id) || [],
);

// Available groups and tags
const groups = ref<DirectoryGroup[]>([]);
const tags = ref<DirectoryTag[]>([]);

// Form state
const isLoading = ref(false);
const error = ref<string | null>(null);

// Directory service
const directoryService = useDirectoryService();

// Validation
const isValid = computed(() => {
  return title.value.trim() !== ''
    && description.value.trim() !== ''
    && selectedGroupIds.value.length > 0;
});

// Load groups and tags
onMounted(async () => {
  try {
    isLoading.value = true;

    // Load groups and tags in parallel
    const [groupsData, tagsData] = await Promise.all([
      directoryService.getGroups(),
      directoryService.getTags(),
    ]);

    groups.value = groupsData;
    tags.value = tagsData;
  }
  catch (err) {
    console.error('Error loading form data:', err);
    error.value = 'Failed to load groups and tags. Please try again.';
  }
  finally {
    isLoading.value = false;
  }
});

// Handle form submission
function handleSubmit() {
  if (!isValid.value) return;

  const formData: Partial<DirectoryItem> = {
    title: title.value,
    description: description.value,
    content: content.value || null,
    image_url: imageUrl.value || null,
    thumbnail_url: thumbnailUrl.value || null,
    url: url.value || null,
    featured: featured.value,
  };

  emit('submit', formData, selectedGroupIds.value, selectedTagIds.value);
}

// Handle cancel
function handleCancel() {
  emit('cancel');
}

// Toggle group selection
function toggleGroup(groupId: string) {
  const index = selectedGroupIds.value.indexOf(groupId);
  if (index === -1) {
    selectedGroupIds.value.push(groupId);
  }
  else {
    selectedGroupIds.value.splice(index, 1);
  }
}

// Toggle tag selection
function toggleTag(tagId: string) {
  const index = selectedTagIds.value.indexOf(tagId);
  if (index === -1) {
    selectedTagIds.value.push(tagId);
  }
  else {
    selectedTagIds.value.splice(index, 1);
  }
}
</script>

<template>
  <div class="space-y-6">
    <div
      v-if="error"
      class="rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/50 dark:text-red-200"
    >
      {{ error }}
    </div>

    <form
      class="space-y-6"
      @submit.prevent="handleSubmit"
    >
      <!-- Title -->
      <div class="space-y-2">
        <Label for="title">Title <span class="text-red-500">*</span></Label>
        <Input
          id="title"
          v-model="title"
          placeholder="Enter a title"
          required
        />
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <Label for="description">Description <span class="text-red-500">*</span></Label>
        <Textarea
          id="description"
          v-model="description"
          placeholder="Enter a description"
          rows="3"
          required
        />
      </div>

      <!-- URL -->
      <div class="space-y-2">
        <Label for="url">URL</Label>
        <Input
          id="url"
          v-model="url"
          placeholder="https://example.com"
          type="url"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Add a link to the resource or website
        </p>
      </div>

      <!-- Content -->
      <div class="space-y-2">
        <Label for="content">Detailed Content</Label>
        <Textarea
          id="content"
          v-model="content"
          placeholder="Enter detailed content or description (supports markdown)"
          rows="6"
        />
      </div>

      <!-- Image URL -->
      <div class="space-y-2">
        <Label for="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          v-model="imageUrl"
          placeholder="https://example.com/image.jpg"
          type="url"
        />
      </div>

      <!-- Thumbnail URL -->
      <div class="space-y-2">
        <Label for="thumbnailUrl">Thumbnail URL</Label>
        <Input
          id="thumbnailUrl"
          v-model="thumbnailUrl"
          placeholder="https://example.com/thumbnail.jpg"
          type="url"
        />
      </div>

      <!-- Featured -->
      <div class="flex items-center space-x-2">
        <Checkbox
          id="featured"
          v-model:checked="featured"
        />
        <Label for="featured">Featured item</Label>
      </div>

      <!-- Groups -->
      <div class="space-y-2">
        <Label>Groups <span class="text-red-500">*</span></Label>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="group in groups"
            :key="group.id"
            type="button"
            :variant="selectedGroupIds.includes(group.id) ? 'default' : 'outline'"
            size="sm"
            @click="toggleGroup(group.id)"
          >
            {{ group.name }}
          </Button>
        </div>
        <p class="text-xs text-muted-foreground">
          Select at least one group
        </p>
      </div>

      <!-- Tags -->
      <div class="space-y-2">
        <Label>Tags</Label>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="tag in tags"
            :key="tag.id"
            type="button"
            :variant="selectedTagIds.includes(tag.id) ? 'default' : 'outline'"
            size="sm"
            @click="toggleTag(tag.id)"
          >
            #{{ tag.name }}
          </Button>
        </div>
      </div>

      <!-- Form actions -->
      <div class="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          :disabled="!isValid || isLoading"
        >
          <span
            v-if="isLoading"
            class="mr-2"
          >
            <Icon
              name="line-md:loading-twotone-loop"
              class="h-4 w-4 animate-spin"
            />
          </span>
          {{ props.submitLabel || 'Submit' }}
        </Button>
      </div>
    </form>
  </div>
</template>
