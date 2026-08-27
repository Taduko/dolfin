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

// Builds a wa.me URL with an arbitrary prebuilt message — used by the quote
// wizard to send the business a summary of the visitor's choices + phone.
export function buildWhatsAppMessageUrl(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
