<script setup lang="ts">
import { toast } from 'vue-sonner';
import { useDirectoryService } from '~/services/directoryService';

// SEO
useHead({
  title: 'Submit Resource',
  meta: [
    {
      name: 'description',
      content: 'Submit a new resource to our directory. Share valuable content with the community.',
    },
  ],
});

// Get Supabase client
const supabase = useSupabaseClient();

// Initialize directory service
const directoryService = useDirectoryService();

// Form state
const currentStep = ref(1);
const totalSteps = 3;
const isSubmitting = ref(false);
const submissionComplete = ref(false);
const submissionError = ref<string | null>(null);

// Steps configuration
const steps = [
  {
    step: 1,
    title: 'Details',
    description: 'Resource information',
    icon: 'mdi:file-document-outline',
  },
  {
    step: 2,
    title: 'Payment',
    description: 'Choose payment method',
    icon: 'mdi:credit-card-outline',
  },
  {
    step: 3,
    title: 'Publish',
    description: 'Review and submit',
    icon: 'mdi:cloud-upload-outline',
  },
];

// Image upload state
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

// Icon upload state
const iconFile = ref<File | null>(null);
const iconPreview = ref<string | null>(null);

// Fetch directory data
const { groups: categories, fetchGroups, isLoading: isLoadingGroups } = useDirectoryGroups();
const { tags, fetchTags, isLoading: isLoadingTags } = useDirectoryTags();

// Loading state for directory data
const isLoadingDirectoryData = computed(() => isLoadingGroups.value || isLoadingTags.value);

// Ensure data is fetched on page load
try {
  await Promise.all([
    fetchGroups(),
    fetchTags(),
  ]);
}
catch (error) {
  console.error('Error fetching directory data:', error);
  toast.error('Failed to load directory data', {
    description: 'Please refresh the page to try again.',
  });
}

// Define form schemas for each step
const { formSchemas } = useSubmitFormSchemas();

// Simplified step navigation functions
function handleNextStep(nextStepFn: () => void) {
  if (currentStep.value < totalSteps) {
    nextStepFn();
  }
}

function handlePrevStep(prevStepFn: () => void) {
  if (currentStep.value > 1) {
    prevStepFn();
  }
}

