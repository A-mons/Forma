export type Client = {
  id: string
  org_id: string
  name: string
  email: string
  company: string | null
  created_at: string
}

// Quotes

export type QuoteStatus = 'draft' | 'sent' | 'signed' | 'paid'

export type Quote = {
  id: string
  org_id: string
  client_id: string
  title: string
  status: QuoteStatus
  blocks: unknown[]
  total_amount: number
  created_at: string
  updated_at: string
}

// Quote with its client relation joined - used in list views
export type QuoteWithClient = Quote & {
  client: Pick<Client, 'id' | 'name' | 'company'>
}
