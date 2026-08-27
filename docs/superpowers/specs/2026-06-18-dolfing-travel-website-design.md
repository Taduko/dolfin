# Dolfing Travel — Website Design Spec

**Date:** 2026-06-18  
**Client:** Dolfing Travel  
**Purpose:** Marketing website to establish digital presence, showcase services, and capture leads across three audience segments.

---

## 1. Business Context

Dolfing Travel is a Guatemalan receptive tourism and ground transportation company with 12+ years of experience. They serve international clients from Latin America, Central America, Europe, and Asia. Their team operates in Spanish, English, French, Italian, and German.

**Primary goal:** Generate qualified leads from three distinct audiences.

**Audiences:**
1. **FIT** — Individual travelers seeking tours, transport, and custom itineraries in Guatemala
2. **MICE / Corporate** — Companies organizing congresses, conventions, incentive trips, fam trips, and custom programs
3. **B2B Agencies** — Travel agencies and tour operators seeking Dolfing as a receptive partner in Guatemala

---

## 2. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js (App Router) | i18n routing, API routes for forms, extensible for future features |
| Styling | Tailwind CSS | Rapid development, consistent design system |
| i18n | next-intl | Clean ES/EN routing with `/es/...` and `/en/...` prefixes |
| Email | Resend | Reliable transactional email for lead notifications |
| Deploy | Vercel | Free tier, native Next.js support |
| Forms | React Hook Form + Zod | Validation, segmented field logic |

---

## 3. Information Architecture

### Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, audience selector, trust signals, destinations, CTA |
| `/servicios/fit` | FIT services — tours, transport, custom itineraries |
| `/servicios/mice` | MICE/Corporate — congresses, conventions, incentives, fam trips |
| `/servicios/agencias` | B2B — Dolfing as receptive operator, partnership benefits |
| `/nosotros` | Company story, team, 12-year track record, multilingual capability |
| `/destinos` | Guatemala destinations covered |
| `/cotizar` | Lead capture — segmented quote form |
| `/contacto` | Address, phone, social media, map |

All routes duplicated under `/es/...` and `/en/...` via next-intl.

---

## 4. Visual Direction

### Design Reference
Virtuoso (virtuoso.com) — sophisticated restraint, white/cream backgrounds, generous whitespace, audience-segmented navigation, full-bleed photography.

### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Primary | Forest green | `#1B3A2D` |
| Accent | Warm gold | `#C9A84C` |
| Background | Off-white / cream | `#FAF8F4` |
| Text | Near-black | `#1A1A1A` |

### Typography
- **Headings:** Serif — Playfair Display or Cormorant Garamond
- **Body / UI:** Sans-serif — Inter or DM Sans

### Photography
Guatemala-first imagery: Volcán de Agua, Lago Atitlán, Antigua Guatemala, Tikal, Semuc Champey. Full-bleed hero, destination cards, service section backgrounds. **Source: client provides photos first; supplement with licensed stock (Unsplash/Adobe Stock) where needed.**

---

## 5. Home Page Structure

Scroll flow (top to bottom):

1. **Hero** — Full-bleed Guatemala photography, serif tagline, two CTAs: primary "Solicitar cotización" / secondary "Nuestros servicios"
2. **Audience selector** — 3 horizontal cards: "Viajero Individual · FIT" / "Corporativo · MICE" / "Agencias de Viaje" — each links to its service page
3. **Trust bar** — Icon row: 12 años de experiencia · Flota propia · 5 idiomas · Alcance global
4. **Destinos destacados** — 4–6 destination cards with photo + name
5. **Por qué Dolfing** — Key differentiators from brochure: own fleet, MICE specialists, multilingual, strategic network
6. **CTA section** — Dark green background, simplified 3-field form + WhatsApp button
7. **Footer** — Logo, page links, social media, contact info

---

## 6. Lead Capture System

### Quote Form (`/cotizar`) — 2-step flow

**Step 1:** Audience selector — 3 large cards with icon (FIT / MICE / Agencias)

**Step 2:** Fields by segment:

| Field | FIT | MICE | Agencias |
|-------|-----|------|---------|
| Full name | ✓ | ✓ | ✓ |
| Email | ✓ | ✓ | ✓ |
| WhatsApp | ✓ | ✓ | ✓ |
| Company / Agency | — | ✓ | ✓ |
| Destinations of interest | ✓ | ✓ | — |
| Number of travelers | ✓ | ✓ | — |
| Event type | — | ✓ | — |
| Country of origin | ✓ | ✓ | ✓ |
| Message / description | ✓ | ✓ | ✓ |

**Form submission flow:**
1. Client submits form → Next.js API route validates with Zod
2. API route sends email to Dolfing via Resend with full lead data
3. Success message shown to user

### WhatsApp Integration

Two touchpoints:
1. **Inside form** — Secondary CTA button alongside submit: "💬 Cotizar por WhatsApp" — opens `wa.me/[number]` with pre-filled message based on selected segment
2. **Floating button** — Fixed position on all pages, always accessible

Pre-filled WhatsApp messages by segment:
- FIT: *"Hola Dolfing Travel, me interesa una cotización para turismo individual en Guatemala."*
- MICE: *"Hola Dolfing Travel, me interesa una cotización para evento corporativo / MICE en Guatemala."*
- Agencias: *"Hola Dolfing Travel, soy agente de viajes y me interesa conocer sus servicios como operador receptivo."*

---

## 7. i18n Strategy

- **Library:** next-intl
- **Languages:** Spanish (es) — default, English (en)
- **Routing:** Subdirectory — `/es/...` and `/en/...`
- **Language switcher:** In navbar, flag + language code
- **Translation files:** JSON per language in `/messages/es.json` and `/messages/en.json`
- **Content:** All UI strings, page titles, meta descriptions, and form labels translated

---

## 8. Email (Corporate)

**Recommendation:** Google Workspace Business Starter ($6/user/month)
- Professional `@dolfingtravel.com` addresses
- Gmail interface, Google Meet for client calls, Drive for itinerary sharing, Calendar for booking coordination
- Best fit for an internationally-facing company

---

## 9. Required from Client Before Launch

| Item | Used for |
|------|---------|
| WhatsApp business number | Floating button + form CTA links |
| Domain name (e.g. `dolfingtravel.com`) | Vercel custom domain + Google Workspace setup |
| High-res photos / brand assets | Hero, destinations, service sections |
| Resend-verified sender email | Lead notification emails |

---

## 10. Out of Scope

- Online booking / payment processing
- Client portal or login system
- Blog or CMS
- Additional languages beyond ES/EN
- Real-time availability or booking calendar
