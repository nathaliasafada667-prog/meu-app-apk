import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.0';

const supabaseUrl = 'https://xrkgbsdwfmhvokigkonx.supabase.co';
const supabaseAnonKey = 'sb_publishable_9_1gh6U73z6zXnMIyx1MTg_J-m7jKzN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
