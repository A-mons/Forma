    'use client'

    import { useState } from 'react'
    import { createClient } from '@/lib/supabase/client'
    import { useSearchParams } from 'next/navigation'
    import { Suspense } from 'react'

    function LoginForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const searchParams = useSearchParams()
    const callbackError = searchParams.get('error')

    // Client-side Supabase instance used for auth actions on the login page
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Send magic link to the provided email address
        const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // Redirect user to auth callback handler after email verification
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
        })

        if (error) {
        setError(error.message)
        setLoading(false)
        return
        }

        setSent(true)
        setLoading(false)
    }

    if (sent) {
        return (
        <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your inbox</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
            We sent a magic link to{' '}
            <span className="font-medium text-gray-700">{email}</span>.
            <br />
            Click it to sign in — no password needed.
            </p>
            <button
            onClick={() => setSent(false)}
            className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
            Use a different email
            </button>
        </div>
        )
    }

    return (
        <>
        <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Sign in to FORMA</h1>
            <p className="text-sm text-gray-500">
            Enter your email — we will send you a magic link.
            </p>
        </div>

        {callbackError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
                Sign in failed. Please try again.
            </p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
            >
                Email address
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lea@studio.com"
                required
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                        transition-shadow"
            />
            </div>

            {error && (
            <p className="text-sm text-red-600">{error}</p>
            )}

            <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-md
                        hover:bg-gray-800
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors"
            >
            {loading ? 'Sending...' : 'Send magic link →'}
            </button>
        </form>
        </>
    )
    }

    export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-8">
            <Suspense>
            <LoginForm />
            </Suspense>
        </div>
        </div>
    )
    }