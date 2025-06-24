export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Conversation ID is required',
      });
    }

    // TODO: Replace with actual ElevenLabs API integration
    // For now, return mock data based on the ID

    const mockConversations = {
      1: {
        id: '1',
        date: new Date('2025-06-23T18:10:00'),
        agent: 'Agent IA B2B - Prospimmo.ai',
        duration: '3:48',
        messages: 35,
        evaluation: 'Failed' as const,
        transcript: 'Detailed transcript for conversation 1...\n\nAgent: Bonjour, je vous appelle de la part de Prospimmo.ai...\nClient: Oui, bonjour...\n[Full conversation transcript would be here]',
        audioUrl: 'https://example.com/audio/1.mp3',
        metadata: {
          voiceId: 'voice_123',
          modelId: 'model_456',
          language: 'fr-FR',
        },
      },
      2: {
        id: '2',
        date: new Date('2025-06-23T18:08:00'),
        agent: 'Conseillim',
        duration: '0:36',
        messages: 2,
        evaluation: 'Failed' as const,
        transcript: 'Detailed transcript for conversation 2...\n\nAgent: Bonjour...\nClient: Non merci, pas intéressé.\n[Call ended]',
        audioUrl: 'https://example.com/audio/2.mp3',
        metadata: {
          voiceId: 'voice_789',
          modelId: 'model_456',
          language: 'fr-FR',
        },
      },
      3: {
        id: '3',
        date: new Date('2025-06-23T18:00:00'),
        agent: 'Agent IA B2B - Prospimmo.ai',
        duration: '4:33',
        messages: 39,
        evaluation: 'Failed' as const,
        transcript: 'Detailed transcript for conversation 3...\n\nAgent: Bonjour, je vous appelle concernant votre projet immobilier...\n[Extended conversation transcript]',
        audioUrl: 'https://example.com/audio/3.mp3',
        metadata: {
          voiceId: 'voice_123',
          modelId: 'model_456',
          language: 'fr-FR',
        },
      },
      4: {
        id: '4',
        date: new Date('2025-06-23T14:33:00'),
        agent: 'Agent IA B2B - Prospimmo.ai',
        duration: '3:17',
        messages: 16,
        evaluation: 'Failed' as const,
        transcript: 'Detailed transcript for conversation 4...',
        audioUrl: 'https://example.com/audio/4.mp3',
        metadata: {
          voiceId: 'voice_123',
          modelId: 'model_456',
          language: 'fr-FR',
        },
      },
      5: {
        id: '5',
        date: new Date('2025-06-23T08:51:00'),
        agent: 'Psyche_v4.1',
        duration: '5:38',
        messages: 42,
        evaluation: 'Successful' as const,
        transcript: 'Detailed transcript for conversation 5...\n\nAgent: Bonjour, je vous appelle pour votre demande de renseignements...\nClient: Oui, parfait, j\'attendais votre appel...\n[Successful conversation leading to appointment]',
        audioUrl: 'https://example.com/audio/5.mp3',
        metadata: {
          voiceId: 'voice_abc',
          modelId: 'model_def',
          language: 'fr-FR',
        },
      },
      6: {
        id: '6',
        date: new Date('2025-06-23T08:42:00'),
        agent: 'Amelie',
        duration: '4:14',
        messages: 47,
        evaluation: 'Successful' as const,
        transcript: 'Detailed transcript for conversation 6...\n\nAgent: Bonjour, c\'est Amélie de votre agence immobilière...\nClient: Bonjour Amélie, merci de m\'appeler...\n[Successful conversation with follow-up scheduled]',
        audioUrl: 'https://example.com/audio/6.mp3',
        metadata: {
          voiceId: 'voice_ghi',
          modelId: 'model_jkl',
          language: 'fr-FR',
        },
      },
    };

    const conversation = mockConversations[id as keyof typeof mockConversations];

    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Conversation not found',
      });
    }

    return conversation;

    // TODO: Implement actual ElevenLabs API integration
    /*
		const elevenLabsApiKey = useRuntimeConfig().elevenLabsApiKey

		if (!elevenLabsApiKey) {
			throw createError({
				statusCode: 500,
				statusMessage: 'ElevenLabs API key not configured'
			})
		}

		const response = await $fetch(`https://api.elevenlabs.io/v1/conversations/${id}`, {
			headers: {
				'Authorization': `Bearer ${elevenLabsApiKey}`,
				'Content-Type': 'application/json'
			}
		})

		return response
		*/
  }
  catch (error: any) {
    console.error('Error fetching ElevenLabs conversation:', error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch conversation',
    });
  }
});
