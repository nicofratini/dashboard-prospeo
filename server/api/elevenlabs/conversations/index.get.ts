import type { ElevenLabsFilters } from '~/composables/useElevenLabs';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event) as ElevenLabsFilters;

    // TODO: Replace with actual ElevenLabs API integration
    // For now, return mock data that matches the interface

    const mockData = [
      {
        id: '1',
        date: new Date('2025-06-23T18:10:00'),
        agent: 'Agent IA B2B - Prospimmo.ai',
        duration: '3:48',
        messages: 35,
        evaluation: 'Failed' as const,
        transcript: 'Mock transcript for conversation 1...',
        audioUrl: 'https://example.com/audio/1.mp3',
        metadata: {
          voiceId: 'voice_123',
          modelId: 'model_456',
          language: 'fr-FR',
        },
      },
      {
        id: '2',
        date: new Date('2025-06-23T18:08:00'),
        agent: 'Conseillim',
        duration: '0:36',
        messages: 2,
        evaluation: 'Failed' as const,
        transcript: 'Mock transcript for conversation 2...',
        audioUrl: 'https://example.com/audio/2.mp3',
        metadata: {
          voiceId: 'voice_789',
          modelId: 'model_456',
          language: 'fr-FR',
        },
      },
      {
        id: '3',
        date: new Date('2025-06-23T18:00:00'),
        agent: 'Agent IA B2B - Prospimmo.ai',
        duration: '4:33',
        messages: 39,
        evaluation: 'Failed' as const,
        transcript: 'Mock transcript for conversation 3...',
        audioUrl: 'https://example.com/audio/3.mp3',
        metadata: {
          voiceId: 'voice_123',
          modelId: 'model_456',
          language: 'fr-FR',
        },
      },
      {
        id: '4',
        date: new Date('2025-06-23T14:33:00'),
        agent: 'Agent IA B2B - Prospimmo.ai',
        duration: '3:17',
        messages: 16,
        evaluation: 'Failed' as const,
        transcript: 'Mock transcript for conversation 4...',
        audioUrl: 'https://example.com/audio/4.mp3',
        metadata: {
          voiceId: 'voice_123',
          modelId: 'model_456',
          language: 'fr-FR',
        },
      },
      {
        id: '5',
        date: new Date('2025-06-23T08:51:00'),
        agent: 'Psyche_v4.1',
        duration: '5:38',
        messages: 42,
        evaluation: 'Successful' as const,
        transcript: 'Mock transcript for conversation 5...',
        audioUrl: 'https://example.com/audio/5.mp3',
        metadata: {
          voiceId: 'voice_abc',
          modelId: 'model_def',
          language: 'fr-FR',
        },
      },
      {
        id: '6',
        date: new Date('2025-06-23T08:42:00'),
        agent: 'Amelie',
        duration: '4:14',
        messages: 47,
        evaluation: 'Successful' as const,
        transcript: 'Mock transcript for conversation 6...',
        audioUrl: 'https://example.com/audio/6.mp3',
        metadata: {
          voiceId: 'voice_ghi',
          modelId: 'model_jkl',
          language: 'fr-FR',
        },
      },
    ];

    // Apply filters
    let filteredData = mockData;

    if (query.dateAfter) {
      const dateAfter = new Date(query.dateAfter);
      filteredData = filteredData.filter(conv => conv.date >= dateAfter);
    }

    if (query.dateBefore) {
      const dateBefore = new Date(query.dateBefore);
      filteredData = filteredData.filter(conv => conv.date <= dateBefore);
    }

    if (query.evaluation) {
      filteredData = filteredData.filter(conv => conv.evaluation === query.evaluation);
    }

    if (query.agent) {
      filteredData = filteredData.filter(conv =>
        conv.agent.toLowerCase().includes(query.agent!.toLowerCase()),
      );
    }

    // Apply pagination
    const limit = query.limit || 50;
    const offset = query.offset || 0;
    const paginatedData = filteredData.slice(offset, offset + limit);

    return {
      data: paginatedData,
      total: filteredData.length,
      limit,
      offset,
    };

    // TODO: Implement actual ElevenLabs API integration
    /*
		const elevenLabsApiKey = useRuntimeConfig().elevenLabsApiKey

		if (!elevenLabsApiKey) {
			throw createError({
				statusCode: 500,
				statusMessage: 'ElevenLabs API key not configured'
			})
		}

		const response = await $fetch('https://api.elevenlabs.io/v1/conversations', {
			headers: {
				'Authorization': `Bearer ${elevenLabsApiKey}`,
				'Content-Type': 'application/json'
			},
			query: {
				...query,
				limit: query.limit || 50,
				offset: query.offset || 0
			}
		})

		return response
		*/
  }
  catch (error) {
    console.error('Error fetching ElevenLabs conversations:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch conversations',
    });
  }
});
