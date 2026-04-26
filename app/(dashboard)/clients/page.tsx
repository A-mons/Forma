import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Client } from '@/types'

export default async function ClientsPage() {
  const supabase = createClient()

  // Fetch clients for the current organization, ordered by creation date
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<Client[]>()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            {clients?.length ?? 0} client{clients?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/clients/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium
                     rounded-md hover:bg-gray-800 transition-colors"
        >
          Add client
        </Link>
      </div>

      {!clients || clients.length === 0 ? (
        <EmptyState />
      ) : (
        <ClientList clients={clients} />
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-200">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">No clients yet</h3>
      <p className="text-sm text-gray-500 mb-6">Add your first client to start sending quotes.</p>
      <Link
        href="/clients/new"
        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium
                   rounded-md hover:bg-gray-800 transition-colors"
      >
        Add your first client
      </Link>
    </div>
  )
}

function ClientList({ clients }: { clients: Client[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left font-medium text-gray-500 px-5 py-3">Name</th>
            <th className="text-left font-medium text-gray-500 px-5 py-3">Email</th>
            <th className="text-left font-medium text-gray-500 px-5 py-3">Company</th>
            <th className="text-left font-medium text-gray-500 px-5 py-3">Added</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-5 py-3.5 font-medium text-gray-900">{client.name}</td>
              <td className="px-5 py-3.5 text-gray-600">{client.email}</td>
              <td className="px-5 py-3.5 text-gray-600">{client.company ?? '—'}</td>
              <td className="px-5 py-3.5 text-gray-400">
                {new Date(client.created_at).toLocaleDateString('en-GB', {
                  day:   'numeric',
                  month: 'short',
                  year:  'numeric',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}