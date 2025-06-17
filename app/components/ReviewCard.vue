<template>
  <figure
    class="relative w-64 cursor-pointer overflow-hidden rounded-xl border border-border bg-muted p-4 hover:bg-muted/50"
  >
    <div class="flex flex-row items-center gap-2">
      <NuxtImg
        :src="img"
        class="overflow-hidden rounded-full size-8 object-cover"
        loading="lazy"
        :alt="name"
        :quality="70"
      />
      <div class="flex flex-col">
        <span class="text-sm font-medium text-foreground">
          {{ name }}
        </span>
        <p class="text-xs font-medium text-muted-foreground">
          {{ username }}
        </p>
      </div>
    </div>
    <blockquote class="mt-2 text-sm">
      {{ body }}
    </blockquote>
  </figure>
</template>

<script lang="ts" setup>
interface Props {
  img: string;
  name: string;
  username: string;
  body: string;
}

defineProps<Props>();
</script>
