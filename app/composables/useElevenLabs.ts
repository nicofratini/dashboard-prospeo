import { ref, type Ref } from 'vue';

export interface ElevenLabsConversation {
  id: string;
  date: Date;
  agent: string;
  duration: string;
  messages: number;
  evaluation: 'Successful' | 'Failed';
  transcript?: string;
  audioUrl?: string;
  metadata?: {
    voiceId?: string;
    modelId?: string;
    language?: string;
  };
}

export interface ElevenLabsFilters {
  dateAfter?: Date | null;
  dateBefore?: Date | null;
  evaluation?: string | null;
  agent?: string | null;
  limit?: number;
  offset?: number;
}

export const useElevenLabs = () => {
  const conversations: Ref<ElevenLabsConversation[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
	 * Fetch conversation history from ElevenLabs API
	 */
  const fetchConversations = async (filters?: ElevenLabsFilters) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await $fetch<{ data: ElevenLabsConversation[] }>('/api/elevenlabs/conversations', {
        method: 'GET',
        query: filters,
      });

      conversations.value = data.map(conv => ({
        ...conv,
        date: new Date(conv.date),
      }));
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch conversations';
      console.error('Error fetching ElevenLabs conversations:', err);
    }
    finally {
      loading.value = false;
    }
  };

  /**
	 * Get conversation details by ID
	 */
  const getConversation = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch<ElevenLabsConversation>(`/api/elevenlabs/conversations/${id}`);
      return {
        ...data,
        date: new Date(data.date),
      };
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch conversation';
      console.error('Error fetching ElevenLabs conversation:', err);
      return null;
    }
    finally {
      loading.value = false;
    }
  };

  /**
	 * Delete a conversation
	 */
  const deleteConversation = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/elevenlabs/conversations/${id}`, {
        method: 'DELETE',
      });

      // Remove from local state
      conversations.value = conversations.value.filter(conv => conv.id !== id);
      return true;
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete conversation';
      console.error('Error deleting ElevenLabs conversation:', err);
      return false;
    }
    finally {
      loading.value = false;
    }
  };

  /**
	 * Export conversation data
	 */
  const exportConversations = async (format: 'csv' | 'json' = 'csv', filters?: ElevenLabsFilters) => {
    loading.value = true;
    error.value = null;

    try {
      return await $fetch('/api/elevenlabs/conversations/export', {
        method: 'POST',
        body: {
          format,
          filters,
        },
      });
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to export conversations';
      console.error('Error exporting ElevenLabs conversations:', err);
      return null;
    }
    finally {
      loading.value = false;
    }
  };

  /**
	 * Get available agents from ElevenLabs
	 */
  const getAgents = async () => {
    try {
      const data = await $fetch<{ agents: string[] }>('/api/elevenlabs/agents');
      return data.agents;
    }
    catch (err) {
      console.error('Error fetching ElevenLabs agents:', err);
      return [];
    }
  };

  /**
	 * Get conversation statistics
	 */
  const getStatistics = async (filters?: ElevenLabsFilters) => {
    try {
      const data = await $fetch('/api/elevenlabs/statistics', {
        query: filters,
      });
      return data;
    }
    catch (err) {
      console.error('Error fetching ElevenLabs statistics:', err);
      return null;
    }
  };

  return {
    conversations: readonly(conversations),
    loading: readonly(loading),
    error: readonly(error),
    fetchConversations,
    getConversation,
    deleteConversation,
    exportConversations,
    getAgents,
    getStatistics,
  };
};
