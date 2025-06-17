<script setup lang="ts">
import { useChat } from '@ai-sdk/vue';
import { useScroll } from '@vueuse/core';
import type { Message } from 'ai';
import { toast } from 'vue-sonner';

// Define props for configuration
const props = withDefaults(defineProps<{
  // Title to display when chat is empty
  title?: string;
  // API endpoint for chat
  apiEndpoint?: string;
  // Initial messages
  initialMessages?: Message[];
  // Enable/disable file upload feature
  enableFileUpload?: boolean;
  // Enable/disable chat history feature
  enableChatHistory?: boolean;
  // Enable/disable edit mode feature
  enableEditMode?: boolean;
  // Enable/disable voice input
  enableVoiceInput?: boolean;
  // Placeholder text for input
  placeholder?: string;
}>(), {
  title: 'Hello there! How can I help you today?',
  apiEndpoint: '/api/chat',
  initialMessages: () => [],
  enableFileUpload: true,
  enableChatHistory: true,
  enableEditMode: true,
  enableVoiceInput: true,
  placeholder: 'Ask AI anything...',
});

// Use the chat composable which provides all necessary state and handlers
const { messages, input, handleSubmit, status, error, stop } = useChat({
  api: props.apiEndpoint,
  initialMessages: props.initialMessages,
  onError: (err: Error) => {
    toast.error('Error', {
      description: JSON.parse(err.message).message,
    });
  },
});

// UI state
const isDisabled = computed(() => status.value !== 'ready');
const isProcessing = computed(() => ['submitted', 'streaming'].includes(status.value));
const chatContainerRef = useTemplateRef<HTMLElement>('chatContainerRef');
const isOverflowing = ref(false);

// Scroll handling with VueUse for better performance
const { arrivedState } = useScroll(chatContainerRef, {
  behavior: 'smooth',
});

// Computed property to determine if we should show the scroll button
const shouldShowScrollButton = computed(() =>
  !arrivedState.bottom || (isOverflowing.value && isProcessing.value),
);

// Check if the content is overflowing the container
function checkOverflow() {
  if (!chatContainerRef.value) return;
  const container = chatContainerRef.value;
  isOverflowing.value = container.scrollHeight > container.clientHeight;
}

// Scroll to bottom of chat
function scrollToBottom() {
  if (!chatContainerRef.value) return;
  chatContainerRef.value.scrollTo({
    top: chatContainerRef.value.scrollHeight,
    behavior: 'smooth',
  });
}

// Watch for new messages with optimized callback
watch(messages, (newMessages, oldMessages) => {
  if (newMessages.length > oldMessages.length) {
    nextTick(scrollToBottom);
  }
  checkOverflow();
}, { deep: true });

// Check for overflow when streaming status changes
watch(() => status.value, (newStatus) => {
  if (newStatus === 'streaming') {
    nextTick(checkOverflow);
  }
}, { immediate: true });

// Optimized interval handling for streaming content
let overflowCheckInterval: number | null = null;

watch(isProcessing, (isCurrentlyProcessing) => {
  if (isCurrentlyProcessing) {
    // Check every 500ms while streaming
    overflowCheckInterval = window.setInterval(checkOverflow, 500);
  }
  else if (overflowCheckInterval !== null) {
    clearInterval(overflowCheckInterval);
    overflowCheckInterval = null;
  }
});

// Clean up interval on component unmount
onBeforeUnmount(() => {
  if (overflowCheckInterval !== null) {
    clearInterval(overflowCheckInterval);
  }
});

// File handling
const uploadedFiles = ref<File[]>([]);
const filePreviewUrls = ref<Map<string, string>>(new Map());

// Chat history search dialog state
const isChatHistoryDialogOpen = ref(false);

// Edit mode state
const isEditMode = ref(false);
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};

// Handle chat selection from history
const handleChatSelection = (chatId: string) => {
  console.log('Selected chat:', chatId);
  // This will be implemented later to load the selected chat
};

// File handling functions
const getFilePreviewUrl = (file: File): string => {
  if (!filePreviewUrls.value.has(file.name) && file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file);
    filePreviewUrls.value.set(file.name, url);
  }
  return filePreviewUrls.value.get(file.name) || '';
};

