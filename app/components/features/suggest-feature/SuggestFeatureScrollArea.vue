<script setup lang="ts">
import type { Database } from '~~/types/database.types';

type SuggestionTag = {
  id: number;
  name: string | null;
};

type SuggestionType = {
  name: string;
};

type SuggestionVotes = {
  count: number;
};

type Suggestion = {
  id: number;
  title: string;
  details: string | null;
  votes: number | null;
  suggestion_tags: SuggestionTag[];
  suggestion_types: SuggestionType | null;
  suggestions_votes: SuggestionVotes[];
};

export type Suggestions = Suggestion[] | null;

const { suggestions } = defineProps<{ suggestions: Suggestions }>();
const emit = defineEmits(['data:refresh']);

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

/**
 * Handles voting for a suggestion. If the user has already voted, it deletes the vote.
 * Otherwise, it inserts a new vote.
 *
 * @param {number} suggestionId - The ID of the suggestion being voted on.
 * @param {number} suggestionsVotes - The number of votes the user has cast on the suggestion. Can be 0 or 1.
 */
const handleVote = async (suggestionId: number, suggestionsVotes: number) => {
  const { error } = suggestionsVotes
    ? await client.from('suggestions_votes').delete().match({ suggestion_id: suggestionId, user_id: user.value?.id })
    : await client.from('suggestions_votes').insert([{ suggestion_id: suggestionId, user_id: user.value?.id }]);

  if (error) {
    handleApiErrorWithToast(error);
    return;
  }
  // I'm doing data refetch to ensure data integrity. You may remove refetching to speed up the loading time if you
  // don't care about possibility that data may be outdated.
  emit('data:refresh');
};
</script>

<template>
  <!-- You may also remove animation to speed up loading times -->
  <ScrollArea
    v-if="suggestions?.length"
    class="flex flex-col items-center justify-between bg-background w-full h-[960px] rounded-md border"
  >
    <div
      v-for="(suggestion, i) in suggestions"
      :key="i"
      class="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-12 py-3 gap-2 md:gap-8"
    >
      <div class="flex flex-col items-start justify-center my-2 w-full gap-1">
        <div class="flex flex-row items-center justify-start gap-2 w-full">
          <p class="font-medium">
            {{ suggestion.title }}
          </p>
          <Badge variant="secondary">
            {{ suggestion?.suggestion_types?.name }}
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          {{ suggestion.details }}
        </p>
        <div
          v-if="suggestion.suggestion_tags"
          class="flex flex-wrap flex-row justify-start items-center gap-1"
        >
          <Badge
            v-for="(tag, tagI) in suggestion.suggestion_tags"
            :key="tagI"
            variant="outline"
            class="rounded-md"
          >
            #{{ tag.name }}
          </Badge>
        </div>
      </div>
      <div class="flex flex-row items-center justify-start md:justify-end w-full md:w-auto">
        <Button
          variant="outline"
          class="min-w-24"
          :class="suggestion?.suggestions_votes?.[0]?.count ? 'border-l-4 border-l-emerald-500' : 'text-success'"
          @click="() => handleVote(suggestion.id, suggestion?.suggestions_votes?.[0]?.count ?? 0)"
        >
          <Icon
            v-if="!suggestion?.suggestions_votes?.[0]?.count"
            mode="svg"
            name="line-md:chevron-up"
            class="mr-1"
          />
          <Icon
            v-else
            name="line-md:confirm"
            mode="svg"
            class="mr-1"
          />
          {{ suggestion.votes }}
        </Button>
      </div>
    </div>
  </ScrollArea>
  <div
    v-else
    class="flex flex-col items-center justify-center w-full h-96 rounded-md border"
  >
    <Icon
      name="line-md:search"
      mode="svg"
      class="size-12 text-muted-foreground"
    />
    <h3 class="text-2xl font-semibold">
      Ooops!
    </h3>
    <p>No suggestions found. Be the first!</p>
  </div>
</template>
