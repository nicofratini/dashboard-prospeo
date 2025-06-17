import type { Database } from '~~/types/database.types';
import type { DirectoryComment, DirectoryGroup, DirectoryItem, DirectoryItemStatus, DirectoryTag } from '~/types';

export interface FilterOptions {
  status?: DirectoryItemStatus;
  featured?: boolean;
  groups?: string[];
  tags?: string[];
  search?: string;
  userId?: string;
  limit?: number;
  offset?: number;
  orderBy?: {
    column: keyof DirectoryItem;
    ascending: boolean;
  };
}

// Define interfaces for the nested data structure
interface DirectoryItemsGroup {
  group_id: string;
  directory_groups: {
    id: string;
    name: string;
  };
}

interface DirectoryItemsTag {
  tag_id: string;
  directory_tags: {
    id: string;
    name: string;
  };
}

// Utility functions for data transformation and filtering
const transformNestedGroups = (groups: DirectoryItemsGroup[] | undefined): any[] => {
  if (!Array.isArray(groups)) return [];

  return groups
    .filter(ig => ig && ig.directory_groups)
    .map(ig => ig.directory_groups);
};

const transformNestedTags = (tags: DirectoryItemsTag[] | undefined): any[] => {
  if (!Array.isArray(tags)) return [];

  return tags
    .filter(it => it && it.directory_tags)
    .map(it => it.directory_tags);
};

const hasAllGroups = (item: DirectoryItem, groupIds: string[]): boolean => {
  if (!item.groups || !Array.isArray(item.groups)) {
    return false;
  }

  return groupIds.every(groupId =>
    item.groups!.some(group => group && group.id === groupId),
  );
};

const hasAllTags = (item: DirectoryItem, tagIds: string[]): boolean => {
  if (!item.tags || !Array.isArray(item.tags)) {
    return false;
  }

  return tagIds.every(tagId =>
    item.tags!.some(tag => tag && tag.id === tagId),
  );
};

const sortItems = <T extends DirectoryItem>(
  items: T[],
  column: keyof DirectoryItem,
  ascending: boolean,
): T[] => {
  return [...items].sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];

    if (valueA === valueB) return 0;

    // Handle null/undefined values
    if (valueA == null) return ascending ? -1 : 1;
    if (valueB == null) return ascending ? 1 : -1;

    // Sort strings
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Sort numbers/dates
    return ascending
      ? (valueA < valueB ? -1 : 1)
      : (valueA > valueB ? -1 : 1);
  });
};

const paginateItems = <T>(
  items: T[],
  offset: number = 0,
  limit: number = 10,
): T[] => {
  return items.slice(offset, offset + limit);
};

