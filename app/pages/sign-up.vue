<script setup lang="ts">
import { toast } from 'vue-sonner';
import { object, string } from 'zod';

definePageMeta({
  layout: 'auth',
});
const { auth } = useSupabaseClient();
const { query } = useRoute();
const { name } = useAppConfig().general;

const {
  public: { baseUrl },
} = useRuntimeConfig();

const formSchema = toTypedSchema(
  object({
    email: string({
      required_error: 'Email is required',
      invalid_type_error: 'Invalid email',
    }).email({ message: 'Invalid email address' }),
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

const onSubmit = handleSubmit(async ({ email, password }) => {
  const { error } = await auth.signUp({
    email,
    password,
  });

  if (error) {
    toast.error('Error', {
      description: error.message,
      closeButton: true,
    });
    return;
  }

  await navigateTo(`/sign-up-confirmation?email=${email}`);
});

const signInWithOAuth = () => {
  toast.promise(auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/api/auth/callback?redirect_to=${(query.redirect as string) ?? '/'}`,
    },
  }), {
    loading: 'Requesting login...',
    success: () => {
      return 'Redirecting...';
    },
    error: (error: any) => {
      console.error(error);
      return 'Error';
    },
  });
};
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
          <h1 class="text-3xl font-bold">
            Create your free account in 30 seconds
          </h1>
          <p class="text-balance text-muted-foreground">
            Join thousands of entrepreneurs who are building their startups with
            <strong class="text-primary"> {{ name }} </strong>.
          </p>
        </div>
        <div class="grid gap-4">
          <form
            class="grid gap-4"
            @submit="onSubmit"
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
                      placeholder="Enter email to get started"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="grid gap-2">
              <FormField
                v-slot="{ componentField }"
                name="password"
              >
                <FormItem v-auto-animate>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password to get started"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <Button
              type="submit"
              class="w-full"
              :disabled="isSubmitting"
            >
              <LazyIcon
                v-if="isSubmitting"
                size="1.5rem"
                class="mr-2"
                mode="svg"
                name="line-md:loading-twotone-loop"
              />
              Sign Up
            </Button>
          </form>
          <Separator label="Or" />
          <Button
            variant="outline"
            class="w-full"
            @click="signInWithOAuth"
          >
            <Icon
              name="logos:google-icon"
              class="-ms-1 h-4 w-4 mr-2"
            />
            <span>Sign up with Google</span>
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <NuxtLink
            to="/sign-in"
            class="underline"
          >
            Sign in
          </NuxtLink>
        </div>
        <div class="mt-4 text-center text-sm">
          <p class="text-balance text-muted-foreground font-light">
            By signing up, I agree to the
            <NuxtLink
              to="/privacy-policy"
              class="underline-offset-4 underline"
            >
              Privacy Policy
            </NuxtLink>
            and
            <NuxtLink
              to="/terms-of-service"
              class="underline-offset-4 underline"
            >
              Terms of Service
            </NuxtLink>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
