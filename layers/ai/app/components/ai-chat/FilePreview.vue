<script setup lang="ts">
defineProps<{
  files: File[];
  getPreviewUrl: (file: File) => string;
}>();

const emit = defineEmits<{
  remove: [index: number];
}>();
</script>

<template>
  <div
    v-if="files.length"
    class="w-full px-4 py-3 border-b border-border/30 flex flex-wrap gap-2"
  >
    <div
      v-for="(file, index) in files"
      :key="`${file.name}-${file.size}`"
      class="relative group rounded-xl border border-border bg-background shadow-sm"
    >
      <div class="size-10 flex items-center justify-center">
        <NuxtImg
          v-if="getPreviewUrl(file)"
          :src="getPreviewUrl(file)"
          alt="File preview"
          class="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
        <Icon
          v-else
          name="mdi:file-document-outline"
          class="size-4 text-muted-foreground"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="absolute top-0 right-0 rounded-full translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground size-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
        aria-label="Remove file"
        @click="emit('remove', index)"
      >
        <Icon
          name="mdi:close"
          class="size-3"
        />
      </Button>
    </div>
  </div>
</template>
