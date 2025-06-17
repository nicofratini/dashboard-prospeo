<script setup lang="ts">
interface Config {
  aspectRatio: string;
  style: string;
  negativePrompt?: string;
  model?: string;
}

defineProps<{
  prompt: string;
  config: Config;
  createdAt: Date;
  images: string[];
  availableModels: Array<{ value: string; label: string }>;
}>();

const emit = defineEmits<{
  upscale: [image: string];
  remix: [image: string];
  vary: [image: string];
}>();
</script>

<template>
  <div class="p-4">
    <div class="flex flex-row gap-4">
      <div class="max-h-52 w-full max-w-64 flex flex-col gap-2">
        <p class="text-sm text-muted-foreground line-clamp-6">
          {{ prompt }}
        </p>

        <!-- Prompt configuration badges -->
        <div class="flex flex-wrap gap-2 mt-2">
          <Badge
            class="cursor-default flex items-center"
            variant="secondary"
          >
            <Icon
              name="mdi:aspect-ratio"
              class="size-3.5 mr-1"
            />
            <span>{{ config.aspectRatio }}</span>
          </Badge>
          <Badge
            class="cursor-default flex items-center"
            variant="secondary"
          >
            <Icon
              name="mdi:palette-outline"
              class="size-3.5 mr-1"
            />
            <span>Style: {{ config.style }}</span>
          </Badge>
          <Badge
            v-if="config.model"
            class="cursor-default flex items-center"
            variant="secondary"
          >
            <Icon
              name="mdi:brain"
              class="size-3.5 mr-1"
            />
            <span>{{ availableModels.find(m => m.value === config.model)?.label.split(' - ')[0] || config.model.split('/').pop() }}</span>
          </Badge>
          <Badge
            class="cursor-default flex items-center"
            variant="secondary"
          >
            <Icon
              name="mdi:clock-outline"
              class="size-3.5 mr-1"
            />
            <span>{{ new Date(createdAt).toLocaleTimeString() }}</span>
          </Badge>
          <Badge
            v-if="config.negativePrompt"
            class="cursor-default flex items-center"
            variant="secondary"
          >
            <Icon
              name="mdi:minus-circle-outline"
              class="size-3.5 mr-1"
            />
            <span>Negative prompt</span>
          </Badge>
          <Badge
            class="cursor-default flex items-center"
            variant="secondary"
          >
            <Icon
              name="mdi:image-multiple-outline"
              class="size-3.5 mr-1"
            />
            <span>{{ images.length }} image{{ images.length !== 1 ? 's' : '' }}</span>
          </Badge>
          <Badge
            class="cursor-default flex items-center"
            variant="secondary"
          >
            <Icon
              name="mdi:high-definition"
              class="size-3.5 mr-1"
            />
            <span>HD</span>
          </Badge>
        </div>
      </div>

      <!-- Gallery for this prompt result -->
      <div class="flex-1">
        <ExpandableGallery
          :images="images"
          :prompt="prompt"
          :config="config"
          :created-at="createdAt"
          :model-label="availableModels.find(m => m.value === config.model)?.label.split(' - ')[0] || config.model?.split('/').pop()"
          class="grid-cols-4"
          @upscale="emit('upscale', $event)"
          @remix="emit('remix', $event)"
          @vary="emit('vary', $event)"
        />
      </div>
    </div>
  </div>
</template>
