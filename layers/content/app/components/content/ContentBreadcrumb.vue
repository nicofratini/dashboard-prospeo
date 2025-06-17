<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const { collection = 'docs' } = defineProps<{
  collection?: string;
}>();

const navigation = inject<Ref<ContentNavigationItem[]>>(`navigation-${collection}`);

const route = useRoute();
const segments = route.path.split('/').filter(segment => segment !== '');

let href = '';
let nav = navigation?.value;
const breadcrumbs = computed(() => {
  return segments.map((segment) => {
    segment = segment.replace('.html', '');
    href += `/${segment}`;
    const page = nav?.find(x => (x.path as string) === href);
    nav = page?.children;
    return { title: page?.title ?? segment, href };
  });
});
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="breadcrumb.title"
      >
        <BreadcrumbItem>
          <BreadcrumbLink
            as-child
            :class="{ 'text-foreground': index === breadcrumbs.length - 1 }"
          >
            <NuxtLink :href="index === 0 ? undefined : breadcrumb.href">
              {{ breadcrumb.title }}
            </NuxtLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index !== breadcrumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
