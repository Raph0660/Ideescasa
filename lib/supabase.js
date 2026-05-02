import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// On exporte directement l'objet "supabase" déjà prêt
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
