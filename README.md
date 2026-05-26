# Vivir Creciendo — Landing Page

Comunidad online en español para personas +60.

## Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (base-ui)
- **lucide-react** (iconos)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editar contenido

Todo el contenido (textos, membresías, FAQs, testimonios) está centralizado en:

```
src/lib/content.ts
```

Edita ese archivo para cambiar textos sin tocar componentes.

## Fuentes

Actualmente usa fallbacks de Google Fonts:
- **Titles:** Archivo Black
- **Subtitles:** Mada (italic)
- **Body:** Work Sans

Si se obtiene licencia de **Mr Eaves XL San Nar**, actualizar las variables de fuente en `src/app/layout.tsx`.

## Placeholders pendientes

- [ ] Precios de las 3 membresías
- [ ] Testimonios reales
- [ ] Fotos del equipo / facilitadores
- [ ] Número de WhatsApp
- [ ] Fechas de actividades gratuitas
- [ ] Más facilitadores del equipo
- [ ] Ilustración / foto del Hero

## Arquitectura

```
src/
  app/
    page.tsx          # Landing (11 secciones)
    layout.tsx        # Fuentes, metadata, skip-link
    globals.css       # Design system, colores VC
  components/
    Navbar.tsx
    Footer.tsx
    Logo.tsx
    WhatsAppFloat.tsx
    TextSizeToggle.tsx
    sections/
      Hero.tsx
      Pillars.tsx
      Memberships.tsx
      HowItWorks.tsx
      Team.tsx
      FreeActivities.tsx
      Testimonials.tsx
      FAQ.tsx
      FinalCTA.tsx
    ui/               # shadcn components
  lib/
    content.ts        # TODA la copy centralizada
public/
  textures/noise.svg  # Overlay de textura
```

## Deploy

```bash
npm run build    # Production build
npm run start    # Serve production
```

Target: Vercel.
