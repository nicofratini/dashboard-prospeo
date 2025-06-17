import { experimental_generateImage as generateImage } from 'ai';
import { replicate } from '@ai-sdk/replicate';
import { z } from 'zod';

// Define the Zod schema for request validation
const GenerateImageSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  aspectRatio: z.string(),
  style: z.string(),
  negativePrompt: z.string().optional(),
  numberOfImages: z.number().int().positive().default(1).optional(),
  model: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    // Validate the request body using readValidatedBody
    const body = await readValidatedBody(event, (body) => {
      const result = GenerateImageSchema.safeParse(body);

      if (!result.success) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid request body',
          data: result.error.format(),
        });
      }

      return result.data;
    });

    const { prompt, aspectRatio, style, negativePrompt, numberOfImages } = body;

    // Default model if not provided
    const selectedModel = 'bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637';

    // Generate image using Vercel AI SDK
    const { image, images } = await generateImage({
      model: replicate.image(selectedModel),
      prompt,
      aspectRatio: aspectRatio as `${number}:${number}`,
      n: numberOfImages ?? 1,
      providerOptions: {
        replicate: {
          disable_safety_checker: true, // todo: remove
          style,
        },
      },
    });

    // Return the generated images as base64
    return {
      success: true,
      // Return single image for backward compatibility
      image: image.base64,
      // Return array of images for multiple image support
      images: images ? images.map(img => img.base64) : [image.base64],

      config: {
        prompt,
        aspectRatio,
        style,
        negativePrompt,
        model: selectedModel,
      },
    };
  }
  catch (error: unknown) {
    console.error('Error generating image:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    });
  }
});
