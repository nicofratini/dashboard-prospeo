<script setup lang="ts">
import type { Database } from '~~/types/database.types';

const client = useSupabaseClient<Database>();

const {
  data: suggestions,
  error: suggestionsError,
  refresh,
} = await useLazyAsyncData('suggestions', async () => {
  const { data } = await client.from('suggestions')
    .select('id,title,details,votes,suggestion_tags(id,name),suggestion_types(name),suggestions_votes(count)')
    .order('votes', { ascending: false });
  return data;
});

if (suggestionsError.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to fetch suggestions',
  });
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full md:px-24 gap-6">
    <div class="flex flex-col md:flex-row items-center justify-between gap-2 w-full">
      <LazySuggestFeatureDialog @data:refresh="refresh" />
    </div>
    <SuggestFeatureScrollArea
      :suggestions="suggestions || []"
      @data:refresh="refresh"
    />
  </div>
</template>
