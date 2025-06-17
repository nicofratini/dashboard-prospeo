export type DirectoryItemStatus = 'draft' | 'pending' | 'published' | 'archived';

export interface DirectoryGroup {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DirectoryTag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Directory submission types
export interface DirectoryCategory {
  id: string;
  name: string;
}

export interface AIAnalysis {
  summary: string;
  suggestedTags: string[];
  suggestedCategories: string[];
  primaryTopic: string;
  targetAudience: string;
}

export interface ScrapeMetadata {
  url: string;
  title: string;
  description: string;
  image: string;
  imageData: string;
  favicon: string;
  faviconData: string;
  domain: string;
  keywords: string;
  author: string;
  themeColor: string;
  aiAnalysis: AIAnalysis;
}

export interface ScrapeResponse {
  success: boolean;
  metadata: ScrapeMetadata;
}

export interface DirectoryItem {
  id: string;
  title: string;
  description: string;
  content: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  url: string | null;
  featured: boolean;
  status: DirectoryItemStatus;
  user_id: string | null;
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  metadata: Record<string, any> | null;

  // These will be populated by joins or additional queries
  groups?: DirectoryGroup[];
  tags?: DirectoryTag[];
  user?: User;
  is_liked_by_user?: boolean;
  is_saved_by_user?: boolean;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  display_name?: string;
}

export interface DirectoryComment {
  id: string;
  item_id: string;
  user_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface DirectoryUserInteraction {
  id: string;
  user_id: string;
  item_id: string;
  interaction_type: 'like' | 'save' | 'view';
  created_at: string;
}

export interface DirectoryCollection {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  thumbnail_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;

  // These will be populated by joins or additional queries
  user?: User;
  items_count?: number;
}

export interface DirectoryCollectionItem {
  collection_id: string;
  item_id: string;
  added_at: string;
  note: string | null;
  position: number;

  // This will be populated by joins
  item?: DirectoryItem;
}
