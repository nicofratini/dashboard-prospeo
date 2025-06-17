<script setup lang="ts">
import { useDebounceFn, useMediaQuery } from '@vueuse/core';
import { toast } from 'vue-sonner';

const isOpen = defineModel<boolean>('isOpen');
const files = defineModel<File[]>('files', { default: [] });

const emit = defineEmits<{
  submit: [];
  cancel: [];
}>();

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
const isDragging = ref(false);
const fileInput = useTemplateRef<HTMLInputElement>('fileInput');
const isMobile = useMediaQuery('(max-width: 640px)');

// Validate file size and type
const validateFile = (file: File): boolean => {
  if (file.size > MAX_FILE_SIZE) {
    toast.error('File Error', {
      description: `File ${file.name} exceeds the maximum size of 2MB`,
      closeButton: true,
    });
    return false;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    toast.error('File Error', {
      description: `File type ${file.type} is not supported`,
      closeButton: true,
    });
    return false;
  }

  return true;
};

// Process files from input or drop event
const processFiles = (fileList: FileList) => {
  if (!fileList.length) return;

  // Filter out invalid files
  const validFiles = Array.from(fileList).filter(validateFile);

  // Filter out duplicate files
  const newFiles = validFiles.filter((newFile) => {
    return !files.value.some(existingFile =>
      existingFile.name === newFile.name && existingFile.size === newFile.size,
    );
  });

  if (newFiles.length > 0) {
    files.value = [...files.value, ...newFiles];
  }
};

// Handle file selection from input
const handleFileSelection = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    processFiles(input.files);
    // Reset the input value to allow selecting the same file again
    input.value = '';
  }
};

// Handle file drop
const handleDrop = (event: DragEvent) => {
  isDragging.value = false;

  if (event.dataTransfer?.files) {
    processFiles(event.dataTransfer.files);
  }
};

// Debounced drag events for better performance
const debouncedDragEnter = useDebounceFn(() => {
  isDragging.value = true;
}, 50);

const debouncedDragLeave = useDebounceFn(() => {
  isDragging.value = false;
}, 50);

// Remove file from selection
const removeFile = (index: number) => {
  const newFiles = [...files.value];
  newFiles.splice(index, 1);
  files.value = newFiles;
};

// Close dialog and cancel
const closeDialog = () => {
  emit('cancel');
  isOpen.value = false;
};

// Submit selected files
const submitFiles = () => {
  emit('submit');
  isOpen.value = false;
};
</script>

<template>
  <!-- Use Drawer on mobile devices -->
  <Drawer
    v-if="isMobile"
    :open="isOpen"
    @update:open="isOpen = $event"
  >
    <DrawerContent class="px-4 pb-6">
      <DrawerHeader>
        <DrawerTitle class="text-xl font-accent font-light">
          Attach Files
        </DrawerTitle>
        <DrawerDescription>
          Upload files to include in your conversation
        </DrawerDescription>
      </DrawerHeader>

      <div class="px-4">
        <!-- Upload Area -->
        <div
          class="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg"
          :class="{ 'border-primary bg-primary/5': isDragging, 'border-border': !isDragging }"
          @dragenter.prevent="debouncedDragEnter"
          @dragleave.prevent="debouncedDragLeave"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <div class="flex flex-col items-center text-center">
            <Icon
              name="mdi:image-add-outline"
              class="size-8 mb-4 text-foreground"
            />
            <h3 class="text-lg font-medium mb-1">
              Upload Files
            </h3>
            <p class="text-sm text-muted-foreground mb-4">
              Drag and drop to upload
            </p>

            <input
              ref="fileInput"
              type="file"
              multiple
              class="hidden"
              @change="handleFileSelection"
            >
            <Button
              variant="outline"
              size="sm"
              type="button"
              @click="fileInput?.click()"
            >
              Select Files
            </Button>
          </div>
        </div>

        <!-- File List -->
        <div
          v-if="files.length"
          class="mt-4"
        >
          <h4 class="text-sm font-medium mb-2">
            Selected Files ({{ files.length }})
          </h4>
          <div class="max-h-40 overflow-y-auto">
            <div
              v-for="(file, index) in files"
              :key="`${file.name}-${file.size}`"
              class="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50"
            >
              <div class="flex items-center gap-2">
                <Icon
                  :name="file.type.startsWith('image/') ? 'mdi:image-outline' : 'mdi:file-document-outline'"
                  class="size-5 text-muted-foreground"
                />
                <span class="text-sm truncate max-w-[200px]">{{ file.name }}</span>
                <span class="text-xs text-muted-foreground">{{ (file.size / 1024).toFixed(1) }} KB</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                class="size-6 text-muted-foreground"
                @click="removeFile(index)"
              >
                <Icon
                  name="mdi:close"
                  class="size-4"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DrawerFooter>
        <Button
          variant="outline"
          @click="closeDialog"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          :disabled="!files.length"
          @click="submitFiles"
        >
          Attach
        </Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>

  <!-- Use Dialog on desktop -->
  <Dialog
    v-else
    :open="isOpen"
    @update:open="isOpen = $event"
  >
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle class="text-xl font-accent font-light">
          Attach Files
        </DialogTitle>
        <DialogDescription>
          Upload files to include in your conversation
        </DialogDescription>
      </DialogHeader>

      <!-- Upload Area -->
      <div
        class="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg"
        :class="{ 'border-primary bg-primary/5': isDragging, 'border-border': !isDragging }"
        @dragenter.prevent="debouncedDragEnter"
        @dragleave.prevent="debouncedDragLeave"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <div class="flex flex-col items-center text-center">
          <Icon
            name="mdi:image-add-outline"
            class="size-8 mb-4 text-foreground"
          />
          <h3 class="font-medium mb-1">
            Upload Files
          </h3>
          <p class="text-sm text-muted-foreground mb-4">
            Drag and drop to upload
          </p>

          <input
            ref="fileInput"
            type="file"
            multiple
            class="hidden"
            @change="handleFileSelection"
          >
          <Button
            variant="outline"
            size="sm"
            type="button"
            @click="fileInput?.click()"
          >
            Select Files
          </Button>
        </div>
      </div>

      <!-- File List -->
      <div
        v-if="files.length"
        class="mt-4"
      >
        <h4 class="text-sm font-medium mb-2">
          Selected Files ({{ files.length }})
        </h4>
        <div class="max-h-40 overflow-y-auto">
          <div
            v-for="(file, index) in files"
            :key="`${file.name}-${file.size}`"
            class="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50"
          >
            <div class="flex items-center gap-2">
              <Icon
                :name="file.type.startsWith('image/') ? 'mdi:image-outline' : 'mdi:file-document-outline'"
                class="size-5 text-muted-foreground"
              />
              <span class="text-sm truncate max-w-[200px]">{{ file.name }}</span>
              <span class="text-xs text-muted-foreground">{{ (file.size / 1024).toFixed(1) }} KB</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              class="size-6 text-muted-foreground"
              @click="removeFile(index)"
            >
              <Icon
                name="mdi:close"
                class="size-4"
              />
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          @click="closeDialog"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          :disabled="!files.length"
          @click="submitFiles"
        >
          Attach
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
