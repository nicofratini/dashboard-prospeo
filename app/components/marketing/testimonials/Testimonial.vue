<script setup lang="ts">
import { cn } from '~/lib/utils';
import { NuxtImg } from '#components';

export interface TestimonialProps {
  avatar: string;
  name: string;
  details: string;
  description: string;
  variant?: 'centered' | 'compact' | 'featured' | 'horizontal';
  shape?: 'circle' | 'square';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const props = withDefaults(defineProps<TestimonialProps>(), {
  variant: 'centered',
  shape: 'circle',
  size: 'md',
});

const variants = {
  centered: 'flex flex-col items-center justify-center gap-4 my-24',
  compact: 'flex flex-col items-center gap-2 my-8',
  featured: 'flex flex-col items-center justify-center gap-6 my-24 bg-muted p-8 rounded-lg',
  horizontal: 'flex flex-row items-start justify-center gap-8 my-12',
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
  <div :class="variants[props.variant]">
    <div :class="cn('flex justify-center items-center', props.variant === 'horizontal' && 'shrink-0 self-center')">
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
      :class="cn(
        'flex flex-col',
        props.variant === 'horizontal' ? 'gap-2 justify-center items-start' : 'gap-4 w-full justify-center items-center',
      )"
    >
      <h2 class="text-lg font-medium truncate">
        {{ props.name }}, <span class="font-normal text-muted-foreground">{{ props.details }}</span>
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
        :class="cn(
          'max-w-xl',
          props.variant === 'horizontal' ? 'text-left' : 'text-center',
          props.variant === 'compact' ? 'text-sm' : 'text-base',
        )"
      >
        "{{ props.description }}"
      </p>
    </div>
  </div>
</template>
