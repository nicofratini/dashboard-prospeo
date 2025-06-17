<script setup lang="ts">
import { computed } from 'vue';
import { DirectoryCard } from '#components';
import type { DirectoryCategory, DirectoryTag } from '~/types';

// Define props
const props = defineProps<{
  values: any;
  setFieldValue: (field: string, value: any) => void;
  categories: DirectoryCategory[];
  tags: DirectoryTag[];
}>();

// Payment options
const paymentOptions = [
  {
    id: 'free',
    value: 'free',
    title: 'Submit to review',
    description: 'Submit your resource for free. Standard review process applies. (5-10 business days)',
  },
  {
    id: 'credit',
    value: 'credit',
    title: 'Pay & Publish Right Now ($9.99)',
    description: 'Publish your resource immediately. Get featured placement and priority review.',
  },
  {
    id: 'sponsor',
    value: 'sponsor',
    title: 'Pay & Publish Right Now (Sponsor) ($19.99)',
    description: 'Publish your resource immediately. Get featured placement and mention in our newsletter.',
  },
];

// Create object URL for preview image
const imageUrl = computed(() => {
  if (props.values.image?.file) {
    return window.URL.createObjectURL(props.values.image.file);
  }
  return '';
});

// Filter out the "All" category
const displayCategories = computed<DirectoryCategory[]>(() =>
  props.categories.filter((category: DirectoryCategory) => category.id !== 'all'),
);

// Create a preview item for the DirectoryCard
const previewItem = computed(() => {
  // Map selected category IDs to actual category objects with names
  const groups = (props.values.categoryIds || []).map((categoryId: string) => {
    const category = displayCategories.value.find(c => c.id === categoryId);
    return {
      id: categoryId,
      name: category?.name || 'Category',
      slug: category?.name?.toLowerCase().replace(/\s+/g, '-') || '',
    };
  });

  // Map selected tag IDs to actual tag names
  const tags = (props.values.tagIds || []).map((tagId: string) => {
    const tag = props.tags.find(t => t.id === tagId);
    return tag?.name || 'Tag';
  });

  return {
    id: 'preview',
    title: props.values.title || 'Resource Title',
    description: props.values.description || 'Resource description will appear here.',
    imageUrl: imageUrl.value,
    tags,
    groups,
    featured: props.values.featured || false,
    url: props.values.url || '#',
  };
});
</script>

<template>
  <div class="space-y-8">
    <!-- Card Preview -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Resource Preview
      </h3>
      <p class="text-sm text-muted-foreground">
        This is how your resource will appear in the directory.
      </p>

      <div class="max-w-md mx-auto">
        <DirectoryCard :item="previewItem" />
      </div>
    </div>

    <div class="space-y-4">
      <FormField
        v-slot="{ componentField }"
        name="paymentMethod"
        :validate-on-input="true"
      >
        <FormItem v-auto-animate>
          <FormLabel>Choose a Promotion Option <span class="text-destructive">*</span></FormLabel>
          <FormControl>
            <RadioGroup
              v-bind="componentField"
              class="space-y-4"
            >
              <div
                v-for="option in paymentOptions"
                :key="option.id"
                class="rounded-lg border p-4 cursor-pointer transition-all duration-300 ease-in-out"
                :class="{
                  'border-primary bg-primary/5 shadow-md scale-[1.02]': props.values.paymentMethod === option.value,
                  'hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.01]': props.values.paymentMethod !== option.value,
                }"
                @click="setFieldValue('paymentMethod', option.value)"
              >
                <div class="flex items-center space-x-3">
                  <RadioGroupItem
                    :id="option.id"
                    :value="option.value"
                  />
                  <Label
                    :for="option.id"
                    class="grid gap-1.5 cursor-pointer"
                  >
                    <span class="font-medium">{{ option.title }}</span>
                    <span class="text-sm text-muted-foreground">
                      {{ option.description }}
                    </span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Promotion Code -->
    <div class="space-y-2">
      <FormField
        v-slot="{ componentField }"
        name="promotionCode"
      >
        <FormItem v-auto-animate>
          <FormLabel>Promotion Code</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="Enter promotion code (if available)"
            />
          </FormControl>
          <FormDescription>
            Enter a promotion code if you have one
          </FormDescription>
        </FormItem>
      </FormField>
    </div>
  </div>
</template>
