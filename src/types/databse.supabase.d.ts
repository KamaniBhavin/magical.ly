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
                    id: number
                    created_at: string
                    updated_at: string
                    count: number
                    user_id: string
                }
                Insert: {
                    id?: number
                    created_at?: string
                    updated_at?: string
                    count?: number
                    user_id: string
                }
                Update: {
                    id?: number
                    created_at?: string
                    updated_at?: string
                    count?: number
                    user_id?: string
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
            [_ in never]: never
        }
    }
}
