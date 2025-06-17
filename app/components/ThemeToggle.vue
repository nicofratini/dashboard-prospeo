<script setup lang="ts">
const colorMode = useColorMode();
</script>

<template>
  <Button
    variant="outline"
    size="icon"
    class="size-10"
    @click="colorMode.preference == 'light' ? colorMode.preference = 'dark' : colorMode.preference = 'light'"
  >
    <LazyIcon
      v-if="colorMode.preference == 'dark'"
      name="line-md:moon-alt-to-sunny-outline-loop-transition"
      mode="svg"
      class="!size-5 text-yellow-400"
    />
    <LazyIcon
      v-else
      name="line-md:sunny-outline-to-moon-alt-loop-transition"
      mode="svg"
      class="!size-5 text-blue-600"
    />
  </Button>
</template>
