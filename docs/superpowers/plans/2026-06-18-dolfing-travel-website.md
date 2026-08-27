# Dolfing Travel Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (ES/EN) marketing website for Dolfing Travel that showcases services across three audience segments (FIT, MICE, B2B Agencies) and captures leads via a segmented quote form and WhatsApp.

**Architecture:** Next.js App Router with `[locale]` segment routing via next-intl, pure API route for form submission (no external form service), UI built with Tailwind using a custom design token system (forest green + gold). Pure logic (validation, email, WhatsApp URL) built TDD-first; UI components built without tests unless they contain state logic.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, next-intl 3, react-hook-form, Zod, Resend, Vitest + React Testing Library, Vercel

## Global Constraints

- Node.js ≥ 20
- TypeScript strict mode
- Colors: primary `#1B3A2D`, accent `#C9A84C`, background `#FAF8F4`, text `#1A1A1A`
- Fonts: headings = Playfair Display (serif), body/UI = Inter (sans-serif)
- Locales: `es` (default), `en` — routing via `/es/...` and `/en/...`
- WhatsApp number from env var `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Resend API key from env var `RESEND_API_KEY`
- Lead notification email from env var `LEAD_EMAIL`
- Sender email from env var `FROM_EMAIL`
- All user-facing strings must come from next-intl translation files — no hardcoded copy in components
- Design reference: Virtuoso — generous whitespace, cream backgrounds, full-bleed photography, audience-segmented navigation

---

## File Map

```
c:\dev\Dolfin Travel\
├── app/
│   ├── api/cotizar/route.ts          # POST handler — validates + sends lead email
│   └── [locale]/
│       ├── layout.tsx                # Root layout: fonts, Navbar, Footer, WhatsAppButton
│       ├── page.tsx                  # Home
│       ├── nosotros/page.tsx
│       ├── destinos/page.tsx
│       ├── servicios/
│       │   ├── fit/page.tsx
│       │   ├── mice/page.tsx
│       │   └── agencias/page.tsx
│       ├── cotizar/page.tsx
│       └── contacto/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppButton.tsx        # Fixed floating button
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── AudienceSelector.tsx
│   │   ├── TrustBar.tsx
│   │   ├── DestinationsGrid.tsx
│   │   ├── WhyDolfing.tsx
│   │   └── HomeCTA.tsx
│   ├── forms/
│   │   ├── SegmentSelector.tsx       # Step 1: pick FIT / MICE / Agencias
│   │   ├── QuoteFields.tsx           # Step 2: fields conditionally per segment
│   │   └── QuoteForm.tsx             # Orchestrates 2-step flow + submit + WA CTA
│   └── ui/
│       ├── Button.tsx
│       └── Section.tsx
├── lib/
│   ├── validations.ts                # Zod schemas per segment
│   ├── whatsapp.ts                   # WA URL builder with pre-filled messages
│   └── email.ts                      # Resend email sender
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── messages/
│   ├── es.json
│   └── en.json
├── tests/
│   ├── setup.ts
│   ├── lib/
│   │   ├── validations.test.ts
│   │   ├── whatsapp.test.ts
│   │   └── email.test.ts
│   └── api/
│       └── cotizar.test.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
└── .env.local.example
```

---

## Task 1: Project Scaffold & Configuration

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json` (via create-next-app)
- Create: `middleware.ts`
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `.env.local.example`

**Interfaces:**
- Produces: `routing.locales`, `routing.defaultLocale` — used by middleware and all locale layouts

- [ ] **Step 1: Scaffold Next.js project in current directory**

```powershell
cd "c:\dev\Dolfin Travel"
npx create-next-app@latest . --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*" --yes
```

Expected: project files created. Confirm `package.json` exists.

- [ ] **Step 2: Install additional dependencies**

```powershell
npm install next-intl resend react-hook-form zod @hookform/resolvers
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Tailwind design tokens**

Replace the contents of `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1B3A2D',
        gold: '#C9A84C',
        cream: '#FAF8F4',
        ink: '#1A1A1A',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Configure next-intl routing**

Create `i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
})
```

- [ ] **Step 5: Configure next-intl request handler**

Create `i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 6: Create middleware**

Create `middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 7: Update next.config.ts**

```typescript
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

export default withNextIntl({})
```

- [ ] **Step 8: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

Add test script to `package.json` scripts section:

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 9: Create empty translation files**

Create `messages/es.json`:

```json
{}
```

Create `messages/en.json`:

```json
{}
```

- [ ] **Step 10: Create env example file**

Create `.env.local.example`:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=50212345678
RESEND_API_KEY=re_xxxxxxxxxxxx
LEAD_EMAIL=info@dolfingtravel.com
FROM_EMAIL=leads@dolfingtravel.com
```

- [ ] **Step 11: Verify dev server starts**

```powershell
npm run dev
```

Expected: server running on http://localhost:3000 with no errors.

- [ ] **Step 12: Commit**

```powershell
git init
git add .
git commit -m "feat: scaffold Next.js project with next-intl, Tailwind, Vitest"
```

---

## Task 2: Zod Validation Schemas (TDD)

**Files:**
- Create: `lib/validations.ts`
- Create: `tests/lib/validations.test.ts`

**Interfaces:**
- Produces: `fitSchema`, `miceSchema`, `agenciasSchema`, `segmentSchemas`, types `FitFormData`, `MiceFormData`, `AgenciasFormData`, `QuoteFormData` — consumed by Task 5 (API route) and Task 10 (QuoteForm)

- [ ] **Step 1: Write failing tests**

Create `tests/lib/validations.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { fitSchema, miceSchema, agenciasSchema } from '@/lib/validations'

const baseFit = {
  segment: 'fit' as const,
  name: 'John Doe',
  email: 'john@example.com',
  whatsapp: '+50212345678',
  country: 'USA',
  message: 'Looking for a 5-day tour of Guatemala',
  destinations: 'Antigua, Atitlán',
  travelers: 2,
}

describe('fitSchema', () => {
  it('accepts valid FIT data', () => {
    expect(fitSchema.safeParse(baseFit).success).toBe(true)
  })
  it('rejects empty name', () => {
    expect(fitSchema.safeParse({ ...baseFit, name: '' }).success).toBe(false)
  })
  it('rejects invalid email', () => {
    expect(fitSchema.safeParse({ ...baseFit, email: 'notanemail' }).success).toBe(false)
  })
  it('rejects travelers < 1', () => {
    expect(fitSchema.safeParse({ ...baseFit, travelers: 0 }).success).toBe(false)
  })
})

describe('miceSchema', () => {
  const baseMice = {
    segment: 'mice' as const,
    name: 'Ana Pérez',
    email: 'ana@corp.com',
    whatsapp: '+50212345678',
    country: 'Mexico',
    message: 'Annual incentive trip for our team',
    company: 'Corp SA de CV',
    destinations: 'Antigua, Petén',
    travelers: 50,
    eventType: 'Incentive trip',
  }
  it('accepts valid MICE data', () => {
    expect(miceSchema.safeParse(baseMice).success).toBe(true)
  })
  it('rejects missing company', () => {
    expect(miceSchema.safeParse({ ...baseMice, company: '' }).success).toBe(false)
  })
  it('rejects missing eventType', () => {
    expect(miceSchema.safeParse({ ...baseMice, eventType: '' }).success).toBe(false)
  })
})

