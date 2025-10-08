import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '@/backend/database/types';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('🔧 Supabase Configuration:');
console.log('  URL:', supabaseUrl || 'MISSING');
console.log('  Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING');
console.log('  Platform:', Platform.OS);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL or Anon Key is missing!');
  console.error('   1. Check your .env file exists in the root directory');
  console.error('   2. Make sure it contains EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
  console.error('   3. Restart your development server with: npx expo start --clear');
}

const supabaseStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') {
        return null;
      }
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') {
        return;
      }
      localStorage.setItem(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') {
        return;
      }
      localStorage.removeItem(key);
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
