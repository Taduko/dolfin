import { NextRequest, NextResponse } from 'next/server'
import { segmentSchemas, type Segment } from '@/lib/validations'
import { sendLeadEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Honeypot: bots that fill the hidden field get a silent success (no email sent)
  if (typeof body.company_url === 'string' && body.company_url !== '') {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const segment = body?.segment as string

  const schema = segmentSchemas[segment as Segment]
  if (!schema) {
    return NextResponse.json({ error: 'Invalid segment' }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 422 })
  }

  try {
    await sendLeadEmail(result.data)
  } catch {
    return NextResponse.json({ error: 'Email failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
