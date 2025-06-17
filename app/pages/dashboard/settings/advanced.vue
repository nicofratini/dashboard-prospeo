<script setup lang="ts">
import { object, string, boolean } from 'zod';
import { DateFormatter, getLocalTimeZone, CalendarDate, today, type DateValue } from '@internationalized/date';
import { toDate } from 'reka-ui/date';
import { toast } from 'vue-sonner';
import { cn } from '@/lib/utils';

definePageMeta({
  layout: 'dashboard',
});

const dateValue = ref<DateValue>();
const placeholder = ref();

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

const navLinks = [
  { title: 'General', href: '/dashboard/settings/general' },
  { title: 'Billing', href: '/dashboard/settings/billing' },
  { title: 'Security', href: '/dashboard/settings/security' },
  { title: 'Advanced', href: '/dashboard/settings/advanced' },
];

const formSchema = toTypedSchema(
  object({
    // Data Management
    dataExport: boolean(),
    dataRetention: string().min(1, 'Please select a retention period'),
    autoBackup: boolean(),

    // API Access
    apiKey: string().optional(),
    webhookUrl: string().url('Please enter a valid URL').optional().or(string().length(0)),

    // System Preferences
    debugMode: boolean(),
    betaFeatures: boolean(),
    customDomain: string().url('Please enter a valid domain').optional().or(string().length(0)),
    analyticsEnabled: boolean(),

    // New fields for examples
    scheduleBackup: string().datetime().refine(date => date !== undefined, 'Please select a valid date.'),
    timezone: string().min(1, 'Please select a timezone'),
    logLevel: string().min(1, 'Please select a log level'),
    environment: string().min(1, 'Please select an environment'),
  }),
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    dataExport: false,
    dataRetention: '30',
    autoBackup: true,
    apiKey: '',
    webhookUrl: '',
    debugMode: false,
    betaFeatures: false,
    customDomain: '',
    analyticsEnabled: true,
    timezone: 'UTC',
    logLevel: 'info',
    environment: 'production',
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    console.log('Advanced settings:', values);
    toast.success('Settings updated successfully');
  }
  catch (error) {
    toast.error('Failed to update settings', {
      description: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

// Timezone options
const timezones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
];

// Log levels
const logLevels = [
  { label: 'Error', value: 'error' },
  { label: 'Warning', value: 'warn' },
  { label: 'Info', value: 'info' },
  { label: 'Debug', value: 'debug' },
  { label: 'Trace', value: 'trace' },
];
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

        <!-- Data Management -->
        <Card class="bg-muted/40">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Configure how your data is handled and stored</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField
              v-slot="{ value, handleChange }"
              name="dataExport"
            >
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <div class="space-y-1 leading-none">
                  <FormLabel>Enable Data Export</FormLabel>
                  <FormDescription>
                    Allow automatic data exports on a scheduled basis
                  </FormDescription>
                </div>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="dataRetention"
            >
              <FormItem>
                <FormLabel>Data Retention Period</FormLabel>
                <Select
                  :model-value="value"
                  @update:model-value="handleChange"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">
                      30 days
                    </SelectItem>
                    <SelectItem value="60">
                      60 days
                    </SelectItem>
                    <SelectItem value="90">
                      90 days
                    </SelectItem>
                    <SelectItem value="180">
                      180 days
                    </SelectItem>
                    <SelectItem value="365">
                      1 year
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How long to keep historical data
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="autoBackup"
            >
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <div class="space-y-1 leading-none">
                  <FormLabel>Automatic Backups</FormLabel>
                  <FormDescription>
                    Enable automatic daily backups of your data
                  </FormDescription>
                </div>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, setValue }"
              name="scheduleBackup"
            >
              <FormItem class="flex flex-col">
                <FormLabel>Backup Schedule</FormLabel>
                <Popover>
                  <PopoverTrigger as-child>
                    <FormControl>
                      <Button
                        variant="outline"
                        :class="cn(
                          'w-[240px] justify-start text-left font-normal',
                          !value && 'text-muted-foreground',
                        )"
                      >
                        <Icon
                          name="mdi:calendar"
                          class="mr-2 h-4 w-4 opacity-50"
                        />
                        <span>{{ value ? df.format(toDate(dateValue as DateValue, getLocalTimeZone())) : "Choose backup schedule" }}</span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="p-0">
                    <Calendar
                      v-model:placeholder="placeholder"
                      v-model="dateValue"
                      initial-focus
                      :min-value="today(getLocalTimeZone())"
                      :max-value="new CalendarDate(2025, 12, 31)"
                      :locale="'en-US'"
                      @update:model-value="(v) => {
                        if (v) {
                          dateValue = v;
                          setValue(toDate(v).toISOString());
                        }
                        else {
                          dateValue = undefined;
                          setValue(undefined);
                        }
                      }"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Configure when your automated backups should be performed
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <!-- API Access -->
        <Card class="bg-muted/40">
          <CardHeader>
            <CardTitle>API Access</CardTitle>
            <CardDescription>Manage your API keys and webhook settings</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField
              v-slot="{ value, handleChange }"
              name="apiKey"
            >
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input
                    :model-value="value"
                    type="password"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <FormDescription>
                  Your API key for accessing the platform programmatically
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="webhookUrl"
            >
              <FormItem>
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input
                    :model-value="value"
                    placeholder="https://your-domain.com/webhook"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <FormDescription>
                  URL to receive webhook notifications
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <!-- System Preferences -->
        <Card class="bg-muted/40">
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>Configure advanced system settings</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField
              v-slot="{ value, handleChange }"
              name="debugMode"
            >
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <div class="space-y-1 leading-none">
                  <FormLabel>Debug Mode</FormLabel>
                  <FormDescription>
                    Enable detailed logging for troubleshooting
                  </FormDescription>
                </div>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="betaFeatures"
            >
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <div class="space-y-1 leading-none">
                  <FormLabel>Beta Features</FormLabel>
                  <FormDescription>
                    Get early access to new features
                  </FormDescription>
                </div>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="customDomain"
            >
              <FormItem>
                <FormLabel>Custom Domain</FormLabel>
                <FormControl>
                  <Input
                    :model-value="value"
                    placeholder="https://your-domain.com"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <FormDescription>
                  Set up a custom domain for your workspace
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="analyticsEnabled"
            >
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <div class="space-y-1 leading-none">
                  <FormLabel>Usage Analytics</FormLabel>
                  <FormDescription>
                    Collect anonymous usage data to improve the platform
                  </FormDescription>
                </div>
              </FormItem>
            </FormField>

            <div class="grid grid-cols-2 gap-4">
              <FormField
                v-slot="{ value, handleChange }"
                name="timezone"
              >
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    :model-value="value"
                    @update:model-value="handleChange"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Timezones</SelectLabel>
                        <SelectItem
                          v-for="tz in timezones"
                          :key="tz.value"
                          :value="tz.value"
                        >
                          {{ tz.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your preferred timezone for logs and reports
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField
                v-slot="{ value, handleChange }"
                name="logLevel"
              >
                <FormItem>
                  <FormLabel>Log Level</FormLabel>
                  <Select
                    :model-value="value"
                    @update:model-value="handleChange"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select log level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Log Levels</SelectLabel>
                        <SelectItem
                          v-for="level in logLevels"
                          :key="level.value"
                          :value="level.value"
                        >
                          <div class="flex items-center gap-2">
                            <Icon
                              :name="level.value === 'error' ? 'mdi:alert-circle'
                                : level.value === 'warn' ? 'mdi:alert'
                                  : level.value === 'info' ? 'mdi:information'
                                    : level.value === 'debug' ? 'mdi:bug' : 'mdi:magnify'"
                              class="h-4 w-4"
                            />
                            {{ level.label }}
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the application logging level
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
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
              Save Advanced Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  </div>
</template>
