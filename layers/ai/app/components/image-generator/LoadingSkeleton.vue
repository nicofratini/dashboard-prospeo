<script setup lang="ts">
defineProps<{
  numberOfImages: string;
  aspectRatio: string;
}>();
</script>

<template>
  <div class="p-4 border border-border/40 rounded-lg bg-muted/10">
    <div class="flex flex-row gap-4">
      <div class="max-h-96 w-full max-w-64 flex flex-col gap-2">
        <!-- Prompt skeleton -->
        <div class="space-y-2">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-5/6" />
          <Skeleton class="h-4 w-4/6" />
        </div>

        <!-- Badge skeletons -->
        <div class="flex flex-wrap gap-2 mt-2">
          <Skeleton class="h-6 w-16 rounded-full" />
          <Skeleton class="h-6 w-24 rounded-full" />
          <Skeleton class="h-6 w-20 rounded-full" />
          <Skeleton class="h-6 w-16 rounded-full" />
          <Skeleton class="h-6 w-12 rounded-full" />
          <Skeleton class="h-6 w-24 rounded-full" />
        </div>
      </div>

      <!-- Gallery skeleton -->
      <div class="flex-1">
        <div
          class="grid gap-4"
          :class="{
            'grid-cols-1': numberOfImages === '1',
            'grid-cols-2': numberOfImages === '2',
            'grid-cols-2 md:grid-cols-4': numberOfImages === '4',
          }"
        >
          <div
            v-for="i in parseInt(numberOfImages)"
            :key="i"
            class="relative overflow-hidden rounded-lg bg-muted/40"
            :class="{
              'aspect-square': aspectRatio === '1:1',
              'aspect-video': aspectRatio === '16:9',
              'aspect-[9/16]': aspectRatio === '9:16',
            }"
          >
            <div class="absolute inset-0 flex items-center justify-center">
              <Icon
                name="svg-spinners:pulse-rings-multiple"
                class="size-12 text-primary/40"
              />
            </div>
            <div class="absolute inset-0 bg-gradient-to-br from-transparent to-background/20" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
