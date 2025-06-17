<script setup lang="ts">
import type { BuiltinLanguage } from 'shiki';

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String as PropType<BuiltinLanguage>,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  inGroup: {
    type: Boolean,
    default: false,
  },
  inStack: {
    type: Boolean,
    default: false,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
});

const { boilerplateDocs } = useAppConfig();
const iconMap = new Map(Object.entries(boilerplateDocs.main.codeIcon));
const icon = iconMap.get(props.filename?.toLowerCase()) || iconMap.get(props.language);
</script>

<template>
  <Card
    class="relative overflow-hidden [&:not(:first-child)]:mt-5 [&:not(:last-child)]:mb-5"
    :class="[
      inGroup && 'mb-0 rounded-t-none border-none shadow-none',
      inStack && 'mb-0 rounded-none border-none shadow-none',
    ]"
  >
    <div
      v-if="!inGroup && filename"
      class="flex border-b p-3 font-mono text-sm"
    >
      <Icon
        v-if="icon"
        :name="icon"
        mode="svg"
        size="1rem"
        class="mr-1.5 self-center"
      />
      {{ filename }}
      <CodeCopy
        :code
        class="ml-auto mr-1"
      />
    </div>

    <span
      v-if="!filename"
      class="absolute right-3 top-3 z-10"
    >
      <CodeCopy :code />
    </span>
    <div class="bg-muted/30">
      <ScrollArea>
        <div
          class="overflow-x-auto py-3 px-2 text-sm"
          :class="[!inGroup && !filename && 'inline-copy', !language && 'pl-3', !inGroup]"
        >
          <slot />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  </Card>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.shiki .line.highlight {
  background-color: hsl(var(--muted) / 0.8);
}

.shiki .line {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.inline-copy .line {
  padding-right: 2.75rem;
}
</style>
