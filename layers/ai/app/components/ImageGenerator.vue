<script setup lang="ts">
import type { PromptResult } from '../types/image-generator';
import { toast } from 'vue-sonner';

// Available options
const availableImageCounts = [
  { value: '1', label: '1 Image' },
  { value: '2', label: '2 Images' },
  { value: '4', label: '4 Images' },
];

const availableAspectRatios = [
  { value: '1:1', label: '1:1 - Square' },
  { value: '16:9', label: '16:9 - Landscape' },
  { value: '9:16', label: '9:16 - Portrait' },
];

const availableStyles = [
  { value: 'vivid', label: 'Vivid - Rich, intense colors and details' },
  { value: 'natural', label: 'Natural - More subdued, realistic results' },
];

const availableModels = [
  { value: 'bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637', label: 'SDXL Lightning - Ultra fast (4 steps)' },
  { value: 'black-forest-labs/flux-1.1-pro-ultra', label: 'Flux 1.1 Pro Ultra - Highest quality, slower' },
  { value: 'black-forest-labs/flux-1.1-pro', label: 'Flux 1.1 Pro - High quality' },
  { value: 'black-forest-labs/flux-dev', label: 'Flux Dev - Development version' },
  { value: 'black-forest-labs/flux-pro', label: 'Flux Pro - Professional quality' },
  { value: 'black-forest-labs/flux-schnell', label: 'Flux Schnell - Fast generation' },
  { value: 'ideogram-ai/ideogram-v2-turbo', label: 'Ideogram v2 Turbo - Fast artistic images' },
  { value: 'ideogram-ai/ideogram-v2', label: 'Ideogram v2 - High quality artistic images' },
  { value: 'luma/photon-flash', label: 'Photon Flash - Quick photorealistic images' },
  { value: 'luma/photon', label: 'Photon - Photorealistic images' },
  { value: 'recraft-ai/recraft-v3-svg', label: 'Recraft v3 SVG - Vector graphics' },
  { value: 'recraft-ai/recraft-v3', label: 'Recraft v3 - Illustration style' },
  { value: 'stability-ai/stable-diffusion-3.5-large-turbo', label: 'SD 3.5 Large Turbo - Fast, high quality' },
  { value: 'stability-ai/stable-diffusion-3.5-large', label: 'SD 3.5 Large - Highest quality' },
  { value: 'stability-ai/stable-diffusion-3.5-medium', label: 'SD 3.5 Medium - Balanced quality/speed' },
];

// Example prompts for inspiration
const examplePrompts = [
  'The 90s, a beautiful woman with a radiant smile and long hair, dressed in summer attire',
  'A pickup truck going up a mountain switchback',
  'A majestic dragon perched on a snowy mountain peak, scales shimmering with icy blues and purples under a starry sky',
  'An astronaut exploring a vibrant alien jungle, filled with bioluminescent plants and strange, colorful creatures',
  'A cyberpunk samurai standing in a rain-soaked neon-lit alley, katana glowing with electric energy',
  'A whimsical forest where trees have faces, glowing mushrooms light the path, and tiny fairies dance in the air',
];

// State management (moved from composable)
const imagePrompt = ref('');
const isGenerating = ref(false);
const promptResults = ref<PromptResult[]>([]);

// Advanced options
const aspectRatio = ref<string>('1:1');
const imageStyle = ref<string>('vivid');
const negativePrompt = ref('');
const numberOfImages = ref<string>('1');
const selectedModel = ref<string>('bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637');

const modelError = computed(() => {
  if (!selectedModel.value) return 'Please select a model';
  return null;
});

const isFormValid = computed(() => !modelError.value);

// Helper function to find image data
function findImageData(imageUrl: string): PromptResult | null {
  return promptResults.value.find(result => result.images.includes(imageUrl)) ?? null;
}

// Function to use an example prompt
function useExamplePrompt(prompt: string) {
  imagePrompt.value = prompt;
}

// Generate image function
async function generateImage() {
  if (!imagePrompt.value.trim() || !isFormValid.value) {
    return;
  }

  isGenerating.value = true;

  try {
    const response = await $fetch('/api/ai/generate-image', {
      method: 'POST',
      body: {
        prompt: imagePrompt.value,
        aspectRatio: aspectRatio.value,
        style: imageStyle.value,
        negativePrompt: negativePrompt.value.trim() || undefined,
        numberOfImages: parseInt(numberOfImages.value, 10) || 1,
        model: selectedModel.value,
      },
    });

    if ('error' in response) {
      throw new Error(String(response.error));
    }

    const imageArray = response.images || [response.image];

    const newPromptResult = {
      prompt: imagePrompt.value,
      config: {
        aspectRatio: aspectRatio.value,
        style: imageStyle.value,
        negativePrompt: negativePrompt.value || undefined,
        model: selectedModel.value,
      },
      createdAt: new Date(),
      images: imageArray.map(imageData => `data:image/png;base64,${imageData}`),
    };

    promptResults.value = [newPromptResult, ...promptResults.value];
  }
  catch (error: any) {
    toast.error('Image generation failed', {
      description: error.statusMessage || 'Failed to generate image. Please try again.',
    });
  }
  finally {
    isGenerating.value = false;
  }
}

