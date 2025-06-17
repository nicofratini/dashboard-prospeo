import { toast } from 'vue-sonner';

/**
 * Copies an image to the clipboard using Canvas and Clipboard API
 * @param imageUrl The URL or data URL of the image to copy
 * @returns Promise that resolves when the operation is complete
 */
export default function (imageUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      // Convert canvas to blob and copy to clipboard
      canvas.toBlob((blob) => {
        if (blob) {
          try {
            // Use the clipboard API to copy the image
            navigator.clipboard.write([
              new ClipboardItem({ [blob.type]: blob }),
            ]).then(() => {
              toast.success('Success', {
                description: 'Image copied to clipboard',
                closeButton: true,
              });
              resolve();
            }).catch((err) => {
              toast.error('Error', {
                description: 'Failed to copy image',
                closeButton: true,
              });
              console.error('Failed to copy image: ', err);
              reject(err);
            });
          }
          catch (err) {
            toast.error('Error', {
              description: 'Clipboard API not supported in this browser',
              closeButton: true,
            });
            console.error('Clipboard API not supported: ', err);
            reject(err);
          }
        }
      });
    };

    img.onerror = (err) => {
      toast.error('Error', {
        description: 'Failed to load image',
        closeButton: true,
      });
      reject(err);
    };

    img.src = imageUrl;
  });
}
