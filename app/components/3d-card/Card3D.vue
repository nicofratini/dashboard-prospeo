<template>
  <ClientOnly>
    <CardContainer v-if="image?.src">
      <CardBody
        class="group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 w-full dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]"
      >
        <CardItem
          :translate-z="50"
          class="text-xl font-bold text-foreground"
        >
          {{ title }}
        </CardItem>
        <CardItem
          as="p"
          translate-z="60"
          class="mt-2 max-w-sm text-sm text-muted-foreground"
        >
          {{ description }}
        </CardItem>
        <CardItem
          :translate-z="100"
          class="mt-4 w-full"
        >
          <NuxtImg
            :src="image.src"
            :height="image.height"
            :width="image.width"
            :loading="image.loading"
            :alt="image.alt"
            class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
          />
        </CardItem>
        <div class="mt-20 flex items-center justify-between">
          <CardItem
            :translate-z="20"
            class="text-xs font-normal text-foreground"
          >
            <NuxtLink
              v-if="primaryLink"
              :to="primaryLink.to"
            >
              {{ primaryLink.text }} →
            </NuxtLink>
          </CardItem>
          <CardItem :translate-z="20">
            <Button
              v-if="secondaryButton"
              as-child
              class="rounded-xl"
            >
              <NuxtLink :to="secondaryButton.to">
                {{ secondaryButton.text }}
              </NuxtLink>
            </Button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  </ClientOnly>
</template>

<script setup lang="ts">
interface ImageProps {
  src: string;
  height: number;
  width: number;
  loading?: 'lazy' | 'eager';
  alt: string;
}

interface LinkProps {
  to: string;
  text: string;
}

interface ButtonProps {
  to: string;
  text: string;
  onClick?: () => void;
}

interface Card3DProps {
  title: string;
  description: string;
  image: ImageProps;
  primaryLink?: LinkProps;
  secondaryButton?: ButtonProps;
}

// Default values for optional props
withDefaults(defineProps<Card3DProps>(), {
  primaryLink: undefined,
  secondaryButton: undefined,
});
</script>
