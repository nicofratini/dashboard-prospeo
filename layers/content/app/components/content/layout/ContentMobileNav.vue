<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="md:hidden size-8"
      >
        <Icon
          name="line-md:menu"
          mode="svg"
          class="!size-8"
        />
      </Button>
    </SheetTrigger>
    <SheetContent
      side="left"
      class="pr-0"
    >
      <div class="flex flex-col gap-4">
        <ContentLogo />
        <Aside is-mobile />
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
const open = ref(false);

// Close sheet on navigation
watch(() => useRoute().path, () => {
  open.value = false;
});
</script>
