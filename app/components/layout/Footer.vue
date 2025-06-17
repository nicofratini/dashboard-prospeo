<script setup lang="ts">
const { general: { name } } = useAppConfig();
</script>

<template>
  <footer class="min-h-[300px] border-t border-muted p-6 md:p-24">
    <div class="flex flex-col gap-6 md:flex-row md:justify-between">
      <div class="flex w-full flex-col items-start justify-center gap-2 md:w-1/3">
        <div class="flex flex-row items-center justify-center gap-2 align-middle">
          <BrandLogo />
          <span class="bg-gradient-to-r from-emerald-500 via-blue-300 to-indigo-600 bg-clip-text font-brand text-2xl font-extrabold text-transparent">
            {{ name }}
          </span>
        </div>
        <span class="mt-2 text-sm text-muted-foreground">
          Make your idea a reality in days with {{ name }}<br>
          Copyright © {{ new Date().getFullYear() }} - All rights reserved
        </span>
        <Button
          as-child
          size="xs"
          variant="outline"
        >
          <NuxtLink
            to="https://nuxtbe.dev"
            target="_blank"
            external
          >
            <Icon
              name="line-md:heart"
              mode="svg"
              class="size-4 text-emerald-700"
            />
            Crafted with Nuxtbe
          </NuxtLink>
        </Button>
      </div>

      <div class="flex w-full flex-col items-start justify-start gap-2 md:w-1/3">
        <span class="text-xl font-bold">About</span>
        <NuxtLink
          to="/contact"
          class="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Contact us
        </NuxtLink>
        <NuxtLink
          to="/terms-of-service"
          class="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          About Us
        </NuxtLink>
        <NuxtLink
          to="/faq"
          class="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          FAQ
        </NuxtLink>
      </div>

      <div class="flex w-1/3 flex-col items-start justify-start gap-2">
        <span class="text-xl font-bold">Legal</span>
        <NuxtLink
          to="/terms-of-service"
          class="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Terms of Services
        </NuxtLink>
        <NuxtLink
          to="/privacy-policy"
          class="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Privacy Policy
        </NuxtLink>
        <NuxtLink
          to="/license"
          class="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Terms of License
        </NuxtLink>
      </div>

      <div class="flex w-1/3 flex-col items-start justify-start gap-4">
        <span class="text-xl font-bold">Follow Us</span>
        <div class="flex flex-row items-center justify-start gap-4">
          <Button
            as-child
            variant="outline"
            size="icon"
            class="rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md hover:border-primary/50"
          >
            <NuxtLink
              to="https://x.com/stvladyslav"
              target="_blank"
              external
            >
              <Icon
                name="mdi:twitter"
                class="size-4"
              />
            </NuxtLink>
          </Button>
          <Button
            as-child
            variant="outline"
            size="icon"
            class="rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md hover:border-primary/50"
          >
            <NuxtLink
              to="https://linkedin.com/in/stvladyslav"
              target="_blank"
              external
            >
              <Icon
                name="mdi:linkedin"
                class="size-4"
              />
            </NuxtLink>
          </Button>
          <Button
            as-child
            variant="outline"
            size="icon"
            class="rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md hover:border-primary/50"
          >
            <NuxtLink
              to="https://github.com/stvladyslav"
              target="_blank"
              external
            >
              <Icon
                name="mdi:github"
                class="size-4"
              />
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </footer>
</template>
