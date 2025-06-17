<script setup lang="ts">
interface ImageWithTextSectionProps {
  reversed?: boolean;
  imgSrc?: string;
  titleLink?: string;
  badge?: string;
  headline?: string;
  date?: string;
  title: string;
  description: string;
  itemsList?: string[];
  lineBehavior?: boolean;
  alignContent?: 'top' | 'center' | 'bottom';
  alignment?: 'left' | 'center' | 'right';
  imageAspectRatio?: 'video' | 'square' | 'auto';
}

const {
  reversed = false,
  lineBehavior = false,
  alignContent = 'center',
  alignment = 'left',
  badge,
  date,
  itemsList,
  imageAspectRatio = 'auto',
} = defineProps<ImageWithTextSectionProps>();

const setAlignContent = computed(() => {
  const alignmentMap = {
    top: 'items-start',
    bottom: 'items-end',
    center: 'items-center',
  } as const;

  return alignmentMap[alignContent];
});

const containerClasses = computed(() => [
  'flex w-full flex-col gap-6 md:flex-row md:justify-between md:items-center',
  lineBehavior ? 'md:flex-raw' : 'md:flex-col',
  reversed ? 'md:flex-row-reverse' : 'md:flex-row',
  alignment === 'center' ? 'md:gap-20' : 'md:gap-6',
  setAlignContent.value,
]);

const hasMetadata = computed(() => Boolean(badge || date));
const showContent = computed(() => Boolean(badge || description || itemsList));
</script>

<template>
  <div
    :class="containerClasses"
  >
    <!-- Image Section -->
    <div class="md:block md:basis-1/2 md:self-start">
      <NuxtLink
        v-if="titleLink"
        :to="titleLink"
      >
        <NuxtImg
          v-if="imgSrc"
          :src="imgSrc"
          :alt="title"
          :class="[
            {
              'aspect-video': imageAspectRatio === 'video',
              'aspect-square': imageAspectRatio === 'square',
              'aspect-auto': imageAspectRatio === 'auto',
            },
            'rounded-lg w-full hover:scale-[102%] transition-all duration-300',
          ]"
          loading="lazy"
          placeholder
        />
      </NuxtLink>
      <NuxtImg
        v-else-if="imgSrc"
        :src="imgSrc"
        :alt="title"
        :class="[
          {
            'aspect-video': imageAspectRatio === 'video',
            'aspect-square': imageAspectRatio === 'square',
            'aspect-auto': imageAspectRatio === 'auto',
          },
          'rounded-lg w-full hover:scale-[102%] transition-all duration-300',
        ]"
        loading="lazy"
        placeholder
      />
    </div>

    <!-- Content Section -->
    <div
      v-if="showContent"
      class="flex w-full flex-col items-start justify-start gap-4 md:basis-1/2"
    >
      <!-- Metadata Section -->
      <div
        v-if="hasMetadata"
        class="flex flex-row items-center gap-2"
      >
        <!-- Badge -->
        <Badge
          v-if="badge"
          variant="outline"
          class="bg-gradient-to-r from-violet-600 via-blue-300 to-emerald-300 bg-clip-text border-indigo-700 text-transparent font-medium font-accent"
        >
          {{ badge }}
        </Badge>

        <!-- Separator -->
        <span
          v-if="badge && date"
          class="text-sm text-muted-foreground"
          aria-hidden="true"
        >
          •
        </span>

        <!-- Date -->
        <time
          v-if="date"
          :datetime="date"
          class="text-sm text-muted-foreground"
        >
          {{ date }}
        </time>
      </div>

      <!-- Title -->

      <Button
        v-if="titleLink"
        variant="link"
        class="text-2xl md:text-4xl font-bold p-0"
        as-child
      >
        <NuxtLink :to="titleLink">
          {{ title }}
        </NuxtLink>
      </Button>
      <template v-else>
        <h3 class="text-2xl md:text-4xl font-bold">
          {{ title }}
        </h3>
      </template>

      <!-- Description -->
      <p class="text-sm md:text-base text-muted-foreground">
        {{ description }}
      </p>

      <!-- List Items -->
      <ul
        v-if="itemsList?.length"
        class="mt-3 flex flex-col gap-2"
      >
        <li
          v-for="(item, i) in itemsList"
          :key="i"
          class="flex items-start justify-start text-sm md:text-base"
        >
          <Icon
            name="mdi:check"
            class="mr-2 text-emerald-500 shrink-0"
            size="24px"
          />
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
