<script setup lang="ts">
import { toast } from 'vue-sonner';
import { object, string } from 'zod';

definePageMeta({
  layout: 'auth',
});

const user = useSupabaseUser();

if (user.value) {
  navigateTo('/', { replace: true });
}

const { auth } = useSupabaseClient();
const { query } = useRoute();
const {
  public: { baseUrl },
} = useRuntimeConfig();

const formSchema = toTypedSchema(
  object({
    email: string({
      required_error: 'Email is required',
      invalid_type_error: 'Invalid email',
    })
      .email({ message: 'Invalid email address' })
      .min(1),
    password: string({
      required_error: 'Password is required',
    }).min(1, { message: 'Password cannot be blank' }),
  }),
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const onCredentialsSubmit = handleSubmit(async ({ email, password }) => {
  try {
    const { error } = await auth.signInWithPassword({ email, password });
    if (error) {
      toast.error('Error', {
        description: error.message,
      });
      return;
    }
  }
  catch (error) {
    console.error('Error during password sign-in:', error);
    toast.error('Error', {
      description: (error as { message: string }).message,
      closeButton: true,
    });
    return;
  }

  const redirectUrl = query.redirect ? `${query.redirect}?prefilled_email=${email}` : '/';

  await navigateTo(redirectUrl, { external: isExternalUri(redirectUrl) });
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
            Login to your account
          </h1>
          <p class="text-balance text-muted-foreground">
            Hey, welcome back! 👋
          </p>
        </div>
        <div class="grid gap-4">
          <form
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
            <div class="grid gap-2">
              <FormField
                v-slot="{ componentField }"
                name="password"
              >
                <FormItem v-auto-animate>
                  <div class="flex justify-between">
                    <FormLabel class="flex items-center">
                      Password
                    </FormLabel>
                    <NuxtLink
                      to="/forgot-password"
                      class="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </NuxtLink>
                  </div>
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
              Login
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
            <span>Sign In with Google</span>
          </Button>
          <Button
            as-child
            variant="outline"
            class="w-full"
          >
            <NuxtLink to="/sign-in-otp">
              <Icon
                name="mdi:link-variant"
                class="-ms-1 h-4 w-4 mr-2"
              />
              Login via magic link
            </NuxtLink>
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <NuxtLink
            to="/sign-up"
            class="underline"
          >
            Sign up
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
