'use client'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { buildWhatsAppMessageUrl } from '@/lib/whatsapp'

type Segment = 'fit' | 'mice' | 'agencias'
type StepId = 'type' | 'destinations' | 'event' | 'agency' | 'travelers' | 'send'

const DEST_KEYS = ['antigua', 'atitlan', 'tikal', 'semuc', 'chichicastenango', 'izabal'] as const
const EVENT_KEYS = ['congreso', 'incentivo', 'team', 'fam'] as const
const AGENCY_KEYS = ['netas', 'receptivo', 'alianza'] as const
const TRAV_KEYS = ['trav_1', 'trav_2', 'trav_3', 'trav_4'] as const

type Selections = {
  type: Segment | null
  destinations: string[]
  event: string | null
  agency: string | null
  travelers: string | null
}

const initial: Selections = {
  type: null,
  destinations: [],
  event: null,
  agency: null,
  travelers: null,
}

function Choice({
  label,
  selected,
  multi,
  onClick,
}: {
  label: string
  selected: boolean
  multi?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...(multi ? { 'aria-pressed': selected } : {})}
      className={`group flex items-center justify-between gap-4 rounded-sm border px-6 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
        selected
          ? 'border-gold bg-sand'
          : 'border-forest/15 bg-cream hover:border-gold/50 hover:bg-sand/50'
      }`}
    >
      <span className="font-serif text-lg text-forest">{label}</span>
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition-colors ${
          selected
            ? 'border-gold bg-gold text-forest'
            : 'border-forest/25 text-transparent group-hover:border-gold/60'
        }`}
      >
        {multi ? '✓' : '→'}
      </span>
    </button>
  )
}

export default function QuoteForm() {
  const tq = useTranslations('quote')
  const td = useTranslations('destinations')
  const [sel, setSel] = useState<Selections>(initial)
  const [index, setIndex] = useState(0)

  const steps: StepId[] = useMemo(() => {
    if (sel.type === 'fit') return ['type', 'destinations', 'travelers', 'send']
    if (sel.type === 'mice') return ['type', 'event', 'travelers', 'send']
    if (sel.type === 'agencias') return ['type', 'agency', 'send']
    return ['type']
  }, [sel.type])

  const current = steps[index]
  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1))
  const back = () => setIndex((i) => Math.max(i - 1, 0))

  const pickType = (value: Segment) => {
    setSel({ ...initial, type: value })
    setIndex(1)
  }

  const pickSingle = (field: 'event' | 'agency' | 'travelers', value: string) => {
    setSel((s) => ({ ...s, [field]: value }))
    next()
  }

  const toggleDest = (value: string) => {
    setSel((s) => ({
      ...s,
      destinations: s.destinations.includes(value)
        ? s.destinations.filter((v) => v !== value)
        : [...s.destinations, value],
    }))
  }

  const destLabel = (v: string) => (v === 'all' ? tq('dest_all') : td(v))

  // Summary rows shown on the final step and used to build the WhatsApp message.
  const summary = useMemo(() => {
    const rows: { label: string; value: string }[] = []
    if (sel.type) rows.push({ label: tq('wa_type'), value: tq(`type_${sel.type}`) })
    if (sel.type === 'fit' && sel.destinations.length)
      rows.push({ label: tq('wa_destinations'), value: sel.destinations.map(destLabel).join(', ') })
    if (sel.type === 'mice' && sel.event)
      rows.push({ label: tq('wa_event'), value: tq(`event_${sel.event}`) })
    if (sel.type === 'agencias' && sel.agency)
      rows.push({ label: tq('wa_agency'), value: tq(`agency_${sel.agency}`) })
    if (sel.travelers) rows.push({ label: tq('wa_travelers'), value: tq(sel.travelers) })
    return rows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel])

  const waUrl = useMemo(() => {
    const lines = [tq('wa_intro'), '', ...summary.map((r) => `• ${r.label}: ${r.value}`)]
    return buildWhatsAppMessageUrl(lines.join('\n'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary])

  const question: Record<StepId, string> = {
    type: tq('q_type'),
    destinations: tq('q_destinations'),
    event: tq('q_event'),
    agency: tq('q_agency'),
    travelers: tq('q_travelers'),
    send: tq('q_send'),
  }

  return (
    <div>
      {/* progress — shown once the path length is known (after picking a type) */}
      {index > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-ink/50 transition-colors hover:text-forest"
            >
              ← {tq('back')}
            </button>
            <span className="text-[0.7rem] uppercase tracking-[0.2em] text-ink/45">
              {tq('step', { n: index + 1, total: steps.length })}
            </span>
          </div>
          <div className="mb-10 h-px w-full bg-forest/10">
            <div
              className="h-px bg-gold transition-all duration-500 ease-out"
              style={{ width: `${((index + 1) / steps.length) * 100}%` }}
            />
          </div>
        </>
      )}

      {/* question */}
      <h2 className="mb-8 text-balance font-serif text-3xl font-normal tracking-[-0.01em] text-forest md:text-4xl">
        {question[current]}
      </h2>

      {/* steps */}
      {current === 'type' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(['fit', 'mice', 'agencias'] as Segment[]).map((v) => (
            <Choice key={v} label={tq(`type_${v}`)} selected={sel.type === v} onClick={() => pickType(v)} />
          ))}
        </div>
      )}

      {current === 'destinations' && (
        <div>
          <p className="mb-5 text-sm text-ink/55">{tq('dest_hint')}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[...DEST_KEYS, 'all'].map((v) => (
              <Choice
                key={v}
                label={destLabel(v)}
                selected={sel.destinations.includes(v)}
                multi
                onClick={() => toggleDest(v)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            disabled={sel.destinations.length === 0}
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-forest px-7 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            {tq('continue')}
          </button>
        </div>
      )}

      {current === 'event' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {EVENT_KEYS.map((v) => (
            <Choice
              key={v}
              label={tq(`event_${v}`)}
              selected={sel.event === v}
              onClick={() => pickSingle('event', v)}
            />
          ))}
        </div>
      )}

      {current === 'agency' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {AGENCY_KEYS.map((v) => (
            <Choice
              key={v}
              label={tq(`agency_${v}`)}
              selected={sel.agency === v}
              onClick={() => pickSingle('agency', v)}
            />
          ))}
        </div>
      )}

      {current === 'travelers' && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TRAV_KEYS.map((v) => (
            <Choice
              key={v}
              label={tq(v)}
              selected={sel.travelers === v}
              onClick={() => pickSingle('travelers', v)}
            />
          ))}
        </div>
      )}

      {current === 'send' && (
        <div className="max-w-lg">
          <p className="mb-8 leading-relaxed text-ink/65">{tq('send_lead')}</p>

          <dl className="mb-9 border-y border-forest/10">
            {summary.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-6 border-b border-forest/10 py-3 last:border-b-0">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-ink/45">{row.label}</dt>
                <dd className="text-right font-serif text-forest">{row.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-forest transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />
            </svg>
            {tq('submit')}
          </a>
        </div>
      )}
    </div>
  )
}
