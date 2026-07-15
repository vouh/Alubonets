import { NextResponse } from 'next/server'
import { z } from 'zod'
import { findTestAccount } from '@/lib/auth/users'
import { setSessionCookie } from '@/lib/auth/session'
import { ROLE_HOME } from '@/lib/auth/types'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 })
    }

    const user = findTestAccount(parsed.data.email, parsed.data.password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials. Please try again.' }, { status: 401 })
    }

    await setSessionCookie(user)

    return NextResponse.json({
      user,
      redirectTo: ROLE_HOME[user.role],
    })
  } catch {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 })
  }
}
