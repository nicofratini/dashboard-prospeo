<script setup lang="ts">
defineProps<{
  announcement?: {
    to?: string;
    target?: Target;
    icon?: string;
    title: string;
  };
  actions: [{
    name: string;
    leftIcon?: string;
    rightIcon?: string;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    to: string;
    target?: Target;
  }];
}>();
defineSlots<{
  title: () => string;
  description: () => string;
}>();
</script>

<template>
  <section class="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
    <NuxtLink
      v-if="announcement"
      :to="announcement.to"
      :target="announcement.target"
      class="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
    >
      <template v-if="announcement.icon">
        <Icon
          :name="announcement.icon"
          :size="16"
        />
        <Separator
          class="mx-2 h-4"
          orientation="vertical"
        />
      </template>
      <span class="sm:hidden">{{ announcement.title }}</span>
      <span class="hidden sm:inline">
        {{ announcement.title }}
      </span>
      <Icon
        name="mdi:arrow-right"
        class="ml-1 size-4"
      />
    </NuxtLink>

    <h1 class="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
      <slot
        name="title"
        mdc-unwrap="p"
      />
    </h1>
    <span class="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
      <slot
        name="description"
        mdc-unwrap="p"
      />
    </span>

    <section class="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
      <NuxtLink
        v-for="(action, i) in actions"
        :key="i"
        :to="action.to"
        :target="action.target"
      >
        <Button :variant="action.variant">
          <Icon
            v-if="action.leftIcon"
            :name="action.leftIcon"
            class="mr-1"
          />
          {{ action.name }}
          <Icon
            v-if="action.rightIcon"
            :name="action.rightIcon"
            class="ml-1"
          />
        </Button>
      </NuxtLink>
    </section>
  </section>
</template>
