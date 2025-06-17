<script setup lang="ts">
const slots = useSlots();

type HeroBadgeProps = {
  text?: string;
  icon?: string;
  iconClass?: string;
  show?: boolean;
};

type HeroProps = {
  badge?: HeroBadgeProps;
};

defineProps<HeroProps>();
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center px-6 duration-1000 animate-in fade-in zoom-in-90 slide-in-from-top-36">
    <div class="max-w-3xl w-full flex flex-col justify-center items-center">
      <Badge
        v-if="badge?.text && badge?.icon"
        variant="outline"
        class="text-lg px-2 border-amber-500/50 font-normal mb-4 text-muted-foreground bg-muted/30 delay-300 duration-700 animate-in fade-in fill-mode-both whitespace-nowrap overflow-hidden text-ellipsis"
      >
        <Icon
          :name="badge.icon || 'line-md:star-alt-filled'"
          mode="svg"
          size="1.2rem"
          class="mr-1 text-yellow-500"
        />
        {{ badge.text }}
      </Badge>

      <h1
        class="text-5xl md:text-6xl font-semibold text-foreground mx-auto transition-transform delay-500 duration-700 animate-in fade-in zoom-in-95 fill-mode-both"
      >
        <slot name="title" />
      </h1>
      <p class="mt-6 md:mt-10 text-lg text-muted-foreground tracking-wide max-w-2xl space-y-8 transition-transform delay-700 duration-700 animate-in fade-in zoom-in-95 fill-mode-both">
        <slot name="description" />
      </p>
      <div
        v-if="slots.buttons"
        class="space-x-4 mt-6 md:mt-12 w-full delay-1000 transition-transform duration-700 animate-in fade-in zoom-in-95 fill-mode-both"
      >
        <div class="flex flex-col lg:flex-row justify-center items-center gap-4 md:gap-6">
          <slot name="buttons" />
        </div>
      </div>

      <div class="delay-1200 duration-700 animate-in fade-in zoom-in-95 fill-mode-both">
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>
