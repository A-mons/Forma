    import { createClient } from '@/lib/supabase/server'

    export default async function DashboardPage() {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <div>
        {/* Page header */}
        <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user?.email}
            </p>
        </div>

        {/* Placeholder cards — these become real features in week 2 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            {[
            { label: 'Active quotes', value: '—' },
            { label: 'Pending invoices', value: '—' },
            { label: 'Collected this month', value: '—' },
            ].map((stat) => (
            <div
                key={stat.label}
                className="bg-white rounded-lg border border-gray-200 p-5"
            >
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
            ))}
        </div>

        {/* Feature placeholders */}
        <div className="bg-white rounded-lg border border-gray-200 border-dashed p-12 text-center">
            <p className="text-sm text-gray-400">
            Quotes, invoices, and clients go here — sprint 2.
            </p>
        </div>
        </div>
    )
    }