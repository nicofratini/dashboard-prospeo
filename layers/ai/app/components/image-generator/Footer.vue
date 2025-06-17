<script setup lang="ts">
defineProps<{
  isGenerating: boolean;
  isDisabled: boolean;
}>();

const emit = defineEmits<{
  generate: [];
}>();
</script>

<template>
  <SidebarFooter class="p-4">
    <Button
      class="w-full"
      size="lg"
      :disabled="isDisabled"
      @click="emit('generate')"
    >
      <Icon
        v-if="isGenerating"
        name="svg-spinners:pulse-rings-multiple"
        class="mr-2 size-4"
      />
      <span>{{ isGenerating ? 'Creating...' : 'Generate Image' }}</span>
    </Button>

    <p class="text-xs text-muted-foreground text-center mt-2">
      Images are generated using AI and may take a few moments to create
    </p>
  </SidebarFooter>
</template>
