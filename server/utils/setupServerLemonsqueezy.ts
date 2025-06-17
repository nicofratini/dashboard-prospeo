import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import type { H3Event } from 'h3';

export const setupServerLemonsqueezy = (event: H3Event) => {
  const { lemonsqueezyApiKey } = useRuntimeConfig(event);

  // Return Lemon Squeezy's config instance if already initialized in event context
  if (event.context._lemonsqueezy) return event.context._lemonsqueezy;

  if (!lemonsqueezyApiKey) console.warn('no key given for server service');

  const config = lemonSqueezySetup({
    apiKey: lemonsqueezyApiKey,
  });

  // Store the initialized Stripe instance in the event context for future use
  event.context._lemonsqueezy = config;

  return event.context._lemonsqueezy;
};
