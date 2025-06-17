<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="aspect-video rounded-xl bg-muted/50" />
      <div class="aspect-video rounded-xl bg-muted/50" />
      <div class="aspect-video rounded-xl bg-muted/50" />
      <div class="col-span-full aspect-video" />
    </div>
  </div>
</template>
