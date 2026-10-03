import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseEnv();
  return Boolean(
    url &&
    key &&
    url !== 'https://your-supabase-project.supabase.co' &&
    key !== 'your-supabase-anon-key'
  );
}

let clientInstance: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  const { url, key } = getSupabaseEnv();
  const configured = isSupabaseConfigured();

  const validUrl = configured ? url : 'https://placeholder.supabase.co';
  const validKey = configured ? key : 'placeholder-anon-key';

  if (!clientInstance) {
    clientInstance = createBrowserClient(validUrl, validKey);
  }
  return clientInstance;
}

export const supabase = createClient();