// Handle upscale image
function handleUpscaleImage(image: string) {
  const imageData = findImageData(image);
  if (!imageData) return;

  // Pre-fill form with the original settings
  imagePrompt.value = imageData.prompt;
  aspectRatio.value = imageData.config.aspectRatio;
  imageStyle.value = imageData.config.style;
  negativePrompt.value = imageData.config.negativePrompt || '';
  if (imageData.config.model) {
    selectedModel.value = imageData.config.model;
  }

  // TODO: Implement actual upscaling logic here
  // For now, we'll just regenerate with the same settings
  generateImage();
}

// Handle remix image
function handleRemixImage(image: string) {
  const imageData = findImageData(image);
  if (!imageData) return;

  // Pre-fill form with the original settings
  imagePrompt.value = imageData.prompt;
  aspectRatio.value = imageData.config.aspectRatio;
  imageStyle.value = imageData.config.style;
  negativePrompt.value = imageData.config.negativePrompt || '';
  if (imageData.config.model) {
    selectedModel.value = imageData.config.model;
  }
}

// Handle vary image
function handleVaryImage(image: string) {
  const imageData = findImageData(image);
  if (!imageData) return;

  // Pre-fill form with the original settings
  imagePrompt.value = imageData.prompt;
  aspectRatio.value = imageData.config.aspectRatio;
  imageStyle.value = imageData.config.style;
  negativePrompt.value = imageData.config.negativePrompt || '';
  if (imageData.config.model) {
    selectedModel.value = imageData.config.model;
  }

  // Set to generate multiple images
  numberOfImages.value = '4';

  // Generate variations
  generateImage();
}

// Handle generate image button click
function handleGenerateImage() {
  if (!imagePrompt.value.trim()) {
    toast.error('Missing prompt', {
      description: 'Please enter a prompt to generate an image',
    });
    return;
  }

  if (!selectedModel.value) {
    toast.error('Model required', {
      description: 'Please select a model for image generation',
    });
    return;
  }

  if (isFormValid.value) {
    generateImage();
  }
  else {
    toast.error('Invalid form', {
      description: modelError.value || 'Please check your inputs and try again',
    });
  }
}
</script>

<template>
  <SidebarProvider
    style="--sidebar-width: 20rem;"
  >
    <!-- Sidebar for Input and Controls -->
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
      role="complementary"
      aria-label="Image generation controls"
    >
      <SidebarHeader class="p-4 text-center">
        <h1 class="text-xl font-semibold">
          Image Generator
        </h1>
        <p class="text-sm text-muted-foreground">
          Create AI-powered visuals
        </p>
      </SidebarHeader>

      <SidebarContent class="p-4 space-y-6">
        <!-- Prompt Input -->
        <ImageGeneratorPromptInput
          ref="promptInputComponent"
          v-model:image-prompt="imagePrompt"
          :example-prompts="examplePrompts"
          @use-example="useExamplePrompt"
        />

        <!-- Advanced Options -->
        <ImageGeneratorAdvancedOptions
          v-model:number-of-images="numberOfImages"
          v-model:aspect-ratio="aspectRatio"
          v-model:image-style="imageStyle"
          v-model:negative-prompt="negativePrompt"
          v-model:selected-model="selectedModel"
          :available-image-counts="availableImageCounts"
          :available-aspect-ratios="availableAspectRatios"
          :available-styles="availableStyles"
          :available-models="availableModels"
        />

        <!-- Loading Indicator -->
        <ImageGeneratorLoadingIndicator
          v-if="isGenerating"
          :image-style="imageStyle"
          :aspect-ratio="aspectRatio"
          :selected-model="selectedModel"
          :available-models="availableModels"
        />
      </SidebarContent>

      <ImageGeneratorFooter
        :is-generating="isGenerating"
        :is-disabled="isGenerating || !isFormValid"
        @generate="handleGenerateImage"
      />
    </Sidebar>

    <!-- Main Content Area -->
    <main
      class="flex-1 p-8 overflow-auto relative"
      role="main"
      aria-label="Generated images gallery"
    >
      <ImageGeneratorGalleryHeader
        :result-count="promptResults.length"
        :is-generating="isGenerating"
      />

      <!-- Gallery Section -->
      <div>
        <ImageGeneratorEmptyGallery
          v-if="promptResults.length === 0 && !isGenerating"
        />

        <!-- Display prompt results and loading skeleton -->
        <div
          v-else
          class="space-y-8"
        >
          <!-- Loading Skeleton (appears at the top when generating) -->
          <ImageGeneratorLoadingSkeleton
            v-if="isGenerating"
            :number-of-images="numberOfImages"
            :aspect-ratio="aspectRatio"
          />

          <!-- Existing prompt results -->
          <ImageGeneratorPromptResultItem
            v-for="(result, index) in promptResults"
            :key="index"
            :prompt="result.prompt"
            :config="result.config"
            :created-at="result.createdAt"
            :images="result.images"
            :available-models="availableModels"
            @upscale="handleUpscaleImage"
            @remix="handleRemixImage"
            @vary="handleVaryImage"
          />
        </div>
      </div>
    </main>
  </SidebarProvider>
</template>
