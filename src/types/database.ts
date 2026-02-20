export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nome: string
          role: 'admin' | 'editor'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nome: string
          role?: 'admin' | 'editor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nome?: string
          role?: 'admin' | 'editor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: Json
          excerpt: string | null
          status: 'draft' | 'scheduled' | 'published' | 'archived'
          published_at: string | null
          author_id: string
          category_id: string | null
          featured_image_id: string | null
          meta_title: string | null
          meta_description: string | null
          keywords: string[] | null
          reading_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug?: string
          content: Json
          excerpt?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'archived'
          published_at?: string | null
          author_id: string
          category_id?: string | null
          featured_image_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
          keywords?: string[] | null
          reading_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: Json
          excerpt?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'archived'
          published_at?: string | null
          author_id?: string
          category_id?: string | null
          featured_image_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
          keywords?: string[] | null
          reading_time?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
      media: {
        Row: {
          id: string
          filename: string
          stored_name: string
          url: string
          mime_type: string
          size_bytes: number
          width: number | null
          height: number | null
          alt_text: string
          caption: string | null
          folder_id: string | null
          uploader_id: string
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          stored_name: string
          url: string
          mime_type: string
          size_bytes: number
          width?: number | null
          height?: number | null
          alt_text: string
          caption?: string | null
          folder_id?: string | null
          uploader_id: string
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          stored_name?: string
          url?: string
          mime_type?: string
          size_bytes?: number
          width?: number | null
          height?: number | null
          alt_text?: string
          caption?: string | null
          folder_id?: string | null
          uploader_id?: string
          created_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          created_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          name: string
          key_hash: string
          prefix: string
          user_id: string
          last_used: string | null
          expires_at: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          key_hash: string
          prefix: string
          user_id: string
          last_used?: string | null
          expires_at?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          key_hash?: string
          prefix?: string
          user_id?: string
          last_used?: string | null
          expires_at?: string | null
          active?: boolean
          created_at?: string
        }
      }
      webhooks: {
        Row: {
          id: string
          name: string
          url: string
          events: string[]
          secret: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          events: string[]
          secret: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          events?: string[]
          secret?: string
          active?: boolean
          created_at?: string
        }
      }
      ai_generations: {
        Row: {
          id: string
          post_id: string | null
          user_id: string
          type: 'content' | 'seo' | 'transcription'
          model: string
          prompt: string
          word_count: number
          tokens_in: number | null
          tokens_out: number | null
          duration_ms: number
          source_urls: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          user_id: string
          type: 'content' | 'seo' | 'transcription'
          model: string
          prompt: string
          word_count: number
          tokens_in?: number | null
          tokens_out?: number | null
          duration_ms: number
          source_urls?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          user_id?: string
          type?: 'content' | 'seo' | 'transcription'
          model?: string
          prompt?: string
          word_count?: number
          tokens_in?: number | null
          tokens_out?: number | null
          duration_ms?: number
          source_urls?: string[] | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'editor'
      post_status: 'draft' | 'scheduled' | 'published' | 'archived'
      ai_generation_type: 'content' | 'seo' | 'transcription'
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']
export type Category = Database['public']['Tables']['categories']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type ApiKey = Database['public']['Tables']['api_keys']['Row']
export type Webhook = Database['public']['Tables']['webhooks']['Row']
export type AiGeneration = Database['public']['Tables']['ai_generations']['Row']
