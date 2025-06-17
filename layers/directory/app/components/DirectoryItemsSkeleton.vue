<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    <div
      v-for="i in count"
      :key="`item-${i}`"
      class="rounded-lg border bg-card relative overflow-hidden"
    >
      <!-- Image placeholder -->
      <Skeleton class="h-40 w-full" />

      <!-- Content placeholder -->
      <div class="p-4">
        <!-- Title -->
        <Skeleton class="h-6 rounded-md mb-3 w-3/4" />

        <!-- Description -->
        <div class="space-y-2">
          <Skeleton class="h-4 rounded w-full" />
          <Skeleton class="h-4 rounded w-5/6" />
          <Skeleton class="h-4 rounded w-4/6" />
        </div>

        <!-- Tags -->
        <div class="mt-4 flex flex-wrap gap-1">
          <Skeleton
            v-for="j in 3"
            :key="`tag-${i}-${j}`"
            class="h-5 w-12 rounded-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Directory items grid loading skeleton

defineProps({
  count: {
    type: Number,
    default: 8,
  },
});
</script>
