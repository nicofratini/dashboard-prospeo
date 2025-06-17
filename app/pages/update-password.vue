<script setup lang="ts">
import { toast } from 'vue-sonner';
import { object, string } from 'zod';

definePageMeta({
  layout: 'auth',
});

const { auth } = useSupabaseClient();

const formSchema = toTypedSchema(
  object({
    password: string({
      required_error: 'Password is required',
    })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(32, { message: 'Password must be at most 32 characters long' }),
  }),
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const passwordUpdated = ref(false);

const onCredentialsSubmit = handleSubmit(async ({ password }) => {
  const { error } = await auth.updateUser({ password });

  if (error) {
    toast.error('Error', {
      description: error.message,
      closeButton: true,
    });
    return;
  }

  passwordUpdated.value = true;
});
</script>

<template>
  <div>
    <div class="flex h-screen w-full flex-col items-center md:flex-row">
      <div class="bg-muted hidden h-screen w-full md:w-1/2 lg:flex xl:w-3/5">
        <SimpleTestimonial />
      </div>
      <div
        class="flex h-screen w-full items-center justify-center px-6 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full lg:px-16 xl:w-2/5 xl:px-12"
      >
        <div class="w-full max-w-md grid gap-6">
          <div class="grid gap-2 text-center">
            <div
              v-if="passwordUpdated"
              class="flex justify-center"
            >
              <LazyIcon
                v-auth-animate
                name="mdi:check-circle-outline"
                size="6rem"
                class="text-emerald-700"
              />
            </div>
            <h1 class="text-3xl font-bold">
              {{ passwordUpdated ? 'Password Changed!' : 'Reset your password' }}
            </h1>
            <p class="text-balance text-muted-foreground">
              {{ passwordUpdated ? 'Your password has been changed successfully!' : 'Write new password' }}
            </p>
          </div>
          <div class="grid gap-4">
            <form
              v-if="!passwordUpdated"
              class="grid gap-4"
              @submit="onCredentialsSubmit"
            >
              <div class="grid gap-2">
                <FormField
                  v-slot="{ componentField }"
                  name="password"
                >
                  <FormItem v-auto-animate>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
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
              v-if="passwordUpdated"
              class="w-full"
              as-child
            >
              <NuxtLink to="/">
                <Icon
                  name="mdi:home"
                  class="-ms-1 h-4 w-4 mr-2"
                />
                Go back to home page
              </NuxtLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
