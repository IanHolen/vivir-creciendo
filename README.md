# Vivir Creciendo — Landing Page

Comunidad online en español para personas de 65 años en adelante.
La audiencia va unificada en **+65** en toda la página: no reintroducir "+60".

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

## Pendientes de las fundadoras

Ninguno de estos se inventa en el código: mientras falte el dato, el bloque
correspondiente se oculta o el texto está redactado para que el dato entre sin
reescribirlo. Buscar `PENDIENTE` en `src/lib/content.ts`.

- [ ] **Número de WhatsApp** dedicado a la comunidad → `siteConfig.whatsapp`.
      Mientras sea `null`, el botón flotante, el bloque de soporte y la línea
      del footer no se renderizan (antes apuntaban a `+52 1 55 0000 0000`).
- [ ] **Nº de miembros activos** → `socialProof.memberCount`. Apagado hasta
      confirmarlo (Alejandra dejó el comentario "¿Qué queremos poner aquí?").
- [ ] **Video de las fundadoras** (90 seg, con subtítulos en español) → la
      ranura está reservada al final del Hero.
- [ ] **Testimonios en video** de miembros reales → `testimonials`.
- [ ] **Foto de Alejandra** → `teamMembers[0].image`.
- [ ] **Condiciones del plan Gratuito** ("conversar con Ariel" según el doc) →
      `membershipPlans[0]`.
- [ ] **Link de horarios** y **plazo de las grabaciones** → FAQ #4.
- [ ] **Páginas legales** (Privacidad, TyC) → hoy los links del footer van a `#`.

## Landing

La estructura sigue la Parte VI del doc de optimización (julio 2026). Cada
sección tiene un solo trabajo y el orden es deliberado — ver el comentario de
cabecera en `src/app/page.tsx` antes de reordenar nada.

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
