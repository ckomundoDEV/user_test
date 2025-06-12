import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string | undefined =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey: string | undefined =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error('No se encontró la URL de Supabase en las variables de entorno');
}

if (!supabaseKey) {
  throw new Error('No se encontró la clave de Supabase en las variables de entorno');
}

/**
 * Cliente global de Supabase para uso en frontend y backend.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey); 