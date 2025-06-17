<script setup lang="ts">
import { object, string, boolean } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard',
});

const navLinks = [
  { title: 'General', href: '/dashboard/settings/general' },
  { title: 'Billing', href: '/dashboard/settings/billing' },
  { title: 'Security', href: '/dashboard/settings/security' },
  { title: 'Advanced', href: '/dashboard/settings/advanced' },
];

const billingSchema = object({
  // Payment Method
  cardNumber: string().regex(/^\d{16}$/, 'Invalid card number'),
  cardExpiry: string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cardCvc: string().regex(/^\d{3,4}$/, 'Invalid CVC'),
  cardName: string().min(2, 'Name is required'),

  // Billing Address
  company: string().optional(),
  address: string().min(5, 'Address is required'),
  city: string().min(2, 'City is required'),
  state: string().min(2, 'State is required'),
  zipCode: string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: string().min(2, 'Country is required'),

  // Billing Preferences
  autoRenew: boolean(),
  emailReceipts: boolean(),
  vatNumber: string().optional(),
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(billingSchema),
  initialValues: {
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    autoRenew: true,
    emailReceipts: true,
    vatNumber: '',
  },
});

const onSubmit = handleSubmit(async () => {
  toast.success('Billing settings updated');
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
        <!-- Payment Method -->
        <Card class="bg-muted/40">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Update your payment method and card details</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField
              v-slot="{ componentField }"
              name="cardName"
            >
              <FormItem v-auto-animate>
                <FormLabel>Cardholder Name</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Name on card"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="cardNumber"
            >
              <FormItem v-auto-animate>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="1234 5678 9012 3456"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="grid grid-cols-2 gap-4">
              <FormField
                v-slot="{ componentField }"
                name="cardExpiry"
              >
                <FormItem v-auto-animate>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="MM/YY"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField
                v-slot="{ componentField }"
                name="cardCvc"
              >
                <FormItem>
                  <FormLabel>CVC</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="123"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>

        <!-- Billing Address -->
        <Card class="bg-muted/40">
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
            <CardDescription>Your billing address for invoices and tax purposes</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField
              v-slot="{ componentField }"
              name="company"
            >
              <FormItem>
                <FormLabel>Company Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Your company name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="address"
            >
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="123 Main St"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="grid grid-cols-2 gap-4">
              <FormField
                v-slot="{ componentField }"
                name="city"
              >
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="City"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField
                v-slot="{ componentField }"
                name="state"
              >
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="State"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <FormField
                v-slot="{ componentField }"
                name="zipCode"
              >
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="12345"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField
                v-slot="{ componentField }"
                name="country"
              >
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="Country"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>

        <!-- Billing Preferences -->
        <Card class="bg-muted/40">
          <CardHeader>
            <CardTitle>Billing Preferences</CardTitle>
            <CardDescription>Manage your billing preferences and settings</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField
              v-slot="{ value, handleChange }"
              name="autoRenew"
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
                    Auto-renew subscription
                  </FormLabel>
                  <FormDescription>
                    Automatically renew your subscription when it expires
                  </FormDescription>
                </div>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="emailReceipts"
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
                    Email receipts
                  </FormLabel>
                  <FormDescription>
                    Receive email receipts for all payments
                  </FormDescription>
                </div>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, handleChange }"
              name="vatNumber"
            >
              <FormItem>
                <FormLabel>VAT Number (Optional)</FormLabel>
                <FormControl>
                  <Input
                    :model-value="value"
                    placeholder="VAT number"
                    @update:model-value="handleChange"
                  />
                </FormControl>
                <FormDescription>
                  For business customers in the EU
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
          <CardFooter>
            <Button type="submit">
              Save Billing Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  </div>
</template>
