<template>
  <div class="[&:not(:first-child)]:mt-4 [&:not(:first-child)]:pt-4">
    <div class="mb-2">
      <div class="flex items-center gap-2">
        <span class="text-md font-bold text-primary">
          {{ name }}
        </span>
        <span
          v-if="required"
          class="font-mono text-sm text-muted-foreground"
        >
          {{ fieldRequiredText }}
        </span>
        <span class="ml-auto font-mono text-sm text-muted-foreground">
          {{ type }}
        </span>
      </div>
      <div
        v-if="defaultValue"
        class="text-muted-foreground"
      >
        <ProseCodeInline>
          {{ defaultValue }}
        </ProseCodeInline>
      </div>
    </div>
    <span class="text-sm text-muted-foreground">
      <slot
        name="description"
        mdc-unwrap="p"
      />
      {{ description }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  type?: string;
  required?: boolean;
  description?: string;
  defaultValue?: string;
}>();

const { fieldRequiredText } = useAppConfig().boilerplateDocs.main;
</script>
