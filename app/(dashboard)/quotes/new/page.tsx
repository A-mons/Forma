import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import type { Client }  from '@/types'
import NewQuoteForm     from './NewQuoteForm'

export default async function NewQuotePage() {
  const supabase = createClient()

  // Auth double-check (middleware already handles this, but be explicit)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch this user's clients to populate the select
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, company')
    .eq('org_id', user.id)
    .order('name', { ascending: true })
    .returns<Pick<Client, 'id' | 'name' | 'company'>[]>()

  const list = clients ?? []

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <Link
          href="/quotes"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Quotes
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3">New quote</h1>
      </div>

      {list.length === 0 ? (
        <NoClientsWarning />
      ) : (
        <NewQuoteForm clients={list} />
      )}
    </div>
  )
}

function NoClientsWarning() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
      <h3 className="text-sm font-medium text-amber-800 mb-1">No clients yet</h3>
      <p className="text-sm text-amber-700 mb-4">
        You need at least one client before creating a quote.
      </p>
      <Link
        href="/clients/new"
        className="text-sm font-medium text-amber-800 underline underline-offset-2
                   hover:text-amber-900"
      >
        Add a client →
      </Link>
    </div>
  )
}
