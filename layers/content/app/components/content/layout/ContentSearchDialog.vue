<script setup lang="ts">
import { VisuallyHidden } from 'reka-ui';
import Fuse from 'fuse.js';
import type { ContentNavigationItem } from '@nuxt/content';
import { useDebounceFn } from '@vueuse/core';

const open = defineModel<boolean>('open');
const colorMode = useColorMode();
const { placeholderDetailed } = useAppConfig().boilerplateDocs.search;

const activeSelect = ref(0);

const { meta_k, ctrl_k } = useMagicKeys();

whenever([meta_k, ctrl_k], () => {
  open.value = true;
});

const input = ref('');
const searchResult = ref<any[]>([]);
const searchLoading = ref(false);

const { data: files } = await useAsyncData('search-content-docs', () =>
  queryCollectionSearchSections('docs'),
{
  default: () => [],
  transform: data => data?.map(item => ({
    title: item.title,
    content: item.content?.substring(0, 200),
    id: item.id,
  })) ?? [],
},
);

const fuse = new Fuse(toValue(files.value) ?? [], {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'content', weight: 1 },
  ],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
});

const debouncedSearch = useDebounceFn(async (query: string) => {
  searchLoading.value = true;
  try {
    searchResult.value = fuse.search(query, { limit: 10 }).map(r => r.item);
  }
  finally {
    searchLoading.value = false;
  }
}, 300);

watch(input, (value) => {
  activeSelect.value = 0;
  if (!value) {
    searchResult.value = [];
    return;
  }
  debouncedSearch(value);
});

const { data: navigation } = await useAsyncData('navigation-docs', () =>
  queryCollectionNavigation('docs', ['title', 'icon', 'path', 'redirect', 'id']),
{
  server: true,
  default: () => [],
},
);

if (!navigation.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

function getItemIcon(path: string) {
  return navKeyFromPath(path, 'icon', navigation.value as ContentNavigationItem[]);
}

watch(activeSelect, (value) => {
  document.querySelector(`[id="${value}"]`)?.scrollIntoView({ block: 'nearest' });
});

function handleEnter() {
  if (searchResult.value[activeSelect.value]?.id) {
    navigateTo(searchResult.value[activeSelect.value].id);
    open.value = false;
  }
}

function handleNavigate(delta: -1 | 1) {
  const newValue = activeSelect.value + delta;
  if (newValue >= 0 && newValue < searchResult.value.length) {
    activeSelect.value = newValue;
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="p-0">
      <VisuallyHidden as-child>
        <DialogTitle />
      </VisuallyHidden>
      <VisuallyHidden as-child>
        <DialogDescription aria-describedby="undefined" />
      </VisuallyHidden>
      <Command
        v-model:search-term="input"
        class="h-svh sm:h-[350px]"
      >
        <CommandInput
          :loading="searchLoading"
          :placeholder="placeholderDetailed"
          @keydown.enter="handleEnter"
          @keydown.down="handleNavigate(1)"
          @keydown.up="handleNavigate(-1)"
        />
        <CommandList
          class="text-sm"
          @escape-key-down="open = false"
        >
          <template v-if="!input?.length">
            <template
              v-for="item in navigation"
              :key="item.path"
            >
              <CommandGroup
                v-if="item.children"
                :heading="item.title"
                class="p-1.5"
              >
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.id"
                  :to="child.path"
                >
                  <CommandItem :value="child.path">
                    <Icon
                      v-if="child.icon"
                      :name="child.icon"
                      class="mr-2 size-4"
                    />
                    <div
                      v-else
                      class="mr-2 size-4"
                    />
                    <span>{{ child.title }}</span>
                  </CommandItem>
                </NuxtLink>
              </CommandGroup>
              <CommandSeparator v-if="item.children" />
            </template>
            <CommandGroup
              heading="Theme"
              class="p-1.5"
            >
              <CommandItem
                value="light"
                @click="colorMode.preference = 'light'"
              >
                <Icon
                  name="line-md:sunny-loop"
                  mode="svg"
                  class="mr-2 size-4"
                />
                <span>Light</span>
              </CommandItem>
              <CommandItem
                value="dark"
                @click="colorMode.preference = 'dark'"
              >
                <Icon
                  name="line-md:moon-loop"
                  mode="svg"
                  class="mr-2 size-4"
                />
                <span>Dark</span>
              </CommandItem>
              <CommandItem
                value="system"
                @click="colorMode.preference = 'auto'"
              >
                <Icon
                  name="line-md:monitor"
                  mode="svg"
                  class="mr-2 size-4"
                />
                <span>System</span>
              </CommandItem>
            </CommandGroup>
          </template>

          <div
            v-else-if="searchResult?.length"
            class="p-1.5"
          >
            <NuxtLink
              v-for="(item, i) in searchResult"
              :id="i"
              :key="item.id"
              :to="item.id"
              class="flex select-none rounded-md p-2 hover:cursor-pointer hover:bg-muted"
              :class="[i === activeSelect && 'bg-muted']"
              @click="open = false; activeSelect = i;"
            >
              <Icon
                v-if="getItemIcon(item.id)"
                :name="getItemIcon(item.id)"
                class="mr-2 size-4 shrink-0 self-center"
              />
              <div
                v-else
                class="mr-2 size-4 shrink-0"
              />

              <span
                v-for="(subtitle, j) in item.titles"
                :key="`${subtitle}${j}`"
                class="flex shrink-0 self-center"
              >
                {{ subtitle }}
                <Icon
                  name="mdi:chevron-right"
                  class="mx-0.5 self-center text-muted-foreground"
                />
              </span>
              <span class="shrink-0 self-center">
                {{ item.title }}
              </span>
              <span
                class="ml-2 self-center truncate text-xs text-muted-foreground"
              >
                {{ item.content }}
              </span>
            </NuxtLink>
          </div>

          <div
            v-else
            class="pt-4 text-center text-muted-foreground"
          >
            No results found.
          </div>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>
