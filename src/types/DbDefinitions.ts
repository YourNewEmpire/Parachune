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
      albums: {
        Row: {
          artist_id: string | null;
          created_at: string;
          genre: string | null;
          id: string;
          image_url: string;
          is_single: boolean | null;
          title: string;
        };
        Insert: {
          artist_id?: string | null;
          created_at?: string;
          genre?: string | null;
          id?: string;
          image_url: string;
          is_single?: boolean | null;
          title: string;
        };
        Update: {
          artist_id?: string | null;
          created_at?: string;
          genre?: string | null;
          id?: string;
          image_url?: string;
          is_single?: boolean | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "albums_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          social_media_urls: Json | null;
          stripe_id: string | null;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          social_media_urls?: Json | null;
          stripe_id?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          social_media_urls?: Json | null;
          stripe_id?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      "saved songs": {
        Row: {
          created_at: string | null;
          id: number;
          song_id: string;
          song_url: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          song_id: string;
          song_url?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          song_id?: string;
          song_url?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved songs_song_id_fkey";
            columns: ["song_id"];
            isOneToOne: false;
            referencedRelation: "songs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved songs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      song_comments: {
        Row: {
          artist_id: string;
          comment_text: string;
          created_at: string | null;
          id: number;
          private: boolean;
          song_id: string;
          user_id: string;
        };
        Insert: {
          artist_id: string;
          comment_text: string;
          created_at?: string | null;
          id?: number;
          private: boolean;
          song_id: string;
          user_id: string;
        };
        Update: {
          artist_id?: string;
          comment_text?: string;
          created_at?: string | null;
          id?: number;
          private?: boolean;
          song_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_song_comments_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "song comments_song_id_fkey";
            columns: ["song_id"];
            isOneToOne: false;
            referencedRelation: "songs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "song comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      song_likes: {
        Row: {
          created_at: string | null;
          id: number;
          liked: boolean;
          song_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          liked: boolean;
          song_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          liked?: boolean;
          song_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "song_likes_song_id_fkey";
            columns: ["song_id"];
            isOneToOne: false;
            referencedRelation: "songs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "song_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      songs: {
        Row: {
          album_id: string;
          artist_id: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          lyrics: string | null;
          name: string | null;
          song_url: string | null;
        };
        Insert: {
          album_id: string;
          artist_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          lyrics?: string | null;
          name?: string | null;
          song_url?: string | null;
        };
        Update: {
          album_id?: string;
          artist_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          lyrics?: string | null;
          name?: string | null;
          song_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "songs_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "albums";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "songs_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_song_like: {
        Args: {
          _user_id: string;
          _song_id: string;
          _liked: boolean;
        };
        Returns: Json;
      };
      delete_album_image: {
        Args: {
          image_url: string;
        };
        Returns: Record<string, unknown>;
      };
      delete_avatar: {
        Args: {
          avatar_url: string;
        };
        Returns: Record<string, unknown>;
      };
      delete_song: {
        Args: {
          song_url: string;
        };
        Returns: Record<string, unknown>;
      };
      delete_storage_object: {
        Args: {
          bucket: string;
          object: string;
        };
        Returns: Record<string, unknown>;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
