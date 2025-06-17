<script setup lang="ts">
interface Plan {
  name: string;
  features: string[];
}

export interface FeaturesTableProps {
  plans?: Plan[];
  title?: string;
  description?: string;
}

const {
  plans = [
    {
      name: 'Pro',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
    },
    {
      name: 'Business',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    },
    {
      name: 'Advanced',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
    },
    {
      name: 'Enterprise',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 'Feature 6'],
    },
  ],
  title = 'Discover which plan suits you best',
  description = 'Here you can find a list of all the amazing features offered in plans',
} = defineProps<FeaturesTableProps>();

// Extract all unique features
const allFeatures = Array.from(new Set(plans.flatMap(plan => plan.features)));
</script>

<template>
  <div class="hidden md:flex justify-center items-center flex-col gap-12">
    <div class="flex justify-center items-center flex-col gap-4">
      <h2 class="text-4xl font-bold">
        {{ title }}
      </h2>
      <p class="text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="hidden md:table-cell">
            Feature
          </TableHead>
          <TableHead
            v-for="plan in plans"
            :key="plan.name"
            class="text-center"
          >
            {{ plan.name }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(feature, index) in allFeatures"
          :key="index"
          class="hover:bg-muted/50"
        >
          <TableCell class="hidden md:table-cell">
            <div class="flex flex-col items-start justify-center gap-2">
              <h2 class="font-semibold text-lg">
                {{ feature }}
              </h2>
              <p class="text-muted-foreground">
                Cost / extra funnel (packs of 10)
              </p>
            </div>
          </TableCell>
          <TableCell
            v-for="(plan, pIndex) in plans"
            :key="plan.name"
          >
            <div class="flex flex-col justify-center items-start gap-2 md:items-center">
              <h2
                v-if="pIndex===0"
                class="font-semibold text-lg md:hidden"
              >
                {{ feature }}
              </h2>
              <LazyIcon
                v-if="plan.features.includes(feature)"
                name="mdi:checkbox-marked-circle-outline"
                size="1.5rem"
                class="text-green-500"
              />
              <LazyIcon
                v-else
                name="mdi:close"
                size="1.5rem"
                class="text-red-700"
              />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
