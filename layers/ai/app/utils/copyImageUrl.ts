import { toast } from 'vue-sonner';

/**
 * Copies an image URL to the clipboard
 * @param imageUrl The URL to copy
 * @returns Promise that resolves when the operation is complete
 */
export default function (imageUrl: string): Promise<void> {
  return navigator.clipboard.writeText(imageUrl)
    .then(() => {
      toast.success('Success', {
        description: 'Image URL copied to clipboard',
        closeButton: true,
      });
    })
    .catch((err) => {
      toast.error('Error', {
        description: 'Failed to copy URL',
        closeButton: true,
      });
      console.error('Failed to copy URL: ', err);
      throw err;
    });
}
