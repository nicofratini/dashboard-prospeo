<script setup lang="ts">
import { toast } from 'vue-sonner';
import { string, array, boolean, object, any } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import type { DirectoryItem, DirectoryGroup, DirectoryTag } from '~/types';
import { useDirectoryService } from '~/services/directoryService';

interface Props {
  id: string;
  categories: DirectoryGroup[];
  tags: DirectoryTag[];
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const props = defineProps<Props>();

// Directory service
const directoryService = useDirectoryService();

// State
const error = ref<string | null>(null);

// Image upload state
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

// Icon upload state
const iconFile = ref<File | null>(null);
const iconPreview = ref<string | null>(null);

// Define validation schema with Zod
const formSchema = object({
  title: string().min(1, 'Title is required').max(100, 'Title cannot be longer than 100 characters'),
  description: string().min(1, 'Description is required').max(500, 'Description cannot be longer than 500 characters'),
  content: string().optional().nullable(),
  url: string().url('Must be a valid URL').optional().nullable(),
  categoryIds: array(string()).min(1, 'At least one category is required'),
  tagIds: array(string()).min(1, 'At least one tag is required'),
  image: object({
    file: any().optional().nullable(),
    hasFile: boolean().optional(),
  }).optional(),
  icon: object({
    file: any().optional().nullable(),
    hasFile: boolean().optional(),
  }).optional(),
});

// Setup form with vee-validate and zod
const { handleSubmit, values, setFieldValue, meta, isSubmitting } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    title: '',
    description: '',
    content: '',
    url: '',
    categoryIds: [],
    tagIds: [],
    image: { file: null, hasFile: false },
    icon: { file: null, hasFile: false },
  },
});

// Fetch directory item data
async function fetchDirectoryItem() {
  try {
    // Get item data
    const item = await directoryService.getItemById(props.id);

    if (!item) {
      throw new Error('Directory item not found');
    }

    // Extract category and tag IDs
    // Handle both data structure patterns
    const categoryIds = item.directory_items_groups
      ? item.directory_items_groups.map((group: any) => group.group_id)
      : [];

    const tagIds = item.directory_items_tags
      ? item.directory_items_tags.map((tag: any) => tag.tag_id)
      : [];

    // Set preview images if URLs exist
    if (item.image_url) {
      imagePreview.value = item.image_url;
    }

    if (item.thumbnail_url) {
      iconPreview.value = item.thumbnail_url;
    }

    // Populate form data using individual field updates
    setFieldValue('title', item.title);
    setFieldValue('description', item.description);
    setFieldValue('content', item.content || '');
    setFieldValue('url', item.url || '');
    setFieldValue('categoryIds', categoryIds);
    setFieldValue('tagIds', tagIds);
    setFieldValue('image', {
      file: null,
      hasFile: !!item.image_url,
    });
    setFieldValue('icon', {
      file: null,
      hasFile: !!item.thumbnail_url,
    });
  }
  catch (err) {
    console.error('Error fetching directory item:', err);
    error.value = err instanceof Error
      ? `Failed to load directory item: ${err.message}`
      : 'An unknown error occurred while loading the directory item';
  }
}

// Handle form submission
const onSubmit = handleSubmit(async (formData) => {
  try {
    // Prepare data for update
    const updates: Partial<DirectoryItem> = {
      title: formData.title,
      description: formData.description,
      content: formData.content || null,
      url: formData.url || null,
    };

    // Process image and icon uploads if needed
    if (imageFile.value) {
      const uploadedImageUrl = await directoryService.uploadDirectoryFile(
        props.id,
        imageFile.value,
        'image',
      );
      updates.image_url = uploadedImageUrl;
    }

    if (iconFile.value) {
      const uploadedIconUrl = await directoryService.uploadDirectoryFile(
        props.id,
        iconFile.value,
        'icon',
      );
      updates.thumbnail_url = uploadedIconUrl;
    }

    // Update the item
    await directoryService.updateItem(props.id, updates, formData.categoryIds, formData.tagIds);

    // Show success message
    toast.success('Directory item updated successfully');

    // Call save handler
    props.onSave();
  }
  catch (err) {
    console.error('Error updating directory item:', err);
    toast.error('Failed to update directory item', {
      description: err instanceof Error ? err.message : 'An unknown error occurred',
    });
  }
});

// Initialize
const { data: _data } = useAsyncData(`directory-item-edit-${props.id}`, () => fetchDirectoryItem());
</script>

<template>
  <form
    class="space-y-6"
    @submit="onSubmit"
  >
    <!-- Title and URL on the same line -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Title -->
      <div class="space-y-2 flex-1">
        <FormField
          v-slot="{ componentField }"
          name="title"
          :validate-on-input="true"
          :validate-on-blur="false"
        >
          <FormItem v-auto-animate>
            <FormLabel>Title <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Enter resource title"
              />
            </FormControl>
            <FormDescription>
              Enter the title of your resource
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- URL -->
      <div class="space-y-2 flex-1">
        <FormField
          v-slot="{ componentField }"
          name="url"
          :validate-on-input="true"
          :validate-on-blur="false"
        >
          <FormItem v-auto-animate>
            <FormLabel>URL <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="https://example.com"
              />
            </FormControl>
            <FormDescription>
              Enter the URL of your resource
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Description -->
    <div class="space-y-2">
      <FormField
        v-slot="{ componentField }"
        name="description"
        :validate-on-input="true"
        :validate-on-blur="false"
      >
        <FormItem v-auto-animate>
          <FormLabel>Description <span class="text-destructive">*</span></FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              placeholder="Enter resource description"
              rows="3"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Content (Optional) -->
    <div class="space-y-2">
      <FormField
        v-slot="{ componentField }"
        name="content"
        :validate-on-blur="false"
      >
        <FormItem v-auto-animate>
          <FormLabel>Content (Optional)</FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              placeholder="Enter additional content or details"
              rows="5"
            />
          </FormControl>
        </FormItem>
      </FormField>
    </div>

    <!-- Category and Tags in a single line -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <DirectoryItemCategorySelect
          :categories="categories.filter(c => c.id !== 'all')"
          :selected-category-ids="values.categoryIds || []"
          :on-change="ids => setFieldValue('categoryIds', ids)"
        />
      </div>

      <div class="flex-1">
        <DirectoryItemTagSelect
          :tags="tags"
          :selected-tag-ids="values.tagIds || []"
          :on-change="ids => setFieldValue('tagIds', ids)"
        />
      </div>
    </div>

    <!-- Image and Icon Upload -->
    <DirectoryItemMediaUpload
      v-model:image-file="imageFile"
      v-model:image-preview="imagePreview"
      v-model:icon-file="iconFile"
      v-model:icon-preview="iconPreview"
      :set-field-value="setFieldValue"
    />

    <!-- Form actions -->
    <div class="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        :disabled="isSubmitting"
        @click="onCancel"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        :disabled="isSubmitting || !meta.valid"
      >
        <Icon
          v-if="isSubmitting"
          name="svg-spinners:12-dots-scale-rotate"
          class="mr-2 size-4"
        />
        Save Changes
      </Button>
    </div>
  </form>
</template>
