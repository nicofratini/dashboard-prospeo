import type { Database } from '~~/types/database.types';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    const { avatarUrl } = await readBody(event);
    if (!avatarUrl) {
      throw createError({
        statusCode: 400,
        message: 'Missing avatar URL',
      });
    }

    const supabase = await serverSupabaseClient<Database>(event);
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('user_id', user.id)
      .select('avatar_url, username, full_name, bio, preferences, social_links')
      .single();

    if (error) {
      throw createError({
        statusCode: 500,
        message: error.message,
      });
    }

    return {
      success: true,
      profile: data,
    };
  }
  catch (error: any) {
    if (error.statusCode === 429) {
      return {
        success: false,
        error: 'Avatar updates are limited to once every 15 minutes. Please try again later.',
        isRateLimited: true,
        retryAfter: '15 minutes',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to update avatar',
    };
  }
});
