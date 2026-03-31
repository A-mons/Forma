    import { createClient } from '@/lib/supabase/server'
    import { redirect } from 'next/navigation'
    import SignOutButton from './_components/SignOutButton'

    export default async function DashboardLayout({
    children,
    }: {
    children: React.ReactNode
    }) {
    const supabase = createClient()

    // This is a second line of defense — middleware already redirected
    // unauthenticated users, but we check again here defensively.
    // getUser() validates server-side — safe.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
                {/* Logo */}
                <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-900 rounded" />
                <span className="font-semibold text-gray-900 text-sm tracking-tight">
                    FORMA
                </span>
                </div>

                {/* Nav — empty for now, quotes/invoices/clients come later */}
                <nav className="hidden sm:flex items-center gap-1">
                {/* Placeholder — you'll add links here in future sprints */}
                </nav>

                {/* User + sign out */}
                <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 hidden sm:block">
                    {user.email}
                </span>
                <SignOutButton />
                </div>
            </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </main>
        </div>
    )
    }