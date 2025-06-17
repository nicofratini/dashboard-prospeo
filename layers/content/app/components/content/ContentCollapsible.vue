<script setup lang="ts">
const { variant = 'simple' } = defineProps<{
  variant?: 'simple' | 'card';
  title?: string;
}>();
const isOpen = ref(false);

defineSlots<{
  title?: () => string;
  content?: () => string;
}>();
</script>

<template>
  <Collapsible
    v-if="variant === 'card'"
    v-model:open="isOpen"
    class="space-y-2"
  >
    <div class="flex items-center justify-between space-x-4">
      <h4 class="text-sm font-semibold">
        <slot
          name="title"
          mdc-unwrap="p"
        />
        {{ title }}
      </h4>
      <CollapsibleTrigger as-child>
        <Button
          variant="ghost"
          size="sm"
          class="w-9 p-0"
        >
          <Icon name="mdi:chevron-up-down" />
          <span class="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>

    <CollapsibleContent class="space-y-2">
      <div class="rounded-md border px-4 py-3 font-mono text-sm">
        <slot
          name="content"
          mdc-unwrap="p"
        />
        <slot mdc-unwrap="p" />
      </div>
    </CollapsibleContent>
  </Collapsible>

  <Collapsible
    v-else-if="variant === 'simple'"
    v-model:open="isOpen"
  >
    <CollapsibleTrigger class="w-full text-left">
      <div class="flex w-full gap-1">
        <Icon
          name="mdi:chevron-down"
          class="self-center transition-all"
          :class="[!isOpen && '-rotate-90']"
        />
        <span>
          <slot
            name="title"
            mdc-unwrap="p"
          />

        </span>
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="ml-2 border-l py-2 pl-4">
        <slot
          name="content"
          mdc-unwrap="p"
        />
        <slot
          mdc-unwrap="p"
        />
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
