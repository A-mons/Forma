import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  // Use server-side cookies to keep auth state in sync during SSR
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
    cookies: {
        getAll() {
        return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
        try {
            cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
            )
        } catch {
            // Prevent render failure when cookie writes are unavailable in this environment
        }
        },
    },
    }
    )
}