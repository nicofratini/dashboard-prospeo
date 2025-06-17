<script setup lang="ts">
import Autoplay from 'embla-carousel-autoplay';

const plugin = Autoplay({
  delay: 3000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
});

const { items = [] } = defineProps<{
  items?: Array<{
    src: string;
    alt: string;
  }>;
}>();
</script>

<template>
  <Carousel
    v-if="items.length"
    :plugins="[plugin]"
    class="relative w-full max-w-full"
    @mouseenter="plugin.stop"
    @mouseleave="[plugin.reset(), plugin.play()];"
  >
    <CarouselContent>
      <CarouselItem
        v-for="(item, index) in items"
        :key="index"
      >
        <AspectRatio :ratio="16 / 9">
          <NuxtImg
            :src="item.src"
            :alt="item.alt"
            class="rounded-2xl object-cover size-full"
            loading="lazy"
          />
        </AspectRatio>
      </CarouselItem>
    </CarouselContent>
  </Carousel>
</template>
