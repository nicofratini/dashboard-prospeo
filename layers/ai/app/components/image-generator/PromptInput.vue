<script setup lang="ts">
const imagePrompt = defineModel<string>('imagePrompt');

defineProps<{
  examplePrompts: string[];
}>();

const emit = defineEmits<{
  'use-example': [prompt: string];
}>();

function useExamplePrompt(prompt: string) {
  emit('use-example', prompt);
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col space-y-2">
      <Label
        for="image-prompt"
        class="text-lg font-medium"
      >Describe your image</Label>
      <Textarea
        id="image-prompt"
        v-model="imagePrompt"
        placeholder="A serene landscape with mountains, a lake, and a colorful sunset..."
        class="min-h-24 resize-none"
      />
    </div>

    <div class="flex flex-wrap gap-2">
      <Badge
        v-for="(prompt, index) in examplePrompts.slice(0, 3)"
        :key="index"
        variant="outline"
        class="cursor-pointer hover:bg-muted transition-colors max-w-[200px]"
        @click="useExamplePrompt(prompt)"
      >
        <span class="truncate block">{{ prompt }}</span>
      </Badge>
      <Popover>
        <PopoverTrigger as-child>
          <Badge
            variant="outline"
            class="cursor-pointer hover:bg-muted transition-colors"
          >
            More examples...
          </Badge>
        </PopoverTrigger>
        <PopoverContent class="w-80">
          <div class="space-y-2">
            <h3 class="font-medium">
              Example Prompts
            </h3>
            <div class="space-y-1">
              <Button
                v-for="(prompt, index) in examplePrompts"
                :key="index"
                variant="ghost"
                class="justify-start h-auto py-1 px-2 text-left text-sm w-full"
                @click="useExamplePrompt(prompt)"
              >
                <span class="truncate block w-full">{{ prompt }}</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
