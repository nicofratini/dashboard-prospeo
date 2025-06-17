<script setup lang="ts">
interface DirectoryTag {
  id: string;
  name: string;
}

interface Props {
  tags: DirectoryTag[];
  selectedTagIds: string[];
  onChange: (ids: string[]) => void;
}

const props = defineProps<Props>();

// Local state
const searchQuery = ref('');

// Filtered tags
const filteredTags = computed<DirectoryTag[]>(() => {
  if (!searchQuery.value) return props.tags;
  return props.tags.filter((tag: DirectoryTag) =>
    tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// Display helper
function getDisplayText(tagIds: string[]): string {
  if (!tagIds.length) return 'Select tags';

  const selectedNames = props.tags
    .filter(tag => tagIds.includes(tag.id))
    .map(tag => tag.name);

  if (selectedNames.length <= 2) {
    return selectedNames.join(', ');
  }

  return `${selectedNames.length} tags selected`;
}

// Reset search on open/close
function handlePopoverChange(isOpen: boolean) {
  if (isOpen) {
    searchQuery.value = '';
  }
}

// Toggle selection
function toggleTag(tagId: string) {
  const newTagIds = [...props.selectedTagIds];
  const index = newTagIds.indexOf(tagId);

  if (index === -1) {
    newTagIds.push(tagId);
  }
  else {
    newTagIds.splice(index, 1);
  }

  props.onChange(newTagIds);
}
</script>

<template>
  <FormField
    name="tagIds"
    :validate-on-input="true"
    :validate-on-blur="false"
  >
    <FormItem v-auto-animate>
      <FormLabel>Tags <span class="text-destructive">*</span></FormLabel>
      <FormControl>
        <div class="relative">
          <Popover @update:open="handlePopoverChange">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                role="combobox"
                class="w-full justify-between"
              >
                {{ getDisplayText(selectedTagIds) }}
                <Icon
                  name="mdi:chevron-down"
                  class="ml-2 h-4 w-4 shrink-0 opacity-50"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[var(--reka-popover-trigger-width)] p-0">
              <Command>
                <CommandInput
                  v-model="searchQuery"
                  placeholder="Search tags..."
                />
                <CommandEmpty>No tag found.</CommandEmpty>
                <ScrollArea class="h-80">
                  <CommandGroup>
                    <CommandItem
                      v-for="tag in filteredTags"
                      :key="tag.id"
                      :value="tag.name"
                      :data-selected="selectedTagIds.includes(tag.id)"
                      @select="() => toggleTag(tag.id)"
                    >
                      <div class="flex items-center">
                        <Checkbox
                          :model-value="selectedTagIds.includes(tag.id)"
                          class="mr-2 size-4"
                        />
                        <span class="font-medium">{{ tag.name }}</span>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </FormControl>
      <FormDescription>
        Select at least one tag
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
