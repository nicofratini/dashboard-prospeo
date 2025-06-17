<script setup lang="ts">
import { useId } from 'reka-ui';

defineProps<{
  value?: string;
  title?: string;
  content?: string;
}>();

defineSlots<{
  title?: () => string;
  content?: () => string;
}>();

const autoValue = useId();
</script>

<template>
  <AccordionItem :value="value ?? autoValue">
    <AccordionTrigger>
      <slot
        mdc-unwrap="p"
        name="title"
      />
      {{ title }}
    </AccordionTrigger>
    <AccordionContent>
      <slot
        mdc-unwrap="p"
        name="content"
      />
      {{ content }}
    </AccordionContent>
  </AccordionItem>
</template>
