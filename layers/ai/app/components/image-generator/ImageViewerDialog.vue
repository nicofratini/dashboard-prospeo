<script setup lang="ts">
const open = defineModel<boolean>('open');

interface Props {
  image: string;
  prompt: string;
  config: {
    aspectRatio: string;
    style: string;
    negativePrompt?: string;
    model?: string;
  };
  createdAt: Date;
  modelLabel?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  upscale: [];
  remix: [];
  vary: [];
}>();

function closeDialog() {
  open.value = false;
}

function handleUpscale() {
  emit('upscale');
  closeDialog();
}

function handleRemix() {
  emit('remix');
  closeDialog();
}

function handleVary() {
  emit('vary');
  closeDialog();
}

// Context menu handlers using the auto-imported utility functions
async function handleCopyImage() {
  try {
    await copyImageToClipboard(props.image);
  }
  catch (error) {
    console.error('Error in handleCopyImage:', error);
  }
}

async function handleCopyImageUrl() {
  try {
    await copyImageUrl(props.image);
  }
  catch (error) {
    console.error('Error in handleCopyImageUrl:', error);
  }
}
</script>

<template>
  <Dialog
    :open="open"
    @update:open="open = $event"
  >
    <DialogContent
      class="flex flex-col md:flex-row max-w-7xl w-[95vw] h-[95vh] p-0 gap-0 overflow-hidden"
    >
      <!-- Image Section (Left/Main) with Context Menu -->
      <div class="relative flex-1 bg-black flex items-center justify-center h-full max-h-[70vh] md:max-h-full overflow-hidden">
        <ContextMenu>
          <ContextMenuTrigger class="h-full w-full flex items-center justify-center">
            <NuxtImg
              :src="image"
              :alt="prompt"
              class="h-full w-full object-contain"
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem @click="handleCopyImage">
              <Icon
                name="mdi:content-copy"
                class="mr-2 size-4"
              />
              Copy Image
            </ContextMenuItem>
            <ContextMenuItem>
              <a
                class="flex items-center w-full"
              >
                <Icon
                  name="mdi:download"
                  class="mr-2 size-4"
                />
                Download(disabled)
              </a>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Icon
                name="mdi:link"
                class="mr-2 size-4"
              />
              Copy Image URL(disabled)
            </ContextMenuItem>
            <ContextMenuItem @click="navigateTo(props.image, { external: true })">
              <Icon
                name="mdi:open-in-new"
                class="mr-2 size-4"
              />
              Open in New Tab
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      <!-- Info Panel (Right) -->
      <div class="w-full md:w-80 p-6 flex flex-col h-full bg-muted/10 border-l overflow-y-auto">
        <h3 class="text-lg font-medium mb-4">
          Image Details
        </h3>

        <!-- Prompt -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-muted-foreground mb-2">
            Prompt
          </h4>
          <p class="text-sm">
            {{ prompt }}
          </p>
        </div>

        <!-- Badges -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-muted-foreground mb-2">
            Properties
          </h4>
          <div class="flex flex-wrap gap-2">
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
              <span>{{ modelLabel || config.model.split('/').pop() }}</span>
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
                name="mdi:high-definition"
                class="size-3.5 mr-1"
              />
              <span>HD</span>
            </Badge>
          </div>
        </div>

        <!-- Negative Prompt -->
        <div
          v-if="config.negativePrompt"
          class="mb-6"
        >
          <h4 class="text-sm font-medium text-muted-foreground mb-2">
            Negative Prompt
          </h4>
          <p class="text-sm text-muted-foreground">
            {{ config.negativePrompt }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-auto pt-4 space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground mb-2">
            Actions
          </h4>

          <TooltipProvider>
            <div class="grid grid-cols-1 gap-3">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    class="w-full justify-start"
                    @click="handleUpscale"
                  >
                    <Icon
                      name="mdi:arrow-expand"
                      class="mr-2 size-4"
                    />
                    Upscale
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enhance resolution and details</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    class="w-full justify-start"
                    @click="handleRemix"
                  >
                    <Icon
                      name="mdi:refresh"
                      class="mr-2 size-4"
                    />
                    Remix
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a new version with modified prompt</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    class="w-full justify-start"
                    @click="handleVary"
                  >
                    <Icon
                      name="mdi:image-multiple-outline"
                      class="mr-2 size-4"
                    />
                    Vary
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate variations of this image</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    variant="outline"
                    class="w-full justify-start"
                    @click="closeDialog"
                  >
                    <Icon
                      name="mdi:close"
                      class="mr-2 size-4"
                    />
                    Close
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close this dialog</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
