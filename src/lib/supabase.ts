import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      wqi_uploads: {
        Row: {
          id: number
          user_id: string
          location: string
          ph: number
          turbidity: number
          created_at: string
          username: string
          latitute: number
          longitude: number
        }
        Insert: {
          id?: number
          user_id: string
          location: string
          ph: number
          turbidity: number
          created_at?: string
          username: string
          latitute: number
          longitude: number
        }
        Update: {
          id?: number
          user_id?: string
          location?: string
          ph?: number
          turbidity?: number
          created_at?: string
          username?: string
          latitude?: number
          longitute?: number
        }
      }
    }
  }
}
