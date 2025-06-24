<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { computed } from 'vue';
import type { ElevenLabsConversation } from '~/composables/useElevenLabs';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

interface DataTableToolbarProps {
  table: Table<ElevenLabsConversation>;
}

const props = defineProps<DataTableToolbarProps>();

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0);

// Evaluation options for filtering
const evaluationOptions = [
  {
    label: 'Successful',
    value: 'Successful',
    icon: 'mdi:check-circle',
  },
  {
    label: 'Failed',
    value: 'Failed',
    icon: 'mdi:close-circle',
  },
];
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        placeholder="Filter conversations..."
        :model-value="(table.getColumn('agent')?.getFilterValue() as string) ?? ''"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('agent')?.setFilterValue($event.target.value)"
      />

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <Icon
          name="mdi:close"
          class="ml-2 h-4 w-4"
        />
      </Button>
    </div>

    <div class="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
      >
        <Icon
          name="mdi:download"
          class="mr-2 h-4 w-4"
        />
        Export
      </Button>
    </div>
  </div>
</template>
