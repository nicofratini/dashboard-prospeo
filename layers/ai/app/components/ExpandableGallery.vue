<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

interface Props {
  images: string[];
  class?: HTMLAttributes['class'];
  prompt?: string;
  config?: {
    aspectRatio: string;
    style: string;
    negativePrompt?: string;
    model?: string;
  };
  createdAt?: Date;
  modelLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  prompt: '',
  config: () => ({
    aspectRatio: '1:1',
    style: 'vivid',
  }),
  createdAt: () => new Date(),
  modelLabel: '',
});

// Determine the hover flex class based on image count
const hoverFlexClass = computed(() => {
  if (props.images.length < 4) return 'hover:scale-105';
  return 'hover:flex-[2]';
});

// Image viewer dialog state
const selectedImage = ref<string>('');
const isDialogOpen = ref(false);

// Open the image viewer dialog
function openImageViewer(image: string) {
  selectedImage.value = image;
  isDialogOpen.value = true;
}

// Event emitters for image actions
const emit = defineEmits<{
  upscale: [image: string];
  remix: [image: string];
  vary: [image: string];
}>();

function handleUpscale() {
  emit('upscale', selectedImage.value);
}

function handleRemix() {
  emit('remix', selectedImage.value);
}

function handleVary() {
  emit('vary', selectedImage.value);
}
</script>

<template>
  <div :class="cn('flex h-96 w-full gap-2', props.class)">
    <div
      v-for="image in images"
      :key="image"
      :class="[
        'relative flex h-full flex-1 cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ease-in-out',
        hoverFlexClass,
      ]"
      @click="openImageViewer(image)"
    >
      <NuxtImg
        class="relative h-full object-cover rounded-xl"
        :src="image"
        :alt="prompt || 'Generated image'"
        loading="lazy"
        :placeholder="[50, 50, 75]"
        sizes="(max-width: 768px) 100vw, 50vw"
        quality="90"
      />
    </div>
  </div>

  <!-- Image Viewer Dialog -->
  <LazyImageGeneratorImageViewerDialog
    v-model:open="isDialogOpen"
    :image="selectedImage"
    :prompt="prompt"
    :config="config"
    :created-at="createdAt"
    :model-label="modelLabel"
    @upscale="handleUpscale"
    @remix="handleRemix"
    @vary="handleVary"
  />
</template>
