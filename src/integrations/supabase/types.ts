export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contract_notifications: {
        Row: {
          contract_id: string
          id: string
          message_sent: boolean | null
          notification_type: string
          sent_at: string | null
          whatsapp_number: string
        }
        Insert: {
          contract_id: string
          id?: string
          message_sent?: boolean | null
          notification_type: string
          sent_at?: string | null
          whatsapp_number: string
        }
        Update: {
          contract_id?: string
          id?: string
          message_sent?: boolean | null
          notification_type?: string
          sent_at?: string | null
          whatsapp_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_notifications_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          admin_notes: string | null
          contract_type: string
          created_at: string | null
          duration_months: number
          end_date: string
          id: string
          notification_sent: boolean | null
          payment_method: string | null
          payment_proof_url: string | null
          payment_status: string
          price: number
          reviewed_at: string | null
          reviewed_by: string | null
          start_date: string
          status: string
          updated_at: string | null
          user_id: string
          whatsapp_number: string | null
        }
        Insert: {
          admin_notes?: string | null
          contract_type: string
          created_at?: string | null
          duration_months: number
          end_date: string
          id?: string
          notification_sent?: boolean | null
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: string
          price: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id: string
          whatsapp_number?: string | null
        }
        Update: {
          admin_notes?: string | null
          contract_type?: string
          created_at?: string | null
          duration_months?: number
          end_date?: string
          id?: string
          notification_sent?: boolean | null
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: string
          price?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      email_notifications: {
        Row: {
          contract_id: string | null
          created_at: string | null
          email_address: string
          error_message: string | null
          id: string
          message: string
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          contract_id?: string | null
          created_at?: string | null
          email_address: string
          error_message?: string | null
          id?: string
          message: string
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          contract_id?: string | null
          created_at?: string | null
          email_address?: string
          error_message?: string | null
          id?: string
          message?: string
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          position: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          position?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      routes: {
        Row: {
          created_at: string | null
          destination_port: string | null
          distance_nm: number | null
          estimated_duration: unknown | null
          id: string
          name: string
          origin_port: string | null
          ship_id: string
          status: string | null
          updated_at: string | null
          waypoints: Json | null
        }
        Insert: {
          created_at?: string | null
          destination_port?: string | null
          distance_nm?: number | null
          estimated_duration?: unknown | null
          id?: string
          name: string
          origin_port?: string | null
          ship_id: string
          status?: string | null
          updated_at?: string | null
          waypoints?: Json | null
        }
        Update: {
          created_at?: string | null
          destination_port?: string | null
          distance_nm?: number | null
          estimated_duration?: unknown | null
          id?: string
          name?: string
          origin_port?: string | null
          ship_id?: string
          status?: string | null
          updated_at?: string | null
          waypoints?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      ships: {
        Row: {
          call_sign: string | null
          created_at: string | null
          current_heading: number | null
          current_lat: number | null
          current_lng: number | null
          current_speed: number | null
          draft_m: number | null
          flag: string | null
          gross_tonnage: number | null
          id: string
          imo_number: string | null
          length_m: number | null
          name: string
          status: string | null
          type: string | null
          updated_at: string | null
          user_id: string
          width_m: number | null
        }
        Insert: {
          call_sign?: string | null
          created_at?: string | null
          current_heading?: number | null
          current_lat?: number | null
          current_lng?: number | null
          current_speed?: number | null
          draft_m?: number | null
          flag?: string | null
          gross_tonnage?: number | null
          id?: string
          imo_number?: string | null
          length_m?: number | null
          name: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id: string
          width_m?: number | null
        }
        Update: {
          call_sign?: string | null
          created_at?: string | null
          current_heading?: number | null
          current_lat?: number | null
          current_lng?: number | null
          current_speed?: number | null
          draft_m?: number | null
          flag?: string | null
          gross_tonnage?: number | null
          id?: string
          imo_number?: string | null
          length_m?: number | null
          name?: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
          width_m?: number | null
        }
        Relationships: []
      }
      tidal_data: {
        Row: {
          created_at: string | null
          id: string
          latitude: number
          location_name: string
          longitude: number
          tide_height_m: number
          tide_time: string
          tide_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          latitude: number
          location_name: string
          longitude: number
          tide_height_m: number
          tide_time: string
          tide_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          latitude?: number
          location_name?: string
          longitude?: number
          tide_height_m?: number
          tide_time?: string
          tide_type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voyage_logs: {
        Row: {
          heading_degrees: number | null
          id: string
          latitude: number
          log_time: string | null
          longitude: number
          notes: string | null
          route_id: string | null
          sea_state: string | null
          ship_id: string
          speed_knots: number | null
          visibility_nm: number | null
          wave_height_m: number | null
          weather_condition: string | null
          wind_speed_knots: number | null
        }
        Insert: {
          heading_degrees?: number | null
          id?: string
          latitude: number
          log_time?: string | null
          longitude: number
          notes?: string | null
          route_id?: string | null
          sea_state?: string | null
          ship_id: string
          speed_knots?: number | null
          visibility_nm?: number | null
          wave_height_m?: number | null
          weather_condition?: string | null
          wind_speed_knots?: number | null
        }
        Update: {
          heading_degrees?: number | null
          id?: string
          latitude?: number
          log_time?: string | null
          longitude?: number
          notes?: string | null
          route_id?: string | null
          sea_state?: string | null
          ship_id?: string
          speed_knots?: number | null
          visibility_nm?: number | null
          wave_height_m?: number | null
          weather_condition?: string | null
          wind_speed_knots?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "voyage_logs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voyage_logs_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_notifications: {
        Row: {
          contract_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          message: string
          notification_for: string | null
          phone_number: string
          sent_at: string | null
          status: string
        }
        Insert: {
          contract_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          message: string
          notification_for?: string | null
          phone_number: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          contract_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          message?: string
          notification_for?: string | null
          phone_number?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_notifications_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_contract: {
        Args: {
          contract_id_param: string
          admin_id_param: string
          admin_notes_param?: string
        }
        Returns: Json
      }
      get_contracts_expiring_soon: {
        Args: Record<PropertyKey, never>
        Returns: {
          contract_id: string
          user_email: string
          whatsapp_number: string
          contract_type: string
          end_date: string
          days_until_expiry: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      reject_contract: {
        Args: {
          contract_id_param: string
          admin_id_param: string
          admin_notes_param?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
