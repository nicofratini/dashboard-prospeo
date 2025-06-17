<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { NuxtImg } from '#components';
import { cn } from '@/lib/utils';

export type SocialLink = {
  platform: 'x' | 'linkedin' | 'github' | 'instagram' | 'youtube' | 'facebook';// may be extended if needed. Is used in app config.
  url: string;
  icon?: string;
};

type TestimonialProps = {
  class?: HTMLAttributes['class'];
  avatar: string;
  name: string;
  details: string;
  description: string;
  variant?: 'centered' | 'compact' | 'featured' | 'horizontal';
  shape?: 'circle' | 'square';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  socialLinks?: SocialLink[];
};

const props = withDefaults(defineProps<TestimonialProps>(), {
  variant: 'centered',
  shape: 'circle',
  size: 'md',
  socialLinks: () => [] as SocialLink[],
});

const finalSocialLinks = computed(() =>
  props.socialLinks?.length ? props.socialLinks : useAppConfig().socialLinks,
);

// Social icon mapping with defaults
const socialIcons = {
  x: 'simple-icons:x',
  linkedin: 'simple-icons:linkedin',
  github: 'simple-icons:github',
  instagram: 'simple-icons:instagram',
  youtube: 'simple-icons:youtube',
  facebook: 'simple-icons:facebook',
};

const variants = {
  centered: 'flex flex-col items-center justify-center gap-4',
  compact: 'flex flex-col items-center gap-2 my-8',
  featured: 'flex flex-col items-center justify-center gap-6 bg-muted p-8 rounded-lg md:p-16',
  horizontal: 'flex flex-row items-start justify-center gap-8',
};

const sizeClasses = {
  'sm': 'size-16',
  'md': 'size-24',
  'lg': 'size-32',
  'xl': 'size-40',
  '2xl': 'size-48',
  '3xl': 'size-56',
  '4xl': 'size-64',
};
</script>

<template>
  <div :class="cn(variants[props.variant], props.class)">
    <div :class="['flex justify-center items-center', props.variant === 'horizontal' && 'shrink-0 self-center']">
      <Avatar
        :shape="props.shape"
        :class="sizeClasses[props.size]"
      >
        <AvatarImage
          :src="props.avatar"
          loading="lazy"
          format="webp"
          :as="NuxtImg"
        />
        <AvatarFallback>{{ props.name }}</AvatarFallback>
      </Avatar>
    </div>

    <div
      :class="[
        'flex flex-col justify-center',
        props.variant === 'horizontal' ? 'gap-2 items-start' : 'gap-4 w-full items-center',
      ]"
    >
      <h2
        class="text-xl font-semibold truncate"
        :class="props.variant === 'featured' || props.variant === 'centered' ? 'text-center' : ''"
      >
        {{ props.name }}<br>
        <span class="font-normal text-muted-foreground">{{ props.details }}</span>
      </h2>

      <div
        v-if="props.variant === 'horizontal'"
        class="flex justify-start items-center"
      >
        <Icon
          name="mdi:format-quote-open"
          size="2rem"
        />
      </div>

      <p
        :class="[
          'max-w-xl font-mono text-sm',
          props.variant === 'horizontal' ? 'text-left max-w-3xl' : 'text-center',
          props.variant === 'compact' ? 'md:text-sm' : 'md:text-base',
        ]"
      >
        "{{ props.description }}"
      </p>

      <div
        v-if="finalSocialLinks.length"
        class="flex flex-row justify-center items-center gap-3"
      >
        <NuxtLink
          v-for="link in finalSocialLinks"
          :key="link.platform"
          :to="link.url"
          target="_blank"
        >
          <Icon
            :name="link?.icon || socialIcons[link.platform]"
            class="hover:text-primary text-muted-foreground transition-colors"
            size="1.5rem"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
