<template>
  <NuxtLink
    :to="to || href"
    :target="(blank && '_blank') || target"
  >
    <Button
      :variant
      :size
    >
      <Icon
        v-if="leftIcon"
        :name="leftIcon"
        class="mr-1"
      />
      <slot mdc-unwrap="p" />
      <Icon
        v-if="rightIcon"
        :name="rightIcon"
        class="ml-1"
      />
    </Button>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ButtonVariants } from '~/components/ui/button';

defineProps<{
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  leftIcon?: string;
  rightIcon?: string;
  to?: string;
  href?: string;
  target?: Target;
  blank?: boolean;
}>();
</script>
