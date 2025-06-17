<script setup lang="ts">
definePageMeta({
  layout: 'ai-dashboard',
});
</script>

<template>
  <div class="relative">
    <div class="absolute top-4 right-4 z-20">
      <Button
        variant="outline"
        size="sm"
        class="flex items-center gap-2"
        as-child
      >
        <NuxtLink to="/dashboard">
          <Icon
            name="mdi:home"
            class="size-4"
          />
          Go Home
        </NuxtLink>
      </Button>
    </div>
    <ImageGenerator />
  </div>
</template>
