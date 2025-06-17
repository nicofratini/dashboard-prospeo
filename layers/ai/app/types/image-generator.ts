/**
 * Configuration for image generation
 */
export interface ImageConfig {
  aspectRatio: string;
  style: string;
  negativePrompt?: string;
  model?: string;
}

/**
 * Represents a completed prompt generation result
 */
export interface PromptResult {
  /** The text prompt used to generate the images */
  prompt: string;
  /** Configuration used for generation */
  config: ImageConfig;
  /** When the images were generated */
  createdAt: Date;
  /** Array of generated image URLs */
  images: string[];
}

/**
 * Successful API response from the image generation endpoint
 */
export interface SuccessResponse {
  success: true;
  /** Single image data (base64) when generating one image */
  image: string;
  /** Multiple image data (base64) when generating multiple images */
  images?: string[];
  /** Configuration used for the generation */
  config: {
    prompt: string;
    aspectRatio: string;
    style: string;
    negativePrompt?: string;
    model?: string;
  };
}

/**
 * Error response from the image generation endpoint
 */
export interface ErrorResponse {
  error: string;
  statusCode?: number;
}

/**
 * Request body for the image generation API
 */
export interface GenerateImageRequest {
  prompt: string;
  aspectRatio: string;
  style: string;
  negativePrompt?: string;
  numberOfImages: number;
  model: string;
}
