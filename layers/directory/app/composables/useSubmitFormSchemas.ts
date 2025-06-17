import { toTypedSchema } from '@vee-validate/zod';
import { string, boolean, array, enum as zEnum, object, any } from 'zod';

export function useSubmitFormSchemas() {
  const formSchemas = [
    // Step 1: Details
    toTypedSchema(
      object({
        title: string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
        description: string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
        content: string().optional(),
        url: string().url('Please enter a valid URL').min(1, 'URL is required'),
        categoryIds: array(string()).min(1, 'Please select at least one category'),
        tagIds: array(string()).min(1, 'Please select at least one tag'),
        image: object({
          file: any(),
          hasFile: boolean(),
        }).refine(data => data.hasFile, {
          message: 'Please upload an image',
        }).refine((data) => {
          if (!data.file) return false;
          const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
          const fileExt = `.${data.file.name.split('.').pop()?.toLowerCase()}`;
          return validExtensions.includes(fileExt);
        }, {
          message: 'Please upload a JPG, JPEG, PNG, or WEBP image',
        }).refine((data) => {
          if (!data.file) return false;
          return data.file.size <= 2 * 1024 * 1024;
        }, {
          message: 'Image must be less than 2MB',
        }),
        icon: object({
          file: any(),
          hasFile: boolean(),
        }).refine(data => data.hasFile, {
          message: 'Please upload an icon',
        }).refine((data) => {
          if (!data.file) return false;
          const validExtensions = ['.svg', '.png', '.ico'];
          const fileExt = `.${data.file.name.split('.').pop()?.toLowerCase()}`;
          return validExtensions.includes(fileExt);
        }, {
          message: 'Please upload an SVG, PNG, or ICO icon',
        }).refine((data) => {
          if (!data.file) return false;
          return data.file.size <= 1024 * 1024;
        }, {
          message: 'Icon must be less than 1MB',
        }),
      }),
    ),

    // Step 2: Payment
    toTypedSchema(
      object({
        paymentMethod: zEnum(['free', 'credit', 'sponsor']),
        promotionCode: string().optional(),
      }),
    ),

    // Step 3: Publish
    toTypedSchema(
      object({
        featured: boolean().default(false),
        publishDate: string().datetime().optional(),
        termsAccepted: boolean().refine(val => val === true, {
          message: 'You must accept the terms and conditions',
        }),
      }),
    ),
  ];

  return {
    formSchemas,
  };
}
