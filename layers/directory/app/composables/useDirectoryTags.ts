import { useDirectoryService } from '~/services/directoryService';
import type { DirectoryTag } from '~/types';

/**
 * Composable for managing directory tags with caching
 * Uses useState for persistent storage and exposes fetch method for data retrieval
 */
export function useDirectoryTags() {
  // Constants
  const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

  // Create shared state using useState
  const state = useState<{
    tags: DirectoryTag[];
    isLoading: boolean;
    error: string | null;
    lastFetchTime: number | null;
  }>('directory-tags-state', () => ({
    tags: [],
    isLoading: false,
    error: null,
    lastFetchTime: null,
  }));

  // Get directory service
  const directoryService = useDirectoryService();

  // Add slugs to tags
  const tagsWithSlug = computed(() => {
    return state.value.tags.map(tag => ({
      ...tag,
      slug: createSlug(tag.name),
    }));
  });

  // Check if data needs to be refreshed
  const shouldRefresh = computed(() => {
    if (state.value.tags.length === 0) return true;
    if (!state.value.lastFetchTime) return true;

    const now = Date.now();
    return now - state.value.lastFetchTime > CACHE_DURATION_MS;
  });

  /**
   * Helper function to create a slug from a name
   */
  function createSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove consecutive hyphens
  }

  /**
   * Get a tag by ID
   */
  function getTagById(id: string) {
    return tagsWithSlug.value.find(tag => tag.id === id);
  }

  /**
   * Get a tag by slug
   */
  function getTagBySlug(slug: string) {
    return tagsWithSlug.value.find(tag => tag.slug === slug);
  }

  /**
   * Fetch tags data with caching
   * Returns reactive state objects for easy consumption in components
   */
  async function fetchTags({ forceRefresh = false } = {}) {
    // Return cached data if it's still valid and not forced to refresh
    if (!shouldRefresh.value && !forceRefresh) {
      return {
        data: tagsWithSlug,
        isLoading: computed(() => state.value.isLoading),
        error: computed(() => state.value.error),
      };
    }

    try {
      state.value.isLoading = true;
      state.value.error = null;

      const { data } = await directoryService.getTags();

      if (data?.value) {
        state.value.tags = data.value;
        state.value.lastFetchTime = Date.now();
      }
    }
    catch (err: any) {
      console.error('Error fetching directory tags:', err);
      state.value.error = err?.message || 'Failed to load directory tags';
    }
    finally {
      state.value.isLoading = false;
    }

    return {
      data: tagsWithSlug,
      isLoading: computed(() => state.value.isLoading),
      error: computed(() => state.value.error),
    };
  }

  return {
    tags: computed(() => state.value.tags),
    isLoading: computed(() => state.value.isLoading),
    error: computed(() => state.value.error),
    fetchTags,
    getTagById,
    getTagBySlug,
    createSlug,
  };
}
