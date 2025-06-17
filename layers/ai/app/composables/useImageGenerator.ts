import type { PromptResult, SuccessResponse, GenerateImageRequest } from '../types/image-generator';

/**
 * Composable for managing image generation state and functionality
 */
export function useImageGenerator() {
  /** The current prompt text */
  const imagePrompt = ref('');
  /** Whether an image is currently being generated */
  const isGenerating = ref(false);
  /** List of all generated prompt results */
  const promptResults = ref<PromptResult[]>([]);
  /** Current error message, if any */
  const errorMessage = ref<string | null>(null);
  /** Reference to the prompt input element */
  const promptInputRef = ref<HTMLTextAreaElement | null>(null);

  // Advanced options
  /** Selected aspect ratio for generation */
  const aspectRatio = ref<string>('');
  /** Selected image style */
  const imageStyle = ref<string>('');
  /** Negative prompt for generation */
  const negativePrompt = ref('');
  /** Number of images to generate */
  const numberOfImages = ref<string>('');
  /** Selected AI model for generation */
  const selectedModel = ref<string>('');

  /**
   * Finds the prompt result containing a specific image URL
   * @param imageUrl - The URL of the image to find
   * @returns The prompt result containing the image, or null if not found
   */
  function findImageData(imageUrl: string): PromptResult | null {
    return promptResults.value.find(result => result.images.includes(imageUrl)) ?? null;
  }

  /**
   * Generates images using the current prompt and settings
   */
  async function generateImage() {
    if (!imagePrompt.value.trim()) return;

    isGenerating.value = true;
    errorMessage.value = null;

    try {
      const response = await $fetch<SuccessResponse>('/api/ai/generate-image', {
        method: 'POST',
        body: {
          prompt: imagePrompt.value,
          aspectRatio: aspectRatio.value,
          style: imageStyle.value,
          negativePrompt: negativePrompt.value.trim() || undefined,
          numberOfImages: parseInt(numberOfImages.value, 10),
          model: selectedModel.value,
        } satisfies GenerateImageRequest,
      });

      if ('error' in response) {
        throw new Error(String(response.error));
      }

      const imageArray = response.images || [response.image];

      const newPromptResult: PromptResult = {
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
      console.error('Error generating image:', error);
      errorMessage.value = error.message || 'Failed to generate image. Please try again.';
    }
    finally {
      isGenerating.value = false;
    }
  }

  /**
   * Handles upscaling an existing image
   * @param image - The URL of the image to upscale
   */
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

  /**
   * Handles remixing an existing image with a modified prompt
   * @param image - The URL of the image to remix
   */
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

    // Focus the prompt input for editing
    nextTick(() => {
      if (promptInputRef.value) {
        promptInputRef.value.focus();
      }
    });
  }

  /**
   * Handles generating variations of an existing image
   * @param image - The URL of the image to vary
   */
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

  /**
   * Dismisses the current error message
   */
  function handleDismissError() {
    errorMessage.value = null;
  }

  return {
    // State
    imagePrompt,
    isGenerating,
    promptResults,
    errorMessage,
    promptInputRef,
    aspectRatio,
    imageStyle,
    negativePrompt,
    numberOfImages,
    selectedModel,

    // Methods
    generateImage,
    handleUpscaleImage,
    handleRemixImage,
    handleVaryImage,
    handleDismissError,
  };
}
