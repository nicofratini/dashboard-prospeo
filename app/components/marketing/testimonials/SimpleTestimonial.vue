<script setup lang="ts">
const { general: { name } } = useAppConfig();
</script>

<template>
  <div class="flex flex-col justify-center items-center p-24 gap-12">
    <div class="flex flex-row justify-between items-center gap-2">
      <BrandLogo />
      <h2 class="font-bold text-4xl font-brand">
        {{ name }}
      </h2>
    </div>

    <div class="flex flex-col justify-center items-center px-12 gap-6">
      <p class="w-4/5 font-bold text-2xl">
        “This library has saved me countless hours of work and helped me deliver
        stunning designs to my clients faster
        than ever before.”
      </p>
      <p class="text-bold text-muted-foreground font-mono">
        John S. - Founder of Serious app
      </p>
    </div>
  </div>
</template>
