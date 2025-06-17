<script setup lang="ts">
interface DirectoryGroup {
  id: string;
  name: string;
}

interface Props {
  categories: DirectoryGroup[];
  selectedCategoryIds: string[];
  onChange: (ids: string[]) => void;
}

const props = defineProps<Props>();

// Local state
const searchQuery = ref('');

// Filtered categories
const filteredCategories = computed<DirectoryGroup[]>(() => {
  if (!searchQuery.value) return props.categories;
  return props.categories.filter((category: DirectoryGroup) =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// Display helper
function getDisplayText(categoryIds: string[]): string {
  if (!categoryIds.length) return 'Select categories';

  const selectedNames = props.categories
    .filter(category => categoryIds.includes(category.id))
    .map(category => category.name);

  if (selectedNames.length <= 2) {
    return selectedNames.join(', ');
  }

  return `${selectedNames.length} categories selected`;
}

// Reset search on open/close
function handlePopoverChange(isOpen: boolean) {
  if (isOpen) {
    searchQuery.value = '';
  }
}

// Toggle selection
function toggleCategory(categoryId: string) {
  const newCategoryIds = [...props.selectedCategoryIds];
  const index = newCategoryIds.indexOf(categoryId);

  if (index === -1) {
    newCategoryIds.push(categoryId);
  }
  else {
    newCategoryIds.splice(index, 1);
  }

  props.onChange(newCategoryIds);
}
</script>

<template>
  <FormField
    name="categoryIds"
    :validate-on-input="true"
    :validate-on-blur="false"
  >
    <FormItem v-auto-animate>
      <FormLabel>Categories <span class="text-destructive">*</span></FormLabel>
      <FormControl>
        <div class="relative">
          <Popover @update:open="handlePopoverChange">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                role="combobox"
                class="w-full justify-between"
              >
                {{ getDisplayText(selectedCategoryIds) }}
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
                  placeholder="Search categories..."
                />
                <CommandEmpty>No category found.</CommandEmpty>
                <ScrollArea class="h-80">
                  <CommandGroup>
                    <CommandItem
                      v-for="category in filteredCategories"
                      :key="category.id"
                      :value="category.name"
                      :data-selected="selectedCategoryIds.includes(category.id)"
                      @select="() => toggleCategory(category.id)"
                    >
                      <div class="flex items-center">
                        <Checkbox
                          :model-value="selectedCategoryIds.includes(category.id)"
                          class="mr-2 size-4"
                        />
                        <span class="font-medium">{{ category.name }}</span>
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
        Select at least one category
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
