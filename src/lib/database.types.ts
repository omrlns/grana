// Database types. Regenerate after each migration with `npm run db:types`
// (requires the local Supabase stack running, or adjust the script to use --project-id).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          financial_month_start_day: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          financial_month_start_day?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          financial_month_start_day?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
