import { Suspense } from 'react'
import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: {
    absolute: 'Login — Alubonets SHG',
  },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <LoginForm />
    </Suspense>
  )
}
