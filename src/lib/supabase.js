import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://indrjjnwxrkixbrjmhef.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_AZlCxWpOMQxa2LD234yzuw_0kuHlR7I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