const removeUploadedFile = (index: number) => {
  const file = uploadedFiles.value[index];
  if (!file) return;

  const previewUrl = filePreviewUrls.value.get(file.name);
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    filePreviewUrls.value.delete(file.name);
  }

  uploadedFiles.value.splice(index, 1);
};

// Clean up when component is unmounted
onBeforeUnmount(() => {
  filePreviewUrls.value.forEach((url) => {
    URL.revokeObjectURL(url);
  });
  filePreviewUrls.value.clear();
});
</script>

<template>
  <div class="flex h-[calc(100vh-4rem)] w-full">
    <div class="container flex items-center h-full w-full gap-4 p-4">
      <div class="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-2 md:p-6 lg:p-8 w-full">
        <!-- Buttons at top right -->
        <div class="absolute top-2 right-2 z-10 flex gap-1">
          <!-- Edit button with tooltip -->
          <TooltipProvider
            v-if="enableEditMode"
            :delay-duration="100"
          >
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  :variant="isEditMode ? 'default' : 'ghost'"
                  size="icon"
                  class="rounded-full"
                  aria-label="Edit chat"
                  @click="toggleEditMode"
                >
                  <Icon
                    name="mdi:square-edit-outline"
                    mode="svg"
                    class="size-5"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ isEditMode ? 'Exit edit mode' : 'Edit chat' }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <!-- Search button with tooltip -->
          <TooltipProvider
            v-if="enableChatHistory"
            :delay-duration="100"
          >
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  class="rounded-full"
                  aria-label="Search chat history"
                  @click="isChatHistoryDialogOpen = true"
                >
                  <Icon
                    name="mdi:text-box-search-outline"
                    mode="svg"
                    class="size-5"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search chat history (⌘K)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <!-- Empty state -->
        <div
          v-if="!messages.length"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center gap-4 p-4"
        >
          <h2 class="text-4xl font-light text-center font-accent">
            {{ title }}
          </h2>
        </div>

        <!-- Chat messages -->
        <div
          ref="chatContainerRef"
          class="flex-1 overflow-y-auto"
        >
          <AiChatMessages
            :messages="messages"
            :is-processing="isProcessing"
          />
        </div>

        <!-- Scroll to bottom button -->
        <Button
          v-show="shouldShowScrollButton"
          variant="outline"
          size="icon"
          class="absolute bottom-48 left-1/2 -translate-x-1/2 z-10 rounded-full animate-in slide-in-from-bottom-4 slide-in-from-left-1/2 duration-300"
          @click="scrollToBottom"
        >
          <Icon
            name="line-md:arrow-down"
            class="size-4"
          />
        </Button>

        <!-- Input form -->
        <form
          class="relative flex flex-col items-center justify-center overflow-hidden max-w-4xl mx-auto w-full rounded-xl md:rounded-2xl border bg-background focus-within:ring-1 focus-within:ring-ring animate-in slide-in-from-bottom-4 duration-500"
          @submit.prevent="handleSubmit"
        >
          <!-- File previews -->
          <LazyAiChatFilePreview
            v-if="enableFileUpload"
            :files="uploadedFiles"
            :get-preview-url="getFilePreviewUrl"
            @remove="removeUploadedFile"
          />

          <div class="flex flex-col w-full">
            <Label
              for="message"
              class="sr-only"
            >Message</Label>

            <Textarea
              id="message"
              v-model="input"
              :placeholder="placeholder"
              class="min-h-24 w-full resize-none border-0 p-4 shadow-none focus-visible:ring-0"
              :disabled="isDisabled"
              @keydown.enter.prevent="handleSubmit"
            />

            <AiChatPromptInput
              v-model:input="input"
              :is-disabled="isDisabled"
              :status="status"
              :enable-file-upload="enableFileUpload"
              :enable-voice-input="enableVoiceInput"
              :uploaded-files="uploadedFiles"
              @submit="handleSubmit"
              @stop="stop"
              @update:uploaded-files="uploadedFiles = $event"
              @get-preview-url="(file) => getFilePreviewUrl(file)"
              @remove-file="(index) => removeUploadedFile(index)"
            />
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Chat History Dialog -->
  <LazyAiChatHistoryDialog
    v-if="enableChatHistory"
    v-model:is-open="isChatHistoryDialogOpen"
    @select-chat="handleChatSelection"
  />
</template>

<style scoped>
input[type="file"]:disabled {
  cursor: not-allowed;
}
</style>
