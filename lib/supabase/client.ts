    import { createBrowserClient } from '@supabase/ssr'

    export function createClient() {
    // Browser client for client-side Supabase auth and data requests
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    }