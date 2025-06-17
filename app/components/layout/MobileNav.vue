<script setup lang="ts">
const open = ref(false);

const { links = useAppConfig().navigation.links } = defineProps<{
  links?: any[];
}>();
// Close sheet on navigation
watch(() => useRoute().path, () => {
  open.value = false;
});
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="lg:hidden size-8"
      >
        <Icon
          v-if="open"
          name="line-md:menu-to-close-alt-transition"
          mode="svg"
          class="!size-8"
        />
        <Icon
          v-else
          name="line-md:close-to-menu-alt-transition"
          mode="svg"
          class="!size-8"
        />
      </Button>
    </SheetTrigger>
    <SheetContent
      side="left"
      class="pr-0 w-72"
    >
      <div class="flex flex-col gap-2 pr-6 pb-6">
        <ContentLogo />
        <template
          v-for="(link, index) in links"
          :key="index"
        >
          <NuxtLink
            v-if="!link.links"
            :to="link.to"
            class="flex h-8 items-center gap-2 rounded-md p-2 text-md text-foreground/80 hover:bg-muted hover:text-primary"
          >
            {{ link.title }}
          </NuxtLink>
          <Collapsible v-else>
            <CollapsibleTrigger class="px-2 text-md flex items-center text-foreground/80 gap-2 rounded-md h-8">
              {{ link.title }}
              <Icon
                name="mdi:chevron-up-down"
                class="ml-auto self-center"
              />
            </CollapsibleTrigger>
            <CollapsibleContent class="pl-4">
              <NuxtLink
                v-for="subLink in link.links"
                :key="subLink.title"
                :to="subLink.to"
                class="flex flex-col items-start rounded-md p-1 text-md text-foreground/80 hover:bg-muted hover:text-primary"
              >
                <span class="font-semibold">
                  {{ subLink.title }}
                </span>
                <span class="text-sm text-muted-foreground">
                  {{ subLink.description }}
                </span>
              </NuxtLink>
            </CollapsibleContent>
          </Collapsible>
        </template>
      </div>
    </SheetContent>
  </Sheet>
</template>
