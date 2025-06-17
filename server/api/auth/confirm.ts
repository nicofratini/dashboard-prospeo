import type { EmailOtpType } from '@supabase/auth-js';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const { token_hash, type, redirect_to }:
  { token_hash: string; type: EmailOtpType; redirect_to: string } = getQuery(event);

  if (token_hash && type) {
    const client = await serverSupabaseClient(event);

    const { error } = await client.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return sendRedirect(event, redirect_to ? redirect_to : '/');
    }
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Internal server error',
  });
});
