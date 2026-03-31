import { redirect } from 'next/navigation'

export default function RootPage() {
  // Middleware redirects /dashboard → /login if unauthenticated
  // So this effectively becomes: authenticated → /dashboard, else → /login
  redirect('/dashboard')
}