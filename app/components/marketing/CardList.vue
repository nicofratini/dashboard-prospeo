<script setup lang="ts">
interface CardItem {
  title: string;
  description: string;
  content: string;
  buttonText?: string;
  alignItemsCenter?: boolean;
  iconName?: string;
}

interface CardListProps {
  title?: string;
  items?: CardItem[];
  cardsBorder?: boolean;
  description?: string;
}

withDefaults(defineProps<CardListProps>(), {
  title: 'Listen, learn, and act on customer feedback',
  items: () => [],
  cardsBorder: false,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
});
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-16">
    <div class="flex flex-col text-center items-center justify-center gap-4 max-w-3xl">
      <h2 class="font-bold text-4xl">
        {{ title }}
      </h2>
      <p class="text-muted-foreground text-xl text-center">
        {{ description }}
      </p>
    </div>

    <div
      v-if="items"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <Motion
        v-for="(item, i) in items"
        :key="`item.title-${i}`"
        preset="popVisibleOnce"
        :delay="i * 100"
        :duration="600"
      >
        <Card
          class="flex flex-col cursor-pointer justify-between h-full shadow-none hover:scale-105 transition-transform duration-300"
          :class="cardsBorder ? '' : 'border-none'"
        >
          <CardHeader
            class="flex"
            :class="item.alignItemsCenter ? 'items-center' : ''"
          >
            <Icon
              v-if="item.iconName"
              :name="item.iconName"
              class="size-12 my-6 text-primary"
            />
            <CardTitle class="text-center">
              {{ item.title }}
            </CardTitle>
            <CardDescription>{{ item.description }}</CardDescription>
          </CardHeader>
          <CardContent>
            <p :class="item.alignItemsCenter ? 'text-center' : ''">
              {{ item.content }}
            </p>
          </CardContent>
          <CardFooter
            v-if="item.buttonText"
            class="w-full flex pb-6"
            :class="item.alignItemsCenter ? 'justify-center' : 'justify-start'"
          >
            <Button>{{ item.buttonText }}</Button>
          </CardFooter>
        </Card>
      </Motion>
    </div>
  </div>
</template>
