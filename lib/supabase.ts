import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmieubfmyiznrctzqkry.supabase.co';
const supabaseAnonKey = 'sb_publishable_UCDlXOjJJBDDv_MQuVTAdw_4Hwk9omK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: window.localStorage
  }
});