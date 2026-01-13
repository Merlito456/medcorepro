
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvkkvijeopdlokmyxqhk.supabase.co';

// Try to get key from environment or use a placeholder that doesn't crash the constructor
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'MISSING_KEY'; 

// We export a dummy client if the key is missing to allow the app to boot
export const supabase = (supabaseAnonKey !== 'MISSING_KEY') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        insert: async () => ({ error: new Error("Supabase not configured") }),
        select: async () => ({ data: [], error: new Error("Supabase not configured") }),
        update: async () => ({ error: new Error("Supabase not configured") }),
        delete: async () => ({ error: new Error("Supabase not configured") }),
        eq: function() { return this; }
      })
    } as any;
