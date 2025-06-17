<script setup lang="ts">
import { NuxtImg } from '#components';

interface AvatarItem {
  src: string;
  fallbackValue: string;
}

interface Props {
  avatars?: AvatarItem[];
}

withDefaults(defineProps<Props>(), {
  avatars: () => ([
    {
      src: '65a74f694f6d57df0bf605b1.jpg',
      fallbackValue: 'CN',
    },
  ]),
});
</script>

<template>
  <div class="-space-x-4 lg:-space-x-5">
    <Avatar
      v-for="(av, index) in avatars"
      :key="index"
      class="border-background border-2"
    >
      <AvatarImage
        :src="av.src"
        :as="NuxtImg"
        quality="70"
      />
      <AvatarFallback>{{ av.fallbackValue }}</AvatarFallback>
    </Avatar>
  </div>
</template>
