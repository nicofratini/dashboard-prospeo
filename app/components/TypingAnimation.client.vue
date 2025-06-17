<script setup lang='ts'>
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  text: string;
  duration?: number;
  class?: string;
}

const props = withDefaults(defineProps<TypingAnimationProps>(), {
  duration: 300,
});

const displayedText = ref('');
const i = ref(0);

function handleTypingEffect(d: number, n: number) {
  const typingEffect = setInterval(() => {
    if (n < props.text.length) {
      displayedText.value = props.text.substring(0, n + 1);
      n = n + 1;
    }
    else {
      clearInterval(typingEffect);
    }
  }, d);

  return () => {
    clearInterval(typingEffect);
  };
}

watch(() => [props.duration, i.value], ([d, n]) => {
  handleTypingEffect(d as number, n as number);
}, {
  deep: true,
  immediate: true,
});

const className = cn(
  'font-accent font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm',
  props.class,
);
</script>

<template>
  <span :class="className">
    {{ displayedText ? displayedText : props.text }}
  </span>
</template>
