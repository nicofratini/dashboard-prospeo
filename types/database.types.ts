export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          chat_id: string;
          content: string;
          created_at: string;
          id: string;
          role: string;
        };
        Insert: {
          chat_id: string;
          content: string;
          created_at?: string;
          id?: string;
          role: string;
        };
        Update: {
          chat_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_messages_chat_id_fkey';
            columns: ['chat_id'];
            isOneToOne: false;
            referencedRelation: 'chats';
            referencedColumns: ['id'];
          },
        ];
      };
      chats: {
        Row: {
          created_at: string;
          id: string;
          title: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      directory_comments: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          item_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          item_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          item_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'directory_comments_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'directory_items';
            referencedColumns: ['id'];
          },
        ];
      };
      directory_groups: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      directory_items: {
        Row: {
          content: string | null;
          created_at: string | null;
          description: string;
          featured: boolean | null;
          id: string;
          image_url: string | null;
          likes_count: number | null;
          metadata: Json | null;
          publish_planned_at: string | null;
          published_at: string | null;
          search_vector: unknown | null;
          status: Database['public']['Enums']['directory_item_status'] | null;
          thumbnail_url: string | null;
          title: string;
          updated_at: string | null;
          url: string | null;
          user_id: string | null;
          views_count: number | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          description: string;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          likes_count?: number | null;
          metadata?: Json | null;
          publish_planned_at?: string | null;
          published_at?: string | null;
          search_vector?: unknown | null;
          status?: Database['public']['Enums']['directory_item_status'] | null;
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string | null;
          url?: string | null;
          user_id?: string | null;
          views_count?: number | null;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          description?: string;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          likes_count?: number | null;
          metadata?: Json | null;
          publish_planned_at?: string | null;
          published_at?: string | null;
          search_vector?: unknown | null;
          status?: Database['public']['Enums']['directory_item_status'] | null;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string | null;
          url?: string | null;
          user_id?: string | null;
          views_count?: number | null;
        };
        Relationships: [];
      };
      directory_items_groups: {
        Row: {
          group_id: string;
          item_id: string;
        };
        Insert: {
          group_id: string;
          item_id: string;
        };
        Update: {
          group_id?: string;
          item_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'directory_items_groups_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'directory_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'directory_items_groups_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'directory_items';
            referencedColumns: ['id'];
          },
        ];
      };
      directory_items_tags: {
        Row: {
          item_id: string;
          tag_id: string;
        };
        Insert: {
          item_id: string;
          tag_id: string;
        };
        Update: {
          item_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'directory_items_tags_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'directory_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'directory_items_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'directory_tags';
            referencedColumns: ['id'];
          },
        ];
      };
      directory_tags: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      directory_user_interactions: {
        Row: {
          created_at: string | null;
          id: string;
          interaction_type: string;
          item_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          interaction_type: string;
          item_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          interaction_type?: string;
          item_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'directory_user_interactions_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'directory_items';
            referencedColumns: ['id'];
          },
        ];
      };
      newsletters_subscribers: {
        Row: {
          created_at: string;
          email: string;
          full_name: string | null;
          note: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string | null;
          note?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string | null;
          note?: string | null;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          created_at: string;
          id: string;
          permission_name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permission_name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          permission_name?: string | null;
        };
        Relationships: [];
      };
      profile_roles: {
        Row: {
          created_at: string;
          id: number;
          profile_id: string;
          role_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          profile_id: string;
          role_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          profile_id?: string;
          role_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_roles_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['profile_id'];
          },
          {
            foreignKeyName: 'profile_roles_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          address: Json | null;
          avatar_url: string | null;
          bio: string | null;
          date_of_birth: string | null;
          email: string;
          first_name: string | null;
          full_name: string | null;
          gender: string | null;
          interests: string[] | null;
          is_subscribed: boolean;
          last_name: string | null;
          occupation: string | null;
          preferences: Json | null;
          profile_id: string;
          social_links: Json | null;
          user_id: string | null;
          username: string | null;
        };
        Insert: {
          address?: Json | null;
          avatar_url?: string | null;
          bio?: string | null;
          date_of_birth?: string | null;
          email: string;
          first_name?: string | null;
          full_name?: string | null;
          gender?: string | null;
          interests?: string[] | null;
          is_subscribed?: boolean;
          last_name?: string | null;
          occupation?: string | null;
          preferences?: Json | null;
          profile_id?: string;
          social_links?: Json | null;
          user_id?: string | null;
          username?: string | null;
        };
        Update: {
          address?: Json | null;
          avatar_url?: string | null;
          bio?: string | null;
          date_of_birth?: string | null;
          email?: string;
          first_name?: string | null;
          full_name?: string | null;
          gender?: string | null;
          interests?: string[] | null;
          is_subscribed?: boolean;
          last_name?: string | null;
          occupation?: string | null;
          preferences?: Json | null;
          profile_id?: string;
          social_links?: Json | null;
          user_id?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          created_at: string;
          id: string;
          product_id: string | null;
          role_name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id?: string | null;
          role_name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string | null;
          role_name?: string;
        };
        Relationships: [];
      };
      suggestion_tags: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      suggestion_types: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      suggestions: {
        Row: {
          created_at: string;
          details: string | null;
          id: number;
          suggestion_type: number | null;
          title: string;
          votes: number;
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          id?: number;
          suggestion_type?: number | null;
          title: string;
          votes?: number;
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: number;
          suggestion_type?: number | null;
          title?: string;
          votes?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'suggestions_suggestion_type_fkey';
            columns: ['suggestion_type'];
            isOneToOne: false;
            referencedRelation: 'suggestion_types';
            referencedColumns: ['id'];
          },
        ];
      };
      suggestions_tags_mapping: {
        Row: {
          created_at: string;
          suggestion_id: number;
          tag_id: number;
        };
        Insert: {
          created_at?: string;
          suggestion_id: number;
          tag_id: number;
        };
        Update: {
          created_at?: string;
          suggestion_id?: number;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'suggestions_tags_mapping_suggestion_id_fkey';
            columns: ['suggestion_id'];
            isOneToOne: false;
            referencedRelation: 'suggestions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'suggestions_tags_mapping_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'suggestion_tags';
            referencedColumns: ['id'];
          },
        ];
      };
      suggestions_votes: {
        Row: {
          created_at: string;
          id: string;
          suggestion_id: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          suggestion_id?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          suggestion_id?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'suggestions_votes_suggestion_id_fkey';
            columns: ['suggestion_id'];
            isOneToOne: false;
            referencedRelation: 'suggestions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      add_suggestion_with_tags: {
        Args: {
          title: string;
          details: string;
          type: number;
          tag_ids: number[];
        };
        Returns: number;
      };
      create_directory_item: {
        Args: {
          item_data: Json;
          group_ids: string[];
          tag_ids: string[];
        };
        Returns: string;
      };
      decrement_likes_count: {
        Args: {
          item_id: string;
        };
        Returns: undefined;
      };
      directory_filtered_partial_search: {
        Args: {
          search_query: string;
          status_filter?: Database['public']['Enums']['directory_item_status'];
          featured_filter?: boolean;
          group_id_filter?: string;
          tag_id_filter?: string;
          user_id_filter?: string;
          limit_val?: number;
          offset_val?: number;
          order_by_column?: string;
          order_ascending?: boolean;
        };
        Returns: {
          id: string;
          title: string;
          description: string;
          content: string;
          image_url: string;
          thumbnail_url: string;
          url: string;
          featured: boolean;
          status: Database['public']['Enums']['directory_item_status'];
          user_id: string;
          views_count: number;
          likes_count: number;
          created_at: string;
          updated_at: string;
          published_at: string;
          metadata: Json;
          search_rank: number;
        }[];
      };
      directory_partial_search: {
        Args: {
          search_term: string;
        };
        Returns: {
          content: string | null;
          created_at: string | null;
          description: string;
          featured: boolean | null;
          id: string;
          image_url: string | null;
          likes_count: number | null;
          metadata: Json | null;
          publish_planned_at: string | null;
          published_at: string | null;
          search_vector: unknown | null;
          status: Database['public']['Enums']['directory_item_status'] | null;
          thumbnail_url: string | null;
          title: string;
          updated_at: string | null;
          url: string | null;
          user_id: string | null;
          views_count: number | null;
        }[];
      };
      increment_likes_count: {
        Args: {
          item_id: string;
        };
        Returns: undefined;
      };
      increment_views_count: {
        Args: {
          item_id: string;
        };
        Returns: undefined;
      };
      update_directory_item: {
        Args: {
          item_id: string;
          item_updates: Json;
          group_ids?: string[];
          tag_ids?: string[];
        };
        Returns: string;
      };
    };
    Enums: {
      directory_item_status: 'draft' | 'pending' | 'published' | 'archived';
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
      ? R
      : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
    PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I;
  }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U;
  }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema['CompositeTypes']
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
