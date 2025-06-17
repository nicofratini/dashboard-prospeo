<script setup lang="ts">
// Props interface defining the component's input properties
interface Props {
  columns?: number; // Number of columns in the icon grid
  rows?: number; // Number of rows in the icon grid
  reversed?: boolean; // Controls flex direction of content
  badge?: string; // Badge text displayed above title
  title?: string; // Main heading text
  description?: string; // Description text below title
  icons?: string[]; // Array of icon names to display in grid
}

// Define props with default values
const props = withDefaults(defineProps<Props>(), {
  columns: 5,
  rows: 3,
  reversed: false,
  icons: () => ['logos:kickstarter-icon', 'logos:twitter', 'logos:google-icon', 'logos:discord-icon', 'logos:spotify-icon'],
});

// Calculate total number of icon slots needed based on grid dimensions
const totalIcons = computed(() => props.columns * props.rows);

// Create array of icons, repeating if needed to fill grid
const repeatedIcons = computed(() => {
  const repeated = [...props.icons];
  // Keep adding icons until I have enough to fill the grid
  while (repeated.length < totalIcons.value) {
    repeated.push(...props.icons);
  }
  // Trim to exact size needed
  return repeated.slice(0, totalIcons.value);
});
</script>

<template>
  <div
    class="flex justify-center items-center gap-6 w-full my-12"
    :class="[reversed ? 'flex-col-reverse' : 'flex-col']"
  >
    <!-- Text content section -->
    <div class="flex flex-col justify-start items-center gap-4 w-full text-center max-w-3xl">
      <Badge
        v-if="badge"
        variant="outline"
        class="bg-gradient-to-r from-violet-600 via-blue-300 to-emerald-300 bg-clip-text border-indigo-700 text-transparent font-medium font-accent"
      >
        {{ badge }}
      </Badge>
      <h2
        v-if="title"
        class="text-4xl font-bold"
      >
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="text-muted-foreground"
      >
        {{ description }}
      </p>
    </div>
    <!-- Icon grid container with radial gradient mask -->
    <div
      class="flex justify-between w-full max-w-4xl [mask:radial-gradient(60%_60%_at_50%,rgba(0,0,0,0.9)_45%,rgba(0,0,0,0)_100%)]"
    >
      <!-- Column loop -->
      <div
        v-for="colIndex in columns"
        :key="colIndex"
        class="flex flex-col gap-8 sm:ml-8 odd:pt-12 lg:odd:pt-8"
      >
        <!-- Row loop - creates individual icon containers -->
        <div
          v-for="rowIndex in rows"
          :key="rowIndex"
          class="flex size-16 items-center justify-center rounded-full bg-primary-foreground ring-1 ring-muted/10 transition-all duration-200 hover:cursor-pointer hover:opacity-95 hover:scale-110"
        >
          <!-- Icon element - calculates index based on position -->
          <Icon
            :name="repeatedIcons[((colIndex - 1) * rows) + rowIndex - 1] ?? 'logos:kickstarter-icon'"
            size="2rem"
          />
        </div>
      </div>
    </div>
  </div>
</template>
