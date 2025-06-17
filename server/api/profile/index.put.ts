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

    const body = await readBody(event);
    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'Missing profile data',
      });
    }

    const supabase = await serverSupabaseClient<Database>(event);
    const { data, error } = await supabase
      .from('profiles')
      .update(body)
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
        error: 'Too many profile updates. Please try again later.',
        isRateLimited: true,
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to update profile',
    };
  }
});
