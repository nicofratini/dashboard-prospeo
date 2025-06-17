import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const { code, redirect_to, error: authError, error_code: authErrorCode }: { code: string; redirect_to: string; error: string; error_code: string } = getQuery(
    event,
  );

  // Handle specific Supabase auth errors
  if (authError && authErrorCode) {
    switch (authErrorCode) {
      case 'invalid_credentials':
        throw createError({
          statusCode: 401,
          statusMessage: 'Invalid login credentials',
          data: { code: authErrorCode },
        });

      case 'user_not_found':
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found',
          data: { code: authErrorCode },
        });

      case 'email_not_confirmed':
        throw createError({
          statusCode: 403,
          statusMessage: 'Email not confirmed',
          data: { code: authErrorCode },
        });

      case 'user_banned':
        throw createError({
          statusCode: 403,
          statusMessage: 'Account has been banned',
          data: { code: authErrorCode },
        });

      case 'signup_disabled':
        throw createError({
          statusCode: 403,
          statusMessage: 'Sign ups are currently disabled',
          data: { code: authErrorCode },
        });

      case 'provider_disabled':
        throw createError({
          statusCode: 403,
          statusMessage: 'This authentication provider is disabled',
          data: { code: authErrorCode },
        });

      case 'session_expired':
        throw createError({
          statusCode: 401,
          statusMessage: 'Session has expired',
          data: { code: authErrorCode },
        });

      case 'over_request_rate_limit':
        throw createError({
          statusCode: 429,
          statusMessage: 'Too many requests, please try again later',
          data: { code: authErrorCode },
        });

      default:
        // For any other auth errors
        throw createError({
          statusCode: 401,
          statusMessage: authError || 'Authentication failed',
          data: { code: authErrorCode },
        });
    }
  }

  if (code) {
    const { auth } = await serverSupabaseClient(event);
    const { error, data } = await auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectPath = getCookie(event, 'sb-redirect-path');
      deleteCookie(event, 'sb-redirect-path');

      if (data?.user?.email) {
        // Adds email to the redirect URL based on the payment system
        const emailParam = `?${redirect_to.includes('buy.stripe.com') ? 'prefilled_email' : 'checkout[email]'}=${data.user.email}`;
        if (redirect_to?.includes('buy.stripe.com') || redirect_to?.includes('lemonsqueezy.com')) {
          return sendRedirect(event, redirect_to.concat(emailParam) ?? '/');
        }
      }
      return sendRedirect(event, redirectPath ?? '/');
    }
  }

  // Fallback error for cases where no specific error code is provided
  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
  });
});
