# FORMA

Financial infrastructure for senior creative independents.

---

## Overview

FORMA is a SaaS platform designed to streamline the workflow of freelancers and studios from quote creation to payment collection.

It replaces fragmented tools (PDFs, email, Notion, Stripe) with a single structured system.

---

## MVP Scope

The product follows a strict "happy path":

1. User signs in (magic link)
2. Creates a client
3. Builds a quote using structured blocks
4. Sends a shareable link
5. Client views and signs the quote
6. Invoice is automatically generated
7. Client pays via Stripe
8. Payment is confirmed

---

## Tech Stack

* **Frontend / Backend:** Next.js 14 (App Router)
* **Language:** TypeScript (strict mode)
* **Database & Auth:** Supabase (PostgreSQL + RLS)
* **Payments:** Stripe (Payment Links)
* **Emails:** Resend (React Email)
* **Background Jobs:** Inngest
* **Deployment:** Vercel

---

## Architecture Principles

* Server-first (React Server Components)
* Strict type safety (TypeScript + Zod)
* Database-level security (Row Level Security)
* Minimal scope (MVP discipline)
* Event-driven side effects (Inngest)

---

## Project Structure

```
app/
  (auth)/
  (dashboard)/
  api/
  portal/

components/
lib/
types/
```

---

## Authentication

* Magic link authentication via Supabase
* No passwords
* Session handled via cookies
* Middleware protects dashboard routes

---

## Core Concepts

### Clients

Basic entities representing customers.

### Quotes

Structured documents composed of blocks:

* Hero
* Scope
* Pricing
* Terms

Stored as JSONB in PostgreSQL.

### Portal

Public shareable link for clients:

* View quote
* Sign agreement

### Invoices

Auto-generated after signature.

---

## Development

### Setup

```bash
npm install
npm run dev
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Status

### Done

- [x] Auth with Supabase magic link
- [x] Protected dashboard routes
- [x] Dashboard header navigation
- [x] Client listing page
- [x] Client creation form
- [x] Clients API endpoints
- [x] Client TypeScript type
- [x] Quotes listing page
- [x] Quote creation page and form
- [x] Quotes API endpoint
- [x] Quote TypeScript types
- [x] Basic quote/client ownership validation

### In Progress

- [ ] Quote builder with structured blocks
- [ ] Quote detail/edit page
- [ ] Shareable client quote portal
- [ ] Client signature flow
- [ ] Invoice generation after signature
- [ ] Stripe payment flow
- [ ] Email notifications
- [ ] Background jobs

---

## Philosophy

If a feature does not directly help:
→ send a quote
→ get it signed
→ get paid

It does not belong in the MVP.

---

## License

Private project.
