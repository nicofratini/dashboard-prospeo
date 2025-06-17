<script setup lang="ts">
/**
 * ChatInput component
 *
 * Provides the input controls for the chat interface, including:
 * - File upload button
 * - Voice input button
 * - Submit/Stop button
 */

const input = defineModel<string>('input');

// File upload state
const isUploadDialogOpen = ref(false);
const tempUploadedFiles = ref<File[]>([]);

const emit = defineEmits<{
  'update:uploadedFiles': [files: File[]];
  'removeFile': [index: number];
  'getPreviewUrl': [file: File];
  'submit': [];
  'stop': [];
}>();

const props = defineProps<{
  /** Whether the input is disabled */
  isDisabled: boolean;
  /** Current chat status (ready, submitted, streaming) */
  status: string;
  /** Whether to show file upload button */
  enableFileUpload?: boolean;
  /** Whether to show voice input button */
  enableVoiceInput?: boolean;
  /** Currently uploaded files */
  uploadedFiles: File[];
}>();

const handleSubmitFiles = () => {
  if (tempUploadedFiles.value.length === 0) return;

  emit('update:uploadedFiles', [...props.uploadedFiles, ...tempUploadedFiles.value]);
  tempUploadedFiles.value = [];
};

const handleCancelFileUpload = () => {
  tempUploadedFiles.value = [];
};
</script>

<template>
  <div class="flex items-center justify-between w-full p-3 pt-0">
    <!-- Left side buttons -->
    <div class="flex items-center gap-2">
      <!-- File upload button -->
      <TooltipProvider v-if="enableFileUpload">
        <Tooltip :delay-duration="100">
          <TooltipTrigger as-child>
            <div class="relative">
              <Button
                variant="outline"
                size="icon"
                class="rounded-full"
                @click="isUploadDialogOpen = true"
              >
                <Icon
                  name="mdi:paperclip"
                  class="size-6"
                />
                <span class="sr-only">Attach files</span>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            Attach Files
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- Voice input button -->
      <TooltipProvider v-if="enableVoiceInput">
        <Tooltip :delay-duration="100">
          <TooltipTrigger as-child>
            <Button
              variant="outline"
              size="icon"
              class="rounded-full"
              :disabled="isDisabled"
            >
              <Icon
                name="mdi:microphone"
                class="size-6"
              />
              <span class="sr-only">Use microphone</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            Use Microphone
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <!-- Right side button: Stop or Submit -->
    <Button
      v-if="status === 'streaming'"
      type="button"
      variant="outline"
      size="icon"
      class="animate-in fade-in scale-in-90 duration-500 rounded-full"
      @click="emit('stop')"
    >
      <Icon
        name="mdi:stop"
        class="size-6"
      />
    </Button>
    <Button
      v-else
      type="submit"
      size="icon"
      class="animate-in fade-in scale-in-90 duration-500 rounded-full"
      :disabled="isDisabled || !input?.trim()"
      @click="emit('submit')"
    >
      <Icon
        name="line-md:arrow-up"
        class="size-4"
      />
    </Button>
  </div>

  <!-- File Upload Dialog -->
  <LazyAiChatFileUploadDialog
    v-if="enableFileUpload"
    v-model:is-open="isUploadDialogOpen"
    v-model:files="tempUploadedFiles"
    @submit="handleSubmitFiles"
    @cancel="handleCancelFileUpload"
  />
</template>
