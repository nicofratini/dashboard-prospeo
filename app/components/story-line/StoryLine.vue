<script setup lang="ts">
import ImageWithTextSection from './ImageWithTextSection.vue';

interface Item {
  icon: string;
  title: string;
  description: string;
  badge: string;
  imgSrc?: string;
  list: string[];
  date?: string;
  titleLink?: string;
}

interface Props {
  alignment?: 'left' | 'right' | 'center';
  cardAlignmentHorizontal?: boolean;
  items?: Item[];
  imageAspectRatio?: 'video' | 'square' | 'auto';
}

const {
  alignment = 'left',
  cardAlignmentHorizontal = false,
  items = [],
  imageAspectRatio = 'auto',
} = defineProps<Props>();

const alignmentClass = computed(() => {
  switch (alignment) {
    case 'left':
      return 'left-0 !transform !-translate-x-1/2';
    case 'right':
      return 'right-0 !transform !translate-x-1/2';
    default:
      return 'left-1/2 !transform !-translate-x-1/2';
  }
});

const parentAlignmentClass = computed(() => {
  switch (alignment) {
    case 'left':
      return 'left-0 transform -translate-x-1/2';
    case 'right':
      return 'right-0 transform translate-x-1/2';
    default:
      return 'left-1/2 transform -translate-x-1/2';
  }
});
</script>

<template>
  <div class="relative w-full">
    <Motion
      preset="fade"
      :class="['h-full hidden md:block absolute w-0.5 bg-gradient-to-b from-transparent via-emerald-600 to-transparent top-0', parentAlignmentClass]"
      :delay="200"
      :duration="600"
    />
    <!-- <LineWithIcons /> -->
    <div class="flex flex-col justify-start relative">
      <div
        v-for="item in items"
        :key="item.title"
        :class="alignment === 'left' ? 'md:pl-32' : alignment === 'right' ? 'md:pr-32' : null"
        class="flex justify-start relative pt-12 md:pt-24"
      >
        <Motion
          preset="fade"
          :class="alignmentClass"
          :delay="200"
          :duration="600"
          class="top-1/2 justify-center items-center circle w-20 h-20 border-emerald-600 rounded-full hidden md:flex absolute bg-gradient-radial from-emerald-600/10 from-50% to-emerald-600/25 to-90% backdrop-blur-sm"
        >
          <div
            class="circle w-12 h-12 border-emerald-600 rounded-full flex justify-center items-center bg-gradient-radial from-emerald-300/10 from-50% to-emerald-300/25 to-90% backdrop-blur-sm"
          >
            <Icon
              size="2rem"
              :name="item.icon"
              class="text-emerald-600 dark:text-emerald-300 size-8"
            />
          </div>
        </Motion>

        <Motion
          preset="slideVisibleOnceBottom"
          :delay="200"
          :duration="600"
          class="w-full"
        >
          <ImageWithTextSection
            align-content="top"
            :alignment="alignment"
            :img-src="item?.imgSrc"
            :line-behavior="cardAlignmentHorizontal"
            :badge="item.badge"
            :date="item.date"
            :title-link="item.titleLink"
            reversed
            :title="item.title"
            :description="item.description"
            :items-list="item.list"
            :image-aspect-ratio="imageAspectRatio"
          />
        </Motion>
      </div>
    </div>
  </div>
</template>
