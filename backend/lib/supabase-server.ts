import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database/types';

const supabaseUrl = "https://itxsyveuizzzyoevkmyf.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHN5dmV1aXp6enlvZXZrbXlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA3ODQ5NiwiZXhwIjoyMDcxNjU0NDk2fQ.vMxlivkDCRL7O-QPoAJ8dg8_DA8-ce4Ldi4M1Pmz-WM" || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

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
