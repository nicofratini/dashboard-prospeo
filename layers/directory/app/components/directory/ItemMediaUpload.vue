<script setup lang="ts">
import { toast } from 'vue-sonner';

interface Props {
  imageFile: File | null;
  imagePreview: string | null;
  iconFile: File | null;
  iconPreview: string | null;
  setFieldValue: (field: string, value: any) => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:imageFile': [value: File | null];
  'update:imagePreview': [value: string | null];
  'update:iconFile': [value: File | null];
  'update:iconPreview': [value: string | null];
}>();

// Use the file upload composable
const { handleFileUpload, removeFile } = useFileUpload(props.setFieldValue);

// Image config
const imageConfig = {
  ref: computed({
    get: () => props.imageFile,
    set: value => emit('update:imageFile', value),
  }),
  previewRef: computed({
    get: () => props.imagePreview,
    set: value => emit('update:imagePreview', value),
  }),
  validExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  maxSize: 2 * 1024 * 1024, // 2MB
  fieldName: 'image',
};

// Icon config
const iconConfig = {
  ref: computed({
    get: () => props.iconFile,
    set: value => emit('update:iconFile', value),
  }),
  previewRef: computed({
    get: () => props.iconPreview,
    set: value => emit('update:iconPreview', value),
  }),
  validExtensions: ['.svg', '.png', '.ico'],
  maxSize: 1024 * 1024, // 1MB
  fieldName: 'icon',
};

// Handle image upload
function setImage(file: File | null) {
  handleFileUpload(imageConfig, file);
}

// Handle icon upload
function setIcon(file: File | null) {
  handleFileUpload(iconConfig, file);
}

// Remove image
function removeImage() {
  removeFile(imageConfig);
}

// Remove icon
function removeIcon() {
  removeFile(iconConfig);
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <!-- Image Upload -->
    <div class="flex-1">
      <FormField name="image">
        <FormItem>
          <FormLabel>Image <span class="text-destructive">*</span></FormLabel>
          <FormControl>
            <FileUpload
              :model-value="imageFile"
              class="h-64"
              variant="image"
              :preview-url="imagePreview"
              accept="image/jpeg,image/png,image/webp"
              :max-size-in-mb="2"
              description="Upload a featured image for your resource"
              button-text="Choose Image"
              @update:model-value="setImage"
              @error="(message: string) => {
                removeImage();
                toast.error('Image Error', { description: message });
              }"
            />
          </FormControl>
          <FormDescription>
            Upload a JPG, PNG, or WEBP image (16:9, max 2MB)
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Icon Upload -->
    <div class="flex-1">
      <FormField name="icon">
        <FormItem>
          <FormLabel>Icon <span class="text-destructive">*</span></FormLabel>
          <FormControl>
            <FileUpload
              :model-value="iconFile"
              class="h-64"
              variant="icon"
              :preview-url="iconPreview"
              accept="image/svg+xml,image/png,image/x-icon"
              :max-size-in-mb="1"
              description="Upload an icon for your resource"
              button-text="Choose Icon"
              @update:model-value="setIcon"
              @error="(message: string) => {
                removeIcon();
                toast.error('Icon Error', { description: message });
              }"
            />
          </FormControl>
          <FormDescription>
            Upload an SVG, PNG, or ICO icon (1:1, max 1MB)
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </div>
</template>
