
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmieubfmyiznrctzqkry.supabase.co';
const supabaseAnonKey = 'sb_publishable_UCDlXOjJJBDDv_MQuVTAdw_4Hwk9omK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Garante que a sessão seja salva no LocalStorage
    autoRefreshToken: true, // Renova o token automaticamente
    detectSessionInUrl: true // Útil para links de confirmação de e-mail
  }
});
