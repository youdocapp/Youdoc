import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database/types';

const supabaseUrl = "https://itxsyveuizzzyoevkmyf.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase URL or Service Key is missing. Please add them to your environment variables.');
}

export const supabaseServer: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function getUserFromToken(token: string) {
  const { data: { user }, error } = await supabaseServer.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}
