'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type FieldErrors = {
  name?:    string[]
  email?:   string[]
  company?: string[]
}

export default function NewClientPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  // Serialize form values and submit to the API route for client creation
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setFieldErrors({})
    setServerError(null)

    // Extract form values and normalize input before submission
    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value.trim(),
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value.trim(),
      company: (form.elements.namedItem('company') as HTMLInputElement).value.trim() || undefined,
    }

    try {
      const res = await fetch('/api/clients', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })

      if (res.status === 400) {
        // Client validation failed; display field-level errors returned by the API
        const body = await res.json()
        setFieldErrors(body.error ?? {})
        setSubmitting(false)
        return
      }

      if (!res.ok) {
        // Backend error, log or report as needed and show generic user-facing message
        setServerError('Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      router.push('/clients')
      router.refresh()
    } catch {
      setServerError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <Link
          href="/clients"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Clients
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3">Add client</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {serverError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Field
            label="Full name"
            name="name"
            type="text"
            placeholder="Sofia Martin"
            required
            autoFocus
            errors={fieldErrors.name}
          />
          <Field
            label="Email address"
            name="email"
            type="email"
            placeholder="sofia@company.com"
            required
            errors={fieldErrors.email}
          />
          <Field
            label="Company"
            name="company"
            type="text"
            placeholder="Novo Studio"
            optional
            errors={fieldErrors.company}
          />

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium
                         rounded-md hover:bg-gray-800
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
            >
              {submitting ? 'Saving...' : 'Save client'}
            </button>
            <Link
              href="/clients"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

type FieldProps = {
  label:       string
  name:        string
  type:        string
  placeholder: string
  required?:   boolean
  optional?:   boolean
  autoFocus?:  boolean
  errors?:     string[]
}

function Field({ label, name, type, placeholder, required, optional, autoFocus, errors }: FieldProps) {
  const hasError = errors && errors.length > 0

  // Reusable input field component with accessible labels and inline validation state
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {optional && <span className="ml-1 text-gray-400 font-normal">(optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        className={`
          w-full px-3 py-2 border rounded-md text-sm text-gray-900
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:border-transparent
          transition-shadow
          ${hasError
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-gray-900'
          }
        `}
      />
      {hasError && (
        <p className="mt-1.5 text-xs text-red-600">{errors[0]}</p>
      )}
    </div>
  )
}