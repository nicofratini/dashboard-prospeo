<script setup lang="ts">
import { toast } from 'vue-sonner';
import { object, string } from 'zod';

definePageMeta({
  layout: 'auth',
});

const {
  public: { baseUrl },
} = useRuntimeConfig();

const { auth } = useSupabaseClient();

const formSchema = toTypedSchema(
  object({
    email: string({
      required_error: 'Email is required',
      invalid_type_error: 'Invalid email',
    })
      .email({ message: 'Invalid email address' })
      .min(1),
  }),
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const passwordResetSent = ref(false);

const onCredentialsSubmit = handleSubmit(async ({ email }) => {
  const { error } = await auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/update-password`,
  });

  if (error) {
    toast.error('Error', {
      description: error.message,
      closeButton: true,
    });
    return;
  }

  passwordResetSent.value = true;
});
</script>

<template>
  <div class="flex h-screen w-full flex-col items-center md:flex-row">
    <div class="bg-muted hidden h-screen w-full md:w-1/2 lg:flex xl:w-3/5">
      <SimpleTestimonial />
    </div>
    <div
      class="flex h-screen w-full items-center justify-center px-6 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full lg:px-16 xl:w-2/5 xl:px-12"
    >
      <div class="w-full max-w-md grid gap-6">
        <Button
          class="gap-2"
          size="icon"
          variant="outline"
          @click="$router.back()"
        >
          <Icon
            size="1.7rem"
            name="mdi:keyboard-arrow-left"
            class="-ms-1"
          />
        </Button>
        <div class="grid gap-2 text-center">
          <div
            v-if="passwordResetSent"
            class="flex justify-center"
          >
            <LazyIcon
              v-auth-animate
              name="material-symbols-light:check-circle-outline-rounded"
              size="6rem"
              class="text-emerald-700"
            />
          </div>
          <h1 class="text-3xl font-bold">
            {{ passwordResetSent ? 'Check Your Inbox' : 'Reset Your Password' }}
          </h1>
          <p class="text-balance text-muted-foreground">
            {{
              passwordResetSent
                ? 'A password reset link has been sent to your email. Follow the instructions to set a new password. Didn’t get the email? Check your spam folder or try again.'
                : 'Forgot your password? No problem! Enter your email below, and we’ll send you a link to reset it.'
            }}
          </p>
        </div>
        <div class="grid gap-4">
          <form
            v-if="!passwordResetSent"
            class="grid gap-4"
            @submit="onCredentialsSubmit"
          >
            <div class="grid gap-2">
              <FormField
                v-slot="{ componentField }"
                name="email"
              >
                <FormItem v-auto-animate>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <Button
              :disabled="isSubmitting"
              type="submit"
              class="w-full"
            >
              <LazyIcon
                v-if="isSubmitting"
                size="1.5rem"
                class="mr-2"
                mode="svg"
                name="line-md:loading-twotone-loop"
              />
              Reset password
            </Button>
          </form>
          <Button
            v-else
            class="w-full"
          >
            <NuxtLink
              to="/"
              class="flex flex-row items-center justify-center gap-2"
            >
              <LazyIcon
                name="mdi:home"
                class="-ms-1 h-4 w-4"
              />
              Go back to home page
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
