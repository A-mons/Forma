import { createClient } from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'
import { z }             from 'zod'
import type { QuoteWithClient } from '@/types'

const createQuoteSchema = z.object({
  title:     z.string().min(1, 'Title is required').max(200),
  client_id: z.string().uuid('Invalid client'),
})

// ─── GET /api/quotes ─────────────────────────────────────────────────────────

export async function GET() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('quotes')
    .select('*, client:clients(id, name, company)')
    .order('created_at', { ascending: false })
    .returns<QuoteWithClient[]>()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// ─── POST /api/quotes ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    const rawBody = await request.text()
    body = rawBody.trim() === '' ? {} : JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = createQuoteSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { title, client_id } = result.data

  // Verify the client belongs to this user before creating the quote.
  // RLS would catch this at DB level too, but we check explicitly
  const { data: clientCheck } = await supabase
    .from('clients')
    .select('id')
    .eq('id', client_id)
    .eq('org_id', user.id)
    .single()

  if (!clientCheck) {
    return NextResponse.json(
      { error: { client_id: ['Client not found'] } },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('quotes')
    .insert({
      org_id:       user.id, 
      client_id,
      title,
      status:       'draft',
      blocks:       [],
      total_amount: 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
