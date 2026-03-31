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
        // Session is now set — redirect to the dashboard
        return NextResponse.redirect(`${origin}/dashboard`)
        }
    }

    // Code was missing or exchange failed — send back to login with an error flag
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
    }