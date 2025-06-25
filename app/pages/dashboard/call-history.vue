<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import type { ElevenLabsConversation } from '~/composables/useElevenLabs';
import DataTable from '~/components/conversation/DataTable.vue';

// Disable layout to avoid authentication middleware
definePageMeta({
  layout: 'dashboard',
});

// Mock data for demonstration
const mockConversations: ElevenLabsConversation[] = [
  {
    id: '1',
    date: new Date('2025-06-23T18:10:00'),
    agent: 'Agent IA B2B - Prospimmo.ai',
    duration: '3:48',
    messages: 35,
    evaluation: 'Failed',
    transcript: 'Sample transcript...',
    audioUrl: 'https://example.com/audio1.mp3',
    metadata: { voiceId: 'voice-1', modelId: 'model-1', language: 'en' },
  },
  {
    id: '2',
    date: new Date('2025-06-23T18:08:00'),
    agent: 'Conseillim',
    duration: '0:36',
    messages: 2,
    evaluation: 'Failed',
    transcript: 'Sample transcript...',
    audioUrl: 'https://example.com/audio2.mp3',
    metadata: { voiceId: 'voice-2', modelId: 'model-2', language: 'fr' },
  },
  {
    id: '3',
    date: new Date('2025-06-23T18:00:00'),
    agent: 'Agent IA B2B - Prospimmo.ai',
    duration: '4:33',
    messages: 39,
    evaluation: 'Failed',
    transcript: 'Sample transcript...',
    audioUrl: 'https://example.com/audio3.mp3',
    metadata: { voiceId: 'voice-1', modelId: 'model-1', language: 'en' },
  },
  {
    id: '4',
    date: new Date('2025-06-23T14:33:00'),
    agent: 'Agent IA B2B - Prospimmo.ai',
    duration: '3:17',
    messages: 16,
    evaluation: 'Failed',
    transcript: 'Sample transcript...',
    audioUrl: 'https://example.com/audio4.mp3',
    metadata: { voiceId: 'voice-1', modelId: 'model-1', language: 'en' },
  },
  {
    id: '5',
    date: new Date('2025-06-23T08:51:00'),
    agent: 'Psyche_v4.1',
    duration: '5:38',
    messages: 42,
    evaluation: 'Successful',
    transcript: 'Sample transcript...',
    audioUrl: 'https://example.com/audio5.mp3',
    metadata: { voiceId: 'voice-3', modelId: 'model-3', language: 'en' },
  },
  {
    id: '6',
    date: new Date('2025-06-23T08:42:00'),
    agent: 'Amelie',
    duration: '4:14',
    messages: 47,
    evaluation: 'Successful',
    transcript: 'Sample transcript...',
    audioUrl: 'https://example.com/audio6.mp3',
    metadata: { voiceId: 'voice-4', modelId: 'model-4', language: 'fr' },
  },
];

// Format date function
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Table data
const tableData = computed(() => mockConversations);

// Define table columns
const columns: ColumnDef<ElevenLabsConversation>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => formatDate(row.getValue('date')),
    enableSorting: true,
  },
  {
    accessorKey: 'agent',
    header: 'Agent',
    cell: ({ row }) => row.getValue('agent'),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => row.getValue('duration'),
  },
  {
    accessorKey: 'messages',
    header: 'Messages',
    cell: ({ row }) => row.getValue('messages'),
  },
  {
    accessorKey: 'evaluation',
    header: 'Evaluation result',
    cell: ({ row }) => {
      return row.getValue('evaluation') as string;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

// SEO
useHead({
  title: 'Conversation History Demo - Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Demo of conversation history table with ElevenLabs integration',
    },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="flex flex-1 flex-col space-y-8 p-8">
      <!-- Header -->
      <div class="flex items-center justify-between space-y-2">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">
            Call history
          </h2>
          <p class="text-muted-foreground">
            Here's a list of your conversation history for this month!
          </p>
        </div>
      </div>

      <!-- Demo Notice -->
      <div class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <div class="flex">
          <Icon
            name="mdi:information"
            class="h-5 w-5 text-blue-400"
          />
        </div>
      </div>

      <!-- Data Table -->
      <DataTable
        :columns="columns"
        :data="tableData"
      />
    </div>
  </div>
</template>
