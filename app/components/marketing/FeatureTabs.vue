<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';

interface TabItem {
  iconName: string;
  text: string;
  description: string;
  pros: string[];
}

interface Props {
  items?: TabItem[];
  // defaultTab is built by converting tab text to lowercase and replacing spaces with underscores
  // e.g. "Quick Start" becomes "quick_start"
  defaultTab?: string;
}

withDefaults(defineProps<Props>(), {
  items: () => ([
    {
      iconName: 'mdi:home-outline',
      text: 'Tab 1',
      description: 'Manage your email settings and preferences.',
      pros: ['Easy to use', 'Customizable', 'Secure'],
    },
    {
      iconName: 'mdi:home-outline',
      text: 'Tab 2',
      description: 'Manage your email settings and preferences.',
      pros: ['Easy to use', 'Customizable', 'Secure'],
    },
    // ... remove other default items
  ]),
});

const gridColsValues = [
  'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
  'grid-cols-5', 'grid-cols-6', 'grid-cols-7', 'grid-cols-8',
  'grid-cols-9', 'grid-cols-10', 'grid-cols-11', 'grid-cols-12',
];
</script>

<template>
  <Tabs
    :default-value="defaultTab"
    class="w-full"
  >
    <TabsList
      class="grid w-full"
      :class="gridColsValues[items.length-1]"
    >
      <TabsTrigger
        v-for="(tab, index) in items"
        :key="index"
        as-child
        :value="tab.text.toLowerCase().replace(/\s+/g, '_')"
      >
        <div class="flex flex-row items-center justify-center space-x-2 cursor-pointer">
          <Icon
            v-if="tab.iconName"
            :name="tab.iconName"
            class="size-8 md:size-6"
          />
          <p class="text-lg hidden md:block">
            {{ tab.text }}
          </p>
        </div>
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="(tab, i) in items"
      :key="i"
      :value="tab.text.toLowerCase().replace(/\s+/g, '_')"
    >
      <Card>
        <CardHeader>
          <CardTitle>{{ tab.text }}</CardTitle>
          <CardDescription>
            {{ tab.description }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="space-y-1">
            <ul class="space-y-1">
              <li
                v-for="(text, idx) in tab.pros"
                :key="idx"
                class="flex items-center space-x-2"
              >
                <Icon
                  name="mdi:check"
                  size="20px"
                />
                <span>{{ text }}</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</template>
