'use client'

import { useState }    from 'react'
import { useRouter }   from 'next/navigation'
import Link            from 'next/link'
import type { Client } from '@/types'

type Props = {
  clients: Pick<Client, 'id' | 'name' | 'company'>[]
}

type FieldErrors = {
  title?:     string[]
  client_id?: string[]
}

export default function NewQuoteForm({ clients }: Props) {
  const router = useRouter()
  const [submitting,   setSubmitting]   = useState(false)
  const [fieldErrors,  setFieldErrors]  = useState<FieldErrors>({})
  const [serverError,  setServerError]  = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setFieldErrors({})
    setServerError(null)

    const form = e.currentTarget
    const data = {
      title:     (form.elements.namedItem('title')     as HTMLInputElement).value.trim(),
      client_id: (form.elements.namedItem('client_id') as HTMLSelectElement).value,
    }

    try {
      const res = await fetch('/api/quotes', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })

      if (res.status === 400) {
        const body = await res.json()
        setFieldErrors(body.error ?? {})
        setSubmitting(false)
        return
      }

      if (!res.ok) {
        setServerError('Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      router.push('/quotes')
      router.refresh()
    } catch {
      setServerError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {serverError && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Quote title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Brand identity project"
            required
            autoFocus
            className={`
              w-full px-3 py-2 border rounded-md text-sm text-gray-900
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:border-transparent transition-shadow
              ${fieldErrors.title
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-gray-900'}
            `}
          />
          {fieldErrors.title && (
            <p className="mt-1.5 text-xs text-red-600">{fieldErrors.title[0]}</p>
          )}
        </div>

        {/* Client */}
        <div>
          <label
            htmlFor="client_id"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Client
          </label>
          <select
            id="client_id"
            name="client_id"
            required
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-md text-sm bg-white
              ${selectedClientId ? 'text-gray-900' : 'text-gray-400'}
              focus:outline-none focus:ring-2 focus:border-transparent transition-shadow
              ${fieldErrors.client_id
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-gray-900'}
            `}
          >
            <option value="" disabled>Select a client…</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}{client.company ? ` — ${client.company}` : ''}
              </option>
            ))}
          </select>
          {fieldErrors.client_id && (
            <p className="mt-1.5 text-xs text-red-600">{fieldErrors.client_id[0]}</p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium
                       rounded-md hover:bg-gray-800
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Creating…' : 'Create quote'}
          </button>
          <Link
            href="/quotes"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>

      </form>
    </div>
  )
}
