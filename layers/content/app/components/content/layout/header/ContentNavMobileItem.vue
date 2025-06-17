<template>
  <template v-if="item.links">
    <Collapsible v-model:open="isOpen">
      <CollapsibleTrigger class="w-full p-2 text-left">
        <div class="flex w-full gap-1">
          {{ item.title }}
          <Icon
            :name="isOpen ? 'mdi:chevron-down-up' : 'mdi:chevron-up-down'"
            size="12"
            class="ml-auto self-center"
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul class="pl-2">
          <li
            v-for="link in item.links"
            :key="link.title"
          >
            <NuxtLink
              :to="link.to"
              :target="link.to"
              class="mb-1 block w-full gap-2 rounded-md px-3 py-2 transition-all hover:bg-muted"
            >
              <div class="font-semibold">
                {{ link.title }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{ link.description }}
              </div>
            </NuxtLink>
          </li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  </template>
  <NuxtLink
    v-else
    :to="item.to"
    :target="item.target"
    class="flex w-full p-2"
  >
    {{ item.title }}
    <Icon
      name="mdi:arrow-top-right"
      class="ml-1 text-muted-foreground"
      size="12"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: any;
  index: number;
}>();

const collapsed = useCollapsedMap();
const isOpen = ref(collapsed.value.get(`mobile-header-nav${props.index}`) || false);
watch(isOpen, (v) => {
  collapsed.value.set(`mobile-header-nav${props.index}`, v);
});
</script>
