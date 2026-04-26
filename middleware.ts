    import { createServerClient } from '@supabase/ssr'
    import { NextResponse, type NextRequest } from 'next/server'

    export async function middleware(request: NextRequest) {
    // Maintain request headers and prepare the response object for cookie proxying
    let response = NextResponse.next({
        request: {
        headers: request.headers,
        },
    })

    // Create a Supabase server client using request cookies for SSR auth
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            getAll() {
            return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
            )
            response = NextResponse.next({
                request: {
                headers: request.headers,
                },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
            )
            },
        },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Protect dashboard routes by redirecting unauthenticated users to login
    if (pathname.startsWith('/dashboard') && !user) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    if (pathname === '/login' && user) {
        // Prevent signed-in users from accessing the login page again
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return response
    }

    export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
    }