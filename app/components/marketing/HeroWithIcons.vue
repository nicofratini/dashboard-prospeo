<script setup lang="ts">
interface IconConfig {
  name: string;
  mobileSize: string;
  desktopSize: string;
  mobilePosition: string;
  desktopPosition: string;
  textColor?: string;
}

const animationDelays: string[] = ['delay-0', 'delay-100', 'delay-200', 'delay-300', 'delay-500', 'delay-0', 'delay-100', 'delay-200', 'delay-300', 'delay-500'];

const icons: IconConfig[] = [
  {
    name: 'logos:supabase-icon',
    mobileSize: 'size-12',
    desktopSize: 'md:size-24',
    mobilePosition: 'top-[15%] left-0',
    desktopPosition: 'md:-top-10 md:left-[30%]',
  },
  {
    name: 'logos:google-analytics',
    mobileSize: 'size-12',
    desktopSize: 'md:size-20',
    mobilePosition: 'top-[25%] left-[17%]',
    desktopPosition: 'md:top-[10%] md:left-[15%]',

  },
  {
    name: 'simple-icons:plausibleanalytics',
    mobileSize: 'size-12',
    desktopSize: 'md:size-16',
    mobilePosition: 'top-[20%] left-[40%]',
    desktopPosition: 'md:top-[40%] md:left-[3%]',
    textColor: 'text-indigo-600',
  },
  {
    name: 'logos:tailwindcss-icon',
    mobileSize: 'size-12',
    desktopSize: 'md:size-24',
    mobilePosition: 'top-[23%] left-[60%]',
    desktopPosition: 'md:top-[65%] md:left-[10%]',
  },
  {
    name: 'logos:nuxt-icon',
    mobileSize: 'size-12',
    desktopSize: 'md:size-28',
    mobilePosition: 'top-[28%] left-[80%]',
    desktopPosition: 'md:top-[85%] md:left-[25%]',
  },
  {
    name: 'simple-icons:shadcnui',
    mobileSize: 'size-12',
    desktopSize: 'md:size-28',
    mobilePosition: 'top-[60%] left-[85%]',
    desktopPosition: 'md:-top-[15%] md:left-[70%]',
    textColor: 'text-black dark:text-white',
  },
  {
    name: 'logos:google-icon',
    mobileSize: 'size-12',
    desktopSize: 'md:size-16',
    mobilePosition: 'top-[70%] left-[65%]',
    desktopPosition: 'md:top-[25%] md:left-[82%]',

  },
  {
    name: 'simple-icons:resend',
    mobileSize: 'size-12',
    desktopSize: 'md:size-24',
    mobilePosition: 'top-[85%] left-[45%]',
    desktopPosition: 'md:top-[45%] md:left-[90%]',
    textColor: 'text-black dark:text-white',
  },
  {
    name: 'simple-icons:lemonsqueezy',
    mobileSize: 'size-12',
    desktopSize: 'md:size-24',
    mobilePosition: 'top-[75%] left-[25%]',
    desktopPosition: 'md:top-[70%] md:left-[80%]',
    textColor: 'text-yellow-500',
  },
  {
    name: 'logos:stripe',
    mobileSize: 'size-12',
    desktopSize: 'md:size-20',
    mobilePosition: 'top-[90%] left-[5%]',
    desktopPosition: 'md:bottom-[35%] md:left-[70%]',
  },
];
</script>

<template>
  <div class="flex flex-col md:flex-row justify-center items-center w-full py-28 md:py-20 my-0 md:my-20 relative">
    <Motion
      preset="popVisibleOnce"
      :duration="700"
      class="text-center text-2xl lg:text-4xl font-bold font-mono md:w-1/3 mb-6 md:mb-0"
    >
      <slot name="title" />
    </Motion>
    <div class="relative md:static min-h-32 w-full md:w-0 md:block">
      <Motion
        v-for="(icon, index) in icons"
        :key="icon.name"
        preset="popVisibleOnce"
        :delay="(index + 1) * 100"
        :duration="700"
        ease="easeOut"
        :class="['absolute', icon.mobilePosition, icon.desktopPosition]"
      >
        <Icon
          :name="icon.name"
          :class="[icon.mobileSize, icon.desktopSize, icon.textColor, 'animate-shake', animationDelays[index]]"
        />
      </Motion>
    </div>
  </div>
</template>
