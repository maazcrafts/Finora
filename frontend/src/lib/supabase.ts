import { createClient } from '@supabase/supabase-js';
import { getFirebaseAuth } from '../firebase/config';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      accessToken: async () => {
        const user = getFirebaseAuth().currentUser;
        return user ? user.getIdToken() : null;
      },
    })
  : null;
