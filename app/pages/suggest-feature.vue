<script setup lang="ts">
const { name } = useAppConfig().general;
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-20 my-16">
    <HeroCard animation-enabled>
      <template #title>
        Help us improve <span class="font-brand bg-gradient-to-r from-violet-600 via-blue-300 to-emerald-300 bg-clip-text text-transparent">{{ name }}</span><br>
        with your suggestions
      </template>
      <template #description>
        We value your input! Share your ideas for new features or improvements that would make Nuxtbe
        even better. Your feedback helps us build the tools you need to succeed. Together, we can create a more powerful platform for everyone.
      </template>
    </HeroCard>
    <LazySuggestFeature />
  </div>
</template>
