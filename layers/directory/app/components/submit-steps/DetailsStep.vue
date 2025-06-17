<script setup lang="ts">
import { toast } from 'vue-sonner';
import type { DirectoryCategory, DirectoryTag, ScrapeResponse } from '~/types';

// Define props
const props = defineProps<{
  values: any;
  setFieldValue: (field: string, value: any) => void;
  categories: DirectoryCategory[];
  tags: DirectoryTag[];
}>();

// Image upload state
const imageFile = defineModel<File | null>('imageFile');
const imagePreview = defineModel<string | null>('imagePreview');

// Icon upload state
const iconFile = defineModel<File | null>('iconFile');
const iconPreview = defineModel<string | null>('iconPreview');

// Search state
const categorySearchQuery = ref('');
const tagSearchQuery = ref('');

// Add these at the top of the <script setup>
const isLoading = ref(false);

// Add these refs to track AI suggestions
const hasAiSuggestions = ref(false);
const aiSummary = ref('');

// Function to reset search queries when popover is closed
const handleCategoryPopoverChange = (isOpen: boolean) => {
  if (isOpen) {
    categorySearchQuery.value = '';
  }
};

const handleTagPopoverChange = (isOpen: boolean) => {
  if (isOpen) {
    tagSearchQuery.value = '';
  }
};

// Filter out the "All" category
const displayCategories = computed<DirectoryCategory[]>(() =>
  props.categories.filter((category: DirectoryCategory) => category.id !== 'all'),
);

// Filtered categories and tags based on search
const filteredCategories = computed<DirectoryCategory[]>(() => {
  if (!categorySearchQuery.value) return displayCategories.value;
  return displayCategories.value.filter(category =>
    category.name.toLowerCase().includes(categorySearchQuery.value.toLowerCase()),
  );
});

const filteredTags = computed<DirectoryTag[]>(() => {
  if (!tagSearchQuery.value) return props.tags;
  return props.tags.filter((tag: DirectoryTag) =>
    tag.name.toLowerCase().includes(tagSearchQuery.value.toLowerCase()),
  );
});

// Helper function to get category names for display
const getCategoryNames = (categoryIds: string[] | undefined): string => {
  if (!categoryIds?.length) return 'Select categories';
  return `${categoryIds.length} ${categoryIds.length === 1 ? 'category' : 'categories'} selected`;
};

