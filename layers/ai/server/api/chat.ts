import { smoothStream, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const openai = createOpenAI({
    apiKey: apiKey,
  });

  return defineEventHandler(async (event) => {
    const { messages } = await readBody(event);

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      temperature: 0.7,
      maxTokens: 700,
      experimental_transform: smoothStream(),
      /*  onFinish: ({ text, finishReason, usage, response }) => {
        console.log(text);
      }, */
    });

    return result.toDataStreamResponse();
  });
});
