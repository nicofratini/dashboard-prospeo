<template>
  <Button
    v-if="style === 'input'"
    variant="outline"
    class="h-10 w-full self-center rounded-md pr-1.5 font-normal text-muted-foreground hover:text-accent-foreground"
    :class="[inAside ? 'mb-4' : 'md:w-40 lg:w-64']"
    @click="isOpen = true"
  >
    <span class="mr-auto overflow-hidden">
      {{ placeholder }}
    </span>
    <ContentKbd class="ml-auto hidden md:block">
      <span class="text-xs">⌘</span>K
    </ContentKbd>
  </Button>
  <Button
    v-else
    variant="ghost"
    size="icon"
    @click="isOpen = true"
  >
    <Icon
      name="mdi:magnify"
      size="16"
    />
  </Button>

  <ClientOnly>
    <LazyContentSearchDialog v-model:open="isOpen" />
  </ClientOnly>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const { inAside, style, placeholder } = useAppConfig().boilerplateDocs.search;
</script>
