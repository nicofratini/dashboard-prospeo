<script setup lang="ts">
interface Advantage {
  text: string;
  icon?: string;
}

interface HeroListItem {
  badge?: string;
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: string;
  advantages?: Advantage[];
}

interface HeroListProps {
  items?: HeroListItem[];
}

const { items = [] } = defineProps<HeroListProps>();
</script>

<template>
  <div
    v-if="items.length"
    class="flex flex-col justify-center items-center gap-y-20 md:gap-y-36 w-full"
  >
    <Motion
      v-for="(item, i) in items"
      :key="i"
      preset="slideVisibleOnceBottom"
      :delay="200"
      :duration="600"
      class="flex flex-col lg:flex-row justify-center items-center gap-y-6 lg:gap-x-24 lg:gap-y-0 w-full lg:odd:flex-row-reverse"
    >
      <div class="flex flex-col justify-center items-start gap-y-6 max-w-full lg:basis-1/2 basis-full">
        <span
          v-if="item.badge"
          class="font-accent bg-gradient-to-r from-violet-600 via-blue-300 to-emerald-300 bg-clip-text text-transparent text-xl font-light"
        >
          {{ item.badge }}
        </span>
        <h3 class="text-4xl font-bold">
          {{ item.title }}
        </h3>
        <p class="text-muted-foreground text-lg">
          {{ item.description }}
        </p>

        <ul
          v-if="item.advantages?.length"
          class="grid grid-cols-1 gap-3 w-full"
        >
          <li
            v-for="(advantage, index) in item.advantages"
            :key="index"
            class="flex items-center gap-3 text-muted-foreground"
          >
            <Icon
              :name="advantage.icon || 'line-md:confirm-circle'"
              class="text-primary shrink-0"
              size="1.5rem"
            />
            <span class="text-base">{{ advantage.text }}</span>
          </li>
        </ul>
      </div>

      <div class="basis-full lg:basis-1/2 w-full">
        <NuxtImg
          v-if="item.imageSrc"
          :src="item.imageSrc"
          :alt="item.imageAlt"
          class="rounded-2xl max-w-2xl w-full"
        />
        <video
          v-else-if="item.videoSrc"
          :src="item.videoSrc"
          class="rounded-2xl w-full"
          autoplay
          loop
          muted
          playsinline
          preload="metadata"
        />
        <Skeleton
          v-else
          class="rounded-2xl w-full aspect-video"
        />
      </div>
    </Motion>
  </div>
</template>
