<script setup lang="ts">
import type { DocsCollectionItem } from '@nuxt/content';

const page = inject<Ref<DocsCollectionItem>>(useRoute().path);

const { enableTocLinks = true } = defineProps<{ isSmall: boolean; enableTocLinks?: boolean }>();

const {
  boilerplateDocs: {
    toc: { title, links },
    header: { border },
  },
} = useAppConfig();

const isOpen = ref(false);
</script>

<template>
  <ScrollArea
    v-if="!isSmall"
    orientation="vertical"
    class="z-30 hidden h-[calc(100vh-6.5rem)] overflow-y-auto md:block lg:block"
    type="hover"
  >
    <p class="mb-2 text-base font-semibold">
      {{ title }}
    </p>
    <TocTree
      v-if="page?.body?.toc?.links"
      :links="page?.body?.toc?.links.filter((x: any) => x.id !== 'hide-toc')"
      :level="0"
      :class="[links.length && enableTocLinks && 'border-b pb-5']"
    />
    <div
      v-if="links && enableTocLinks"
      class="pt-5 text-muted-foreground"
    >
      <NuxtLink
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
        :target="link.target"
        class="flex w-full gap-1 underline-offset-4 hover:underline [&:not(:first-child)]:pt-3"
      >
        <Icon
          v-if="link.icon"
          :name="link.icon"
          class="mr-1 self-center"
        />
        {{ link.title }}
        <Icon
          name="mdi:arrow-top-right"
          class="ml-auto self-center text-muted-foreground"
          size="13"
        />
      </NuxtLink>
    </div>
  </ScrollArea>
  <Collapsible
    v-else
    v-model:open="isOpen"
    class="block w-full text-sm lg:hidden"
    :class="{ 'border-b': border }"
  >
    <CollapsibleTrigger class="flex w-full px-4 py-3 text-left font-medium">
      {{ title }}
      <Icon
        name="mdi:chevron-right"
        class="ml-auto self-center transition-all"
        :class="[isOpen && 'rotate-90']"
      />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <TocTree
        v-if="page?.body?.toc?.links"
        :links="page?.body?.toc?.links"
        :level="0"
        class="mx-4 mb-3 border-l pl-4 text-sm"
      />
    </CollapsibleContent>
  </Collapsible>
</template>
