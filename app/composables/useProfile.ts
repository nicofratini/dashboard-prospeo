import { useStorage } from '@vueuse/core';
import type { Database } from '~~/types/database.types';

interface SignedUrlCache {
  url: string;
  timestamp: number;
}

interface ProfileApiResponse {
  success: boolean;
  profile?: Database['public']['Tables']['profiles']['Row'];
  error?: string;
  isRateLimited?: boolean;
  retryAfter?: string;
}

export function useProfile() {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const profile = useState(`profile-${user.value?.id}`);
  const isLoading = useState(`isLoadingProfile-${user.value?.id}`, () => true);
  const signedAvatarUrl = useState<string | null>(`signedAvatarUrl-${user.value?.id}`, () => null);
  const signedUrlCache = useStorage<SignedUrlCache | null>(`avatarUrlCache-${user.value?.id}`, null);
  const isInitialized = useState<boolean>(`isInitialized-${user.value?.id}`, () => false);

  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  function isUrlCacheValid(): boolean {
    if (!signedUrlCache.value) return false;
    const now = Date.now();
    return now - signedUrlCache.value.timestamp < CACHE_DURATION;
  }

  // Fetch profile data
  async function fetchProfile() {
    try {
      isLoading.value = true;

      if (!user.value?.id)
        return;

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, username, full_name, bio, preferences, social_links, team_id')
        .eq('user_id', user.value.id)
        .single();

      if (error)
        throw createError({
          statusCode: 500,
          statusMessage: error.message,
        });

      profile.value = data;

      // Get signed URL for avatar if exists
      if (data.avatar_url) {
        // Check cache first
        if (isUrlCacheValid()) {
          signedAvatarUrl.value = signedUrlCache.value!.url;
        }
        else {
          const { data: signedUrlData } = await supabase
            .storage
            .from('avatars')
            .createSignedUrl(data.avatar_url, 3600);

          if (signedUrlData) {
            signedAvatarUrl.value = signedUrlData.signedUrl;
            // Update cache
            signedUrlCache.value = {
              url: signedUrlData.signedUrl,
              timestamp: Date.now(),
            };
          }
        }
      }
    }
    catch (error) {
      console.error('Error fetching profile:', error);
    }
    finally {
      isLoading.value = false;
    }
  }

  // Update profile data
  async function updateProfile(update: Partial<Database['public']['Tables']['profiles']['Row']>) {
    if (!user.value?.id)
      throw createError({
        statusCode: 401,
        statusMessage: 'No user logged in',
      });

    try {
      const response = await $fetch<ProfileApiResponse>('/api/profile', {
        method: 'PUT',
        body: update,
      });

      if (!response.success) {
        throw createError({
          statusCode: 500,
          statusMessage: response.error || 'Failed to update profile',
        });
      }

      // Update the profile state with returned data
      if (response.profile) {
        profile.value = response.profile;

        // Update avatar URL if it was part of the update
        if (update?.avatar_url && response.profile.avatar_url) {
          // Get new signed URL for avatar
          const { data: signedUrlData } = await supabase
            .storage
            .from('avatars')
            .createSignedUrl(response.profile.avatar_url, 3600);

          if (signedUrlData) {
            signedAvatarUrl.value = signedUrlData.signedUrl;
            // Update cache
            signedUrlCache.value = {
              url: signedUrlData.signedUrl,
              timestamp: Date.now(),
            };
          }
        }
      }

      return response.profile;
    }
    catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.statusMessage,
      });
    }
  }

  // Update profile picture
  async function updateProfilePicture(avatarUrl: string) {
    if (!user.value?.id)
      throw createError({
        statusCode: 401,
        statusMessage: 'No user logged in',
      });

    try {
      const response = await $fetch<ProfileApiResponse>('/api/profile/avatar', {
        method: 'PUT',
        body: { avatarUrl },
      });

      if (!response.success) {
        throw createError({
          statusCode: 500,
          statusMessage: response.error || 'Failed to update avatar',
        });
      }

      // Update the profile state with returned data
      if (response.profile) {
        profile.value = response.profile;

        // Get new signed URL for avatar
        if (avatarUrl) {
          const { data: signedUrlData } = await supabase
            .storage
            .from('avatars')
            .createSignedUrl(avatarUrl, 3600);

          if (signedUrlData) {
            signedAvatarUrl.value = signedUrlData.signedUrl;
            // Update cache
            signedUrlCache.value = {
              url: signedUrlData.signedUrl,
              timestamp: Date.now(),
            };
          }
        }
      }

      return response.profile;
    }
    catch (error: any) {
      console.error('Error updating profile picture:', error.statusMessage);
      throw createError({
        statusCode: 500,
        statusMessage: error.statusMessage,
      });
    }
  }
  if (user.value?.id && !isInitialized.value) {
    watchEffect(async () => {
      if (user.value?.id) {
        signedUrlCache.value = null;
        await fetchProfile();
      }
    });
    isInitialized.value = true;
  }

  return {
    profile: readonly(profile),
    isLoading: readonly(isLoading),
    signedAvatarUrl: readonly(signedAvatarUrl),
    updateProfile,
    updateProfilePicture,
  };
}
