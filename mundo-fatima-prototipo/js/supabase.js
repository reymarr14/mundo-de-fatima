// Cliente único de Supabase para toda la app.
// Usa la Publishable key (segura para frontend) — la seguridad real depende de RLS.
const SUPABASE_URL = 'https://uqezekauwxxdrkdrwasb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_RFqipJgoXtBc96_ORCcLQw_JGkqPTaK';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});
