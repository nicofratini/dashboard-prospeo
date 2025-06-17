<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface FaqItem {
  value: string;
  title: string;
  content: string;
}

interface Props {
  class?: HTMLAttributes['class'];
  type?: 'horizontal' | 'vertical';
  title?: string;
  description?: string;
  items?: FaqItem[];
}

const props = withDefaults(defineProps<Props>(), {
  type: 'horizontal',
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about product and services.',
  items: () => [],
});
</script>

<template>
  <div
    v-if="items.length"
    :class="cn('flex flex-col lg:flex-row my-12 gap-6', props.type === 'horizontal' ? 'lg:flex-row' : 'lg:flex-col', props.class)"
  >
    <div class="flex flex-col justify-start items-start basis-1/2 gap-y-4">
      <h3 class="font-bold text-4xl">
        {{ title }}
      </h3>
      <p class="text-lg text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <div class="w-full basis-1/2">
      <Accordion
        type="single"
        class="w-full"
        collapsible
      >
        <AccordionItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
        >
          <AccordionTrigger class="text-start">
            {{ item.title }}
          </AccordionTrigger>
          <AccordionContent>
            {{ item.content }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
</template>
