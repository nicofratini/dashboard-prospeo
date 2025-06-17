<template>
  <div>
    <NuxtLink
      class="flex flex-row gap-2 items-center justify-start md:justify-center"
      to="/"
    >
      <BrandLogo />
      <span
        v-if="showTitle && title"
        class="text-2xl font-extrabold text-foreground font-brand"
      >
        {{ siteName }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { title, showTitle } = useAppConfig().boilerplateDocs.header;
const { general: {
  name: siteName,
} } = useAppConfig();
</script>
