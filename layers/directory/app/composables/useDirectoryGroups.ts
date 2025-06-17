import { useDirectoryService } from '~/services/directoryService';
import type { DirectoryGroup } from '~/types';

/**
 * Composable for managing directory groups with caching
 * Uses useState for persistent storage and exposes fetch method for data retrieval
 */
export function useDirectoryGroups() {
  // Constants
  const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

  // Create shared state using useState
  const state = useState<{
    groups: DirectoryGroup[];
    isLoading: boolean;
    error: string | null;
    lastFetchTime: number | null;
  }>('directory-groups-state', () => ({
    groups: [],
    isLoading: false,
    error: null,
    lastFetchTime: null,
  }));

  // Get directory service
  const directoryService = useDirectoryService();

  // Add a default "All" group to the processed data
  const allGroupsWithDefault = computed(() => {
    return [
      { id: 'all', name: 'All', slug: 'all', description: 'All resources' },
      ...state.value.groups,
    ];
  });

  // Check if data needs to be refreshed
  const shouldRefresh = computed(() => {
    if (state.value.groups.length === 0) return true;
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
   * Get a group by ID
   */
  function getGroupById(id: string) {
    return state.value.groups.find(group => group.id === id);
  }

  /**
   * Get a group by slug
   */
  function getGroupBySlug(slug: string) {
    return state.value.groups.find(group => group.slug === slug);
  }

  /**
   * Fetch groups data with caching
   * Returns reactive state objects for easy consumption in components
   */
  async function fetchGroups({ forceRefresh = false } = {}) {
    state.value.isLoading = true;
    // Return cached data if it's still valid and not forced to refresh
    if (!shouldRefresh.value && !forceRefresh) {
      state.value.isLoading = false;
      return state;
    }

    try {
      state.value.error = null;

      const { data } = await directoryService.getGroups();

      if (data?.value) {
        // Add slug to each group based on name
        state.value.groups = data.value.map((group: DirectoryGroup) => ({
          ...group,
          slug: createSlug(group.name),
        }));

        state.value.lastFetchTime = Date.now();
      }
    }
    catch (err: any) {
      console.error('Error fetching directory groups:', err);
      state.value.error = err?.message || 'Failed to load directory groups';
    }
    finally {
      state.value.isLoading = false;
    }

    return {
      data: allGroupsWithDefault,
    };
  }

  return {
    groups: computed(() => state.value.groups),
    isLoading: computed(() => state.value.isLoading),
    error: computed(() => state.value.error),
    fetchGroups,
    getGroupById,
    getGroupBySlug,
    createSlug,
  };
}
