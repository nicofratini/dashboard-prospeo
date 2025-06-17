export interface FileConfig {
  ref: Ref<File | null>;
  previewRef: Ref<string | null>;
  validExtensions: string[];
  maxSize: number;
  fieldName: string;
}

export function useFileUpload(setFieldValue: (field: string, value: any) => void) {
  function handleFileUpload(config: FileConfig, file: File | null) {
    if (!file) {
      // Clear file
      config.ref.value = null;
      config.previewRef.value = null;
      setFieldValue(config.fieldName, {
        file: null,
        hasFile: false,
      });
      return;
    }

    // Validate file
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isValidExtension = config.validExtensions.includes(fileExt);
    const isValidSize = file.size <= config.maxSize;

    if (!isValidExtension || !isValidSize) {
      // Validation failed
      config.ref.value = null;
      config.previewRef.value = null;
      setFieldValue(config.fieldName, {
        file: null,
        hasFile: false,
      });
      return;
    }

    // Set file and preview
    config.ref.value = file;
    setFieldValue(config.fieldName, {
      file,
      hasFile: true,
    });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      config.previewRef.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function removeFile(config: FileConfig) {
    config.ref.value = null;
    config.previewRef.value = null;
    setFieldValue(config.fieldName, {
      file: null,
      hasFile: false,
    });
  }

  return {
    handleFileUpload,
    removeFile,
  };
}
