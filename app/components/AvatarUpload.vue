<script setup lang="ts">
import { useDropZone } from '@vueuse/core';
import { toast } from 'vue-sonner';
import { NuxtImg } from '#components';

interface Props {
  userId: string;
  url?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  update: [url: string];
}>();

// State
const isUploading = ref(false);
const previewUrl = ref(props.url ?? null);

// Dropzone setup
const dropZoneRef = ref<HTMLElement | null>(null);
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: (files) => {
    const file = files?.[0];
    if (file && file instanceof File && file.type.startsWith('image/'))
      uploadFile(file);
  },
});

// File input ref
const fileInput = ref<HTMLInputElement | null>(null);

// Methods
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file)
    await uploadFile(file);
}

async function uploadFile(file: File) {
  try {
    isUploading.value = true;

    // Prepare the file for upload
    const fileName = `${props.userId}/${Date.now()}.${file.name.split('.').pop()}`;

    const { error: uploadError } = await useSupabaseClient()
      .storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError)
      throw uploadError;

    emit('update', fileName);
  }
  catch (error) {
    toast.error('Failed to upload avatar', {
      description: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    // Reset preview on error
    previewUrl.value = props.url ?? null;
  }
  finally {
    isUploading.value = false;
  }
}

// Watch for prop changes
watch(() => props.url, (newUrl) => {
  previewUrl.value = newUrl ?? null;
});
</script>

<template>
  <div class="grid gap-4">
    <div
      ref="dropZoneRef"
      class="relative mx-auto"
      :class="{ 'ring-2 ring-primary ring-offset-2': isOverDropZone }"
      @click="fileInput?.click()"
    >
      <Avatar class="size-24 cursor-pointer transition-all hover:opacity-90">
        <AvatarImage
          v-if="previewUrl"
          :src="previewUrl"
          alt="Profile picture"
          class="animate-in fade-in zoom-in-50"
          :as="NuxtImg"
          quality="70"
        />
        <AvatarFallback>
          AV
        </AvatarFallback>
      </Avatar>
      <div
        v-if="isUploading"
        class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50"
      >
        <Icon
          name="line-md:loading-twotone-loop"
          class="size-8 text-white"
        />
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/*"
      @change="handleFileSelect"
    >
    <p class="text-center text-sm text-muted-foreground">
      Click to upload or drag and drop
      <br>
      SVG, PNG, JPG or GIF (max. 2MB)
    </p>
  </div>
</template>
