<script setup lang="ts">
const { title, description, content, imgSrc } = defineProps({
  title: String,
  description: String,
  content: String,
  imgSrc: String,
});
</script>

<template>
  <Card>
    <CardHeader>
      <NuxtImg
        :src="imgSrc"
        loading="lazy"
        :alt="title"
        class="h-full rounded-lg"
      />
    </CardHeader>
    <CardContent>
      <div class="space-y-1.5 py-4">
        <CardTitle v-if="title?.length">
          {{ title }}
        </CardTitle>
        <CardDescription v-if="description?.length">
          {{ description }}
        </CardDescription>
      </div>
      <p v-if="content?.length">
        {{ content }}
      </p>
    </CardContent>
  </Card>
</template>
