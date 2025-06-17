<script setup lang="ts">
interface DirectoryItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  groups?: {
    id?: string;
    name: string;
    slug?: string;
  }[];
  featured?: boolean;
  url?: string;
}

defineProps<{
  item: DirectoryItem;
}>();

// Prevent event propagation when clicking on category badges
function handleCategoryClick(event: Event, slug?: string) {
  if (!slug) return;
  navigateTo(`/directory/categories/${slug}`);
}

// Handle tag click to navigate to tag page
function handleTagClick(event: Event, tag: string) {
  // Create a slug from the tag name
  const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
  navigateTo(`/directory/tags/${tagSlug}`);
}
</script>

<template>
  <NuxtLink
    v-if="item.url"
    :to="item.url"
    target="_blank"
    class="block h-full"
  >
    <Card
      class="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-accent/5 hover:-translate-y-1 hover:scale-[1.01] relative before:absolute before:inset-0 before:transition-colors before:pointer-events-none"
      :class="{ 'ring-1 ring-yellow-500 before:hover:bg-yellow-500/10': item.featured, 'before:hover:bg-accent/5': !item.featured }"
    >
      <div class="relative aspect-video w-full overflow-hidden bg-muted">
        <NuxtImg
          v-if="item.imageUrl"
          :src="item.imageUrl"
          :alt="item.title"
          class="h-full w-full object-cover transition-all duration-500 will-change-transform group-hover:scale-110"
          loading="lazy"
          placeholder
        />
        <div
          v-else
          class="flex h-full items-center justify-center bg-muted-foreground/20"
        >
          <Icon
            name="line-md:image"
            class="h-12 w-12 text-muted-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
          />
        </div>

        <!-- Groups overlay on image - now clickable -->
        <div
          v-if="item.groups && item.groups.length"
          class="absolute top-2 left-2 flex flex-wrap gap-1"
        >
          <Button
            v-for="group in item.groups"
            :key="group.name"
            size="sm"
            variant="ghost"
            class="h-6 text-xs backdrop-blur-md bg-black/30 text-white/80 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            @click.stop.prevent="(e) => handleCategoryClick(e, group.slug)"
          >
            {{ group.name }}
          </Button>
        </div>
      </div>

      <CardHeader class="transition-transform duration-300 group-hover:translate-y-[-2px]">
        <CardTitle class="transition-colors group-hover:text-primary">{{ item.title }}</CardTitle>
        <CardDescription class="line-clamp-4 transition-colors group-hover:text-foreground/80">{{ item.description }}</CardDescription>
      </CardHeader>

      <CardFooter
        v-if="item.tags && item.tags.length"
        class="pb-6 transition-transform duration-300 group-hover:translate-y-[-2px]"
      >
        <div class="flex flex-wrap gap-1">
          <Badge
            v-for="tag in item.tags"
            :key="tag"
            variant="secondary"
            class="text-xs cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-secondary-foreground hover:text-secondary"
            @click.stop.prevent="(e) => handleTagClick(e, tag)"
          >
            #{{ tag }}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  </NuxtLink>

  <!-- Fallback for items without URL -->
  <Card
    v-else
    class="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/5 hover:-translate-y-1 hover:scale-[1.01] relative before:absolute before:inset-0 before:transition-colors before:pointer-events-none"
    :class="{ 'ring-1 ring-warning before:hover:bg-warning/5': item.featured, 'before:hover:bg-primary/5': !item.featured }"
  >
    <div class="relative aspect-video w-full overflow-hidden bg-muted">
      <NuxtImg
        v-if="item.imageUrl"
        :src="item.imageUrl"
        :alt="item.title"
        class="h-full w-full object-cover transition-all duration-500 will-change-transform group-hover:scale-110"
        loading="lazy"
        placeholder
      />
      <div
        v-else
        class="flex h-full items-center justify-center bg-muted-foreground/20"
      >
        <Icon
          name="line-md:image"
          class="h-12 w-12 text-muted-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
        />
      </div>

      <!-- Groups overlay on image - now clickable -->
      <div
        v-if="item.groups && item.groups.length"
        class="absolute top-2 left-2 flex flex-wrap gap-1"
      >
        <Button
          v-for="group in item.groups"
          :key="group.name"
          variant="ghost"
          size="sm"
          class="h-6 text-xs backdrop-blur-sm bg-background/60 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          @click="(e) => handleCategoryClick(e, group.slug)"
        >
          {{ group.name }}
        </Button>
      </div>
    </div>

    <CardHeader class="transition-transform duration-300 group-hover:translate-y-[-2px]">
      <CardTitle class="transition-colors group-hover:text-primary">
        {{ item.title }}
      </CardTitle>
      <CardDescription class="transition-colors group-hover:text-foreground/80">
        {{ item.description }}
      </CardDescription>
    </CardHeader>

    <CardFooter
      v-if="item.tags && item.tags.length"
      class="pb-6 transition-transform duration-300 group-hover:translate-y-[-2px]"
    >
      <div class="flex flex-wrap gap-1">
        <Badge
          v-for="tag in item.tags"
          :key="tag"
          variant="secondary"
          class="text-xs cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-secondary-foreground hover:text-secondary"
          @click="(e) => handleTagClick(e, tag)"
        >
          #{{ tag }}
        </Badge>
      </div>
    </CardFooter>
  </Card>
</template>
