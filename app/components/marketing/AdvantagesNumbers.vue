<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface AdvantageItem {
  value: string;
  label: string;
  tooltip: string;
}

interface Props {
  items: AdvantageItem[];
}

const props = withDefaults(defineProps<Props & { class?: HTMLAttributes['class'] }>(), {
  items: () => [
    {
      value: '7x',
      label: 'higher lead quality',
      tooltip: 'Based on customer feedback and analytics from the past year',
    },
    {
      value: '42x',
      label: 'faster development',
      tooltip: 'Measured against traditional development approaches',
    },
    {
      value: '300%',
      label: 'increase in productivity',
      tooltip: 'Average improvement reported by our enterprise customers',
    },
  ],
});
</script>

<template>
  <div :class="cn('w-full flex flex-col lg:flex-row items-center justify-between px-6 md:px-24 my-12', props.class)">
    <div
      v-for="item in items"
      :key="item.value"
      class="flex flex-col justify-center items-center my-12 lg:my-0 space-y-2"
    >
      <span class="text-6xl font-bold">{{ item.value }}</span>
      <span class="text-xl font-bold flex items-center cursor-pointer">
        {{ item.label }}
        <TooltipProvider :delay-duration="30">
          <Tooltip>
            <TooltipTrigger as-child>
              <Icon
                name="mdi:information-outline"
                class="ml-1"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p class="max-w-md text-center">{{ item.tooltip }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </div>
  </div>
</template>
