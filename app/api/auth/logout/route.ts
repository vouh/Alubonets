import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  try {
    await supabase.auth.signOut()
  } catch {
    // Session may already be invalid — cookies are cleared regardless.
  }
  return NextResponse.json({ ok: true })
}
