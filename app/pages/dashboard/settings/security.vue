<script setup lang="ts">
import { object, string, boolean, number } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard',
});

const user = useSupabaseUser();

const navLinks = [
  { title: 'General', href: '/dashboard/settings/general' },
  { title: 'Billing', href: '/dashboard/settings/billing' },
  { title: 'Security', href: '/dashboard/settings/security' },
  { title: 'Advanced', href: '/dashboard/settings/advanced' },
];

const securitySchema = object({
  currentPassword: string().min(1, 'Current password is required'),
  newPassword: string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: string(),
  twoFactorEnabled: boolean(),
  recoveryEmail: string().email('Please enter a valid email').optional().or(string().length(0)),
  sessionTimeout: number().min(5).max(60),
  notifyOnNewLogin: boolean(),
  allowMultipleSessions: boolean(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(securitySchema),
  initialValues: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    recoveryEmail: user.value?.email || '',
    sessionTimeout: 30,
    notifyOnNewLogin: true,
    allowMultipleSessions: false,
  },
});

const onSubmit = handleSubmit(async () => {
  toast.success('Security settings updated');
});
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
          v-for="(link, i) in navLinks"
          :key="i"
          :href="link.href"
          :class="link.href === $route.path ? 'font-semibold text-primary' : ''"
        >
          {{ link.title }}
        </NuxtLink>
      </nav>

      <form
        class="grid gap-6"
        @submit="onSubmit"
      >
        <Alert variant="warning">
          <AlertTitle class="flex items-center gap-2">
            <Icon
              name="line-md:alert"
              class="h-5 w-5"
            />
            Demo Mode
          </AlertTitle>
          <AlertDescription>
            This is a demo interface. No actual data is being sent or stored.
          </AlertDescription>
        </Alert>
        <!-- Password Management -->
        <Card class="bg-muted/40">
          <CardHeader>
            <CardTitle>Password Management</CardTitle>
            <CardDescription>Update your password and manage password-related settings</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField
              v-slot="{ componentField }"
              name="currentPassword"
            >
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    v-bind="componentField"
                    placeholder="Enter current password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="newPassword"
            >
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    v-bind="componentField"
                    placeholder="Enter new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="confirmPassword"
            >
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    v-bind="componentField"
                    placeholder="Confirm new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <!-- Two-Factor Authentication -->
        <Card class="bg-muted/40">
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField
              v-slot="{ value, handleChange }"
              name="twoFactorEnabled"
            >
              <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
                <div class="space-y-0.5">
                  <FormLabel>Two-factor authentication</FormLabel>
                  <FormDescription>
                    Secure your account with 2FA authentication using your phone.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="recoveryEmail"
            >
              <FormItem>
                <FormLabel>Recovery Email</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="backup@example.com"
                  />
                </FormControl>
                <FormDescription>
                  Email used for account recovery and security notifications
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <!-- Session Security -->
        <Card class="bg-muted/40">
          <CardHeader>
            <CardTitle>Session Security</CardTitle>
            <CardDescription>Manage your active sessions and security preferences</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField
              v-slot="{ componentField }"
              name="sessionTimeout"
            >
              <FormItem>
                <FormLabel>Session Timeout (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    v-bind="componentField"
                    min="5"
                    max="60"
                  />
                </FormControl>
                <FormDescription>
                  Automatically log out after period of inactivity
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="notifyOnNewLogin"
            >
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <div class="space-y-1 leading-none">
                  <FormLabel>
                    Email me about new sign-ins
                  </FormLabel>
                  <FormDescription>
                    Get notified when a new device signs into your account
                  </FormDescription>
                </div>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="allowMultipleSessions"
            >
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <div class="space-y-1 leading-none">
                  <FormLabel>
                    Allow multiple sessions
                  </FormLabel>
                  <FormDescription>
                    Stay signed in on multiple devices simultaneously
                  </FormDescription>
                </div>
              </FormItem>
            </FormField>
          </CardContent>
          <CardFooter>
            <Button type="submit">
              Save Security Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  </div>
</template>
