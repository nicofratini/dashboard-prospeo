<script setup lang="ts">
defineProps<{
  prevNext: any;
  side: 'left' | 'right';
}>();
</script>

<template>
  <NuxtLink
    v-if="prevNext && prevNext.path"
    :to="prevNext.path"
    class="basis-1/3"
  >
    <div class="mb-4 space-y-2 rounded-lg border p-4 transition-all hover:bg-muted/50">
      <div class="flex flex-row gap-3">
        <div
          v-if="side === 'left'"
          class="flex size-6 min-w-6"
        >
          <Icon
            name="mdi:arrow-left"
            size="20"
            class="mx-auto self-center"
          />
        </div>
        <div class="space-y-2 self-center">
          <div class="text-lg font-semibold">
            {{ prevNext.title }}
          </div>
          <div
            v-if="prevNext.description"
            class="text-sm text-muted-foreground"
          >
            {{ prevNext.description }}
          </div>
        </div>
        <div
          v-if="side === 'right'"
          class="ml-auto flex size-6 min-w-6"
        >
          <Icon
            name="mdi:arrow-right"
            size="20"
            class="mx-auto self-center"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