// Set image and create preview
function setImage(file: File) {
  // Validate file extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
  const isValidExtension = validExtensions.includes(fileExt);

  // Validate file size
  const isValidSize = file.size <= 2 * 1024 * 1024;

  if (!isValidExtension || !isValidSize) {
    // Clear preview if file is invalid
    imageFile.value = null;
    imagePreview.value = null;
    props.setFieldValue('image', {
      file: null,
      hasFile: false,
    });
    return;
  }

  imageFile.value = file;
  props.setFieldValue('image', {
    file,
    hasFile: true,
  });

  // Create preview URL only for valid files
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

// Set icon and create preview
function setIcon(file: File) {
  // Validate file extension
  const validExtensions = ['.svg', '.png', '.ico'];
  const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
  const isValidExtension = validExtensions.includes(fileExt);

  // Validate file size
  const isValidSize = file.size <= 1024 * 1024;

  if (!isValidExtension || !isValidSize) {
    // Clear preview if file is invalid
    iconFile.value = null;
    iconPreview.value = null;
    props.setFieldValue('icon', {
      file: null,
      hasFile: false,
    });
    return;
  }

  iconFile.value = file;
  props.setFieldValue('icon', {
    file,
    hasFile: true,
  });

  // Create preview URL only for valid files
  const reader = new FileReader();
  reader.onload = (e) => {
    iconPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

// Remove image
function removeImage() {
  imageFile.value = null;
  imagePreview.value = null;
  props.setFieldValue('image', {
    file: null,
    hasFile: false,
  });
}

// Remove icon
function removeIcon() {
  iconFile.value = null;
  iconPreview.value = null;
  props.setFieldValue('icon', {
    file: null,
    hasFile: false,
  });
}

// Update the scrape function to show AI analysis results
async function handleScrape() {
  const url = props.values.url;
  if (!url) {
    toast.error('Please enter a URL first');
    return;
  }

  isLoading.value = true;
  try {
    const { metadata, success } = await $fetch<ScrapeResponse>('/api/scrape', {
      method: 'GET',
      params: { url },
      headers: {
        Accept: 'application/json',
      },
    });

    if (success && metadata) {
      // Update form fields with scraped data
      props.setFieldValue('title', metadata.title);
      props.setFieldValue('description', metadata.description);

      // Handle AI analysis results if available
      if (metadata.aiAnalysis) {
        const aiAnalysis = metadata.aiAnalysis;

        // Set the AI flag and summary
        hasAiSuggestions.value = true;
        aiSummary.value = aiAnalysis.summary;

        // Suggest AI-generated description if current description is empty or short
        if (!props.values.description || props.values.description.length < 20) {
          props.setFieldValue('description', aiAnalysis.summary);
        }

        // Set content from AI summary if available
        if (aiAnalysis.summary && (!props.values.content || props.values.content.trim() === '')) {
          props.setFieldValue('content', aiAnalysis.summary);
        }

        // Find matching categories based on AI suggestions
        if (aiAnalysis.suggestedCategories && aiAnalysis.suggestedCategories.length > 0) {
          const suggestedCategoryIds = [];

          // Convert both to lowercase for case-insensitive matching
          const suggestedCategoriesLower = aiAnalysis.suggestedCategories.map(cat =>
            typeof cat === 'string' ? cat.toLowerCase() : '',
          );

          // Find matching categories
          for (const category of props.categories) {
            if (suggestedCategoriesLower.some(suggested =>
              category.name.toLowerCase().includes(suggested)
              || suggested.includes(category.name.toLowerCase()),
            )) {
              suggestedCategoryIds.push(category.id);
            }
          }

          // Only set if we found matches and no categories are currently selected
          if (suggestedCategoryIds.length > 0 && (!props.values.categoryIds || props.values.categoryIds.length === 0)) {
            props.setFieldValue('categoryIds', suggestedCategoryIds);
          }
        }

        // Find matching tags based on AI suggestions
        if (aiAnalysis.suggestedTags && aiAnalysis.suggestedTags.length > 0) {
          const suggestedTagIds = [];

          // Convert to lowercase for matching
          const suggestedTagsLower = aiAnalysis.suggestedTags.map(tag =>
            typeof tag === 'string' ? tag.toLowerCase() : '',
          );

          // Find matching tags
          for (const tag of props.tags) {
            if (suggestedTagsLower.some(suggested =>
              tag.name.toLowerCase().includes(suggested)
              || suggested.includes(tag.name.toLowerCase()),
            )) {
              suggestedTagIds.push(tag.id);
            }
          }

          // Only set if we found matches and no tags are currently selected
          if (suggestedTagIds.length > 0 && (!props.values.tagIds || props.values.tagIds.length === 0)) {
            props.setFieldValue('tagIds', suggestedTagIds);
          }
        }
      }

      // Handle image download if exists
      if (metadata.imageData) {
        try {
          // Create an image in memory to work with
          const img = new Image();
          img.src = metadata.imageData;

          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = () => {
              console.error('Failed to load image data');
              resolve(null);
            };
          });

          // Only process if image loaded successfully
          if (img.width > 0 && img.height > 0) {
            // Determine optimal dimensions (max 800px wide or tall)
            const MAX_SIZE = 800;
            let width = img.width;
            let height = img.height;

            if (width > height && width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
            else if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }

            // Create canvas for resizing
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            // Draw and resize image on canvas
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);

              // Convert to more efficient format (WebP if supported)
              const mimeType = 'image/webp';
              const quality = 0.85;

              // Get the compressed image data
              const compressedDataUrl = canvas.toDataURL(mimeType, quality);

              // Convert data URL to Blob
              const res = await fetch(compressedDataUrl);
              const blob = await res.blob();

              // Create file from blob
              const file = new File([blob], 'scraped-image.webp', {
                type: mimeType,
              });

              // Set the image
              setImage(file);
            }
          }
        }
        catch (error) {
          console.error('Failed to process image data:', error);
        }
      }

      // Handle favicon download if exists
      if (metadata.faviconData) {
        try {
          // Favicons are usually small, so we don't need to resize them
          const res = await fetch(metadata.faviconData);
          const blob = await res.blob();

          // Determine extension based on content type
          const contentType = blob.type;
          const extension = contentType.includes('svg')
            ? 'svg'
            : contentType.includes('png')
              ? 'png'
              : 'ico';

          const file = new File([blob], `favicon.${extension}`, {
            type: contentType,
          });

          setIcon(file);
        }
        catch (error) {
          console.error('Failed to process favicon data:', error);
        }
      }

      // Show a toast with suggestions
      toast.success('Metadata scraped successfully', {
        description: 'Content analyzed and suggestions applied',
      });
    }
  }
  catch (error) {
    toast.error('Failed to scrape metadata', {
      description: error instanceof Error ? error.statusMessage : 'Unknown error occurred',
    });
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Title and URL on the same line -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Title -->
      <div class="space-y-2 flex-1">
        <FormField
          v-slot="{ componentField }"
          name="title"
          :validate-on-input="true"
          :validate-on-blur="false"
        >
          <FormItem v-auto-animate>
            <FormLabel>Title <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Enter resource title"
              />
            </FormControl>
            <FormDescription>
              Enter the title of your resource
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- URL -->
      <div class="space-y-2 flex-1">
        <FormField
          v-slot="{ componentField }"
          name="url"
          :validate-on-input="true"
          :validate-on-blur="false"
        >
          <FormItem v-auto-animate>
            <FormLabel>URL <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <div class="flex gap-2">
                <Input
                  v-bind="componentField"
                  placeholder="https://example.com"
                />
                <TooltipProvider :delay-duration="0">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Button
                        variant="outline"
                        size="icon"
                        :disabled="isLoading"
                        @click="handleScrape"
                      >
                        <Icon
                          v-if="isLoading"
                          name="svg-spinners:12-dots-scale-rotate"
                          class="size-4"
                        />
                        <Icon
                          v-else
                          name="mdi:robot-outline"
                          class="size-4"
                        />
                        <span class="sr-only">Scrape metadata</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Auto-fill details with AI. (Limited to 3 times per hour)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </FormControl>
            <FormDescription>
              Enter the URL of your resource
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Add this after the Title and URL section -->
    <div
      v-if="hasAiSuggestions"
      class="flex items-center gap-2 mt-2 mb-4 p-3 bg-muted/50 rounded-lg border border-border"
    >
      <Icon
        name="line-md:ai"
        class="h-5 w-5 text-primary"
      />
      <div class="flex-1">
        <div class="text-sm">
          <span class="font-medium">AI-powered suggestions</span> have been created
        </div>
        <div
          v-if="aiSummary"
          class="text-xs text-muted-foreground mt-1"
        >
          {{ aiSummary }}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="hover:bg-primary/10"
        @click="hasAiSuggestions = false"
      >
        <Icon
          name="mdi:close"
          class="size-4"
        />
        <span class="sr-only">Dismiss</span>
      </Button>
    </div>

    <!-- Description -->
    <div class="space-y-2">
      <FormField
        v-slot="{ componentField }"
        name="description"
        :validate-on-input="true"
        :validate-on-blur="false"
      >
        <FormItem v-auto-animate>
          <FormLabel>Description <span class="text-destructive">*</span></FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              placeholder="Enter resource description"
              rows="3"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Content (Optional) -->
    <div class="space-y-2">
      <FormField
        v-slot="{ componentField }"
        name="content"
        :validate-on-blur="false"
      >
        <FormItem v-auto-animate>
          <FormLabel>Content (Optional)</FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              placeholder="Enter additional content or details"
              rows="5"
            />
          </FormControl>
        </FormItem>
      </FormField>
    </div>

    <!-- Category and Tags in a single line -->
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Category -->
      <div class="space-y-2 flex-1">
        <FormField
          name="categoryIds"
          :validate-on-input="true"
          :validate-on-blur="false"
        >
          <FormItem v-auto-animate>
            <FormLabel>Categories <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <div class="relative">
                <Popover @update:open="handleCategoryPopoverChange">
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      role="combobox"
                      class="w-full justify-between"
                    >
                      {{ getCategoryNames(values.categoryIds) }}
                      <Icon
                        name="mdi:chevron-down"
                        class="ml-2 h-4 w-4 shrink-0 opacity-50"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-[var(--reka-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput
                        v-model="categorySearchQuery"
                        placeholder="Search categories..."
                      />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <ScrollArea class="h-80">
                        <CommandGroup>
                          <CommandItem
                            v-for="category in filteredCategories"
                            :key="category.id"
                            :value="category.name"
                            @select="() => {
                              const newCategoryIds = [...(values.categoryIds || [])];
                              const index = newCategoryIds.indexOf(category.id);
                              if (index === -1) {
                                newCategoryIds.push(category.id);
                              }
                              else {
                                newCategoryIds.splice(index, 1);
                              }
                              setFieldValue('categoryIds', newCategoryIds);
                            }"
                          >
                            <div class="flex items-center">
                              <Checkbox
                                :model-value="values.categoryIds?.includes(category.id)"
                                class="mr-2 h-4 w-4"
                              />
                              {{ category.name }}
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
      </div>

      <!-- Tags -->
      <div class="space-y-2 flex-1">
        <FormField
          name="tagIds"
          :validate-on-input="true"
          :validate-on-blur="false"
        >
          <FormItem v-auto-animate>
            <FormLabel>Tags <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <div class="relative">
                <Popover @update:open="handleTagPopoverChange">
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      role="combobox"
                      class="w-full justify-between"
                    >
                      {{ values.tagIds?.length ? `${values.tagIds.length} tag(s) selected` : 'Select tags' }}
                      <Icon
                        name="mdi:chevron-down"
                        class="ml-2 h-4 w-4 shrink-0 opacity-50"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-[var(--reka-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput
                        v-model="tagSearchQuery"
                        placeholder="Search tags..."
                      />
                      <CommandEmpty>No tag found.</CommandEmpty>
                      <ScrollArea class="h-80">
                        <CommandGroup>
                          <CommandItem
                            v-for="tag in filteredTags"
                            :key="tag.id"
                            :value="tag.name"
                            @select="() => {
                              const newTagIds = [...(values.tagIds || [])];
                              const index = newTagIds.indexOf(tag.id);
                              if (index === -1) {
                                newTagIds.push(tag.id);
                              }
                              else {
                                newTagIds.splice(index, 1);
                              }
                              setFieldValue('tagIds', newTagIds);
                            }"
                          >
                            <div class="flex items-center">
                              <Checkbox
                                :model-value="values.tagIds?.includes(tag.id)"
                                class="mr-2 h-4 w-4"
                              />
                              {{ tag.name }}
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
      </div>
    </div>

    <!-- Image and Icon Upload -->
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Image Upload -->
      <div class="flex-1">
        <FormField
          name="image"
        >
          <FormItem>
            <FormLabel>Image <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <FileUpload
                v-model="imageFile"
                class="h-64"
                variant="image"
                :preview-url="imagePreview"
                accept="image/jpeg,image/png,image/webp"
                :max-size-in-mb="2"
                description="Upload a featured image for your resource"
                button-text="Choose Image"
                @update:model-value="(file: File | null) => {
                  if (file) {
                    setImage(file);
                  }
                  else {
                    removeImage();
                  }
                }"
                @error="(message: string) => {
                  removeImage();
                  toast.error('Image Error', { description: message });
                }"
              />
            </FormControl>
            <FormDescription>
              Upload a JPG, PNG, or WEBP image (16:9, max 2MB)
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Icon Upload -->
      <div class="flex-1">
        <FormField
          name="icon"
        >
          <FormItem>
            <FormLabel>Icon <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <FileUpload
                v-model="iconFile"
                class="h-64"
                variant="icon"
                :preview-url="iconPreview"
                accept="image/svg+xml,image/png,image/x-icon"
                :max-size-in-mb="1"
                description="Upload an icon for your resource"
                button-text="Choose Icon"
                @update:model-value="(file: File | null) => {
                  if (file) {
                    setIcon(file);
                  }
                  else {
                    removeIcon();
                  }
                }"
                @error="(message: string) => {
                  removeIcon();
                  toast.error('Icon Error', { description: message });
                }"
              />
            </FormControl>
            <FormDescription>
              Upload an SVG, PNG, or ICO icon (1:1, max 1MB)
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
  </div>
</template>
