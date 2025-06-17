<script setup lang="ts">
defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  dismiss: [];
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
    <Icon
      name="mdi:alert-circle-outline"
      class="size-8 text-destructive mb-2"
    />
    <h3 class="text-base font-medium mb-1 text-destructive">
      Generation Failed
    </h3>
    <p class="text-sm text-destructive/80 text-center">
      {{ message }}
    </p>
    <Button
      variant="destructive"
      size="sm"
      class="mt-3"
      @click="emit('dismiss')"
    >
      Dismiss
    </Button>
  </div>
</template>
