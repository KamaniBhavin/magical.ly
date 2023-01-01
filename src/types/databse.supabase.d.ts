import {UserDetails} from "./database.magically";

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[]

export interface Database {
  public: {
    Tables: {
      credits: {
        Row: {
          user_id: string
          tokens: number
          id: number
          created_at: string
        }
        Insert: {
          user_id: string
          tokens?: number
          id?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          tokens?: number
          id?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_credits: {
        Args: { user_id: string; amount: number }
        Returns: undefined
      }
      get_user_data: {
        Args: { user_id: string }
        Returns: UserDetails
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
