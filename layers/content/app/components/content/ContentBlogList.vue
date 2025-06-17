<script setup lang="ts">
import type { BlogPost } from '~/types';

defineProps<{
  posts: BlogPost[];
}>();
</script>

<template>
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 gap-8">
      <!-- Featured (First) Post -->
      <div
        v-if="posts?.[0]"
        class="w-full relative group"
      >
        <div class="flex flex-col md:flex-row gap-8 mb-8">
          <NuxtLink
            :to="posts[0].path"
            class="md:w-1/2 overflow-hidden rounded-lg"
          >
            <NuxtImg
              v-if="posts[0].image"
              :src="posts[0].image.src"
              :alt="posts[0].title"
              class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
              preload
              placeholder
            />
          </NuxtLink>
          <div class="md:w-1/2">
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{{ new Date(posts[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
              <span v-if="posts[0].badge">•</span>
              <span
                v-if="posts[0].badge"
                class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs"
              >
                {{ posts[0].badge.label }}
              </span>
            </div>
            <NuxtLink :to="posts[0].path">
              <h2 class="text-3xl font-bold mb-3 hover:text-primary transition-colors">
                {{ posts[0].title }}
              </h2>
            </NuxtLink>
            <p class="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              {{ posts[0].description }}
            </p>
            <div
              v-if="posts[0].authors?.length"
              class="flex items-center gap-3"
            >
              <div
                v-for="author in posts[0].authors"
                :key="author.name"
                class="flex items-center gap-2"
              >
                <NuxtLink :to="author.to">
                  <NuxtImg
                    v-if="author.avatar"
                    :src="author.avatar.src"
                    :alt="author.name"
                    class="size-8 rounded-full object-cover"
                    preload
                    placeholder
                  />
                </NuxtLink>
                <NuxtLink
                  :to="author.to"
                  class="hover:text-primary transition-colors text-muted-foreground"
                >
                  {{ author.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Grid Posts -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="post in posts?.slice(1)"
          :key="post.id"
          class="flex flex-col group"
        >
          <NuxtLink
            :to="post.path"
            class="mb-4 overflow-hidden rounded-lg"
          >
            <NuxtImg
              v-if="post.image"
              :src="post.image.src"
              :alt="post.title"
              class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              placeholder
            />
          </NuxtLink>
          <div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{{ new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
              <span v-if="post.badge">•</span>
              <span
                v-if="post.badge"
                class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs"
              >
                {{ post.badge.label }}
              </span>
            </div>
            <NuxtLink :to="post.path">
              <h2 class="text-xl font-bold mb-2 hover:text-primary transition-colors">
                {{ post.title }}
              </h2>
            </NuxtLink>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ post.description }}
            </p>
            <div
              v-if="post.authors?.length"
              class="flex items-center gap-3 mt-auto"
            >
              <div
                v-for="author in post.authors"
                :key="author.name"
                class="flex items-center gap-2"
              >
                <NuxtLink :to="author.to">
                  <NuxtImg
                    v-if="author.avatar"
                    :src="author.avatar.src"
                    :alt="author.name"
                    class="size-6 rounded-full object-cover"
                    loading="lazy"
                    placeholder
                  />
                </NuxtLink>
                <NuxtLink
                  :to="author.to"
                  class="hover:text-primary transition-colors text-muted-foreground"
                >
                  {{ author.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
