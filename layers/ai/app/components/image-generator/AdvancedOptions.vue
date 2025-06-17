<script setup lang="ts">
// Define models for each v-model binding
const numberOfImages = defineModel<string>('numberOfImages');
const aspectRatio = defineModel<string>('aspectRatio');
const imageStyle = defineModel<string>('imageStyle');
const negativePrompt = defineModel<string>('negativePrompt');
const selectedModel = defineModel<string>('selectedModel');

// Props that don't need two-way binding
defineProps<{
  availableImageCounts: Array<{ value: string; label: string }>;
  availableAspectRatios: Array<{ value: string; label: string }>;
  availableStyles: Array<{ value: string; label: string }>;
  availableModels: Array<{ value: string; label: string }>;
}>();
</script>

<template>
  <Collapsible
    as-child
    class="group/collapsible"
  >
    <div class="border-t pt-4 mt-4">
      <CollapsibleTrigger as-child>
        <Button
          variant="ghost"
          size="sm"
          class="flex items-center gap-1 w-full justify-between"
        >
          <div class="flex items-center gap-2">
            <Icon
              name="mdi:tune"
              class="size-4 shrink-0"
            />
            <span>Advanced Options</span>
          </div>
          <Icon
            name="mdi:chevron-right"
            class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div class="space-y-4 py-4 px-1">
          <div class="grid grid-cols-1 gap-4">
            <!-- Number of Images -->
            <div class="space-y-2">
              <Label for="number-of-images">Number of Images</Label>
              <Select
                id="number-of-images"
                v-model="numberOfImages"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of images" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="count in availableImageCounts"
                    :key="count.value"
                    :value="count.value"
                  >
                    {{ count.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">
                Generate multiple variations at once
              </p>
            </div>

            <!-- Aspect Ratio -->
            <div class="space-y-2">
              <Label for="image-aspect-ratio">Aspect Ratio</Label>
              <Select
                id="image-aspect-ratio"
                v-model="aspectRatio"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="ratio in availableAspectRatios"
                    :key="ratio.value"
                    :value="ratio.value"
                  >
                    {{ ratio.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Image Style -->
            <div class="space-y-2">
              <Label for="image-style">Style</Label>
              <Select
                id="image-style"
                v-model="imageStyle"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="style in availableStyles"
                    :key="style.value"
                    :value="style.value"
                  >
                    {{ style.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Model Selection -->
            <div class="space-y-2">
              <Label for="model-selection">Model</Label>
              <Select
                id="model-selection"
                v-model="selectedModel"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="model in availableModels"
                    :key="model.value"
                    :value="model.value"
                    :disabled="model.value !== 'bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637'"
                  >
                    {{ model.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Negative Prompt -->
            <div class="space-y-2">
              <Label for="negative-prompt">Negative Prompt</Label>
              <Textarea
                id="negative-prompt"
                v-model="negativePrompt"
                placeholder="Enter terms to exclude from the generation"
                rows="3"
              />
              <p class="text-xs text-muted-foreground">
                Specify what you don't want to see in the generated images
              </p>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </div>
  </Collapsible>
</template>
