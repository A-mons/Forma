import { createClient }        from '@/lib/supabase/server'
import Link                    from 'next/link'
import type { QuoteWithClient, QuoteStatus } from '@/types'

export default async function QuotesPage() {
  const supabase = createClient()

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*, client:clients(id, name, company)')
    .order('created_at', { ascending: false })
    .returns<QuoteWithClient[]>()

  const list = quotes ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quotes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {list.length} quote{list.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/quotes/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium
                     rounded-md hover:bg-gray-800 transition-colors"
        >
          New quote
        </Link>
      </div>

      {list.length === 0 ? <EmptyState /> : <QuoteTable quotes={list} />}
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-200">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
               a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19
               a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">No quotes yet</h3>
      <p className="text-sm text-gray-500 mb-6">
        Create your first quote to start sending proposals.
      </p>
      <Link
        href="/quotes/new"
        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium
                   rounded-md hover:bg-gray-800 transition-colors"
      >
        Create your first quote
      </Link>
    </div>
  )
}

// ─── Table ───────────────────────────────────────────────────────────────────

function QuoteTable({ quotes }: { quotes: QuoteWithClient[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left font-medium text-gray-500 px-5 py-3">Title</th>
            <th className="text-left font-medium text-gray-500 px-5 py-3">Client</th>
            <th className="text-left font-medium text-gray-500 px-5 py-3">Status</th>
            <th className="text-left font-medium text-gray-500 px-5 py-3">Amount</th>
            <th className="text-left font-medium text-gray-500 px-5 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr
              key={quote.id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              <td className="px-5 py-3.5 font-medium text-gray-900">
                {quote.title}
              </td>
              <td className="px-5 py-3.5 text-gray-600">
                {quote.client.name}
                {quote.client.company && (
                  <span className="text-gray-400 ml-1"> · {quote.client.company}</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge status={quote.status} />
              </td>
              <td className="px-5 py-3.5 text-gray-600">
                {formatAmount(quote.total_amount)}
              </td>
              <td className="px-5 py-3.5 text-gray-400">
                {new Date(quote.created_at).toLocaleDateString('en-GB', {
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<QuoteStatus, string> = {
  draft:  'bg-gray-100 text-gray-600',
  sent:   'bg-blue-50 text-blue-700',
  signed: 'bg-amber-50 text-amber-700',
  paid:   'bg-emerald-50 text-emerald-700',
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function formatAmount(cents: number): string {
  if (cents === 0) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style:    'currency',
    currency: 'EUR',
  }).format(cents / 100)
}
