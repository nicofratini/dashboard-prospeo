<script setup lang="ts">
import type { TestimonialProps } from './Testimonial.vue';

interface Props {
  testimonials: TestimonialProps[];
  variant?: 'centered' | 'compact' | 'featured' | 'horizontal';
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <Testimonial
      v-for="(testimonial, index) in testimonials"
      :key="index"
      v-bind="testimonial"
      :variant="variant"
      :avatar="testimonial.avatar"
    />
  </div>
</template>
