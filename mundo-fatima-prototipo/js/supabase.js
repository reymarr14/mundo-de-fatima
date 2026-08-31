// Cliente único de Supabase para toda la app.
// Usa la Publishable key (segura para frontend) — la seguridad real depende de RLS.
const SUPABASE_URL = 'https://uqezekauwxxdrkdrwasb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'PEGA_AQUI_TU_PUBLISHABLE_KEY';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});
