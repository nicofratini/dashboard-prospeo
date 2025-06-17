<script setup lang="ts">
import type { Message } from '@ai-sdk/vue';
import { toast } from 'vue-sonner';
// added as we properly sanitize the html
/* eslint-disable vue/no-v-html */
defineProps<{
  messages: Message[];
  isProcessing: boolean;
}>();

const { parseMarkdown } = useMarkdown();

// Function to copy message content to clipboard
async function copyMessageToClipboard(content: string) {
  try {
    await navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard', {
      description: 'Message content has been copied to your clipboard',
    });
  }
  catch (error) {
    toast.error('Copy failed', {
      description: 'Failed to copy message to clipboard',
    });
    console.error('Failed to copy:', error);
  }
}
</script>

<template>
  <div class="flex flex-col max-w-[52rem] mx-auto w-full gap-4 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
    <template
      v-for="message in messages"
      :key="message.id"
    >
      <div
        :class="[
          'flex gap-3 max-w-full',
          message.role === 'assistant' ? 'flex-row w-auto' : 'flex-row-reverse w-full justify-start',
        ]"
      >
        <div
          v-if="message.role === 'assistant'"
          :class="[
            'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow bg-primary text-primary-foreground',
          ]"
        >
          <Icon
            name="simple-icons:openai"
            class="size-5"
          />
        </div>
        <div
          :class="[
            'flex flex-col gap-2 px-5 py-2.5 overflow-hidden',
            message.role === 'assistant'
              ? 'bg-transparent w-auto pb-8'
              : 'bg-muted text-primary rounded-3xl rounded-br-lg self-end w-auto max-w-full',
          ]"
        >
          <article
            v-if="message.role === 'assistant'"
            class="prose dark:prose-invert max-w-none overflow-hidden
              prose-pre:!bg-background
              prose-pre:my-0
              prose-pre:overflow-x-auto
              prose-pre:max-w-full
              prose-pre:whitespace-pre-wrap
              prose-code:!bg-background
              prose-code:overflow-wrap-anywhere
              prose-headings:font-accent
              prose-h1:text-3xl prose-h1:font-light
              prose-h2:text-2xl prose-h2:font-light
              prose-h3:text-xl prose-h3:font-light
              prose-p:text-base prose-p:leading-relaxed
              prose-ul:my-2 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-6
              prose-li:my-1
              prose-code:text-sm prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            v-html="parseMarkdown(message.content)"
          />
          <p
            v-else
            class="break-words whitespace-normal"
          >
            {{ message.content }}
          </p>

          <!-- Copy button -->
          <div
            v-if="message.role === 'assistant' && !isProcessing"
            class="flex justify-start mt-1"
          >
            <Button
              variant="ghost"
              size="sm"
              class="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              @click="copyMessageToClipboard(message.content)"
            >
              <Icon
                name="mdi:content-copy"
                class="size-3 mr-1"
              />
              <span>Copy</span>
            </Button>
          </div>
        </div>
      </div>
    </template>
    <div v-if="isProcessing">
      <Icon
        name="svg-spinners:pulse-multiple"
        class="size-5"
      />
    </div>
  </div>
</template>
