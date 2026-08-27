import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log('⚡ Connected to Supabase Cloud PostgreSQL Database');
  } catch (err) {
    console.warn('⚠️ Supabase connection initialization failed, falling back to local database:', err);
  }
} else {
  console.log('ℹ️ No Supabase credentials found in environment. Using persistent local JSON database (database/store.json).');
}

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};