describe('agenciasSchema', () => {
  const baseAgencia = {
    segment: 'agencias' as const,
    name: 'Luis García',
    email: 'luis@agency.com',
    whatsapp: '+50212345678',
    country: 'Guatemala',
    message: 'Interested in becoming a receptive partner',
    company: 'García Travels SA',
  }
  it('accepts valid agency data', () => {
    expect(agenciasSchema.safeParse(baseAgencia).success).toBe(true)
  })
  it('rejects missing company', () => {
    expect(agenciasSchema.safeParse({ ...baseAgencia, company: '' }).success).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```powershell
npm run test:run -- tests/lib/validations.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement schemas**

Create `lib/validations.ts`:

```typescript
import { z } from 'zod'

const baseSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  whatsapp: z.string().min(7, 'WhatsApp required'),
  country: z.string().min(2, 'Country required'),
  message: z.string().min(10, 'Message required'),
})

export const fitSchema = baseSchema.extend({
  segment: z.literal('fit'),
  destinations: z.string().min(2, 'Destinations required'),
  travelers: z.coerce.number().min(1, 'At least 1 traveler'),
})

export const miceSchema = baseSchema.extend({
  segment: z.literal('mice'),
  company: z.string().min(2, 'Company required'),
  destinations: z.string().min(2, 'Destinations required'),
  travelers: z.coerce.number().min(1, 'At least 1 traveler'),
  eventType: z.string().min(2, 'Event type required'),
})

export const agenciasSchema = baseSchema.extend({
  segment: z.literal('agencias'),
  company: z.string().min(2, 'Agency name required'),
})

export type FitFormData = z.infer<typeof fitSchema>
export type MiceFormData = z.infer<typeof miceSchema>
export type AgenciasFormData = z.infer<typeof agenciasSchema>
export type QuoteFormData = FitFormData | MiceFormData | AgenciasFormData

export const segmentSchemas = {
  fit: fitSchema,
  mice: miceSchema,
  agencias: agenciasSchema,
} as const

export type Segment = keyof typeof segmentSchemas
```

- [ ] **Step 4: Run tests to confirm they pass**

```powershell
npm run test:run -- tests/lib/validations.test.ts
```

Expected: 8 tests pass

- [ ] **Step 5: Commit**

```powershell
git add lib/validations.ts tests/lib/validations.test.ts
git commit -m "feat: add Zod validation schemas for FIT, MICE, and Agencias segments"
```

---

## Task 3: WhatsApp URL Builder (TDD)

**Files:**
- Create: `lib/whatsapp.ts`
- Create: `tests/lib/whatsapp.test.ts`

**Interfaces:**
- Produces: `buildWhatsAppUrl(segment?: string): string` — consumed by WhatsAppButton, QuoteForm

- [ ] **Step 1: Write failing tests**

Create `tests/lib/whatsapp.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('buildWhatsAppUrl', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '50212345678')
  })

  it('builds a valid wa.me URL for FIT segment', async () => {
    const { buildWhatsAppUrl } = await import('@/lib/whatsapp')
    const url = buildWhatsAppUrl('fit')
    expect(url).toMatch(/^https:\/\/wa\.me\/50212345678\?text=/)
    expect(decodeURIComponent(url)).toContain('individual')
  })

  it('builds a valid wa.me URL for MICE segment', async () => {
    const { buildWhatsAppUrl } = await import('@/lib/whatsapp')
    const url = buildWhatsAppUrl('mice')
    expect(decodeURIComponent(url)).toContain('MICE')
  })

  it('builds a valid wa.me URL for Agencias segment', async () => {
    const { buildWhatsAppUrl } = await import('@/lib/whatsapp')
    const url = buildWhatsAppUrl('agencias')
    expect(decodeURIComponent(url)).toContain('agente')
  })

  it('falls back to default message for unknown segment', async () => {
    const { buildWhatsAppUrl } = await import('@/lib/whatsapp')
    const url = buildWhatsAppUrl('unknown')
    expect(decodeURIComponent(url)).toContain('informaci')
  })

  it('falls back to default message when segment is undefined', async () => {
    const { buildWhatsAppUrl } = await import('@/lib/whatsapp')
    const url = buildWhatsAppUrl()
    expect(url).toContain('wa.me')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```powershell
npm run test:run -- tests/lib/whatsapp.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement the URL builder**

Create `lib/whatsapp.ts`:

```typescript
const MESSAGES: Record<string, string> = {
  fit: 'Hola Dolfing Travel, me interesa una cotización para turismo individual en Guatemala.',
  mice: 'Hola Dolfing Travel, me interesa una cotización para evento corporativo / MICE en Guatemala.',
  agencias: 'Hola Dolfing Travel, soy agente de viajes y me interesa conocer sus servicios como operador receptivo.',
  default: 'Hola Dolfing Travel, me interesa recibir información sobre sus servicios.',
}

export function buildWhatsAppUrl(segment?: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const message = MESSAGES[segment ?? 'default'] ?? MESSAGES.default
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```powershell
npm run test:run -- tests/lib/whatsapp.test.ts
```

Expected: 5 tests pass

- [ ] **Step 5: Commit**

```powershell
git add lib/whatsapp.ts tests/lib/whatsapp.test.ts
git commit -m "feat: add WhatsApp URL builder with per-segment pre-filled messages"
```

---

## Task 4: Email Builder (TDD)

**Files:**
- Create: `lib/email.ts`
- Create: `tests/lib/email.test.ts`

**Interfaces:**
- Consumes: `QuoteFormData` from `@/lib/validations`
- Produces: `sendLeadEmail(data: QuoteFormData): Promise<void>` — consumed by Task 5 (API route)

- [ ] **Step 1: Write failing tests**

Create `tests/lib/email.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSend = vi.fn().mockResolvedValue({ id: 'test-id' })
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}))

describe('sendLeadEmail', () => {
  beforeEach(() => {
    mockSend.mockClear()
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('LEAD_EMAIL', 'info@dolfingtravel.com')
    vi.stubEnv('FROM_EMAIL', 'leads@dolfingtravel.com')
  })

  it('calls resend.emails.send with correct to/from', async () => {
    const { sendLeadEmail } = await import('@/lib/email')
    await sendLeadEmail({
      segment: 'fit',
      name: 'John',
      email: 'john@example.com',
      whatsapp: '+1234',
      country: 'USA',
      message: 'Test message here',
      destinations: 'Antigua',
      travelers: 2,
    })
    expect(mockSend).toHaveBeenCalledOnce()
    const call = mockSend.mock.calls[0][0]
    expect(call.to).toBe('info@dolfingtravel.com')
    expect(call.from).toBe('leads@dolfingtravel.com')
  })

  it('includes segment in subject line', async () => {
    vi.resetModules()
    const { sendLeadEmail } = await import('@/lib/email')
    await sendLeadEmail({
      segment: 'mice',
      name: 'Ana',
      email: 'ana@corp.com',
      whatsapp: '+1234',
      country: 'Mexico',
      message: 'Incentive trip for our team',
      company: 'Corp SA',
      destinations: 'Antigua',
      travelers: 50,
      eventType: 'Incentive',
    })
    const call = mockSend.mock.calls[0][0]
    expect(call.subject).toContain('MICE')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```powershell
npm run test:run -- tests/lib/email.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement email sender**

Create `lib/email.ts`:

```typescript
import { Resend } from 'resend'
import type { QuoteFormData } from './validations'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendLeadEmail(data: QuoteFormData): Promise<void> {
  const resend = getResend()
  const subject = `Nuevo lead ${data.segment.toUpperCase()} — ${data.name}`

  const rows = (Object.entries(data) as [string, unknown][])
    .map(([k, v]) => `<tr><td style="padding:4px 12px;font-weight:bold">${k}</td><td style="padding:4px 12px">${v}</td></tr>`)
    .join('')

  await resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'leads@dolfingtravel.com',
    to: process.env.LEAD_EMAIL ?? '',
    subject,
    html: `<table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
  })
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```powershell
npm run test:run -- tests/lib/email.test.ts
```

Expected: 2 tests pass

- [ ] **Step 5: Commit**

```powershell
git add lib/email.ts tests/lib/email.test.ts
git commit -m "feat: add Resend email sender for lead notifications"
```

---

## Task 5: API Route — POST /api/cotizar (TDD)

**Files:**
- Create: `app/api/cotizar/route.ts`
- Create: `tests/api/cotizar.test.ts`

**Interfaces:**
- Consumes: `segmentSchemas` from `@/lib/validations`, `sendLeadEmail` from `@/lib/email`
- Produces: `POST /api/cotizar` → `201 { ok: true }` | `400 { error }` | `422 { error }`

- [ ] **Step 1: Write failing tests**

Create `tests/api/cotizar.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/email', () => ({
  sendLeadEmail: vi.fn().mockResolvedValue(undefined),
}))

async function makeRequest(body: object) {
  const { POST } = await import('@/app/api/cotizar/route')
  const req = new NextRequest('http://localhost/api/cotizar', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  return POST(req)
}

describe('POST /api/cotizar', () => {
  beforeEach(() => vi.resetModules())

  it('returns 201 for valid FIT submission', async () => {
    const res = await makeRequest({
      segment: 'fit',
      name: 'John Doe',
      email: 'john@example.com',
      whatsapp: '+50212345678',
      country: 'USA',
      message: 'Looking for a tour of Guatemala',
      destinations: 'Antigua',
      travelers: 2,
    })
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('returns 201 for valid MICE submission', async () => {
    const res = await makeRequest({
      segment: 'mice',
      name: 'Ana Pérez',
      email: 'ana@corp.com',
      whatsapp: '+50212345678',
      country: 'Mexico',
      message: 'Annual incentive trip for our team',
      company: 'Corp SA',
      destinations: 'Antigua',
      travelers: 50,
      eventType: 'Incentive',
    })
    expect(res.status).toBe(201)
  })

  it('returns 400 for unknown segment', async () => {
    const res = await makeRequest({ segment: 'unknown' })
    expect(res.status).toBe(400)
  })

  it('returns 422 for validation failure', async () => {
    const res = await makeRequest({ segment: 'fit', name: '', email: 'bad' })
    expect(res.status).toBe(422)
  })

  it('returns 500 when email sending throws', async () => {
    const { sendLeadEmail } = await import('@/lib/email')
    vi.mocked(sendLeadEmail).mockRejectedValueOnce(new Error('Resend down'))
    const res = await makeRequest({
      segment: 'fit',
      name: 'John',
      email: 'john@example.com',
      whatsapp: '+50212345678',
      country: 'USA',
      message: 'Looking for a tour of Guatemala',
      destinations: 'Antigua',
      travelers: 2,
    })
    expect(res.status).toBe(500)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```powershell
npm run test:run -- tests/api/cotizar.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement the route**

Create `app/api/cotizar/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { segmentSchemas, type Segment } from '@/lib/validations'
import { sendLeadEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const segment = body?.segment as string

  const schema = segmentSchemas[segment as Segment]
  if (!schema) {
    return NextResponse.json({ error: 'Invalid segment' }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 422 })
  }

  try {
    await sendLeadEmail(result.data)
  } catch {
    return NextResponse.json({ error: 'Email failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```powershell
npm run test:run -- tests/api/cotizar.test.ts
```

Expected: 5 tests pass

- [ ] **Step 5: Run all tests**

```powershell
npm run test:run
```

Expected: all tests pass

- [ ] **Step 6: Commit**

```powershell
git add app/api/cotizar/route.ts tests/api/cotizar.test.ts
git commit -m "feat: add POST /api/cotizar route with segment validation and email notification"
```

---

## Task 6: UI Primitives & Layout Shell

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Section.tsx`
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/WhatsAppButton.tsx`
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `buildWhatsAppUrl` from `@/lib/whatsapp`, `routing` from `@/i18n/routing`, `useTranslations` from `next-intl`
- Produces: `<Button>`, `<Section>`, `<Navbar>`, `<Footer>`, `<WhatsAppButton>` — consumed by all page components

- [ ] **Step 1: Create Button primitive**

Create `components/ui/Button.tsx`:

```typescript
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost'

type Props = {
  variant?: Variant
  href?: string
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

const styles: Record<Variant, string> = {
  primary: 'bg-forest text-cream hover:bg-forest/90',
  secondary: 'bg-gold text-ink hover:bg-gold/90',
  ghost: 'border border-forest text-forest hover:bg-forest/5',
}

export default function Button({
  variant = 'primary',
  href,
  children,
  className = '',
  type = 'button',
  disabled,
  onClick,
}: Props) {
  const base = 'inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors rounded-sm'
  const cls = `${base} ${styles[variant]} ${className}`

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>
  }

  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Create Section primitive**

Create `components/ui/Section.tsx`:

```typescript
type Props = {
  children: React.ReactNode
  className?: string
  id?: string
  dark?: boolean
}

export default function Section({ children, className = '', id, dark }: Props) {
  return (
    <section
      id={id}
      className={`px-6 py-20 md:px-12 lg:px-24 ${dark ? 'bg-forest text-cream' : 'bg-cream'} ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {children}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create Navbar**

Create `components/layout/Navbar.tsx`:

```typescript
'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const otherLocale = locale === 'es' ? 'en' : 'es'
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-forest/10">
      <div className="mx-auto max-w-6xl px-6 md:px-12 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-serif text-xl text-forest font-semibold tracking-wide">
          Dolfing Travel
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-ink/70">
          <Link href={`/${locale}/servicios/fit`} className="hover:text-forest transition-colors">{t('fit')}</Link>
          <Link href={`/${locale}/servicios/mice`} className="hover:text-forest transition-colors">{t('mice')}</Link>
          <Link href={`/${locale}/servicios/agencias`} className="hover:text-forest transition-colors">{t('agencias')}</Link>
          <Link href={`/${locale}/nosotros`} className="hover:text-forest transition-colors">{t('nosotros')}</Link>
          <Link href={`/${locale}/destinos`} className="hover:text-forest transition-colors">{t('destinos')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(switchedPath)}
            className="text-xs text-ink/50 hover:text-forest uppercase tracking-widest"
          >
            {otherLocale}
          </button>
          <Button href={`/${locale}/cotizar`} variant="primary" className="text-xs px-4 py-2">
            {t('cotizar')}
          </Button>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Create Footer**

Create `components/layout/Footer.tsx`:

```typescript
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

export default function Footer() {
  const t = useTranslations('nav')
  const f = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="bg-forest text-cream/80 px-6 md:px-12 lg:px-24 py-16">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-serif text-xl text-cream mb-3">Dolfing Travel</p>
          <p className="text-sm leading-relaxed">
            Turismo receptivo y transporte terrestre en Guatemala.
            +12 años conectando viajeros con la riqueza cultural y natural del país.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-gold mb-4">Servicios</p>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/${locale}/servicios/fit`} className="hover:text-cream">{t('fit')}</Link></li>
            <li><Link href={`/${locale}/servicios/mice`} className="hover:text-cream">{t('mice')}</Link></li>
            <li><Link href={`/${locale}/servicios/agencias`} className="hover:text-cream">{t('agencias')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-gold mb-4">Empresa</p>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/${locale}/nosotros`} className="hover:text-cream">{t('nosotros')}</Link></li>
            <li><Link href={`/${locale}/destinos`} className="hover:text-cream">{t('destinos')}</Link></li>
            <li><Link href={`/${locale}/contacto`} className="hover:text-cream">{t('contacto')}</Link></li>
            <li><Link href={`/${locale}/cotizar`} className="hover:text-cream">{t('cotizar')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-12 pt-8 border-t border-cream/10 text-xs text-cream/40">
        © {new Date().getFullYear()} Dolfing Travel. {f('rights')}.
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Create WhatsApp floating button**

Create `components/layout/WhatsAppButton.tsx`:

```typescript
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export default function WhatsAppButton() {
  const url = buildWhatsAppUrl()

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-110 transition-transform"
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.11 1.523 5.836L0 24l6.336-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.87 9.87 0 01-5.022-1.367l-.36-.214-3.742.981.999-3.648-.235-.374A9.865 9.865 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.466 0 9.882 4.415 9.882 9.882 0 5.466-4.416 9.882-9.882 9.882z"/>
      </svg>
    </a>
  )
}
```

- [ ] **Step 6: Simplify root app/layout.tsx**

create-next-app generates `app/layout.tsx` with html/body tags. With next-intl, the `[locale]/layout.tsx` provides those instead. Replace `app/layout.tsx` with a passthrough:

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

Also delete `app/page.tsx` — the middleware redirects `/` to `/es` automatically, so a root page is not needed:

```powershell
Remove-Item "app/page.tsx"
```

- [ ] **Step 7: Create root locale layout**

Create (or replace) `app/[locale]/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import '../globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: { template: '%s | Dolfing Travel', default: 'Dolfing Travel — Turismo Receptivo en Guatemala' },
  description: 'Empresa líder en turismo receptivo y transporte terrestre en Guatemala. FIT, MICE y servicios para agencias de viaje.',
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'es' | 'en')) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-cream text-ink font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 8: Update globals.css to remove Tailwind defaults that conflict**

In `app/globals.css`, keep only:

```css
@import "tailwindcss";
```

(Remove the default Next.js CSS variables and `:root` block)

- [ ] **Step 9: Verify layout renders**

```powershell
npm run dev
```

Navigate to http://localhost:3000 — should show Navbar and Footer with no errors. WhatsApp button visible in bottom-right.

- [ ] **Step 10: Commit**

```powershell
git add components/ app/
git commit -m "feat: add UI primitives, Navbar, Footer, and WhatsApp floating button"
```

---

## Task 7: i18n Translation Files

**Files:**
- Modify: `messages/es.json`
- Modify: `messages/en.json`

**Interfaces:**
- Produces: all translation keys consumed by every component via `useTranslations(namespace)`

- [ ] **Step 1: Write complete Spanish translations**

Replace `messages/es.json`:

```json
{
  "nav": {
    "fit": "Viajero Individual",
    "mice": "Corporativo / MICE",
    "agencias": "Agencias",
    "nosotros": "Nosotros",
    "destinos": "Destinos",
    "cotizar": "Solicitar Cotización",
    "contacto": "Contacto"
  },
  "hero": {
    "tagline": "Tu mejor aliado, la experiencia inolvidable para ti y los tuyos",
    "cta_primary": "Solicitar Cotización",
    "cta_secondary": "Nuestros Servicios"
  },
  "audience": {
    "fit_title": "Viajero Individual",
    "fit_subtitle": "FIT",
    "fit_description": "Tours, transporte e itinerarios a la medida para viajeros independientes en Guatemala",
    "mice_title": "Corporativo",
    "mice_subtitle": "MICE",
    "mice_description": "Congresos, convenciones, viajes de incentivo y programas corporativos totalmente a la medida",
    "agencias_title": "Agencias de Viaje",
    "agencias_subtitle": "B2B",
    "agencias_description": "Somos tu operador receptivo de confianza en Guatemala. Red de alianzas, calidad garantizada"
  },
  "trust": {
    "years": "12+ Años de experiencia",
    "fleet": "Flota propia y moderna",
    "languages": "5 Idiomas",
    "global": "Alcance global"
  },
  "destinations": {
    "title": "Destinos que cubrimos",
    "antigua": "Antigua Guatemala",
    "atitlan": "Lago Atitlán",
    "tikal": "Tikal",
    "semuc": "Semuc Champey",
    "chichicastenango": "Chichicastenango",
    "izabal": "Lago de Izábal"
  },
  "why": {
    "title": "¿Por qué elegir Dolfing Travel?",
    "fleet_title": "Flota Propia y Reciente",
    "fleet_desc": "Unidades modernas y confortables operadas por un equipo profesional disponible 24/7.",
    "global_title": "Alcance Global",
    "global_desc": "Experiencia atendiendo los exigentes mercados de Latinoamérica, Europa y Asia.",
    "mice_title": "Especialistas MICE y Leisure",
    "mice_desc": "Desde viajeros independientes hasta congresos y convenciones internacionales.",
    "multilingual_title": "Equipo Multilingüe",
    "multilingual_desc": "Servicios guiados en español, inglés, francés, italiano y alemán.",
    "network_title": "Red de Confianza",
    "network_desc": "Alianzas estratégicas con hoteles, restaurantes, aerolíneas y transporte acuático."
  },
  "cta": {
    "title": "¿Listo para vivir Guatemala?",
    "subtitle": "Cuéntanos qué necesitas y te diseñamos una propuesta a la medida.",
    "button": "Solicitar Cotización",
    "whatsapp": "Escribir por WhatsApp"
  },
  "form": {
    "segment_title": "¿Cómo podemos ayudarte?",
    "segment_fit": "Viajero Individual",
    "segment_mice": "Corporativo / MICE",
    "segment_agencias": "Agencia de Viajes",
    "name": "Nombre completo",
    "email": "Correo electrónico",
    "whatsapp": "WhatsApp (con código de país)",
    "company": "Empresa / Agencia",
    "destinations": "Destinos de interés",
    "travelers": "Número de viajeros",
    "event_type": "Tipo de evento",
    "country": "País de origen",
    "message": "Cuéntanos más sobre tu viaje",
    "submit": "Enviar solicitud",
    "whatsapp_cta": "Cotizar por WhatsApp",
    "success": "¡Gracias! Recibirás respuesta en menos de 24 horas.",
    "error": "Hubo un error al enviar. Por favor intenta de nuevo."
  },
  "footer": {
    "rights": "Todos los derechos reservados"
  },
  "pages": {
    "fit_title": "Viajero Individual (FIT)",
    "fit_description": "Diseñamos tu viaje a Guatemala a la perfección. Transporte privado, tours guiados e itinerarios completamente personalizados.",
    "mice_title": "Corporativo y MICE",
    "mice_description": "Gestionamos con éxito congresos, convenciones, viajes de incentivo, fam trips y programas corporativos totalmente a la medida.",
    "agencias_title": "Agencias de Viaje",
    "agencias_description": "Somos el operador receptivo que potencia tu negocio en Guatemala. Respaldo profesional, red de alianzas y atención de primer nivel.",
    "nosotros_title": "Nosotros",
    "destinos_title": "Destinos",
    "contacto_title": "Contacto",
    "cotizar_title": "Solicitar Cotización"
  }
}
```

- [ ] **Step 2: Write complete English translations**

Replace `messages/en.json`:

```json
{
  "nav": {
    "fit": "Individual Traveler",
    "mice": "Corporate / MICE",
    "agencias": "Travel Agencies",
    "nosotros": "About Us",
    "destinos": "Destinations",
    "cotizar": "Request a Quote",
    "contacto": "Contact"
  },
  "hero": {
    "tagline": "Your best ally for unforgettable experiences in Guatemala",
    "cta_primary": "Request a Quote",
    "cta_secondary": "Our Services"
  },
  "audience": {
    "fit_title": "Individual Traveler",
    "fit_subtitle": "FIT",
    "fit_description": "Custom tours, transport, and itineraries for independent travelers in Guatemala",
    "mice_title": "Corporate",
    "mice_subtitle": "MICE",
    "mice_description": "Congresses, conventions, incentive trips, and fully customized corporate programs",
    "agencias_title": "Travel Agencies",
    "agencias_subtitle": "B2B",
    "agencias_description": "We are your trusted receptive operator in Guatemala. Strategic alliances, guaranteed quality"
  },
  "trust": {
    "years": "12+ Years of experience",
    "fleet": "Own modern fleet",
    "languages": "5 Languages",
    "global": "Global reach"
  },
  "destinations": {
    "title": "Destinations we cover",
    "antigua": "Antigua Guatemala",
    "atitlan": "Lake Atitlán",
    "tikal": "Tikal",
    "semuc": "Semuc Champey",
    "chichicastenango": "Chichicastenango",
    "izabal": "Lake Izábal"
  },
  "why": {
    "title": "Why choose Dolfing Travel?",
    "fleet_title": "Own Modern Fleet",
    "fleet_desc": "Modern, comfortable vehicles operated by a highly qualified professional team available 24/7.",
    "global_title": "Global Reach",
    "global_desc": "Solid experience serving the demanding markets of Latin America, Europe, and Asia.",
    "mice_title": "MICE & Leisure Specialists",
    "mice_desc": "From independent travelers to international congresses and conventions.",
    "multilingual_title": "Multilingual Team",
    "multilingual_desc": "Guided services in Spanish, English, French, Italian, and German.",
    "network_title": "Trusted Network",
    "network_desc": "Strategic alliances with hotels, restaurants, airlines, and water transport."
  },
  "cta": {
    "title": "Ready to experience Guatemala?",
    "subtitle": "Tell us what you need and we'll design a tailor-made proposal for you.",
    "button": "Request a Quote",
    "whatsapp": "Chat on WhatsApp"
  },
  "form": {
    "segment_title": "How can we help you?",
    "segment_fit": "Individual Traveler",
    "segment_mice": "Corporate / MICE",
    "segment_agencias": "Travel Agency",
    "name": "Full name",
    "email": "Email address",
    "whatsapp": "WhatsApp (with country code)",
    "company": "Company / Agency",
    "destinations": "Destinations of interest",
    "travelers": "Number of travelers",
    "event_type": "Event type",
    "country": "Country of origin",
    "message": "Tell us more about your trip",
    "submit": "Send request",
    "whatsapp_cta": "Quote via WhatsApp",
    "success": "Thank you! You will receive a response within 24 hours.",
    "error": "There was an error sending. Please try again."
  },
  "footer": {
    "rights": "All rights reserved"
  },
  "pages": {
    "fit_title": "Individual Traveler (FIT)",
    "fit_description": "We design your Guatemala trip to perfection. Private transport, guided tours, and fully personalized itineraries.",
    "mice_title": "Corporate & MICE",
    "mice_description": "We successfully manage congresses, conventions, incentive trips, fam trips, and fully customized corporate programs.",
    "agencias_title": "Travel Agencies",
    "agencias_description": "We are the receptive operator that boosts your business in Guatemala. Professional support, strategic network, and top-tier service.",
    "nosotros_title": "About Us",
    "destinos_title": "Destinations",
    "contacto_title": "Contact",
    "cotizar_title": "Request a Quote"
  }
}
```

- [ ] **Step 3: Verify no missing keys**

```powershell
npm run dev
```

Navigate to http://localhost:3000/es and http://localhost:3000/en. Check that Navbar text renders in both languages.

- [ ] **Step 4: Commit**

```powershell
git add messages/
git commit -m "feat: add complete ES/EN translation files"
```

---

## Task 8: Home Page

**Files:**
- Create: `components/home/Hero.tsx`
- Create: `components/home/AudienceSelector.tsx`
- Create: `components/home/TrustBar.tsx`
- Create: `components/home/DestinationsGrid.tsx`
- Create: `components/home/WhyDolfing.tsx`
- Create: `components/home/HomeCTA.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: translations via `useTranslations`, `buildWhatsAppUrl` from `@/lib/whatsapp`
- Produces: the home page visible at `/{locale}`

- [ ] **Step 1: Create Hero**

Create `components/home/Hero.tsx`:

```typescript
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import Button from '@/components/ui/Button'

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()

  return (
    <div className="relative h-[90vh] min-h-[600px] flex items-end">
      <Image
        src="/images/hero-guatemala.jpg"
        alt="Guatemala landscape"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />

      <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-20 max-w-3xl">
        <p className="text-gold text-xs uppercase tracking-widest mb-4">Dolfing Travel · Guatemala</p>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-tight mb-8">
          {t('tagline')}
        </h1>
        <div className="flex flex-wrap gap-4">
          <Button href={`/${locale}/cotizar`} variant="secondary">{t('cta_primary')}</Button>
          <Button href={`/${locale}/servicios/fit`} variant="ghost" className="border-cream text-cream hover:bg-cream/10">{t('cta_secondary')}</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add hero placeholder image**

Add a placeholder image file reference. Download a free Guatemala landscape image from Unsplash (search "antigua guatemala") and save as `public/images/hero-guatemala.jpg`.

For development, create the directory and use any placeholder:

```powershell
mkdir -p "c:\dev\Dolfin Travel\public\images"
```

Then place the hero image at `public/images/hero-guatemala.jpg`.

- [ ] **Step 3: Create AudienceSelector**

Create `components/home/AudienceSelector.tsx`:

```typescript
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import Section from '@/components/ui/Section'

const segments = ['fit', 'mice', 'agencias'] as const

const icons: Record<string, string> = {
  fit: '🧳',
  mice: '🏛️',
  agencias: '🤝',
}

export default function AudienceSelector() {
  const t = useTranslations('audience')
  const locale = useLocale()

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {segments.map((seg) => (
          <Link
            key={seg}
            href={`/${locale}/servicios/${seg}`}
            className="group border border-forest/15 p-8 hover:border-gold hover:shadow-md transition-all"
          >
            <span className="text-3xl mb-4 block">{icons[seg]}</span>
            <p className="text-xs uppercase tracking-widest text-gold mb-1">{t(`${seg}_subtitle`)}</p>
            <h2 className="font-serif text-2xl text-forest mb-3">{t(`${seg}_title`)}</h2>
            <p className="text-sm text-ink/60 leading-relaxed">{t(`${seg}_description`)}</p>
          </Link>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Create TrustBar**

Create `components/home/TrustBar.tsx`:

```typescript
import { useTranslations } from 'next-intl'

const items = ['years', 'fleet', 'languages', 'global'] as const

export default function TrustBar() {
  const t = useTranslations('trust')

  return (
    <div className="bg-forest text-cream py-10 px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {items.map((item) => (
          <div key={item}>
            <p className="text-gold font-serif text-xl font-semibold">{t(item)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create DestinationsGrid**

Create `components/home/DestinationsGrid.tsx`:

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import Section from '@/components/ui/Section'

const destinations = [
  { key: 'antigua', image: '/images/antigua.jpg' },
  { key: 'atitlan', image: '/images/atitlan.jpg' },
  { key: 'tikal', image: '/images/tikal.jpg' },
  { key: 'semuc', image: '/images/semuc.jpg' },
] as const

export default function DestinationsGrid() {
  const t = useTranslations('destinations')
  const locale = useLocale()

  return (
    <Section>
      <h2 className="font-serif text-3xl md:text-4xl text-forest mb-12">{t('title')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {destinations.map(({ key, image }) => (
          <Link key={key} href={`/${locale}/destinos`} className="group relative aspect-[3/4] overflow-hidden">
            <Image
              src={image}
              alt={t(key)}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-forest/30 group-hover:bg-forest/10 transition-colors" />
            <p className="absolute bottom-4 left-4 text-cream font-serif text-lg">{t(key)}</p>
          </Link>
        ))}
      </div>
    </Section>
  )
}
```

Add destination images to `public/images/`: `antigua.jpg`, `atitlan.jpg`, `tikal.jpg`, `semuc.jpg` (download from Unsplash).

- [ ] **Step 6: Create WhyDolfing**

Create `components/home/WhyDolfing.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import Section from '@/components/ui/Section'

const items = ['fleet', 'global', 'mice', 'multilingual', 'network'] as const

export default function WhyDolfing() {
  const t = useTranslations('why')

  return (
    <Section className="bg-cream">
      <h2 className="font-serif text-3xl md:text-4xl text-forest mb-12">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item} className="border-t border-forest/15 pt-6">
            <h3 className="font-serif text-xl text-forest mb-2">{t(`${item}_title`)}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{t(`${item}_desc`)}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 7: Create HomeCTA**

Create `components/home/HomeCTA.tsx`:

```typescript
import { useTranslations, useLocale } from 'next-intl'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'

export default function HomeCTA() {
  const t = useTranslations('cta')
  const locale = useLocale()
  const waUrl = buildWhatsAppUrl()

  return (
    <Section dark>
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">{t('title')}</h2>
        <p className="text-cream/70 mb-10">{t('subtitle')}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href={`/${locale}/cotizar`} variant="secondary">{t('button')}</Button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-cream/40 text-cream text-sm hover:bg-cream/10 transition-colors"
          >
            💬 {t('whatsapp')}
          </a>
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 8: Assemble home page**

Replace `app/[locale]/page.tsx`:

```typescript
import Hero from '@/components/home/Hero'
import AudienceSelector from '@/components/home/AudienceSelector'
import TrustBar from '@/components/home/TrustBar'
import DestinationsGrid from '@/components/home/DestinationsGrid'
import WhyDolfing from '@/components/home/WhyDolfing'
import HomeCTA from '@/components/home/HomeCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AudienceSelector />
      <TrustBar />
      <DestinationsGrid />
      <WhyDolfing />
      <HomeCTA />
    </>
  )
}
```

- [ ] **Step 9: Verify home page renders correctly**

```powershell
npm run dev
```

Navigate to http://localhost:3000 — verify all 6 sections render. Check http://localhost:3000/en for English version.

- [ ] **Step 10: Commit**

```powershell
git add components/home/ app/[locale]/page.tsx public/images/
git commit -m "feat: build home page with all 6 sections"
```

---

## Task 9: Service Pages & Content Pages

**Files:**
- Create: `app/[locale]/servicios/fit/page.tsx`
- Create: `app/[locale]/servicios/mice/page.tsx`
- Create: `app/[locale]/servicios/agencias/page.tsx`
- Create: `app/[locale]/nosotros/page.tsx`
- Create: `app/[locale]/destinos/page.tsx`
- Create: `app/[locale]/contacto/page.tsx`

**Interfaces:**
- Consumes: translations, `Button`, `Section` components
- Produces: 6 content pages

- [ ] **Step 1: Create FIT service page**

Create `app/[locale]/servicios/fit/page.tsx`:

```typescript
import { useTranslations, useLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages')
  return { title: t('fit_title') }
}

export default function FITPage() {
  const t = useTranslations('pages')
  const locale = useLocale()

  return (
    <>
      <Section>
        <p className="text-xs uppercase tracking-widest text-gold mb-3">FIT</p>
        <h1 className="font-serif text-4xl md:text-5xl text-forest mb-6">{t('fit_title')}</h1>
        <p className="text-ink/60 text-lg max-w-2xl leading-relaxed mb-10">{t('fit_description')}</p>
        <Button href={`/${locale}/cotizar`} variant="primary">Solicitar Cotización</Button>
      </Section>
    </>
  )
}
```

- [ ] **Step 2: Create MICE service page**

Create `app/[locale]/servicios/mice/page.tsx`:

```typescript
import { useTranslations, useLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages')
  return { title: t('mice_title') }
}

export default function MICEPage() {
  const t = useTranslations('pages')
  const locale = useLocale()

  return (
    <>
      <Section>
        <p className="text-xs uppercase tracking-widest text-gold mb-3">MICE</p>
        <h1 className="font-serif text-4xl md:text-5xl text-forest mb-6">{t('mice_title')}</h1>
        <p className="text-ink/60 text-lg max-w-2xl leading-relaxed mb-10">{t('mice_description')}</p>
        <Button href={`/${locale}/cotizar`} variant="primary">Solicitar Cotización</Button>
      </Section>
    </>
  )
}
```

- [ ] **Step 3: Create Agencias service page**

Create `app/[locale]/servicios/agencias/page.tsx`:

```typescript
import { useTranslations, useLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages')
  return { title: t('agencias_title') }
}

export default function AgenciasPage() {
  const t = useTranslations('pages')
  const locale = useLocale()

  return (
    <>
      <Section>
        <p className="text-xs uppercase tracking-widest text-gold mb-3">B2B</p>
        <h1 className="font-serif text-4xl md:text-5xl text-forest mb-6">{t('agencias_title')}</h1>
        <p className="text-ink/60 text-lg max-w-2xl leading-relaxed mb-10">{t('agencias_description')}</p>
        <Button href={`/${locale}/cotizar`} variant="primary">Solicitar Cotización</Button>
      </Section>
    </>
  )
}
```

- [ ] **Step 4: Create Nosotros page**

Create `app/[locale]/nosotros/page.tsx`:

```typescript
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages')
  return { title: t('nosotros_title') }
}

export default function NosotrosPage() {
  return (
    <Section>
      <h1 className="font-serif text-4xl md:text-5xl text-forest mb-8">Dolfing Travel</h1>
      <div className="max-w-3xl space-y-6 text-ink/70 leading-relaxed">
        <p>
          Dolfing Travel es una empresa líder en turismo receptivo y transporte terrestre en Guatemala,
          respaldada por más de 12 años de trayectoria y evolución constante en el mercado.
        </p>
        <p>
          Nos apasiona conectar a los viajeros con la riqueza cultural y natural de nuestro país,
          garantizando experiencias memorables bajo los más altos estándares de calidad y seguridad.
        </p>
        <p>
          Nuestro equipo multilingüe ofrece servicios en español, inglés, francés, italiano y alemán,
          atendiendo los exigentes mercados de Latinoamérica, Centroamérica, Europa y Asia.
        </p>
      </div>
    </Section>
  )
}
```

- [ ] **Step 5: Create Destinos page**

Create `app/[locale]/destinos/page.tsx`:

```typescript
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages')
  return { title: t('destinos_title') }
}

const destinations = [
  { key: 'antigua', image: '/images/antigua.jpg' },
  { key: 'atitlan', image: '/images/atitlan.jpg' },
  { key: 'tikal', image: '/images/tikal.jpg' },
  { key: 'semuc', image: '/images/semuc.jpg' },
  { key: 'chichicastenango', image: '/images/antigua.jpg' },
  { key: 'izabal', image: '/images/atitlan.jpg' },
] as const

export default function DestinosPage() {
  const t = useTranslations('destinations')

  return (
    <Section>
      <h1 className="font-serif text-4xl md:text-5xl text-forest mb-12">{t('title')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {destinations.map(({ key, image }) => (
          <div key={key} className="relative aspect-square overflow-hidden">
            <Image src={image} alt={t(key)} fill className="object-cover" />
            <div className="absolute inset-0 bg-forest/30" />
            <p className="absolute bottom-4 left-4 text-cream font-serif text-lg">{t(key)}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 6: Create Contacto page**

Create `app/[locale]/contacto/page.tsx`:

```typescript
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages')
  return { title: t('contacto_title') }
}

export default function ContactoPage() {
  const waUrl = buildWhatsAppUrl()

  return (
    <Section>
      <h1 className="font-serif text-4xl md:text-5xl text-forest mb-12">Contacto</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6 text-ink/70">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold mb-1">País</p>
            <p>Guatemala, Centroamérica</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold mb-1">WhatsApp</p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-forest">
              Escribir por WhatsApp
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold mb-1">Idiomas</p>
            <p>Español · English · Français · Italiano · Deutsch</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 7: Verify all pages render**

```powershell
npm run dev
```

Visit each route: `/es/servicios/fit`, `/es/servicios/mice`, `/es/servicios/agencias`, `/es/nosotros`, `/es/destinos`, `/es/contacto`. Verify no 404s and pages render correctly.

- [ ] **Step 8: Commit**

```powershell
git add app/[locale]/servicios/ app/[locale]/nosotros/ app/[locale]/destinos/ app/[locale]/contacto/
git commit -m "feat: add service pages (FIT, MICE, Agencias) and content pages"
```

---

## Task 10: Quote Form

**Files:**
- Create: `components/forms/SegmentSelector.tsx`
- Create: `components/forms/QuoteFields.tsx`
- Create: `components/forms/QuoteForm.tsx`
- Create: `app/[locale]/cotizar/page.tsx`

**Interfaces:**
- Consumes: `segmentSchemas`, `Segment`, `QuoteFormData` from `@/lib/validations`; `buildWhatsAppUrl` from `@/lib/whatsapp`
- Produces: 2-step form at `/cotizar` that POSTs to `/api/cotizar`

- [ ] **Step 1: Create SegmentSelector**

Create `components/forms/SegmentSelector.tsx`:

```typescript
'use client'
import { useTranslations } from 'next-intl'
import type { Segment } from '@/lib/validations'

const segments: Segment[] = ['fit', 'mice', 'agencias']

const icons: Record<Segment, string> = {
  fit: '🧳',
  mice: '🏛️',
  agencias: '🤝',
}

type Props = { onSelect: (segment: Segment) => void }

export default function SegmentSelector({ onSelect }: Props) {
  const t = useTranslations('form')

  return (
    <div>
      <h2 className="font-serif text-2xl text-forest mb-8">{t('segment_title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {segments.map((seg) => (
          <button
            key={seg}
            onClick={() => onSelect(seg)}
            className="border border-forest/20 p-8 text-left hover:border-gold hover:shadow-md transition-all group"
          >
            <span className="text-3xl mb-4 block">{icons[seg]}</span>
            <p className="font-serif text-xl text-forest">{t(`segment_${seg}`)}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create QuoteFields**

Create `components/forms/QuoteFields.tsx`:

```typescript
'use client'
import { useTranslations } from 'next-intl'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { Segment } from '@/lib/validations'

type Props = {
  segment: Segment
  register: UseFormRegister<any>
  errors: FieldErrors<any>
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-ink/50 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full border border-forest/20 bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold'

export default function QuoteFields({ segment, register, errors }: Props) {
  const t = useTranslations('form')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field label={t('name')} error={errors.name?.message as string}>
        <input {...register('name')} className={inputCls} />
      </Field>

      <Field label={t('email')} error={errors.email?.message as string}>
        <input {...register('email')} type="email" className={inputCls} />
      </Field>

      <Field label={t('whatsapp')} error={errors.whatsapp?.message as string}>
        <input {...register('whatsapp')} className={inputCls} placeholder="+502..." />
      </Field>

      <Field label={t('country')} error={errors.country?.message as string}>
        <input {...register('country')} className={inputCls} />
      </Field>

      {(segment === 'mice' || segment === 'agencias') && (
        <Field label={t('company')} error={errors.company?.message as string}>
          <input {...register('company')} className={inputCls} />
        </Field>
      )}

      {(segment === 'fit' || segment === 'mice') && (
        <Field label={t('destinations')} error={errors.destinations?.message as string}>
          <input {...register('destinations')} className={inputCls} />
        </Field>
      )}

      {(segment === 'fit' || segment === 'mice') && (
        <Field label={t('travelers')} error={errors.travelers?.message as string}>
          <input {...register('travelers')} type="number" min={1} className={inputCls} />
        </Field>
      )}

      {segment === 'mice' && (
        <Field label={t('event_type')} error={errors.eventType?.message as string}>
          <input {...register('eventType')} className={inputCls} />
        </Field>
      )}

      <div className="md:col-span-2">
        <Field label={t('message')} error={errors.message?.message as string}>
          <textarea {...register('message')} rows={4} className={inputCls} />
        </Field>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create QuoteForm**

Create `components/forms/QuoteForm.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { segmentSchemas, type Segment, type QuoteFormData } from '@/lib/validations'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import SegmentSelector from './SegmentSelector'
import QuoteFields from './QuoteFields'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function QuoteForm() {
  const [segment, setSegment] = useState<Segment | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const t = useTranslations('form')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuoteFormData>({
    resolver: segment ? zodResolver(segmentSchemas[segment]) : undefined,
  })

  async function onSubmit(data: QuoteFormData) {
    setStatus('submitting')
    try {
      const res = await fetch('/api/cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, segment }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-2xl text-forest mb-4">{t('success')}</p>
        <button onClick={() => { setStatus('idle'); setSegment(null) }} className="text-sm text-ink/50 underline">
          Enviar otra consulta
        </button>
      </div>
    )
  }

  if (!segment) {
    return <SegmentSelector onSelect={setSegment} />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button
        type="button"
        onClick={() => setSegment(null)}
        className="text-xs text-ink/40 hover:text-forest mb-8 flex items-center gap-1"
      >
        ← Cambiar tipo
      </button>

      <QuoteFields segment={segment} register={register} errors={errors} />

      <div className="flex flex-wrap gap-4 mt-8">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-forest text-cream px-8 py-3 text-sm tracking-wide hover:bg-forest/90 disabled:opacity-50 transition-colors"
        >
          {status === 'submitting' ? '...' : t('submit')}
        </button>

        <a
          href={buildWhatsAppUrl(segment)}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-forest text-forest px-8 py-3 text-sm tracking-wide hover:bg-forest/5 transition-colors flex items-center gap-2"
        >
          💬 {t('whatsapp_cta')}
        </a>
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm mt-4">{t('error')}</p>
      )}
    </form>
  )
}
```

- [ ] **Step 4: Create cotizar page**

Create `app/[locale]/cotizar/page.tsx`:

```typescript
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import QuoteForm from '@/components/forms/QuoteForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages')
  return { title: t('cotizar_title') }
}

export default function CotizarPage() {
  return (
    <Section>
      <div className="max-w-3xl">
        <QuoteForm />
      </div>
    </Section>
  )
}
```

- [ ] **Step 5: Verify form flow end-to-end**

```powershell
npm run dev
```

1. Navigate to http://localhost:3000/es/cotizar
2. Click "Viajero Individual" — confirm Step 2 fields appear
3. Fill form with valid data — confirm submit button activates
4. Click "Cotizar por WhatsApp" — confirm WhatsApp opens with correct pre-filled message
5. Click "← Cambiar tipo" — confirm Step 1 reappears

Note: Form submission will fail until `.env.local` is configured with Resend credentials.

- [ ] **Step 6: Commit**

```powershell
git add components/forms/ app/[locale]/cotizar/
git commit -m "feat: add 2-step quote form with segment routing and WhatsApp CTA"
```

---

## Task 11: SEO Metadata & Sitemap

**Files:**
- Modify: `app/[locale]/layout.tsx` (metadata already added in Task 6)
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Produces: `/sitemap.xml`, `/robots.txt`, per-page Open Graph tags

- [ ] **Step 1: Create sitemap**

Create `app/sitemap.ts`:

```typescript
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://dolfingtravel.com'
const locales = ['es', 'en']

const routes = [
  '',
  '/servicios/fit',
  '/servicios/mice',
  '/servicios/agencias',
  '/nosotros',
  '/destinos',
  '/cotizar',
  '/contacto',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )
}
```

- [ ] **Step 2: Create robots.txt**

Create `app/robots.ts`:

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://dolfingtravel.com/sitemap.xml',
  }
}
```

- [ ] **Step 3: Verify sitemap and robots**

```powershell
npm run dev
```

Visit http://localhost:3000/sitemap.xml and http://localhost:3000/robots.txt — confirm both return correct output.

- [ ] **Step 4: Commit**

```powershell
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap and robots.txt for SEO"
```

---

## Task 12: Deploy to Vercel

**Files:**
- Create: `.env.local` (not committed)
- Configuration via Vercel dashboard

- [ ] **Step 1: Create .env.local from example**

```powershell
Copy-Item .env.local.example .env.local
```

Edit `.env.local` and fill in real values:
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — Dolfing's WhatsApp number without `+` (e.g. `50212345678`)
- `RESEND_API_KEY` — from resend.com dashboard (free plan covers this usage)
- `LEAD_EMAIL` — email address where leads should arrive
- `FROM_EMAIL` — verified sender domain in Resend

- [ ] **Step 2: Test form submission locally**

```powershell
npm run dev
```

Navigate to http://localhost:3000/es/cotizar, fill the form, submit. Check `LEAD_EMAIL` inbox for the lead notification.

- [ ] **Step 3: Run full test suite**

```powershell
npm run test:run
```

Expected: all tests pass

- [ ] **Step 4: Run production build**

```powershell
npm run build
```

Expected: build succeeds with no errors. Note any warnings about missing images (replace placeholders with real client photos before launch).

- [ ] **Step 5: Deploy to Vercel**

```powershell
npx vercel --prod
```

Follow CLI prompts to link/create project. Vercel auto-detects Next.js.

- [ ] **Step 6: Configure environment variables in Vercel dashboard**

In Vercel project → Settings → Environment Variables, add:
- `RESEND_API_KEY`
- `LEAD_EMAIL`
- `FROM_EMAIL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

- [ ] **Step 7: Configure custom domain in Vercel**

In Vercel project → Settings → Domains, add `dolfingtravel.com`. Follow DNS instructions to point the domain.

- [ ] **Step 8: Final smoke test on production URL**

Visit the production URL. Verify:
- [ ] Home loads with all 6 sections
- [ ] Language switcher works (ES ↔ EN)
- [ ] All nav links work
- [ ] Quote form step 1 and 2 work
- [ ] WhatsApp buttons open correct pre-filled chat
- [ ] Form submission sends email to `LEAD_EMAIL`

- [ ] **Step 9: Final commit**

```powershell
git add .
git commit -m "feat: complete Dolfing Travel website — ready for launch"
```
