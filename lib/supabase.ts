import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pijmwgjzdneufoxxgbpb.supabase.co';
const supabaseAnonKey = 'sb_publishable_l-RrMO7uf3PmYUcBjRI1Qw_ru8dlHwH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: window.localStorage
  }
});