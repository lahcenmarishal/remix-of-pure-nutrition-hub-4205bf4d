export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          is_published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          label: string
        }
        Insert: {
          id: string
          label: string
        }
        Update: {
          id?: string
          label?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          items: Json
          notes: string | null
          shipping: number | null
          shipping_address: string
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          items?: Json
          notes?: string | null
          shipping?: number | null
          shipping_address: string
          status?: string
          subtotal: number
          total: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          items?: Json
          notes?: string | null
          shipping?: number | null
          shipping_address?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          barcode: string | null
          benefits: string[] | null
          category: string
          created_at: string
          description: string | null
          expiration_date: string | null
          faq: Json | null
          id: string
          image: string
          images: string[] | null
          ingredients: Json | null
          is_active: boolean | null
          name: string
          original_price: number | null
          price: number
          promo_label: string | null
          rating: number | null
          reviews: number | null
          shipping_price: number | null
          short_description: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          barcode?: string | null
          benefits?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          faq?: Json | null
          id?: string
          image: string
          images?: string[] | null
          ingredients?: Json | null
          is_active?: boolean | null
          name: string
          original_price?: number | null
          price: number
          promo_label?: string | null
          rating?: number | null
          reviews?: number | null
          shipping_price?: number | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          barcode?: string | null
          benefits?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          faq?: Json | null
          id?: string
          image?: string
          images?: string[] | null
          ingredients?: Json | null
          is_active?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          promo_label?: string | null
          rating?: number | null
          reviews?: number | null
          shipping_price?: number | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      promos: {
        Row: {
          badge: string | null
          created_at: string | null
          id: string
          image: string | null
          is_active: boolean | null
          link: string | null
          sort_order: number | null
          subtitle: string | null
          title: string
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          link?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title: string
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          link?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          email: string | null
          facebook: string | null
          free_shipping_threshold: number | null
          id: string
          instagram: string | null
          phone: string | null
          shipping_price: number | null
          tiktok: string | null
          updated_at: string | null
          whatsapp: string | null
          youtube: string | null
        }
        Insert: {
          address?: string | null
          email?: string | null
          facebook?: string | null
          free_shipping_threshold?: number | null
          id?: string
          instagram?: string | null
          phone?: string | null
          shipping_price?: number | null
          tiktok?: string | null
          updated_at?: string | null
          whatsapp?: string | null
          youtube?: string | null
        }
        Update: {
          address?: string | null
          email?: string | null
          facebook?: string | null
          free_shipping_threshold?: number | null
          id?: string
          instagram?: string | null
          phone?: string | null
          shipping_price?: number | null
          tiktok?: string | null
          updated_at?: string | null
          whatsapp?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar: string | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          rating: number | null
          role: string | null
        }
        Insert: {
          avatar?: string | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          rating?: number | null
          role?: string | null
        }
        Update: {
          avatar?: string | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          rating?: number | null
          role?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
