import { z } from 'zod'

const baseSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.email('Valid email required'),
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

export const segmentFormSchemas = {
  fit: fitSchema.omit({ segment: true }),
  mice: miceSchema.omit({ segment: true }),
  agencias: agenciasSchema.omit({ segment: true }),
} as const

export type Segment = keyof typeof segmentSchemas
