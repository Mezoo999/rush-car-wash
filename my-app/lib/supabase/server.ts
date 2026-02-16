import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase server environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
  );
}

// Admin client for server-side operations only
// WARNING: This bypasses RLS - use with extreme caution
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper for admin operations with logging
export async function adminQuery<T>(
  operation: string,
  queryFn: () => Promise<T>
): Promise<T> {
  console.log(`[Admin Query] ${operation} at ${new Date().toISOString()}`);
  
  try {
    const result = await queryFn();
    console.log(`[Admin Query] ${operation} completed successfully`);
    return result;
  } catch (error) {
    console.error(`[Admin Query] ${operation} failed:`, error);
    throw error;
  }
}
