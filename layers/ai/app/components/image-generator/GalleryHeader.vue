<script setup lang="ts">
defineProps<{
  resultCount: number;
  isGenerating: boolean;
}>();
</script>

<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold tracking-tight mb-2">
      AI Image Generator
    </h1>
    <p class="text-muted-foreground">
      Transform your ideas into stunning visuals with AI
    </p>
  </div>

  <div
    v-if="resultCount > 0 || isGenerating"
    class="mb-4 flex justify-between items-center"
  >
    <h2 class="text-2xl font-semibold">
      Your Gallery
    </h2>
    <p class="text-sm text-muted-foreground">
      {{ resultCount }} prompt{{ resultCount !== 1 ? 's' : '' }}
      {{ isGenerating ? '(generating...)' : '' }}
    </p>
  </div>
</template>
