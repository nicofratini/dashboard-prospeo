<template>
  <header
    class="sticky top-0 z-40 bg-background/80 backdrop-blur-lg"
    :class="{ 'lg:border-b': border }"
  >
    <div
      class="flex h-20 items-center justify-between gap-2 px-4 md:px-8"
      :class="{ 'border-b lg:border-none': border, 'container max-w-screen-2xl': padded }"
    >
      <ContentLogo class="hidden flex-1 md:flex" />
      <ContentMobileNav />
      <ContentLogo
        v-if="showTitleInMobile"
        class="flex md:hidden"
      />
      <ContentNav class="hidden flex-1 lg:flex" />
      <div class="flex flex-1 justify-end gap-2">
        <LazyContentSearchButton v-if="enableSearch && !inAside && style === 'input'" />
        <div class="flex gap-2">
          <LazyContentSearchButton v-if="enableSearch && !inAside && style === 'button'" />
          <ThemeToggle v-if="darkModeToggle" />
          <template
            v-for="(link, i) in links"
            :key="i"
          >
            <TooltipProvider
              v-if="link?.tooltip"
              :delay-duration="0"
            >
              <Tooltip>
                <TooltipTrigger as-child>
                  <NuxtLink
                    :to="link?.to"
                    :target="link?.target"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      class="flex gap-2 size-10"
                    >
                      <Icon
                        v-if="link?.icon"
                        :name="link.icon"
                        :size="18"
                      />
                    </Button>
                  </NuxtLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p class="w-64">
                    {{ link?.tooltip }}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <NuxtLink
              v-else
              :to="link?.to"
              :target="link?.target"
            >
              <Button
                variant="outline"
                size="icon"
                class="flex gap-2"
              >
                <Icon
                  v-if="link?.icon"
                  :name="link.icon"
                  :size="18"
                />
              </Button>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="enable && enableInMobile"
      class="lg:hidden"
    >
      <Toc is-small />
    </div>
  </header>
</template>

<script setup lang="ts">
const { enableSearch = true } = defineProps<{
  enableSearch?: boolean;
}>();

const {
  toc: { enable, enableInMobile },
  header: { showTitleInMobile, links, darkModeToggle, border },
  search: { inAside, style },
  main: { padded },
} = useAppConfig().boilerplateDocs;
</script>