// Handle form submission
const submitForm = async (formData: any) => {
  try {
    isSubmitting.value = true;
    submissionError.value = null;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('You must be logged in to submit a resource');
    }

    // 1. Create the directory item first without images
    const { data: item, error: itemError } = await supabase
      .from('directory_items')
      .insert({
        title: formData.title,
        description: formData.description,
        content: formData.content || null,
        url: formData.url || null,
        featured: formData.featured,
        status: 'pending',
        user_id: user.id,
        image_url: null, // Will update this after upload
        thumbnail_url: null, // Will update this after upload
        publish_planned_at: formData.publishDate || null,
      } as any)
      .select('id')
      .single();

    if (itemError) {
      throw new Error(itemError.message || 'Failed to create resource');
    }

    // Get the real resource ID from the created item
    const resourceId = (item as any).id;
    let imageUrl = null;
    let iconUrl = null;

    // 2. Now upload files with the actual resource ID using the directory service
    // Upload image if exists
    if (imageFile.value) {
      imageUrl = await directoryService.uploadDirectoryFile(
        resourceId,
        imageFile.value,
        'image',
      );
    }

    // Upload icon if exists
    if (iconFile.value) {
      iconUrl = await directoryService.uploadDirectoryFile(
        resourceId,
        iconFile.value,
        'icon',
      );
    }

    // 3. Update the resource with image URLs
    if (imageUrl || iconUrl) {
      const success = await directoryService.updateItemWithImageUrls(
        resourceId,
        imageUrl,
        iconUrl,
      );

      if (!success) {
        console.error('Failed to update resource with image URLs');
      }
    }

    // 4. Continue with adding categories and tags
    // Add category relationships
    const categoryInserts = formData.categoryIds?.map((categoryId: string) => ({
      item_id: resourceId,
      group_id: categoryId,
    })) || [];

    if (categoryInserts.length > 0) {
      const { error: categoriesError } = await supabase
        .from('directory_items_groups')
        .insert(categoryInserts as any);

      if (categoriesError) {
        throw new Error(categoriesError.message || 'Failed to assign categories');
      }
    }

    // Add tag relationships
    const tagInserts = formData.tagIds?.map((tagId: string) => ({
      item_id: resourceId,
      tag_id: tagId,
    })) || [];

    if (tagInserts.length > 0) {
      const { error: tagsError } = await supabase
        .from('directory_items_tags')
        .insert(tagInserts as any);

      if (tagsError) {
        throw new Error(tagsError.message || 'Failed to assign tags');
      }
    }

    // Success
    submissionComplete.value = true;
    toast.success('Resource submitted successfully', {
      description: 'Your resource has been submitted and is pending review.',
    });
  }
  catch (error: any) {
    console.error('Error submitting resource:', error);
    submissionError.value = error.message || 'Failed to submit resource. Please try again.';
    toast.error('Submission failed', {
      description: submissionError.value || '',
    });
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="container flex items-center justify-center flex-col px-4 py-8">
    <!-- Header section -->
    <div class="mb-12 text-center relative">
      <!-- Back button -->
      <NuxtLink
        to="/directory"
        class="mb-4 inline-flex absolute left-0 items-center text-sm font-medium text-primary"
      >
        <Icon
          name="mdi:arrow-left"
          class="mr-1 h-4 w-4"
        />
        Back to Directory
      </NuxtLink>

      <!-- Badge above title -->
      <div class="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        <Icon
          name="mdi:plus-circle"
          class="mr-1 h-4 w-4"
        />
        Submit Resource
      </div>

      <!-- Gradient title -->
      <h1 class="mb-6 bg-gradient-to-r from-emerald-500 via-blue-300 to-indigo-600 bg-clip-text text-4xl font-brand text-transparent sm:text-5xl max-w-fit mx-auto">
        Share with the Community
      </h1>
      <p class="mx-auto mb-8 max-w-2xl text-muted-foreground">
        Submit your resource to our directory and help others discover valuable content.
      </p>
    </div>

    <!-- Submission complete -->
    <div
      v-if="submissionComplete"
      class="mx-auto max-w-md w-full"
    >
      <Card class="overflow-hidden border-2 border-primary/20 shadow-lg">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />

        <CardHeader class="pb-2">
          <div class="flex flex-col items-center">
            <div class="mb-8 flex justify-center">
              <div class="relative">
                <div class="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-sm" />
                <div class="relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/90 p-4 text-primary-foreground shadow-lg">
                  <Icon
                    name="line-md:confirm-circle"
                    mode="svg"
                    class="size-12 animate-in fade-in-50 scale-in-95 duration-500"
                  />
                </div>
              </div>
            </div>
            <CardTitle class="text-2xl font-brand">
              Resource Submitted!
            </CardTitle>
            <CardDescription class="text-base">
              Your contribution has been received and is now pending review.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent class="pb-6">
          <div class="space-y-4">
            <div class="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <p class="mb-2 font-medium text-foreground flex items-center">
                <Icon
                  name="mdi:information-outline"
                  class="mr-2 h-4 w-4 text-primary"
                />
                What happens next?
              </p>
              <ul class="ml-6 list-disc space-y-1.5">
                <li>Our team will review your submission</li>
                <li>You'll receive a notification when it's approved</li>
                <li>Once approved, your resource will appear in the directory</li>
              </ul>
            </div>

            <div class="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Icon
                name="mdi:clock-outline"
                class="h-4 w-4"
              />
              <span>Average review time: 1-2 business days</span>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-3 pt-0">
          <NuxtLink
            to="/directory"
            class="w-full"
          >
            <Button
              class="w-full"
              variant="default"
            >
              <Icon
                name="mdi:view-grid"
                class="mr-2 h-4 w-4"
              />
              Browse Directory
            </Button>
          </NuxtLink>

          <NuxtLink
            to="/directory/dashboard"
            class="w-full"
          >
            <Button
              class="w-full"
              variant="outline"
            >
              <Icon
                name="mdi:folder-outline"
                class="mr-2 h-4 w-4"
              />
              View My Resources
            </Button>
          </NuxtLink>
        </CardFooter>
      </Card>

      <div class="mt-6 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          @click="submissionComplete = false; currentStep = 1"
        >
          <Icon
            name="mdi:plus-circle"
            class="mr-2 h-4 w-4"
          />
          Submit Another Resource
        </Button>
      </div>
    </div>

    <!-- Submission form -->
    <div
      v-else
      class="flex items-center justify-center max-w-6xl w-full"
    >
      <!-- Loading state -->
      <div
        v-if="isLoadingDirectoryData"
        class="flex flex-col items-center justify-center py-12"
      >
        <div class="mb-4">
          <Icon
            name="svg-spinners:ring-resize"
            class="h-12 w-12 text-primary animate-spin"
          />
        </div>
        <p class="text-lg font-medium">
          Loading directory data...
        </p>
        <p class="text-sm text-muted-foreground">
          Please wait while we fetch the necessary information.
        </p>
      </div>

      <!-- Form content -->
      <Form
        v-else
        v-slot="{ meta, values, validate, setFieldValue }"
        as=""
        keep-values
        validate-on-change
        :validation-schema="formSchemas[currentStep - 1]"
        :initial-values="{
          title: '',
          description: '',
          content: '',
          url: '',
          categoryIds: [],
          tagIds: [],
          paymentMethod: 'free',
          promotionCode: '',
          featured: false,
          termsAccepted: false,
          publishDate: undefined,
          image: {
            file: null,
            hasFile: false,
          },
          icon: {
            file: null,
            hasFile: false,
          },
        }"
      >
        <Stepper
          v-slot="{ nextStep, prevStep }"
          v-model="currentStep"
          class="mb-8 w-full"
        >
          <form
            class="w-full"
            @submit.prevent="(e) => {
              validate();

              if (currentStep === totalSteps && meta.valid) {
                submitForm(values);
              }
            }"
          >
            <div class="flex w-full justify-between">
              <StepperItem
                v-for="(step, index) in steps"
                :key="step.step"
                v-slot="{ state }"
                class="relative flex w-full flex-col items-center justify-center"
                :step="step.step"
              >
                <StepperSeparator
                  v-if="index < steps.length - 1"
                  class="absolute left-[calc(50%+16px)] right-[calc(-50%+16px)] top-[1.1rem] block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary transition-all duration-500 z-0"
                  :class="[
                    state === 'completed' && 'animate-fill-in',
                    state === 'active' && 'animate-pulse',
                  ]"
                />

                <StepperTrigger as-child>
                  <Button
                    :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                    size="icon"
                    class="z-10 rounded-full shrink-0 transition-all duration-300 relative"
                    :class="[
                      state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background shadow-[0_0_10px_rgba(var(--primary),0.4)]',
                      state === 'completed' && 'animate-scale-in',
                      state !== 'completed' && state !== 'active' && 'transition-all duration-300',
                    ]"
                    :disabled="state !== 'completed' && !meta.valid"
                  >
                    <Transition
                      enter-active-class="transition-all duration-300"
                      leave-active-class="transition-all duration-300"
                      enter-from-class="opacity-0 scale-50"
                      leave-to-class="opacity-0 scale-50"
                      mode="out-in"
                    >
                      <Icon
                        v-if="state === 'completed'"
                        key="completed"
                        name="mdi:check"
                        class="size-5"
                      />
                      <Icon
                        v-else
                        :key="step.icon"
                        :name="step.icon"
                        class="size-5"
                      />
                    </Transition>
                  </Button>
                </StepperTrigger>

                <div class="mt-5 flex flex-col items-center text-center w-full">
                  <StepperTitle
                    :class="[state === 'active' && 'text-primary']"
                    class="text-sm font-semibold transition lg:text-base"
                  >
                    {{ step.title }}
                  </StepperTitle>
                  <StepperDescription
                    :class="[state === 'active' && 'text-primary']"
                    class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
                  >
                    {{ step.description }}
                  </StepperDescription>
                </div>
              </StepperItem>
            </div>

            <Card class="mt-8 w-full">
              <CardHeader>
                <CardTitle>
                  {{ currentStep === 1 ? 'Resource Details'
                    : currentStep === 2 ? 'Payment Options'
                      : 'Review & Publish' }}
                </CardTitle>
                <CardDescription>
                  {{ currentStep === 1 ? 'Provide information about your resource'
                    : currentStep === 2 ? 'Choose how you want to promote your resource'
                      : 'Review your submission and publish' }}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <!-- Step 1: Details -->
                <SubmitStepsDetailsStep
                  v-if="currentStep === 1"
                  v-model:image-file="imageFile"
                  v-model:image-preview="imagePreview"
                  v-model:icon-file="iconFile"
                  v-model:icon-preview="iconPreview"
                  :values="values"
                  :set-field-value="setFieldValue"
                  :categories="categories"
                  :tags="tags"
                />

                <!-- Step 2: Payment -->
                <SubmitStepsPaymentStep
                  v-if="currentStep === 2"
                  :values="values"
                  :set-field-value="setFieldValue"
                  :categories="categories"
                  :tags="tags"
                />

                <!-- Step 3: Publish -->
                <SubmitStepsPublishStep
                  v-if="currentStep === 3"
                  :values="values"
                  :set-field-value="setFieldValue"
                  :image-file="imageFile"
                  :icon-file="iconFile"
                  :submission-error="submissionError"
                  :categories="categories"
                  :tags="tags"
                />
              </CardContent>

              <CardFooter class="flex justify-between">
                <div class="w-full flex items-center gap-2 justify-between">
                  <Button
                    variant="outline"
                    :disabled="currentStep === 1 || isSubmitting"
                    type="button"
                    @click="handlePrevStep(prevStep)"
                  >
                    <Icon
                      name="mdi:arrow-left"
                      class="mr-2 h-4 w-4"
                    />
                    Back
                  </Button>
                  <Button
                    v-if="currentStep < totalSteps"
                    :disabled="!meta.valid"
                    type="button"
                    @click="meta.valid && handleNextStep(nextStep)"
                  >
                    Next
                    <Icon
                      name="mdi:arrow-right"
                      class="ml-2 h-4 w-4"
                    />
                  </Button>
                  <Button
                    v-else
                    type="submit"
                    :disabled="!meta.valid || isSubmitting"
                  >
                    <Icon
                      v-if="isSubmitting"
                      name="svg-spinners:ring-resize"
                      class="mr-2 h-4 w-4 animate-spin"
                    />
                    {{ isSubmitting ? 'Submitting...' : 'Submit Resource' }}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </Stepper>
      </Form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fill-in {
  from {
    background-color: hsl(var(--muted));
    background-position: left;
    background-size: 0% 100%;
  }
  to {
    background-color: hsl(var(--primary));
    background-position: right;
    background-size: 100% 100%;
  }
}

@keyframes scale-in {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-fill-in {
  animation: fill-in 0.8s ease forwards;
}

.animate-scale-in {
  animation: scale-in 0.5s ease forwards;
}
</style>
