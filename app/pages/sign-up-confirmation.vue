<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['sign-up-confirmation'],
});

const user = useSupabaseUser();

if (user.value) {
  await navigateTo('/');
}

const route = useRoute();
const email = route.query.email as string;
</script>

<template>
  <div class="mx-auto flex h-screen w-full items-center justify-center">
    <Card class="mx-auto flex w-full flex-col justify-center md:w-1/3 md:max-h-1/2 m-6">
      <CardContent class="space-y-6 pt-6">
        <div class="flex flex-col space-y-2 text-center">
          <Icon
            name="line-md:email-opened-twotone"
            class="mx-auto size-12 text-primary"
          />
          <h1 class="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p class="text-sm text-muted-foreground">
            Thank you for signing up! We’ve sent a confirmation email to
            <span
              v-if="email"
              class="font-medium text-foreground"
            >
              {{ email }}
            </span>.
          </p>
          <p class="text-sm text-muted-foreground">
            Please check your inbox and click the verification link to activate your account.
          </p>
        </div>
      </CardContent>
      <CardFooter class="text-center flex-col md:flex-row text-sm pb-6 justify-center gap-4">
        <Button
          variant="outline"
          class="w-full"
          as-child
        >
          <NuxtLink to="/">
            <Icon
              name="line-md:home"
              class="mr-2"
            />
            Back to home
          </NuxtLink>
        </Button>
        <Button
          class="w-full"
          as-child
        >
          <NuxtLink to="/sign-in">
            Back to sign in
            <Icon
              name="line-md:arrow-right"
              class="ml-2"
            />
          </NuxtLink>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
