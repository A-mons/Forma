    'use client'

    import { createClient } from '@/lib/supabase/client'
    import { useRouter } from 'next/navigation'
    import { useState } from 'react'

    export default function SignOutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSignOut() {
        setLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh() 
    }

    return (
        <button
        onClick={handleSignOut}
        disabled={loading}
        className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors"
        >
        {loading ? 'Signing out...' : 'Sign out'}
        </button>
    )
    }