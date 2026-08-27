import { Resend } from 'resend'
import type { QuoteFormData } from './validations'

function escapeHtml(s: unknown): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  const leadEmail = process.env.LEAD_EMAIL
  const fromEmail = process.env.FROM_EMAIL
  if (!apiKey) throw new Error('Missing env var: RESEND_API_KEY')
  if (!leadEmail) throw new Error('Missing env var: LEAD_EMAIL')
  if (!fromEmail) throw new Error('Missing env var: FROM_EMAIL')
  return new Resend(apiKey)
}

export async function sendLeadEmail(data: QuoteFormData): Promise<void> {
  const resend = getResend()
  const subject = `Nuevo lead ${data.segment.toUpperCase()} — ${data.name}`

  const rows = (Object.entries(data) as [string, unknown][])
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px;font-weight:bold">${escapeHtml(k)}</td><td style="padding:4px 12px">${escapeHtml(v)}</td></tr>`
    )
    .join('')

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'leads@dolfingtravel.com',
    to: process.env.LEAD_EMAIL ?? '',
    subject,
    html: `<table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
  })
  if (error) {
    throw new Error(`Resend failed: ${(error as { message?: string }).message ?? 'unknown error'}`)
  }
}
