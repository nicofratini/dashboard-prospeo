<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    default: () => ({ statusCode: 500 }),
  },
});

const errorMessages: Record<number, string> = {
  400: 'Oops! It looks like there was a bad request. Please check your input and try again.',
  401: 'Sorry, you are not authorized to access this page. Please log in and try again.',
  403: 'Access Denied! You do not have permission to view this page.',
  404: 'Whoops! The page you are looking for cannot be found. It might have been moved or deleted.',
  500: 'Something went wrong on our end. Please try again later or contact support.',
  502: 'Bad Gateway! There seems to be an issue with the server. Please try again later.',
  503: 'Service Unavailable! Our servers are currently overloaded. Please try again in a few minutes.',
  504: 'Gateway Timeout! The server took too long to respond. Please try again later.',
};

const errorMessage = computed(() => errorMessages[props?.error?.statusCode || 0] || 'An unexpected error occurred');
</script>

<template>
  <NuxtLayout name="default">
    <div class="relative flex flex-col items-center justify-center min-h-[calc(100vh-20vh-300px)] py-12 sm:px-12 lg:px-24">
      <NuxtImg
        src="not-found.svg"
        alt="Page not found"
        class="absolute inset-0 md:w-5/6 lg:w-full h-full object-cover opacity-60 hidden sm:block"
      />

      <div class="relative z-10 bg-background/10 md:bg-background/20 backdrop-blur-lg p-6 md:p-8 lg:p-12 rounded-2xl shadow-lg max-w-md md:max-w-lg lg:max-w-2xl text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground drop-shadow-xl">
          {{ error?.statusCode }}
        </h1>
        <p class="text-lg md:text-xl mt-4 text-foreground drop-shadow-xl">
          {{ errorMessage }}
        </p>
        <Button
          as-child
          size="lg"
          class="mt-6 w-full md:w-auto"
        >
          <NuxtLink to="/">
            Go back to Homepage
          </NuxtLink>
        </Button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang=""></style>
