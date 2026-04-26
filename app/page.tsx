import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect authenticated users to dashboard, unauthenticated to login
  // Middleware handles initial routing, this is the fallback redirect
  redirect('/dashboard')
}