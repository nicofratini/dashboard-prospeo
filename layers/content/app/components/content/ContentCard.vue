<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  footer?: string;
  content?: string;
  to?: string;
  target?: Target;
  icon?: string;
  inStack?: boolean;
}>();

defineSlots<{
  title?: () => string;
  description?: () => string;
  content?: () => string;
  default?: () => any;
  footer?: () => string;
}>();
</script>

<template>
  <div class="group-has-[div]:mt-0 [&:not(:first-child)]:mt-5">
    <NuxtLink
      :to
      :target
    >
      <Card
        class="relative h-full transition-all"
        :class="[
          to && 'hover:bg-muted',
          inStack && 'mb-0 rounded-none border-none shadow-none',
        ]"
      >
        <CardHeader v-if="icon || title || $slots.title || description || $slots.description">
          <Icon
            v-if="icon"
            class="mb-2"
            :name="icon"
            :size="24"
          />
          <CardTitle v-if="title || $slots.title">
            <slot
              name="title"
              mdc-unwrap="p"
            />
            {{ title }}
          </CardTitle>
          <CardDescription v-if="description || $slots.description">
            <slot
              name="description"
              mdc-unwrap="p"
            />
            {{ description }}
          </CardDescription>
        </CardHeader>
        <CardContent v-if="content || $slots.content || $slots.default">
          <slot
            name="content"
            mdc-unwrap="p"
          />
          <slot
            name="default"
            mdc-unwrap="p"
          />
        </CardContent>
        <CardFooter v-if="footer || $slots.footer">
          <slot
            name="footer"
            mdc-unwrap="p"
          />
          {{ footer }}
        </CardFooter>
        <Icon
          v-if="to"
          name="mdi:arrow-top-right"
          class="absolute right-4 top-4"
        />
      </Card>
    </NuxtLink>
  </div>
</template>
