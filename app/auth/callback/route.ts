    import { createClient } from '@/lib/supabase/server'
    import { NextResponse } from 'next/server'
    import { type NextRequest } from 'next/server'

    export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
        // Exchange successful: session established, redirect to dashboard
        return NextResponse.redirect(`${origin}/dashboard`)
        }
    }

    // Exchange failed or code missing: redirect to login with error indicator
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
    }