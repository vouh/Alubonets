import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** Simple client without cookie/SSR session handling. Prefer `@/utils/supabase/*` in app code. */
export const supabase = createClient(supabaseUrl, supabaseKey)