export function useDirectoryService() {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const directoryCache = useDirectoryCache<any>(10 * 60 * 1000);

  /**
   * Process directory items to transform nested relationships
   */
  function processDirectoryItems(items: any[]): DirectoryItem[] {
    return items.map((item) => {
      const processedItem = { ...item } as DirectoryItem;

      // Extract groups and tags from the nested structure
      processedItem.groups = transformNestedGroups(item.directory_items_groups);
      processedItem.tags = transformNestedTags(item.directory_items_tags);

      // Remove the nested structures
      delete (processedItem as any).directory_items_groups;
      delete (processedItem as any).directory_items_tags;

      return processedItem;
    });
  }

  /**
   * Apply client-side filtering for items
   */
  function applyFilters(
    items: DirectoryItem[],
    filters: FilterOptions,
  ): DirectoryItem[] {
    let filteredItems = [...items];
    // Apply filtering for categories with AND logic
    if (filters.groups && filters.groups.length > 0) {
      filteredItems = filteredItems.filter(item => hasAllGroups(item, filters.groups!));
    }

    // Apply filtering for tags with AND logic
    if (filters.tags && filters.tags.length > 0) {
      filteredItems = filteredItems.filter(item => hasAllTags(item, filters.tags!));
    }

    return filteredItems;
  }

  /**
   * Check if user has interacted with an item in a specific way
   */
  async function checkUserInteraction(
    itemId: string,
    interactionType: 'like' | 'save' | 'view',
    options?: { olderThan?: Date },
  ) {
    if (!user.value) return null;

    let query = supabase
      .from('directory_user_interactions')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('item_id', itemId)
      .eq('interaction_type', interactionType);

    if (options?.olderThan) {
      query = query.gt('created_at', options.olderThan.toISOString());
    }

    const { data } = await query.maybeSingle();

    return data;
  }

  /**
   * Create a user interaction record
   */
  async function createUserInteraction(
    itemId: string,
    interactionType: 'like' | 'save' | 'view',
  ) {
    if (!user.value) {
      throw new Error(`User must be authenticated for ${interactionType} interaction`);
    }

    const { error } = await supabase
      .from('directory_user_interactions')
      .insert({
        user_id: user.value.id,
        item_id: itemId,
        interaction_type: interactionType,
      });

    if (error) {
      console.error(`Error creating ${interactionType} interaction:`, error);
      throw error;
    }
  }

  /**
   * Delete a user interaction record
   */
  async function deleteUserInteraction(interactionId: string) {
    const { error } = await supabase
      .from('directory_user_interactions')
      .delete()
      .eq('id', interactionId);

    if (error) {
      console.error('Error deleting user interaction:', error);
      throw error;
    }
  }

  /**
   * Get directory items with filtering, pagination, and sorting
   */
  async function getItems(filters: FilterOptions = {}) {
    try {
      // Generate cache key based on filters
      const cacheKey: CacheKey = {
        type: 'search',
        filters,
      };

      // Check cache first
      const cachedResult = directoryCache.getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // First, get the directory items with their relationships
      let query = supabase
        .from('directory_items')
        .select(`
          id, 
          title, 
          description, 
          url,
          image_url,
          thumbnail_url, 
          featured, 
          status,
          views_count,
          likes_count,
          created_at,
          directory_items_groups (
            group_id,
            directory_groups (id, name)
          ),
          directory_items_tags (
            tag_id,
            directory_tags (id, name)
          )
        `, { count: 'exact', head: false });

      // Apply status filter (default to published for public viewing)
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      else if (!user.value) {
        // If no user is logged in, only show published items
        query = query.eq('status', 'published');
      }

      // Apply featured filter
      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }

      // Apply user filter
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      // Handle search filter
      if (filters.search) {
        // Use the partial search RPC function
        const { data: searchResults, error: searchError } = await supabase
          .rpc('directory_partial_search', { search_term: filters.search });

        if (searchError) {
          console.error('Error performing partial search:', searchError);
          return { items: [], count: 0 };
        }

        // Process the search results
        const processedItems = processDirectoryItems(searchResults);

        // Apply client-side filtering
        const filteredItems = applyFilters(processedItems, filters);

        // Apply sorting
        const sortedItems = filters.orderBy
          ? sortItems(filteredItems, filters.orderBy.column, filters.orderBy.ascending)
          : filteredItems;

        // Apply pagination
        const paginatedItems = (filters.offset !== undefined || filters.limit !== undefined)
          ? paginateItems(sortedItems, filters.offset, filters.limit)
          : sortedItems;

        const result = {
          items: paginatedItems,
          count: filteredItems.length,
        };

        // Save to cache
        directoryCache.saveToCache(cacheKey, result);

        return result;
      }
      else if (filters.search === undefined) {
        // Skip the textSearch if search is undefined
        // Continue with other filters
      }
      else {
        // If search is an empty string, use textSearch with empty string
        query = query.textSearch('search_vector', filters.search);
      }

      // Apply sorting
      if (filters.orderBy) {
        query = query.order(filters.orderBy.column as string, {
          ascending: filters.orderBy.ascending,
        });
      }
      else {
        // Default sorting by created_at descending
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, count, error } = await query;

      if (error) {
        console.error('Error fetching directory items:', error);
        throw error;
      }

      // If no items found, return empty array
      if (!data || data.length === 0) {
        return { items: [], count: 0 };
      }

      // Process the data and apply client-side filtering
      const processedItems = processDirectoryItems(data);

      const filteredItems = applyFilters(processedItems, filters);

      const result = {
        items: filteredItems,
        count,
      };

      // Save to cache
      directoryCache.saveToCache(cacheKey, result);

      return result;
    }
    catch (error) {
      console.error('Error in getItems:', error);
      return { items: [], count: 0 };
    }
  }

  /**
   * Get a single directory item by ID
   */
  async function getItemById(id: string) {
    // Get the directory item with its relationships
    const { data, error } = await supabase
      .from('directory_items')
      .select(`
        id, 
        title, 
        description, 
        url,
        image_url,
        thumbnail_url, 
        featured, 
        status,
        views_count,
        likes_count,
        created_at,
        directory_items_groups (
          group_id,
          directory_groups (id, name)
        ),
        directory_items_tags (
          tag_id,
          directory_tags (id, name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching directory item:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    return data;

    /*  // Remove the nested structures
    delete (processedItem as any).directory_items_groups;
    delete (processedItem as any).directory_items_tags;

    // Check if the current user has liked or saved this item
    if (user.value) {
      const likeData = await checkUserInteraction(id, 'like');
      const saveData = await checkUserInteraction(id, 'save');

      processedItem.is_liked_by_user = !!likeData;
      processedItem.is_saved_by_user = !!saveData;
    }

    // Increment view count
    await incrementViewCount(id); */
  }

  /**
   * Create a new directory item
   */
  async function createItem(
    item: Omit<DirectoryItem, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'likes_count'>,
    groupIds: string[],
    tagIds: string[],
  ) {
    if (!user.value) {
      throw new Error('User must be authenticated to create an item');
    }

    const { data, error } = await supabase.rpc('create_directory_item', {
      item_data: {
        title: item.title,
        description: item.description,
        content: item.content,
        image_url: item.image_url,
        thumbnail_url: item.thumbnail_url,
        url: item.url,
        featured: item.featured || false,
        status: item.status || 'draft',
        user_id: user.value.id,
        metadata: item.metadata,
      },
      group_ids: groupIds,
      tag_ids: tagIds,
    });

    if (error) {
      console.error('Error creating directory item:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update an existing directory item
   */
  async function updateItem(
    id: string,
    updates: Partial<Omit<DirectoryItem, 'id' | 'created_at' | 'updated_at'>>,
    groupIds?: string[],
    tagIds?: string[],
  ) {
    if (!user.value) {
      throw new Error('User must be authenticated to update an item');
    }

    const { data, error } = await supabase.rpc('update_directory_item', {
      p_item_id: id,
      item_updates: updates,
      group_ids: groupIds,
      tag_ids: tagIds,
    });

    if (error) {
      console.error('Error updating directory item:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a directory item
   */
  async function deleteItem(id: string) {
    const { error } = await supabase
      .from('directory_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting directory item:', error);
      throw error;
    }

    return true;
  }

  /**
   * Get all available groups with caching
   */
  function getGroups() {
    return useAsyncData(
      'directory-groups',
      async () => {
        const { data, error } = await supabase
          .from('directory_groups')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching directory groups:', error);
          throw error;
        }

        return data as DirectoryGroup[];
      },
    );
  }

  /**
   * Get all available tags with caching
   */
  function getTags() {
    return useAsyncData(
      'directory-tags',
      async () => {
        const { data, error } = await supabase
          .from('directory_tags')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching directory tags:', error);
          throw error;
        }

        return data as DirectoryTag[];
      },
    );
  }

  /**
   * Toggle like status for an item
   */
  async function toggleLike(itemId: string) {
    if (!user.value) {
      throw new Error('User must be authenticated to like an item');
    }

    // Check if the user has already liked this item
    const existingLike = await checkUserInteraction(itemId, 'like');

    if (existingLike) {
      // Unlike the item
      await deleteUserInteraction(existingLike.id);

      // Decrement the likes count
      await supabase.rpc('decrement_likes_count', { item_id: itemId });

      return false; // Item is now unliked
    }
    else {
      // Like the item
      await createUserInteraction(itemId, 'like');

      // Increment the likes count
      await supabase.rpc('increment_likes_count', { item_id: itemId });

      return true; // Item is now liked
    }
  }

  /**
   * Toggle save status for an item
   */
  async function toggleSave(itemId: string) {
    if (!user.value) {
      throw new Error('User must be authenticated to save an item');
    }

    // Check if the user has already saved this item
    const existingSave = await checkUserInteraction(itemId, 'save');

    if (existingSave) {
      // Unsave the item
      await deleteUserInteraction(existingSave.id);
      return false; // Item is now unsaved
    }
    else {
      // Save the item
      await createUserInteraction(itemId, 'save');
      return true; // Item is now saved
    }
  }

  /**
   * Increment view count for an item
   */
  async function incrementViewCount(itemId: string) {
    // Record the view if user is logged in
    if (user.value) {
      // Check if the user has already viewed this item recently
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const existingView = await checkUserInteraction(
        itemId,
        'view',
        { olderThan: oneDayAgo },
      );

      if (!existingView) {
        // Record the view
        await createUserInteraction(itemId, 'view');
      }
    }

    // Increment the views count
    await supabase.rpc('increment_views_count', { item_id: itemId });
  }

  /**
   * Get comments for an item
   */
  async function getComments(itemId: string) {
    const { data, error } = await supabase
      .from('directory_comments')
      .select(`
        *,
        user:user_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('item_id', itemId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    return data as DirectoryComment[];
  }

  /**
   * Add a comment to an item
   */
  async function addComment(itemId: string, content: string) {
    if (!user.value) {
      throw new Error('User must be authenticated to add a comment');
    }

    const { data, error } = await supabase
      .from('directory_comments')
      .insert({
        item_id: itemId,
        user_id: user.value.id,
        content,
      })
      .select(`
        *,
        user:user_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    return data as DirectoryComment;
  }

  async function getItemsByCategory(categoryId: string) {
    const cacheKey: CacheKey = {
      type: 'category',
      id: categoryId,
    };

    const cachedResult = directoryCache.getFromCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await getItems({ groups: [categoryId] });
    directoryCache.saveToCache(cacheKey, result);
    return result;
  }

  async function getItemsByTag(tagId: string) {
    const cacheKey: CacheKey = {
      type: 'tag',
      id: tagId,
    };

    const cachedResult = directoryCache.getFromCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await getItems({ tags: [tagId] });
    directoryCache.saveToCache(cacheKey, result);
    return result;
  }

  /**
   * Upload files for a directory item
   */
  async function uploadDirectoryFile(
    resourceId: string,
    file: File,
    fileType: 'image' | 'icon',
  ): Promise<string | null> {
    if (!user.value) {
      throw new Error('User must be authenticated to upload files');
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${fileType}.${fileExt}`;
      const filePath = `${user.value.id}/${resourceId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('directory-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error(`${fileType} upload error:`, uploadError);
        throw new Error(uploadError.message || `Failed to upload ${fileType}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('directory-images')
        .getPublicUrl(filePath);

      return publicUrl;
    }
    catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      return null;
    }
  }

  /**
   * Update resource with image URLs
   */
  async function updateItemWithImageUrls(
    resourceId: string,
    imageUrl: string | null,
    iconUrl: string | null,
  ): Promise<boolean> {
    try {
      if (!imageUrl && !iconUrl) return true;

      const updateData: Record<string, string> = {};

      if (imageUrl) updateData.image_url = imageUrl;
      if (iconUrl) updateData.thumbnail_url = iconUrl;

      const { error: updateError } = await supabase
        .from('directory_items')
        .update(updateData)
        .eq('id', resourceId);

      if (updateError) {
        console.error('Error updating resource with image URLs:', updateError);
        throw new Error(updateError.message || 'Failed to update resource with image URLs');
      }

      return true;
    }
    catch (error) {
      console.error('Error in updateItemWithImageUrls:', error);
      return false;
    }
  }

  function clearItemsCache() {
    directoryCache.clearCache();
  }

  return {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getGroups,
    getTags,
    toggleLike,
    toggleSave,
    incrementViewCount,
    getComments,
    addComment,
    getItemsByCategory,
    getItemsByTag,
    clearItemsCache,
    uploadDirectoryFile,
    updateItemWithImageUrls,
  };
}
