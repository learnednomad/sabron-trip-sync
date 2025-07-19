export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accommodations: {
        Row: {
          address: string
          amenities: string[] | null
          check_in: string
          check_out: string
          confirmation_number: string | null
          contact: Json | null
          cost: Json | null
          created_at: string | null
          documents: Json | null
          id: string
          itinerary_id: string
          name: string
          notes: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          check_in: string
          check_out: string
          confirmation_number?: string | null
          contact?: Json | null
          cost?: Json | null
          created_at?: string | null
          documents?: Json | null
          id?: string
          itinerary_id: string
          name: string
          notes?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          check_in?: string
          check_out?: string
          confirmation_number?: string | null
          contact?: Json | null
          cost?: Json | null
          created_at?: string | null
          documents?: Json | null
          id?: string
          itinerary_id?: string
          name?: string
          notes?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          address: string | null
          booking_url: string | null
          category: string | null
          confirmation_number: string | null
          cost: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          itinerary_id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          metadata: Json | null
          notes: string | null
          photos: string[] | null
          rating: number | null
          start_time: string | null
          status: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          booking_url?: string | null
          category?: string | null
          confirmation_number?: string | null
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          itinerary_id: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          metadata?: Json | null
          notes?: string | null
          photos?: string[] | null
          rating?: number | null
          start_time?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          booking_url?: string | null
          category?: string | null
          confirmation_number?: string | null
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          itinerary_id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          metadata?: Json | null
          notes?: string | null
          photos?: string[] | null
          rating?: number | null
          start_time?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_fields: string[] | null
          endpoint: string | null
          entity_id: string | null
          entity_type: string
          error_message: string | null
          http_method: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          reason: string | null
          session_id: string | null
          success: boolean | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          endpoint?: string | null
          entity_id?: string | null
          entity_type: string
          error_message?: string | null
          http_method?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
          session_id?: string | null
          success?: boolean | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          endpoint?: string | null
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          http_method?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
          session_id?: string | null
          success?: boolean | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string | null
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          contact: Json
          created_at: string | null
          details: Json
          documents: Json | null
          id: string
          metadata: Json | null
          notes: string | null
          payment: Json | null
          policies: Json
          pricing: Json
          provider: Json
          reference_number: string
          status: string | null
          timeline: Json
          travelers: Json | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact: Json
          created_at?: string | null
          details: Json
          documents?: Json | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment?: Json | null
          policies: Json
          pricing: Json
          provider: Json
          reference_number: string
          status?: string | null
          timeline: Json
          travelers?: Json | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact?: Json
          created_at?: string | null
          details?: Json
          documents?: Json | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment?: Json | null
          policies?: Json
          pricing?: Json
          provider?: Json
          reference_number?: string
          status?: string | null
          timeline?: Json
          travelers?: Json | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          alerts: Json | null
          category_limits: Json | null
          created_at: string | null
          currency: string | null
          current_spent: number | null
          id: string
          is_shared: boolean | null
          itinerary_id: string
          last_calculated: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          alerts?: Json | null
          category_limits?: Json | null
          created_at?: string | null
          currency?: string | null
          current_spent?: number | null
          id?: string
          is_shared?: boolean | null
          itinerary_id: string
          last_calculated?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          alerts?: Json | null
          category_limits?: Json | null
          created_at?: string | null
          currency?: string | null
          current_spent?: number | null
          id?: string
          is_shared?: boolean | null
          itinerary_id?: string
          last_calculated?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: true
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_members: {
        Row: {
          chat_room_id: string
          id: string
          is_active: boolean | null
          joined_at: string | null
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          chat_room_id: string
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          chat_room_id?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_members_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_room_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          itinerary_id: string | null
          name: string | null
          settings: Json | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          itinerary_id?: string | null
          name?: string | null
          settings?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          itinerary_id?: string | null
          name?: string | null
          settings?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborators: {
        Row: {
          created_at: string | null
          id: string
          invited_by: string
          itinerary_id: string
          joined_at: string | null
          last_active_at: string | null
          permissions: string[] | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_by: string
          itinerary_id: string
          joined_at?: string | null
          last_active_at?: string | null
          permissions?: string[] | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_by?: string
          itinerary_id?: string
          joined_at?: string | null
          last_active_at?: string | null
          permissions?: string[] | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborators_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborators_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          likes_count: number | null
          media_files: Json | null
          parent_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          likes_count?: number | null
          media_files?: Json | null
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          likes_count?: number | null
          media_files?: Json | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          capital_city: string | null
          code: string
          continent: string
          currency: string
          dial_code: string | null
          emergency_numbers: Json | null
          health_requirements: Json | null
          id: string
          is_active: boolean | null
          languages: string[] | null
          last_updated: string | null
          major_cities: string[] | null
          name: string
          official_name: string | null
          safety_level: string | null
          timezone: string | null
          visa_policy: Json | null
        }
        Insert: {
          capital_city?: string | null
          code: string
          continent: string
          currency: string
          dial_code?: string | null
          emergency_numbers?: Json | null
          health_requirements?: Json | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          last_updated?: string | null
          major_cities?: string[] | null
          name: string
          official_name?: string | null
          safety_level?: string | null
          timezone?: string | null
          visa_policy?: Json | null
        }
        Update: {
          capital_city?: string | null
          code?: string
          continent?: string
          currency?: string
          dial_code?: string | null
          emergency_numbers?: Json | null
          health_requirements?: Json | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          last_updated?: string | null
          major_cities?: string[] | null
          name?: string
          official_name?: string | null
          safety_level?: string | null
          timezone?: string | null
          visa_policy?: Json | null
        }
        Relationships: []
      }
      cultural_tips: {
        Row: {
          category: string
          content: string
          country_code: string
          created_at: string | null
          helpful_count: number | null
          id: string
          is_active: boolean | null
          is_moderated: boolean | null
          is_user_generated: boolean | null
          language: string | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          region: string | null
          report_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          content: string
          country_code: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_active?: boolean | null
          is_moderated?: boolean | null
          is_user_generated?: boolean | null
          language?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          region?: string | null
          report_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          content?: string
          country_code?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_active?: boolean | null
          is_moderated?: boolean | null
          is_user_generated?: boolean | null
          language?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          region?: string | null
          report_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cultural_tips_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "cultural_tips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      currencies: {
        Row: {
          code: string
          id: string
          is_active: boolean | null
          last_updated: string | null
          name: string
          rate_to_usd: number
          symbol: string
        }
        Insert: {
          code: string
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          name: string
          rate_to_usd: number
          symbol: string
        }
        Update: {
          code?: string
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          name?: string
          rate_to_usd?: number
          symbol?: string
        }
        Relationships: []
      }
      embassies: {
        Row: {
          address: Json
          appointment_required: boolean | null
          contact_info: Json | null
          country_code: string
          id: string
          is_active: boolean | null
          last_updated: string | null
          name: string
          services: string[] | null
          type: string | null
          website: string | null
          working_hours: Json | null
        }
        Insert: {
          address: Json
          appointment_required?: boolean | null
          contact_info?: Json | null
          country_code: string
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          name: string
          services?: string[] | null
          type?: string | null
          website?: string | null
          working_hours?: Json | null
        }
        Update: {
          address?: Json
          appointment_required?: boolean | null
          contact_info?: Json | null
          country_code?: string
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          name?: string
          services?: string[] | null
          type?: string | null
          website?: string | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "embassies_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          address: Json | null
          allowed_to_contact: boolean | null
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          notes: string | null
          phone_number: string
          preferred_contact_method: string | null
          relationship: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: Json | null
          allowed_to_contact?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          notes?: string | null
          phone_number: string
          preferred_contact_method?: string | null
          relationship: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: Json | null
          allowed_to_contact?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          notes?: string | null
          phone_number?: string
          preferred_contact_method?: string | null
          relationship?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_splits: {
        Row: {
          amount: number
          created_at: string | null
          expense_id: string
          id: string
          is_settled: boolean | null
          notes: string | null
          percentage: number | null
          settled_at: string | null
          settled_method: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          expense_id: string
          id?: string
          is_settled?: boolean | null
          notes?: string | null
          percentage?: number | null
          settled_at?: string | null
          settled_method?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          expense_id?: string
          id?: string
          is_settled?: boolean | null
          notes?: string | null
          percentage?: number | null
          settled_at?: string | null
          settled_method?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_splits_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_splits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          activity_id: string | null
          amount: number
          category: string
          created_at: string | null
          currency: string | null
          deleted_at: string | null
          description: string
          exchange_rate: number | null
          expense_type: string | null
          id: string
          is_business_expense: boolean | null
          is_recurring: boolean | null
          itinerary_id: string | null
          location: Json | null
          merchant_name: string | null
          notes: string | null
          original_amount: number | null
          original_currency: string | null
          payment_method: string | null
          receipt: Json | null
          recurring_pattern: Json | null
          subcategory: string | null
          tags: string[] | null
          tax_amount: number | null
          tax_rate: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          amount: number
          category: string
          created_at?: string | null
          currency?: string | null
          deleted_at?: string | null
          description: string
          exchange_rate?: number | null
          expense_type?: string | null
          id?: string
          is_business_expense?: boolean | null
          is_recurring?: boolean | null
          itinerary_id?: string | null
          location?: Json | null
          merchant_name?: string | null
          notes?: string | null
          original_amount?: number | null
          original_currency?: string | null
          payment_method?: string | null
          receipt?: Json | null
          recurring_pattern?: Json | null
          subcategory?: string | null
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_id?: string | null
          amount?: number
          category?: string
          created_at?: string | null
          currency?: string | null
          deleted_at?: string | null
          description?: string
          exchange_rate?: number | null
          expense_type?: string | null
          id?: string
          is_business_expense?: boolean | null
          is_recurring?: boolean | null
          itinerary_id?: string | null
          location?: Json | null
          merchant_name?: string | null
          notes?: string | null
          original_amount?: number | null
          original_currency?: string | null
          payment_method?: string | null
          receipt?: Json | null
          recurring_pattern?: Json | null
          subcategory?: string | null
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      itineraries: {
        Row: {
          budget: number | null
          cover_image_url: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          destination: string
          end_date: string
          group_size: number | null
          id: string
          metadata: Json | null
          packing_list: Json | null
          share_token: string | null
          shared_with: string[] | null
          start_date: string
          status: string | null
          tags: string[] | null
          title: string
          travel_style: string | null
          updated_at: string | null
          user_id: string
          visibility: string | null
          weather_data: Json | null
        }
        Insert: {
          budget?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          destination: string
          end_date: string
          group_size?: number | null
          id?: string
          metadata?: Json | null
          packing_list?: Json | null
          share_token?: string | null
          shared_with?: string[] | null
          start_date: string
          status?: string | null
          tags?: string[] | null
          title: string
          travel_style?: string | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
          weather_data?: Json | null
        }
        Update: {
          budget?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          destination?: string
          end_date?: string
          group_size?: number | null
          id?: string
          metadata?: Json | null
          packing_list?: Json | null
          share_token?: string | null
          shared_with?: string[] | null
          start_date?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          travel_style?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
          weather_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          accessibility: Json | null
          address: string | null
          amenities: string[] | null
          average_cost: Json | null
          average_rating: number | null
          best_time_to_visit: Json | null
          category: string | null
          city: string | null
          contact_info: Json | null
          country: string
          country_code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_updated: string | null
          latitude: number
          longitude: number
          name: string
          official_website: string | null
          opening_hours: Json | null
          photos: Json | null
          place_id: string | null
          place_type: string | null
          social_media: Json | null
          state: string | null
          subcategory: string | null
          timezone: string | null
          total_visits: number | null
          updated_at: string | null
        }
        Insert: {
          accessibility?: Json | null
          address?: string | null
          amenities?: string[] | null
          average_cost?: Json | null
          average_rating?: number | null
          best_time_to_visit?: Json | null
          category?: string | null
          city?: string | null
          contact_info?: Json | null
          country: string
          country_code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          latitude: number
          longitude: number
          name: string
          official_website?: string | null
          opening_hours?: Json | null
          photos?: Json | null
          place_id?: string | null
          place_type?: string | null
          social_media?: Json | null
          state?: string | null
          subcategory?: string | null
          timezone?: string | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Update: {
          accessibility?: Json | null
          address?: string | null
          amenities?: string[] | null
          average_cost?: Json | null
          average_rating?: number | null
          best_time_to_visit?: Json | null
          category?: string | null
          city?: string | null
          contact_info?: Json | null
          country?: string
          country_code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          latitude?: number
          longitude?: number
          name?: string
          official_website?: string | null
          opening_hours?: Json | null
          photos?: Json | null
          place_id?: string | null
          place_type?: string | null
          social_media?: Json | null
          state?: string | null
          subcategory?: string | null
          timezone?: string | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_room_id: string
          content: string | null
          created_at: string | null
          deleted_at: string | null
          edited_at: string | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          media_files: Json | null
          message_type: string | null
          metadata: Json | null
          read_by: Json | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          chat_room_id: string
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          media_files?: Json | null
          message_type?: string | null
          metadata?: Json | null
          read_by?: Json | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          chat_room_id?: string
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          media_files?: Json | null
          message_type?: string | null
          metadata?: Json | null
          read_by?: Json | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actions: Json | null
          channel: string
          created_at: string | null
          delivered_at: string | null
          entity: Json | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          read_at: string | null
          sent_at: string | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actions?: Json | null
          channel: string
          created_at?: string | null
          delivered_at?: string | null
          entity?: Json | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actions?: Json | null
          channel?: string
          created_at?: string | null
          delivered_at?: string | null
          entity?: Json | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: Json
          created_at: string | null
          id: string
          metadata: Json | null
          method: string
          payment_details: Json
          processed_at: string | null
          reference: Json
          status: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: Json
          created_at?: string | null
          id?: string
          metadata?: Json | null
          method: string
          payment_details: Json
          processed_at?: string | null
          reference: Json
          status: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: Json
          created_at?: string | null
          id?: string
          metadata?: Json | null
          method?: string
          payment_details?: Json
          processed_at?: string | null
          reference?: Json
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          activity_id: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          is_moderated: boolean | null
          itinerary_id: string | null
          likes_count: number | null
          location: Json | null
          media_files: Json | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          shares_count: number | null
          tags: string[] | null
          type: string | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          activity_id?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_moderated?: boolean | null
          itinerary_id?: string | null
          likes_count?: number | null
          location?: Json | null
          media_files?: Json | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          shares_count?: number | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          activity_id?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_moderated?: boolean | null
          itinerary_id?: string | null
          likes_count?: number | null
          location?: Json | null
          media_files?: Json | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          shares_count?: number | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      price_alerts: {
        Row: {
          alert_frequency: string | null
          alerts_sent: number | null
          created_at: string | null
          currency: string | null
          current_price: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_alert_sent: string | null
          last_checked: string | null
          lowest_price: number | null
          lowest_price_date: string | null
          price_history: Json | null
          search_criteria: Json
          target_price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_frequency?: string | null
          alerts_sent?: number | null
          created_at?: string | null
          currency?: string | null
          current_price?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_alert_sent?: string | null
          last_checked?: string | null
          lowest_price?: number | null
          lowest_price_date?: string | null
          price_history?: Json | null
          search_criteria: Json
          target_price: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_frequency?: string | null
          alerts_sent?: number | null
          created_at?: string | null
          currency?: string | null
          current_price?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_alert_sent?: string | null
          last_checked?: string | null
          lowest_price?: number | null
          lowest_price_date?: string | null
          price_history?: Json | null
          search_criteria?: Json
          target_price?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          description: string
          evidence: Json | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
          resolved_at: string | null
          resolved_by_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          evidence?: Json | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
          resolved_at?: string | null
          resolved_by_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          evidence?: Json | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          resolved_at?: string | null
          resolved_by_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_id_fkey"
            columns: ["resolved_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          cons: string[] | null
          content: string
          created_at: string | null
          entity_id: string
          entity_type: string
          helpful_count: number | null
          helpful_users: string[] | null
          id: string
          images: Json | null
          pros: string[] | null
          rating: number
          reported_count: number | null
          response: Json | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          visited_at: string
        }
        Insert: {
          cons?: string[] | null
          content: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          helpful_count?: number | null
          helpful_users?: string[] | null
          id?: string
          images?: Json | null
          pros?: string[] | null
          rating: number
          reported_count?: number | null
          response?: Json | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          visited_at: string
        }
        Update: {
          cons?: string[] | null
          content?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          helpful_count?: number | null
          helpful_users?: string[] | null
          id?: string
          images?: Json | null
          pros?: string[] | null
          rating?: number
          reported_count?: number | null
          response?: Json | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          device_id: string | null
          device_type: string | null
          expires_at: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_active_at: string | null
          location: Json | null
          platform: string | null
          security_flags: Json | null
          token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          device_type?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active_at?: string | null
          location?: Json | null
          platform?: string | null
          security_flags?: Json | null
          token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          device_type?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active_at?: string | null
          location?: Json | null
          platform?: string | null
          security_flags?: Json | null
          token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          sender_id: string | null
          sender_type: string
          ticket_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          sender_id?: string | null
          sender_type: string
          ticket_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          sender_id?: string | null
          sender_type?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          attachments: Json | null
          category: string
          created_at: string | null
          description: string
          id: string
          internal_notes: Json | null
          priority: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          subject: string
          tags: string[] | null
          ticket_number: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          internal_notes?: Json | null
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject: string
          tags?: string[] | null
          ticket_number: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          internal_notes?: Json | null
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject?: string
          tags?: string[] | null
          ticket_number?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          content: Json
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          is_verified: boolean | null
          language: string
          translated_by: string | null
          updated_at: string | null
          verified_by: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_verified?: boolean | null
          language: string
          translated_by?: string | null
          updated_at?: string | null
          verified_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_verified?: boolean | null
          language?: string
          translated_by?: string | null
          updated_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      transportation: {
        Row: {
          arrival_time: string | null
          booking_reference: string | null
          carrier: string | null
          cost: Json | null
          created_at: string | null
          departure_time: string | null
          documents: Json | null
          from_location: string
          id: string
          itinerary_id: string
          notes: string | null
          to_location: string
          type: string
          updated_at: string | null
        }
        Insert: {
          arrival_time?: string | null
          booking_reference?: string | null
          carrier?: string | null
          cost?: Json | null
          created_at?: string | null
          departure_time?: string | null
          documents?: Json | null
          from_location: string
          id?: string
          itinerary_id: string
          notes?: string | null
          to_location: string
          type: string
          updated_at?: string | null
        }
        Update: {
          arrival_time?: string | null
          booking_reference?: string | null
          carrier?: string | null
          cost?: Json | null
          created_at?: string | null
          departure_time?: string | null
          documents?: Json | null
          from_location?: string
          id?: string
          itinerary_id?: string
          notes?: string | null
          to_location?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transportation_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_advisories: {
        Row: {
          country_code: string
          details: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          issued_at: string
          issuing_country: string
          last_updated: string | null
          level: string
          regions: string[] | null
          risk_categories: string[] | null
          source_agency: string | null
          source_url: string | null
          summary: string
          title: string
        }
        Insert: {
          country_code: string
          details?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          issued_at: string
          issuing_country: string
          last_updated?: string | null
          level: string
          regions?: string[] | null
          risk_categories?: string[] | null
          source_agency?: string | null
          source_url?: string | null
          summary: string
          title: string
        }
        Update: {
          country_code?: string
          details?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          issued_at?: string
          issuing_country?: string
          last_updated?: string | null
          level?: string
          regions?: string[] | null
          risk_categories?: string[] | null
          source_agency?: string | null
          source_url?: string | null
          summary?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_advisories_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      travel_log_entries: {
        Row: {
          accessibility: Json | null
          activity_id: string
          best_time_to_visit: Json | null
          companions: string[] | null
          created_at: string | null
          cultural_notes: string | null
          description: string | null
          expenses: Json | null
          highlights: string[] | null
          id: string
          language: string | null
          memories: string | null
          nearby_places: Json | null
          photos: Json | null
          publicly_visible: boolean | null
          rating: number | null
          recommendations: string | null
          tags: string[] | null
          tips: string | null
          title: string
          transportation: Json | null
          updated_at: string | null
          user_id: string
          visit_date: string
          warnings_advice: string | null
          weather: Json | null
          would_return: boolean | null
        }
        Insert: {
          accessibility?: Json | null
          activity_id: string
          best_time_to_visit?: Json | null
          companions?: string[] | null
          created_at?: string | null
          cultural_notes?: string | null
          description?: string | null
          expenses?: Json | null
          highlights?: string[] | null
          id?: string
          language?: string | null
          memories?: string | null
          nearby_places?: Json | null
          photos?: Json | null
          publicly_visible?: boolean | null
          rating?: number | null
          recommendations?: string | null
          tags?: string[] | null
          tips?: string | null
          title: string
          transportation?: Json | null
          updated_at?: string | null
          user_id: string
          visit_date: string
          warnings_advice?: string | null
          weather?: Json | null
          would_return?: boolean | null
        }
        Update: {
          accessibility?: Json | null
          activity_id?: string
          best_time_to_visit?: Json | null
          companions?: string[] | null
          created_at?: string | null
          cultural_notes?: string | null
          description?: string | null
          expenses?: Json | null
          highlights?: string[] | null
          id?: string
          language?: string | null
          memories?: string | null
          nearby_places?: Json | null
          photos?: Json | null
          publicly_visible?: boolean | null
          rating?: number | null
          recommendations?: string | null
          tags?: string[] | null
          tips?: string | null
          title?: string
          transportation?: Json | null
          updated_at?: string | null
          user_id?: string
          visit_date?: string
          warnings_advice?: string | null
          weather?: Json | null
          would_return?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_log_entries_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: true
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_log_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      travelers: {
        Row: {
          created_at: string | null
          email: string | null
          emergency_contact: Json | null
          id: string
          itinerary_id: string
          joined_at: string | null
          name: string
          preferences: Json | null
          role: string
          status: string | null
          travel_documents: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          emergency_contact?: Json | null
          id?: string
          itinerary_id: string
          joined_at?: string | null
          name: string
          preferences?: Json | null
          role: string
          status?: string | null
          travel_documents?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          emergency_contact?: Json | null
          id?: string
          itinerary_id?: string
          joined_at?: string | null
          name?: string
          preferences?: Json | null
          role?: string
          status?: string | null
          travel_documents?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travelers_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travelers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          device: Json | null
          event_action: string
          event_category: string
          event_label: string | null
          event_type: string
          id: string
          load_time: number | null
          location: Json | null
          page: string | null
          properties: Json | null
          referrer: string | null
          session_id: string | null
          time_on_page: number | null
          timestamp: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device?: Json | null
          event_action: string
          event_category: string
          event_label?: string | null
          event_type: string
          id?: string
          load_time?: number | null
          location?: Json | null
          page?: string | null
          properties?: Json | null
          referrer?: string | null
          session_id?: string | null
          time_on_page?: number | null
          timestamp?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device?: Json | null
          event_action?: string
          event_category?: string
          event_label?: string | null
          event_type?: string
          id?: string
          load_time?: number | null
          location?: Json | null
          page?: string | null
          properties?: Json | null
          referrer?: string | null
          session_id?: string | null
          time_on_page?: number | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          accessibility_settings: Json | null
          booking_preferences: Json | null
          created_at: string | null
          currency: string | null
          date_format: string | null
          email_notifications: Json | null
          id: string
          language: string | null
          map_preferences: Json | null
          measurement_unit: string | null
          privacy_settings: Json | null
          push_notifications: Json | null
          theme: string | null
          time_format: string | null
          timezone: string | null
          travel_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accessibility_settings?: Json | null
          booking_preferences?: Json | null
          created_at?: string | null
          currency?: string | null
          date_format?: string | null
          email_notifications?: Json | null
          id?: string
          language?: string | null
          map_preferences?: Json | null
          measurement_unit?: string | null
          privacy_settings?: Json | null
          push_notifications?: Json | null
          theme?: string | null
          time_format?: string | null
          timezone?: string | null
          travel_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accessibility_settings?: Json | null
          booking_preferences?: Json | null
          created_at?: string | null
          currency?: string | null
          date_format?: string | null
          email_notifications?: Json | null
          id?: string
          language?: string | null
          map_preferences?: Json | null
          measurement_unit?: string | null
          privacy_settings?: Json | null
          push_notifications?: Json | null
          theme?: string | null
          time_format?: string | null
          timezone?: string | null
          travel_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          accessibility_needs: Json | null
          address: Json | null
          company: string | null
          created_at: string | null
          dietary_restrictions: string[] | null
          display_name: string | null
          first_name: string | null
          gender: string | null
          health_conditions: string[] | null
          id: string
          languages: string[] | null
          last_name: string | null
          nationality: string | null
          occupation: string | null
          social_media: Json | null
          travel_documents: Json | null
          travel_style: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          accessibility_needs?: Json | null
          address?: Json | null
          company?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          health_conditions?: string[] | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          nationality?: string | null
          occupation?: string | null
          social_media?: Json | null
          travel_documents?: Json | null
          travel_style?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          accessibility_needs?: Json | null
          address?: Json | null
          company?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          health_conditions?: string[] | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          nationality?: string | null
          occupation?: string | null
          social_media?: Json | null
          travel_documents?: Json | null
          travel_style?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          accessibility: Json | null
          consent_history: Json | null
          created_at: string | null
          data_deletion_requests: Json | null
          data_export_requests: Json | null
          data_sharing: Json | null
          id: string
          privacy: Json | null
          security: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accessibility?: Json | null
          consent_history?: Json | null
          created_at?: string | null
          data_deletion_requests?: Json | null
          data_export_requests?: Json | null
          data_sharing?: Json | null
          id?: string
          privacy?: Json | null
          security?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accessibility?: Json | null
          consent_history?: Json | null
          created_at?: string | null
          data_deletion_requests?: Json | null
          data_export_requests?: Json | null
          data_sharing?: Json | null
          id?: string
          privacy?: Json | null
          security?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          billing_history: Json | null
          created_at: string | null
          current_usage: Json | null
          end_date: string | null
          features_enabled: Json | null
          id: string
          payment_method: Json | null
          start_date: string | null
          status: string | null
          tier: string | null
          updated_at: string | null
          usage_limits: Json | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          billing_history?: Json | null
          created_at?: string | null
          current_usage?: Json | null
          end_date?: string | null
          features_enabled?: Json | null
          id?: string
          payment_method?: Json | null
          start_date?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string | null
          usage_limits?: Json | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          billing_history?: Json | null
          created_at?: string | null
          current_usage?: Json | null
          end_date?: string | null
          features_enabled?: Json | null
          id?: string
          payment_method?: Json | null
          start_date?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string | null
          usage_limits?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          accessibility_needs: string | null
          auth_user_id: string | null
          bio: string | null
          created_at: string | null
          currency_preference: string | null
          data_processing_consent: boolean | null
          date_of_birth: string | null
          dietary_restrictions: string | null
          email: string
          email_verified: boolean | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          is_verified: boolean | null
          last_activity_at: string | null
          last_login_at: string | null
          last_name: string | null
          marketing_consent: boolean | null
          name: string
          nationality: string | null
          notification_preferences: Json | null
          passport_expiry: string | null
          passport_number: string | null
          phone_number: string | null
          phone_verified: boolean | null
          preferred_language: string | null
          premium_expires_at: string | null
          privacy_settings: Json | null
          profile_picture_url: string | null
          timezone: string | null
          travel_preferences: Json | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          accessibility_needs?: string | null
          auth_user_id?: string | null
          bio?: string | null
          created_at?: string | null
          currency_preference?: string | null
          data_processing_consent?: boolean | null
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          email: string
          email_verified?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          last_activity_at?: string | null
          last_login_at?: string | null
          last_name?: string | null
          marketing_consent?: boolean | null
          name: string
          nationality?: string | null
          notification_preferences?: Json | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          premium_expires_at?: string | null
          privacy_settings?: Json | null
          profile_picture_url?: string | null
          timezone?: string | null
          travel_preferences?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          accessibility_needs?: string | null
          auth_user_id?: string | null
          bio?: string | null
          created_at?: string | null
          currency_preference?: string | null
          data_processing_consent?: boolean | null
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          email?: string
          email_verified?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          last_activity_at?: string | null
          last_login_at?: string | null
          last_name?: string | null
          marketing_consent?: boolean | null
          name?: string
          nationality?: string | null
          notification_preferences?: Json | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          premium_expires_at?: string | null
          privacy_settings?: Json | null
          profile_picture_url?: string | null
          timezone?: string | null
          travel_preferences?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      visa_applications: {
        Row: {
          application_number: string | null
          created_at: string | null
          decided_at: string | null
          decision: string | null
          documents_required: Json | null
          documents_submitted: Json | null
          embassy: Json | null
          expected_decision: string | null
          id: string
          notes: string | null
          planned_stay: Json | null
          purpose: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
          visa_requirement_id: string
        }
        Insert: {
          application_number?: string | null
          created_at?: string | null
          decided_at?: string | null
          decision?: string | null
          documents_required?: Json | null
          documents_submitted?: Json | null
          embassy?: Json | null
          expected_decision?: string | null
          id?: string
          notes?: string | null
          planned_stay?: Json | null
          purpose?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
          visa_requirement_id: string
        }
        Update: {
          application_number?: string | null
          created_at?: string | null
          decided_at?: string | null
          decision?: string | null
          documents_required?: Json | null
          documents_submitted?: Json | null
          embassy?: Json | null
          expected_decision?: string | null
          id?: string
          notes?: string | null
          planned_stay?: Json | null
          purpose?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
          visa_requirement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visa_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visa_applications_visa_requirement_id_fkey"
            columns: ["visa_requirement_id"]
            isOneToOne: false
            referencedRelation: "visa_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_requirements: {
        Row: {
          fee: Json | null
          from_country_code: string
          id: string
          is_active: boolean | null
          last_updated: string | null
          max_stay_days: number | null
          notes: string | null
          processing_days: number | null
          requirements: Json | null
          restrictions: Json | null
          to_country_code: string
          valid_from: string | null
          valid_until: string | null
          visa_required: boolean | null
          visa_type: string | null
        }
        Insert: {
          fee?: Json | null
          from_country_code: string
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          max_stay_days?: number | null
          notes?: string | null
          processing_days?: number | null
          requirements?: Json | null
          restrictions?: Json | null
          to_country_code: string
          valid_from?: string | null
          valid_until?: string | null
          visa_required?: boolean | null
          visa_type?: string | null
        }
        Update: {
          fee?: Json | null
          from_country_code?: string
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          max_stay_days?: number | null
          notes?: string | null
          processing_days?: number | null
          requirements?: Json | null
          restrictions?: Json | null
          to_country_code?: string
          valid_from?: string | null
          valid_until?: string | null
          visa_required?: boolean | null
          visa_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visa_requirements_from_country_code_fkey"
            columns: ["from_country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "visa_requirements_to_country_code_fkey"
            columns: ["to_country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
