<script setup lang="ts">
import {
  DateFormatter,
  getLocalTimeZone,
  CalendarDate,
  today,
  parseDate,
} from '@internationalized/date';
import { toDate } from 'reka-ui/date';
import type { DirectoryCategory, DirectoryTag } from '~/types';

// Define props
const props = defineProps<{
  values: any;
  setFieldValue: (field: string, value: any) => void;
  imageFile: File | null;
  iconFile: File | null;
  submissionError?: string | null;
  categories: DirectoryCategory[];
  tags: DirectoryTag[];
}>();

// Set initial publish date to today if not already set
onMounted(() => {
  if (!props.values.publishDate) {
    const todayDate = today(getLocalTimeZone());
    props.setFieldValue('publishDate', toDate(todayDate).toISOString());
  }
});

// Date formatter for display
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

// Handle date selection
const handleDateSelect = (date: CalendarDate | null) => {
  if (date) {
    props.setFieldValue('publishDate', toDate(date).toISOString());
  }
  else {
    props.setFieldValue('publishDate', null);
  }
};

// Filter out the "All" category
const displayCategories = computed<DirectoryCategory[]>(() =>
  props.categories.filter((category: DirectoryCategory) => category.id !== 'all'),
);
</script>

<template>
  <div class="space-y-6">
    <!-- Summary -->
    <div class="rounded-lg border bg-muted/50 p-4">
      <h3 class="mb-2 font-semibold">
        Submission Summary
      </h3>
      <dl class="space-y-2 text-sm">
        <div class="flex justify-between">
          <dt class="font-medium text-muted-foreground">
            Title:
          </dt>
          <dd>{{ values.title }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="font-medium text-muted-foreground">
            Categories:
          </dt>
          <dd class="flex flex-wrap justify-end gap-1">
            <Badge
              v-for="categoryId in values.categoryIds"
              :key="categoryId"
              variant="outline"
              class="text-xs"
            >
              {{ displayCategories.find((c) => c.id === categoryId)?.name }}
            </Badge>
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="font-medium text-muted-foreground">
            Tags:
          </dt>
          <dd class="flex flex-wrap justify-end gap-1">
            <Badge
              v-for="tagId in values.tagIds"
              :key="tagId"
              variant="secondary"
              class="text-xs"
            >
              #{{ tags.find((t) => t.id === tagId)?.name }}
            </Badge>
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="font-medium text-muted-foreground">
            Image:
          </dt>
          <dd>{{ imageFile ? 'Uploaded' : 'None' }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="font-medium text-muted-foreground">
            Icon:
          </dt>
          <dd>{{ iconFile ? 'Uploaded' : 'None' }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="font-medium text-muted-foreground">
            Promotion:
          </dt>
          <dd>
            {{ values.paymentMethod === 'free' ? 'Free'
              : values.paymentMethod === 'credit' ? 'Credit Card ($5.99)'
                : 'Subscription ($19.99/month)' }}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="font-medium text-muted-foreground">
            Publish Date:
          </dt>
          <dd>
            {{ values.publishDate ? df.format(new Date(values.publishDate)) : 'Immediate' }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Publish Date Selection -->
    <FormField
      v-slot="{ value }"
      name="publishDate"
    >
      <FormItem class="flex flex-col">
        <FormLabel>Publish Date</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                :class="[
                  'w-full max-w-48 justify-center text-left font-normal',
                  !value && 'text-muted-foreground',
                ]"
              >
                <Icon
                  name="mdi:calendar"
                  class="mr-2 h-4 w-4 opacity-50"
                />
                <span>{{ value ? df.format(new Date(value)) : "Schedule publication (optional)" }}</span>
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="p-0">
            <Calendar
              :model-value="value ? parseDate(new Date(value).toISOString().split('T')[0]) : undefined"
              initial-focus
              :min-value="today(getLocalTimeZone())"
              :max-value="new CalendarDate(new Date().getFullYear() + 1, 12, 31)"
              :locale="'en-US'"
              @update:model-value="handleDateSelect"
            />
          </PopoverContent>
        </Popover>
        <FormDescription>
          Choose when your resource should be published. Leave empty for immediate publication after approval.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Terms and Conditions -->
    <FormField
      v-slot="{ value, handleChange }"
      name="termsAccepted"
      :validate-on-input="true"
    >
      <FormItem
        class="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4"
      >
        <FormControl>
          <Checkbox
            id="terms"
            :model-value="value"
            @update:model-value="handleChange"
          />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel class="text-foreground">
            I agree to the <NuxtLink
              to="/license"
              class="text-primary hover:underline"
            >
              License Agreement
            </NuxtLink>
          </FormLabel>
          <div v-auto-animate>
            <FormMessage class="mt-1" />
          </div>
        </div>
      </FormItem>
    </FormField>
  </div>
</template>
