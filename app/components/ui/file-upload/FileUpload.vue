<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  id?: string;
  label?: string;
  description?: string;
  buttonText?: string;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
  modelValue?: File | null;
  previewUrl?: string | null;
  variant?: 'default' | 'icon' | 'image';
}

const props = withDefaults(defineProps<FileUploadProps & { class?: HTMLAttributes['class'] }>(), {
  id: 'file-upload',
  label: 'Upload File',
  description: 'Drag and drop or click to browse',
  buttonText: 'Choose File',
  acceptedFileTypes: '*',
  maxSizeInMB: 5,
  modelValue: null,
  previewUrl: null,
  variant: 'default',
});

const emit = defineEmits<{
  'update:modelValue': [file: File | null];
  'error': [message: string];
}>();

const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Computed properties for display
const acceptedTypesDisplay = computed(() => {
  if (props.acceptedFileTypes === '*') return 'any file';
  return props.acceptedFileTypes.split(',').map(type => type.trim().replace('.', '')).join(', ').toUpperCase();
});

// Handle file selection
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  }
}

// Handle drag events
function handleDragEnter() {
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  }
}

// Validate and set file
function validateAndSetFile(file: File) {
  // Check file type if acceptedFileTypes is specified and not '*'
  if (props.acceptedFileTypes !== '*') {
    const fileExtension = file.name.split('.').pop();
    const fileExt = fileExtension ? `.${fileExtension.toLowerCase()}` : '';
    const validExtensions = props.acceptedFileTypes.split(',').map(ext => ext.trim());

    if (!validExtensions.includes(fileExt)) {
      emit('error', `Invalid file type. Please upload ${acceptedTypesDisplay.value}`);
      return;
    }
  }

  // Check file size
  if (file.size > props.maxSizeInMB * 1024 * 1024) {
    emit('error', `File too large. Maximum size is ${props.maxSizeInMB}MB`);
    return;
  }

  emit('update:modelValue', file);
}

// Trigger file input click
function triggerFileInput() {
  fileInputRef.value?.click();
}
</script>

<template>
  <div class="space-y-2">
    <Label
      v-if="label"
      :for="id"
    >
      {{ label }}
    </Label>

    <div
      :class="cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        props.class,
      )"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <!-- File Preview -->
      <div
        v-if="modelValue || previewUrl"
        class="relative w-full"
      >
        <!-- Image preview for image variants -->
        <NuxtImg
          v-if="variant === 'image' || variant === 'icon'"
          :src="previewUrl || ''"
          :alt="label || ''"
          :class="[
            'mx-auto rounded-md object-contain',
            variant === 'image' ? 'max-h-48' : 'max-h-24',
            variant === 'icon' && 'p-2 bg-muted/50',
          ]"
          loading="lazy"
          placeholder
        />

        <!-- File name for default variant -->
        <div
          v-else
          class="flex items-center justify-center p-2 rounded-md bg-muted/50"
        >
          <Icon
            name="mdi:file-document-outline"
            class="h-6 w-6 mr-2 text-muted-foreground"
          />
          <span class="text-sm font-medium truncate">{{ modelValue?.name }}</span>
        </div>
      </div>

      <!-- Upload Placeholder -->
      <div
        v-else
        class="flex flex-col items-center justify-center space-y-2 text-center"
      >
        <div class="rounded-full p-2 bg-muted/50 flex items-center justify-center">
          <Icon
            :name="variant === 'image' ? 'mdi:image-plus' : variant === 'icon' ? 'mdi:image-plus' : 'mdi:file-upload'"
            class="h-8 w-8 text-muted-foreground"
          />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-medium">
            Drag and drop {{ variant === 'image' ? 'an image' : variant === 'icon' ? 'an icon' : 'a file' }}
          </p>
          <p class="text-xs text-muted-foreground">
            or click to browse ({{ acceptedTypesDisplay }}, max {{ maxSizeInMB }}MB)
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          @click="triggerFileInput"
        >
          {{ buttonText }}
        </Button>
      </div>

      <!-- Hidden File Input -->
      <input
        :id="id"
        ref="fileInputRef"
        type="file"
        class="absolute inset-0 cursor-pointer opacity-0 file:hidden"
        :accept="acceptedFileTypes"
        @change="handleFileUpload"
      >
    </div>
  </div>
</template>
