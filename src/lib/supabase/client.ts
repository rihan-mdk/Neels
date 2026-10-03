import { createBrowserClient } from '@supabase/ssr';
import { createClient as createJsClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
    supabaseAnonKey !== 'your-supabase-anon-key'
  );
}

let clientInstance: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (clientInstance) return clientInstance;

  // Use dummy valid URL format for fallback client instantiation during build/unconfigured state
  const validUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
  const validKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key';

  clientInstance = createBrowserClient(validUrl, validKey);
  return clientInstance;
}

export const supabase = createClient();
