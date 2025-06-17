<script setup lang="ts">
interface Props {
  text: string;
  highlight: string;
}

const props = defineProps<Props>();

const segments = computed(() => {
  if (!props.highlight)
    return [{ text: props.text, isMatch: false }];

  const parts = [];
  const lowerText = props.text.toLowerCase();
  const lowerHighlight = props.highlight.toLowerCase();
  let lastIndex = 0;

  let index = lowerText.indexOf(lowerHighlight, lastIndex);

  while (index !== -1) {
    if (index > lastIndex)
      parts.push({ text: props.text.slice(lastIndex, index), isMatch: false });

    parts.push({
      text: props.text.slice(index, index + props.highlight.length),
      isMatch: true,
    });

    lastIndex = index + props.highlight.length;
    index = lowerText.indexOf(lowerHighlight, lastIndex);
  }

  if (lastIndex < props.text.length)
    parts.push({ text: props.text.slice(lastIndex), isMatch: false });

  return parts;
});
</script>

<template>
  <span>
    <template
      v-for="(segment, index) in segments"
      :key="index"
    >
      <span :class="{ 'font-semibold underline': segment.isMatch }">
        {{ segment.text }}
      </span>
    </template>
  </span>
</template>
