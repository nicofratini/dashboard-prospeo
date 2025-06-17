<script setup lang="ts">
import { object, string } from 'zod';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard',
});

// Constants
const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
] as const;

const NAV_LINKS = [
  { title: 'General', href: '/dashboard/settings/general' },
  { title: 'Billing', href: '/dashboard/settings/billing' },
  { title: 'Security', href: '/dashboard/settings/security' },
  { title: 'Advanced', href: '/dashboard/settings/advanced' },
] as const;

const SOCIAL_LINKS = [
  { name: 'x', label: 'X (Twitter)', icon: 'simple-icons:x' },
  { name: 'instagram', label: 'Instagram', icon: 'simple-icons:instagram' },
  { name: 'facebook', label: 'Facebook', icon: 'simple-icons:facebook' },
  { name: 'reddit', label: 'Reddit', icon: 'simple-icons:reddit' },
  { name: 'github', label: 'GitHub', icon: 'simple-icons:github' },
] as const;

// Form Schema
const formSchema = toTypedSchema(
  object({
    username: string().min(3, 'Username must be at least 3 characters'),
    fullName: string().min(2, 'Full name must be at least 2 characters'),
    bio: string()
      .min(10, {
        message: 'Bio must be at least 10 characters.',
      })
      .max(160, 'Bio must be less than 160 characters')
      .optional()
      .or(string().length(0)),
    language: string().min(1, 'Please select a language'),
    socialLinks: object({
      x: string().url('Please enter a valid URL').optional().or(string().length(0)),
      instagram: string().url('Please enter a valid URL').optional().or(string().length(0)),
      facebook: string().url('Please enter a valid URL').optional().or(string().length(0)),
      reddit: string().url('Please enter a valid URL').optional().or(string().length(0)),
      github: string().url('Please enter a valid URL').optional().or(string().length(0)),
    }).optional(),
  }),
);

// Composables
const user = useSupabaseUser();
const { profile, isLoading, updateProfile, updateProfilePicture, signedAvatarUrl } = useProfile();

// Form Setup
const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: '',
    fullName: '',
    bio: '',
    language: 'en',
    socialLinks: {
      x: '',
      instagram: '',
      facebook: '',
      reddit: '',
      github: '',
    },
  },
});

// Watch for profile changes to update form
watch(profile, (newProfile) => {
  if (newProfile) {
    setValues({
      username: newProfile.username ?? '',
      fullName: newProfile.full_name ?? '',
      bio: newProfile.bio ?? '',
      language: newProfile.preferences?.language ?? 'en',
      socialLinks: {
        x: newProfile.social_links?.x ?? '',
        instagram: newProfile.social_links?.instagram ?? '',
        facebook: newProfile.social_links?.facebook ?? '',
        reddit: newProfile.social_links?.reddit ?? '',
        github: newProfile.social_links?.github ?? '',
      },
    });
  }
}, { immediate: true });

// Form Submit Handler
const onSubmit = handleSubmit(async (values) => {
  try {
    await updateProfile({
      username: values.username,
      full_name: values.fullName,
      bio: values.bio,
      preferences: {
        ...(profile.value?.preferences ?? {}),
        language: values.language,
      },
      social_links: {
        x: values.socialLinks?.x,
        instagram: values.socialLinks?.instagram,
        facebook: values.socialLinks?.facebook,
        reddit: values.socialLinks?.reddit,
        github: values.socialLinks?.github,
      },
    });

    toast.success('Settings updated successfully');
  }
  catch (error) {
    toast.error('Failed to update settings', {
      description: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

// Avatar Update Handler
async function handleAvatarUpdate(url: string) {
  try {
    await updateProfilePicture(url);
    toast.success('Profile picture updated successfully');
  }
  catch (error) {
    toast.error('Failed to update profile picture', {
      description: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
</script>

<template>
  <div class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
    <div class="mx-auto grid w-full max-w-6xl gap-2">
      <h1 class="text-3xl font-semibold">
        Settings
      </h1>
    </div>
    <div class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <nav class="grid gap-4 text-sm text-muted-foreground">
        <NuxtLink
          v-for="link in NAV_LINKS"
          :key="link.href"
          :href="link.href"
          :class="link.href === $route.path ? 'font-semibold text-primary' : ''"
        >
          {{ link.title }}
        </NuxtLink>
      </nav>
      <form
        v-if="!isLoading"
        class="grid gap-6"
        @submit.prevent="onSubmit"
      >
        <Card :class="['bg-muted/40', { 'opacity-50 pointer-events-none': isLoading }]">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your profile information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Avatar Upload Section -->
            <div class="flex justify-center border-b pb-6">
              <AvatarUpload
                v-if="user?.id"
                :user-id="user.id"
                :url="signedAvatarUrl"
                @update="handleAvatarUpdate"
              />
            </div>

            <!-- Basic Info Section -->
            <FormField
              v-slot="{ componentField }"
              name="username"
            >
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Choose a username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="fullName"
            >
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter your full name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="bio"
            >
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    placeholder="Tell us a little bit about yourself"
                    class="resize-none"
                    :rows="3"
                  />
                </FormControl>
                <FormDescription>
                  Write a short bio about yourself.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="language"
            >
              <FormItem>
                <FormLabel>Preferred Language</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      v-for="lang in LANGUAGES"
                      :key="lang.value"
                      :value="lang.value"
                    >
                      {{ lang.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Social Links Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium">
                Social Links
              </h3>
              <div class="grid gap-4 sm:grid-cols-2">
                <FormField
                  v-for="social in SOCIAL_LINKS"
                  :key="social.name"
                  v-slot="{ componentField }"
                  :name="`socialLinks.${social.name}`"
                >
                  <FormItem>
                    <FormLabel>
                      <div class="flex items-center gap-2">
                        <Icon :name="social.icon" />
                        {{ social.label }}
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        v-bind="componentField"
                        type="url"
                        :placeholder="`Link to your ${social.label} profile`"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              :disabled="isSubmitting"
            >
              <Icon
                v-if="isSubmitting"
                name="line-md:loading-twotone-loop"
                class="mr-2 h-4 w-4"
              />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
      <div v-else>
        <Card>
          <CardHeader class="flex items-center gap-4">
            <Skeleton class="size-24 rounded-full" />
            <Skeleton class="h-8 w-[200px]" />
            <Skeleton class="h-4 w-[300px] mt-2" />
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <Skeleton class="h-4 w-[150px]" />
              <div class="space-y-4">
                <div class="grid gap-4">
                  <Skeleton class="h-10" />
                  <Skeleton class="h-10" />
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <Skeleton class="h-4 w-[120px]" />
              <div class="grid gap-4 sm:grid-cols-2">
                <Skeleton class="h-10" />
                <Skeleton class="h-10" />
                <Skeleton class="h-10" />
                <Skeleton class="h-10" />
                <Skeleton class="h-10" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton class="h-10 w-[120px]" />
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
