<script setup lang="ts">
const {
  variant = 'separate',
  padded = true,
  inStack = false,
} = defineProps<{
  variant?: 'separate' | 'card' | 'line';
  padded?: boolean;
  inStack?: boolean;
}>();

defineSlots<{
  default?: () => any;
}>();

const activeTabIndex = ref(0);

const iconMap = new Map(Object.entries(useAppConfig().boilerplateDocs.main.codeIcon));
function icon(props: any) {
  return props?.icon || iconMap.get(props?.filename?.toLowerCase()) || iconMap.get(props?.language);
}

function label(props: any) {
  return props?.label || props?.filename;
}
</script>

<template>
  <Tabs
    v-if="variant === 'separate'"
    class="[&:not(:first-child)]:mt-5"
    :default-value="label(($slots.default?.() ?? [])[0]?.props)"
  >
    <TabsList>
      <TabsTrigger
        v-for="(slot, i) in $slots.default?.() ?? []"
        :key="`${i}${label(slot.props)}`"
        :value="label(slot.props)"
      >
        <div class="flex flex-row">
          <Icon
            v-if="icon(slot?.props)"
            :name="icon(slot?.props)!"
            class="mr-1.5 self-center"
          />
          {{ label(slot.props) }}
        </div>
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="(slot, i) in $slots.default?.() ?? []"
      :key="`${i}${label(slot.props)}`"
      :value="label(slot.props)"
    >
      <component :is="slot" />
    </TabsContent>
  </Tabs>

  <Tabs
    v-else-if="variant === 'line'"
    class="relative mr-auto w-full [&:not(:first-child)]:mt-5"
    :default-value="label(($slots.default?.() ?? [])[0]?.props)"
  >
    <div class="flex items-center justify-between pb-3">
      <TabsList class="h-9 w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          v-for="(slot, i) in $slots.default?.() ?? []"
          :key="`${i}${label(slot.props)}`"
          :value="label(slot.props)"
          class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          <Icon
            v-if="icon(slot?.props)"
            :name="icon(slot?.props)!"
            class="mr-1.5 self-center"
          />
          {{ label(slot.props) }}
        </TabsTrigger>
      </TabsList>
    </div>

    <TabsContent
      v-for="(slot, i) in $slots.default?.() ?? []"
      :key="`${i}${label(slot.props)}`"
      :value="label(slot.props)"
      class="relative space-y-10"
    >
      <component :is="slot" />
    </TabsContent>
  </Tabs>

  <Card
    v-else-if="variant === 'card'"
    class="[&:not(:first-child)]:mt-5"
    :class="[inStack && 'mb-0 rounded-none border-none shadow-none']"
  >
    <ScrollArea>
      <div class="relative flex overflow-x-auto border-b p-0.5 text-sm">
        <div class="flex p-1">
          <div
            v-for="(slot, i) in ($slots.default?.() ?? [])"
            :key="`${i}${label(slot.props)}`"
            :value="label(slot.props)"
            class="flex cursor-pointer rounded-md px-3 py-1.5 text-muted-foreground transition-all duration-75"
            :class="[activeTabIndex === i && 'bg-muted text-primary']"
            @mousedown.left="activeTabIndex = i"
          >
            <Icon
              v-if="icon(slot?.props)"
              :name="icon(slot?.props)!"
              class="mr-1.5 self-center"
            />
            {{ label(slot.props) }}
          </div>
        </div>
        <CodeCopy
          v-if="$slots.default?.()[activeTabIndex]?.props?.code"
          class="ml-auto mr-3 self-center pl-2"
          :code="$slots.default?.()[activeTabIndex]?.props?.code"
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

    <div
      v-for="(slot, i) in $slots.default?.() ?? []"
      v-show="activeTabIndex === i"
      :key="`${i}${label(slot.props)}`"
      :value="label(slot.props)"
      class="mt-0"
      :class="[padded && ($slots.default?.()[activeTabIndex]?.type as any).tag !== 'pre' && 'p-3']"
    >
      <component
        :is="slot"
        :in-group="true"
      />
    </div>
  </Card>
</template>
