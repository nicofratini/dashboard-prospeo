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
const {
  public: { baseUrl },
} = useRuntimeConfig();

const { query } = useRoute();

const formSchema = toTypedSchema(
  object({
    email: string()
      .email({ message: 'Invalid email address' })
      .min(1, { message: 'Email is required' })
      .max(32, { message: 'Email must be less than 32 characters' }),
  }),
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const otpSent = ref(false);
const submitScreenEmailValue = ref('');

const signInWithOtp = handleSubmit(async ({ email }: { email: string }) => {
  try {
    const { error } = await auth.signInWithOtp({ email });
    if (error) {
      toast.error('Error', {
        description: error.message,
        closeButton: true,
      });
      return;
    }
  }
  catch (error) {
    console.error('Error during OTP sign-in:', error);
    toast.error('Error', {
      description: (error as { message: string }).message,
      closeButton: true,
    });
    return;
  }

  submitScreenEmailValue.value = email;
  otpSent.value = true;
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
      <Motion
        preset="fade"
        class="w-full max-w-md grid gap-6"
      >
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
            v-if="otpSent"
            class="flex justify-center"
          >
            <Motion
              preset="slideVisibleOnceLeft"
              :duration="300"
            >
              <LazyIcon
                name="mdi:email-fast-outline"
                size="5rem"
              />
            </Motion>
          </div>
          <h1 class="text-3xl font-bold">
            {{ otpSent ? 'Check your email' : 'Login to your account' }}
          </h1>
          <p
            v-if="!otpSent"
            class="text-balance text-muted-foreground"
          >
            Enter your email to receive a magic-link. 👋
          </p>
        </div>
        <Motion
          v-if="otpSent"
          preset="fade"
          class="grid gap-4"
        >
          <div class="flex flex-col justify-center items-center gap-2 text-center">
            <p>We’ve just sent you a unique sign-in link to your email: {{ submitScreenEmailValue }}</p>
            <p class="text-balance text-muted-foreground text-green-700 text-sm">
              Can take up to 10 minutes to arrive. Make sure to check your spam folder if you don't see it.
            </p>
          </div>
          <div class="flex justify-center w-full">
            <Button
              class="w-full"
              variant="outline"
              as-child
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
        </Motion>
        <div
          v-else
          class="grid grid-gap-6"
        >
          <div class="grid gap-4">
            <form
              class="grid gap-4"
              @submit="signInWithOtp"
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
                Login via magic link
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
              <NuxtLink to="/sign-in">
                <Icon
                  name="mdi:password"
                  class="-ms-1 h-4 w-4 mr-2"
                />
                Login with password
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
      </Motion>
    </div>
  </div>
</template>
