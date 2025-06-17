<script setup lang="ts">
defineProps<{
  imageStyle: string;
  aspectRatio: string;
  selectedModel: string;
  availableModels: Array<{ value: string; label: string }>;
}>();
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <Icon
        name="svg-spinners:pulse-rings-multiple"
        class="size-12 mx-auto mb-3 text-primary"
      />
      <h3 class="text-base font-medium mb-1">
        Creating your masterpiece...
      </h3>
      <p class="text-xs text-muted-foreground">
        Your image is being generated with {{ imageStyle }} style in {{ aspectRatio }} aspect ratio using {{ availableModels.find(m => m.value === selectedModel)?.label.split(' - ')[0] || selectedModel }}
      </p>
    </div>
  </div>
</template>
