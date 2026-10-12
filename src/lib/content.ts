export const siteConfig = {
  name: "Vivir Creciendo",
  // Audiencia unificada en +65 en TODA la página (Error #2 del doc): antes
  // convivían "+60" (title, nav, footer) y "+65" (hero). No reintroducir +60.
  tagline: "Comunidad +65",
  // Tagline de marca para logo, redes y materiales (Parte III del doc).
  brandTagline: "Una comunidad de pertenencia en crecimiento",
  email: "contacto@vivircreciendo.com",
  // PENDIENTE fundadoras: número dedicado a la comunidad (no el personal de
  // ninguna de las dos). Mientras sea null, los bloques de WhatsApp no se
  // renderizan — es preferible a un link roto (el doc marca los links rotos
  // como bloqueante para publicar).
  whatsapp: null as string | null,
  // Mensaje pre-rellenado del link de WhatsApp (Parte XI del doc).
  whatsappPrefill: "Hola, quiero saber más sobre Vivir Creciendo",
  social: {
    // Página real (Ian 2026-08-19). Antes apuntaba a facebook.com/vivircreciendo,
    // un nombre de usuario que la página no tiene: el link daba en la nada.
    // La página no tiene nombre corto, así que la URL va con el id numérico.
    facebook: "https://www.facebook.com/profile.php?id=61550076244304",
    facebookLabel: "Vivir Creciendo",
    instagram: "https://instagram.com/vivir_creciendo",
    youtube: "https://youtube.com/@VivirCreciendoComunidad",
  },
};

/** Link de WhatsApp con mensaje pre-rellenado, o null si aún no hay número. */
export function whatsappHref(): string | null {
  if (!siteConfig.whatsapp) return null;
  const numero = siteConfig.whatsapp.replace(/\D/g, "");
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(
    siteConfig.whatsappPrefill
  )}`;
}

// Nav según Sección 00 del doc: los links + un botón CTA diferenciado.
//
// Los anclajes van con "/" adelante ("/#actividades", no "#actividades") a
// propósito. El nav se pinta también en las páginas propias (/testimonios,
// /nosotros, /membresias/…) y ahí un "#actividades" a secas busca un ancla que
// no existe en esa página: el link no hace nada. Con "/#actividades" el
// navegador vuelve a la portada y baja a la sección. Desde la portada misma
// sigue siendo una navegación dentro del mismo documento —o sea, el mismo
// salto de siempre, sin recargar.
export const navLinks = [
  { label: "Actividades", href: "/#actividades" },
  { label: "Membresía", href: "/#membresias" }, // singular: hay una sola
  { label: "Quiénes somos", href: "/#nosotras" },
  // Testimonios en video (Ian, 20-ago-2026). Antes solo estaba en el pie y no
  // se encontraba. Es la prueba social más fuerte que hay: va en el nav.
  { label: "Testimonios", href: "/testimonios" },
];

/** CTA del nav — visualmente distinto a los links (naranja, sticky). */
export const navCta = { label: "Prueba gratis", href: "/#contacto" };

// Sección 01 — Hero. UN SOLO CTA (Error #4 del doc, Ley de Hick): los tres
// botones que competían acá se redujeron a "Quiero mi actividad gratuita".
export const heroContent = {
  title:
    "¿Cuándo fue la última vez que al finalizar una conversación pensaste: «esto me hizo bien»?",
  subtitle:
    "Vivir Creciendo es la comunidad en línea en español donde personas de 65 años en adelante se encuentran semanalmente para conversar con profundidad, aprender junto a otros y sentir que pertenecen a algo real.",
  cta: "Quiero mi actividad gratuita",
  ctaHref: "#contacto",
  // Texto de bajo riesgo debajo del botón — reduce la fricción del alta.
  // Se quitó "Sin tarjeta de crédito" (Ian 2026-08-19). Estaba acá y en otros
  // cuatro lugares; no reintroducirlo suelto en un solo sitio.
  ctaNote: "Sin compromiso de permanencia.",
  imageAlt:
    "Grupo de mujeres y hombres de 65 años conversando y riendo en una sesión online de Vivir Creciendo",
};

// Sección 02 — Strip de prueba social (fondo naranja, texto blanco).
//
// Los dos números salen de acá y de ningún otro lado: alimentan el pie de la
// foto del hero, este strip y la bajada de "¿Qué es Vivir Creciendo?" (Ian
// 2026-08-12). Si cambian, se cambian una sola vez. Poner cualquiera de los
// dos en `null` apaga la frase entera en los tres lugares.
export const socialProof = {
  memberCount: 200 as number | null,
  countryCount: 10 as number | null,
  items: [
    "Facilitado por expertas con 40 años de experiencia",
    "Comunidad global en español",
    "Actividades semanales",
  ],
};

/**
 * "+200 miembros activos en más de 10 países", o null si falta el dato.
 *
 * Devolver null y no una cadena vacía es a propósito: quien la usa decide si
 * pinta el bloque o lo omite, en vez de renderizar un hueco.
 */
export function memberCountLine(): string | null {
  const { memberCount, countryCount } = socialProof;
  if (!memberCount) return null;
  const base = `+${memberCount} miembros activos`;
  return countryCount ? `${base} en más de ${countryCount} países` : base;
}

// Sección 03 — El Momento. Sin título visible: texto puro, centrado, ancho
// máximo acotado. El único trabajo de esta sección es que el visitante piense
// "me están leyendo la mente".
export const elMomento = [
  "¿Tienes 65, 70, 80 o más y buscas un lugar donde las conversaciones tengan peso, donde cada reflexión sume, donde encuentres genuina pertenencia?",
  "Eso es Vivir Creciendo: una comunidad pensada para acompañarte, sostenerte y escucharte. Aquí cada voz cuenta.",
  "Un espacio donde tu experiencia de vida importa, donde cada reflexión te acerca a otros, y donde la pertenencia se siente real — porque fue pensada para ti.",
];

// Sección 05 — Cómo funciona. Tres pasos, sin apuros.
export const comoFunciona = {
  // El título va como pregunta (Ian 2026-08-12). "Son tres pasos, sin apuros"
  // baja a subtítulo: metida dentro de la pregunta, la frase la volvía una
  // pregunta que no se puede responder.
  title: "¿Cómo empezar?",
  subtitle: "Son tres pasos, sin apuros.",
  steps: [
    {
      n: "01",
      title: "Prueba una actividad gratis",
      text: "Sin datos innecesarios. Solo tu nombre y tu email.",
    },
    {
      n: "02",
      title: "Conoce la comunidad desde adentro",
      text: "Un encuentro en vivo por Zoom, junto a personas que piensan como tú. Habrás aprendido algo nuevo, habrás encontrado algo que importa, y habrás conocido a alguien que transformará tu vida.",
    },
    {
      n: "03",
      title: "Elige quedarte si así lo deseas",
      text: "Si al terminar la actividad piensas «esto es para mí» — y confiamos en que así será — eliges integrarte a la comunidad. ¡Bienvenido!",
    },
  ],
};

// Sección 07 — Actividades.
//
// Acá vivía `actividades`: las cuatro cards escritas a mano. Se eliminaron
// porque eran una segunda copia de lo que ya estaba en Supabase — las mismas
// actividades cargadas dos veces, y ninguna de las dos enlazaba a la otra. El
// grid de la portada ahora lee `getActivities()` (ver Actividades.tsx) y se
// edita desde /admin. De este archivo solo queda el título.
export const actividadesTitle = "Nuestras actividades";

// Sección "Nos nutrimos con expertos especialistas en" (Ian 2026-06-28).
// Reemplaza la grilla de colaboradores/avatares por 5 categorías con ícono.
// El ícono (componente lucide) se mapea por índice en Nosotros.tsx.
export const expertAreasTitle = "Nos nutrimos con expertos especialistas en";
export const expertAreas = [
  "Vínculos, emociones y vida íntima",
  "Tecnología e Inteligencia Artificial",
  "Salud y Longevidad",
  "Espiritualidad y Trascendencia",
  "Finanzas y habilidades prácticas para la vida diaria",
];

// NOTA: el bloque `quienesSomos` (7 párrafos que vivían dentro del Hero) se
// retiró al reestructurar la landing. Su trabajo lo hacen ahora dos secciones
// con un único objetivo cada una: `elMomento` (resonancia emocional) y
// `pillars` (qué es Vivir Creciendo, en 3 columnas). El Hero quedó liberado
// para hacer una sola cosa: headline + un CTA.

export const emotionalQuestions = [
  "¿Sientes que esta etapa pide algo distinto, pero no sabes qué?",
  "¿Te gustaría conversar con personas que estén viviendo lo mismo?",
  "¿Buscas un espacio para seguir aprendiendo, sin sentirte fuera de lugar?",
];

// Sección 04 — Qué es Vivir Creciendo. Tres columnas con ícono outline.
export const pillarsIntro = "Vínculos reales. Mente activa. Protagonismo genuino.";
export const pillarsTitle = "¿Qué es Vivir Creciendo?";
export const pillars = [
  {
    // HeartHandshake y no MessagesSquare (Ian 2026-08-12): el bocadillo de
    // diálogo dibuja la conversación, no el vínculo — y además chocaba con el
    // ícono de "Mente activa", que también es de conversación.
    icon: "HeartHandshake" as const,
    title: "VÍNCULOS REALES",
    description:
      "Un lugar donde escuchar y ser escuchado amplía tu mirada y te acerca a formas de pensar que quizás no habías considerado. Cada conversación enriquece, cada perspectiva suma y, poco a poco, se crean vínculos auténticos que sostienen.",
  },
  {
    icon: "Lightbulb" as const,
    title: "MENTE ACTIVA",
    description:
      "Cine Reflexión, charlas con expertos y temas que invitan a pensar diferente. Cada semana una nueva propuesta para ampliar la mirada, aprender y seguir descubriendo, junto a personas con la misma curiosidad por seguir creciendo.",
  },
  {
    icon: "Users" as const,
    title: "PROTAGONISMO",
    description:
      "Un espacio participativo donde tu voz tiene un lugar. Tu historia, tu experiencia y tu mirada se comparten, se valoran y enriquecen esta comunidad. Porque nadie llega con tu misma historia, y justamente ahí reside su mayor riqueza.",
  },
];

export interface Membership {
  slug: string;
  icon: "Film" | "MessageCircle" | "Sparkles";
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  includes: string[];
  facilitator: string;
  facilitatorBio: string;
  closingQuote: string;
  price: string;
  accent: string;
  accentBg: string;
  badge?: string;
  faqs: { question: string; answer: string }[];
}

export const memberships: Membership[] = [
  {
    slug: "cine",
    icon: "Film",
    title: "CINE REFLEXIÓN",
    accent: "text-vc-blue",
    accentBg: "bg-vc-blue",
    tagline: "Una película al mes. Una conversación que te transforma.",
    description:
      "Cada mes seleccionamos una película que toca temas profundamente humanos. La ves a tu ritmo, y luego nos reunimos por Zoom para conversar.",
    longDescription:
      "Cine Reflexión es mucho más que ver una película. Cada mes seleccionamos cuidadosamente una película que toca temas profundamente humanos — el paso del tiempo, los vínculos, la reinvención. La ves a tu ritmo desde casa, y luego nos reunimos por Zoom para una conversación guiada donde compartimos lo que sentimos, pensamos y recordamos. No necesitas saber de cine: lo que importa es tu mirada.",
    includes: [
      "Película mensual seleccionada",
      "Encuentro mensual por Zoom guiado",
      "Grupo de WhatsApp exclusivo",
      "Acceso a grabaciones por tiempo limitado",
    ],
    facilitator: "Nurit Mileris-Zylbersztejn",
    facilitatorBio:
      "Psicoterapeuta con más de 30 años de experiencia. Cofundadora de Vivir Creciendo.",
    closingQuote: "Comunidad, humor y emoción.",
    price: "Incluida en la Membresía — $27 USD/mes",
    faqs: [
      {
        question: "¿Qué tipo de películas seleccionan?",
        answer:
          "Películas de distintos géneros y países que tocan temas universales: vínculos, memoria, reinvención, humor. No son películas difíciles ni de autor exclusivamente.",
      },
      {
        question: "¿Necesito tener algún servicio de streaming?",
        answer:
          "No. Te compartimos un enlace para ver la película del mes. Solo necesitas internet.",
      },
      {
        question: "¿Puedo ver la película con alguien más?",
        answer:
          "¡Por supuesto! Muchos miembros la ven con su pareja o amigos. Lo importante es llegar al encuentro con tu propia reflexión.",
      },
    ],
  },
  {
    slug: "caminando",
    icon: "MessageCircle",
    title: "CAMINANDO JUNTOS",
    badge: "Más elegida",
    accent: "text-vc-orange",
    accentBg: "bg-vc-orange",
    tagline:
      "Una Rueda de Trabajo Comunitario. Un espacio donde cada voz importa.",
    description:
      "Basada en la metodología del Dr. Adalberto Barreto. Cada mes nos reunimos a poner palabras a lo que estamos viviendo.",
    longDescription:
      "Caminando Juntos es nuestra Rueda de Trabajo Comunitario, inspirada en la Terapia Comunitaria Integrativa del Dr. Adalberto Barreto. En cada encuentro mensual por Zoom, compartimos lo que estamos viviendo en un espacio seguro, guiado y sin juicios. No es terapia individual: es la fuerza del grupo la que sostiene. Cada participante aporta su experiencia y se lleva la riqueza de las demás.",
    includes: [
      "Encuentros grupales mensuales por Zoom",
      "Espacio terapéutico-educativo guiado por Nurit Mileris-Zylbersztejn",
      "Grupo de WhatsApp exclusivo",
      "Material complementario",
    ],
    facilitator: "Nurit Mileris-Zylbersztejn",
    facilitatorBio:
      "Psicoterapeuta con más de 30 años de experiencia. Cofundadora de Vivir Creciendo. Formada en Terapia Comunitaria Integrativa.",
    closingQuote: "Ninguna de nuestras historias se escribe en soledad.",
    price: "Incluida en la Membresía — $27 USD/mes",
    faqs: [
      {
        question: "¿Qué es una Rueda de Trabajo Comunitario?",
        answer:
          "Es una metodología grupal creada por el Dr. Adalberto Barreto en Brasil. Se basa en compartir experiencias en un espacio seguro, donde la sabiduría del grupo es el recurso principal.",
      },
      {
        question: "¿Tengo que hablar en cada encuentro?",
        answer:
          "No. Puedes participar escuchando. La invitación es a compartir cuando te sientas cómodo/a. No hay presión.",
      },
      {
        question: "¿Esto reemplaza la terapia?",
        answer:
          "No. Caminando Juntos es un espacio comunitario, no terapia individual. Es complementario y muchos miembros lo combinan con su proceso personal.",
      },
    ],
  },
  {
    slug: "bienestar",
    icon: "Sparkles",
    title: "SALUD Y BIENESTAR",
    accent: "text-vc-blue-dark",
    accentBg: "bg-vc-blue-dark",
    tagline:
      "Recupera energía, claridad y alegría. Sin dietas. Sin culpa.",
    description:
      "Cada mes Alejandra Furman-Paz comparte una clase práctica sobre cómo cuidar tu cuerpo, mente y emociones.",
    longDescription:
      "Salud y Bienestar es un programa mensual con Alejandra Furman-Paz, Coach de Bienestar y Nutrición Integrativa. Cada clase aborda un tema práctico: desde cómo mejorar tu energía y sueño, hasta cómo alimentarte con placer y sin culpa. No es un programa de dietas ni recetas milagro — es aprender a escuchar tu cuerpo y hacer cambios sostenibles que funcionen para ti.",
    includes: [
      "Clase mensual en vivo con Alejandra",
      "Sesión de preguntas y respuestas",
      "Material descargable cada mes",
      "Grupo de WhatsApp exclusivo",
    ],
    facilitator: "Alejandra Furman-Paz",
    facilitatorBio:
      "Coach de Bienestar y Nutrición Integrativa. Cofundadora de Vivir Creciendo. Transformó su propia vida a los 55 años.",
    closingQuote:
      "Yo viví 50 años engañada. A mis 55 viví una experiencia transformadora.",
    price: "Incluida en la Membresía — $27 USD/mes",
    faqs: [
      {
        question: "¿Necesito seguir una dieta?",
        answer:
          "No. Este programa no es de dietas. Es sobre aprender a escuchar tu cuerpo, entender qué necesita y hacer cambios graduales que puedas sostener.",
      },
      {
        question: "¿Las clases quedan grabadas?",
        answer:
          "Sí. Las clases de Salud y Bienestar quedan grabadas por tiempo limitado para que puedas verlas a tu ritmo.",
      },
      {
        question: "¿Puedo hacer preguntas durante la clase?",
        answer:
          "¡Sí! Cada clase incluye un espacio de preguntas y respuestas donde Alejandra responde personalmente.",
      },
    ],
  },
];

/**
 * Sección 09 — Membresías. UNA SOLA MEMBRESÍA (decisión de fondo del doc
 * "Vivir Creciendo — una sola membresía"): los tres planes anteriores
 * (Gratis / Básica / Plus) se colapsan en Gratuita + Membresía.
 *
 * Los precios van SIEMPRE visibles, sin sesión (Error #1 del doc, el más
 * grave): antes decían "Precio por confirmar" y solo se mostraban a usuarios
 * logueados, que es exactamente al revés de lo que necesita la conversión.
 */
export interface MembershipPlan {
  name: string;
  kind: "gratis" | "paga";
  /** Precio visible siempre. */
  price: string;
  /** Segunda línea de precio (anual, aclaración de riesgo). */
  priceNote: string;
  tagline: string;
  features: string[];
  /** Micro-copy de bajo riesgo bajo la lista. */
  reassurance?: string;
  cta: string;
  ctaHref: string;
  featured?: boolean;
}

// Singular (Ian 2026-08-12): hay UNA membresía. El plural venía del esquema
// viejo de tres planes y contradecía a la propia sección.
export const membershipsTitle = "Nuestra membresía";
export const membershipsSubtitle =
  "Empieza por la actividad gratuita. Si el espacio es para ti, te esperamos.";

export const membershipPlans: MembershipPlan[] = [
  {
    name: "Gratuita",
    kind: "gratis",
    price: "$0",
    // PENDIENTE fundadoras: el doc marca este plan como "todavía no definido,
    // conversar con Ariel". El copy queda publicable tal cual; si cambian las
    // condiciones, se edita solo este objeto.
    priceNote: "Sin compromiso.",
    tagline: "Una actividad por mes para conocernos desde adentro.",
    features: [
      "1 actividad online en vivo por mes",
      "Acceso a una actividad para conocernos",
      "Sin compromiso de permanencia",
    ],
    cta: "Quiero probar gratis",
    ctaHref: "#contacto",
  },
  {
    name: "Membresía",
    kind: "paga",
    price: "$27 USD/mes",
    priceNote: "o $270/año (2 meses gratis)",
    tagline: "Las conversaciones que nutren, semana a semana.",
    features: [
      "Cine Reflexión: te enviamos la película, la ves y reflexionamos juntos",
      "Círculo de escucha: rueda grupal para poner palabras a lo que estás viviendo",
      "Salud y bienestar: exploramos la nutrición desde una mirada integral para cultivar salud, energía y bienestar",
      "Descuento en actividades especiales",
    ],
    reassurance: "Sin compromisos de permanencia. Cancelas cuando quieras.",
    cta: "Quiero sumarme",
    ctaHref: "#contacto",
    featured: true,
  },
];

/**
 * Bloque de debajo de las membresías.
 *
 * Reemplaza a la "garantía de satisfacción" con devolución a los 7 días que
 * pedía la Parte XI del doc (Ian 2026-08-12). El trabajo de este bloque sigue
 * siendo el mismo —desactivar el riesgo percibido justo cuando el visitante
 * está mirando el precio— pero ahora lo hace explicando cómo funciona la
 * cancelación, que es la duda concreta, en vez de prometer un reembolso.
 */
export const cancelacion = {
  title: "Cancelas cuando quieras",
  text: "No hay permanencia mínima ni penalización por irte. Si cancelas, tu membresía sigue activa hasta el final del período que ya pagaste: participas de todas las actividades hasta ese día y, simplemente, no se genera el cobro siguiente.",
  closing:
    "Se cancela desde tu cuenta, sin llamados ni trámites. Queremos que estés porque quieres estar, no porque irse sea complicado.",
};

// Vista logueada — las 5 actividades completas del programa (contenido full)
export interface FullActivity {
  title: string;
  facilitator: string;
  /** Adelanto corto — visible sin iniciar sesión (la puntita del iceberg). */
  preview: string;
  /** Descripción completa — visible al iniciar sesión. */
  description: string;
  cadence: string;
}

export const fullActivities: FullActivity[] = [
  {
    title: "Cine Reflexión",
    facilitator: "Nurit Mileris-Zylbersztejn",
    preview:
      "Vemos juntos una película que conmueve y la conversamos por Zoom.",
    description:
      "Cada mes vemos una película que toca temas profundamente humanos y nos reunimos por Zoom para conversar sobre lo que sentimos, pensamos y recordamos. No hace falta saber de cine: lo que importa es tu mirada.",
    cadence: "Mensual · Zoom",
  },
  {
    title: "Caminemos Juntos",
    facilitator: "Nurit Mileris-Zylbersztejn",
    preview:
      "Una rueda comunitaria: un espacio seguro para compartir y sostenernos.",
    description:
      "Nuestra Rueda de Trabajo Comunitario inspirada en la metodología del Dr. Adalberto Barreto. Un espacio seguro y sin juicios donde la fuerza del grupo sostiene lo que cada persona trae para compartir.",
    cadence: "Mensual · Zoom",
  },
  {
    title: "Salud y Bienestar",
    facilitator: "Alejandra Furman-Paz",
    preview:
      "Clases prácticas para cuidar tu cuerpo, mente y emociones, sin dietas ni culpa.",
    description:
      "Clases prácticas para cuidar tu cuerpo, mente y emociones. Sin dietas ni culpa: aprender a escuchar tu cuerpo y hacer cambios sostenibles, con espacio de preguntas y material descargable cada mes.",
    cadence: "Mensual · en vivo",
  },
  {
    title: "Círculo Cultural",
    facilitator: "Equipo Vivir Creciendo",
    preview:
      "Literatura, música, historia y arte, conversados en comunidad.",
    description:
      "Un encuentro para seguir nutriendo la curiosidad: literatura, música, historia y arte conversados en comunidad. Un espacio para pensar, sentir y crear junto a otros.",
    cadence: "Mensual · Zoom",
  },
  {
    title: "Plática con Foro",
    facilitator: "Invitados especiales",
    preview:
      "Una charla mensual con expertos y un foro abierto donde tu voz es protagonista.",
    description:
      "Una charla mensual con expertos invitados sobre temas que nos importan, seguida de un foro abierto de intercambio donde tu voz y tus preguntas son protagonistas.",
    cadence: "Mensual · Zoom",
  },
];

export const philosophy = {
  quote:
    "Vivir Creciendo no es un grupo. No es una actividad. Es una comunidad que sostiene, que transforma, que legitima.",
  author: "Nurit Mileris-Zylbersztejn, cofundadora",
  principles: [
    "Comunidad — Ubuntu: yo soy porque nosotros somos",
    "Reautoría — Reescribir nuestra historia, no aceptar la dominante",
    "Anti-edadismo — La edad no es un límite, es una oportunidad",
  ],
};

export interface Course {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  dates: string;
  time: string;
  instructor: string;
  instructorBio: string;
  format: string;
  price: string;
}

export const courses: Course[] = [
  {
    slug: "sexualidad-60",
    title:
      "Deseo, conexión y ternura: resignificando la sexualidad después de los 60",
    description:
      "Un taller para explorar y resignificar la sexualidad en esta etapa de la vida, con apertura y respeto.",
    longDescription:
      "Un espacio seguro y respetuoso para hablar de lo que muchas veces se calla: el deseo, la intimidad y los vínculos después de los 60. En 3 sesiones exploraremos cómo resignificar la sexualidad en esta etapa, con apertura, sin tabúes y con mucho cariño. No importa si estás en pareja o no — este taller es para ti.",
    dates: "Miércoles 16, 23 y 30 de julio",
    time: "10:00 AM (CDMX)",
    instructor: "Abigail Sosa Mendoza",
    instructorBio:
      "Psicóloga clínica, especialista en sexualidad y vínculos 60+.",
    format: "100% online vía Zoom",
    price: "PLACEHOLDER USD (3 sesiones)",
  },
  {
    slug: "finanzas-60",
    title: "Tranquilidad Financiera para mayores de 60",
    description:
      "3 sesiones grupales para ordenar tus finanzas y vivir con más tranquilidad.",
    longDescription:
      "¿Te preocupa el dinero pero no sabes por dónde empezar? En 3 sesiones prácticas, Diego Socolovsky te acompaña a ordenar tus finanzas sin tecnicismos. Aprenderás a hacer un diagnóstico simple de tu situación, a armar un plan realista y a tomar decisiones con más tranquilidad. No necesitas saber de economía — solo ganas de vivir con menos estrés financiero.",
    dates: "11, 18 y 25 de junio",
    time: "Horario por confirmar",
    instructor: "Diego Socolovsky",
    instructorBio:
      "Economista y Coach Financiero. Especialista en finanzas personales para adultos mayores.",
    format: "Online vía Zoom",
    price: "PLACEHOLDER USD (3 sesiones)",
  },
  {
    slug: "brain-gym",
    title: "Activa tu Cerebro con Brain Gym\u00AE",
    description:
      "Ejercicios prácticos para mantener la mente activa y mejorar la coordinación, con la psicóloga Ivonne Hodara.",
    longDescription:
      "Brain Gym® es un programa de ejercicios simples y divertidos diseñados para activar el cerebro y mejorar la coordinación entre cuerpo y mente. Con la guía de la psicóloga Ivonne Hodara, aprenderás técnicas que puedes practicar en casa para mantener la mente ágil, mejorar la memoria y la concentración. No se necesita experiencia previa ni equipo especial.",
    dates: "Desde el miércoles 12 de marzo",
    time: "Horarios ajustados por país",
    instructor: "Psicóloga Ivonne Hodara",
    instructorBio:
      "Psicóloga, Instructora certificada de Brain Gym®. Especialista en estimulación cognitiva para adultos mayores.",
    format: "Online vía Zoom",
    price: "PLACEHOLDER USD",
  },
];

export interface TeamMember {
  name: string;
  role: string;
  quote: string | null;
  /** Presentación en primera persona (cofundadoras). Si existe, se muestra
   *  en lugar del role/quote en la sección NOSOTRAS de la landing. */
  bio?: string | null;
  image: string | null;
  /**
   * Encuadre del recorte circular. Las fotos verticales necesitan
   * `object-top` para que la cara no quede cortada por arriba; las cuadradas
   * se ven bien con el centro por defecto.
   */
  imagePosition?: string;
  /**
   * Ranura de /admin/multimedia que puede reemplazar a `image`. Si las
   * fundadoras suben otra foto desde el panel, gana esa; si no, se usa el
   * archivo de `image`. Ver MEDIA_SLOTS en src/lib/media.ts.
   */
  mediaSlot?: string;
  cofounder: boolean;
}

export const teamMembers: TeamMember[] = [
  // Bio reescrita (Error #5 del doc): la anterior hablaba de "recuperar
  // energía" y "sin dietas rígidas" — o sea, del negocio personal de
  // nutrición de Alejandra, no de Vivir Creciendo. La nueva entra por la
  // experiencia propia de llegar a los 65 y aterriza en el proyecto.
  {
    name: "Alejandra Furman-Paz",
    role: "Cofundadora de Vivir Creciendo | Coach de Salud en Nutrición Integrativa",
    quote: null,
    bio: "Cuando llegué a los 65 entendí que el bienestar es mucho más que cuidar el cuerpo. También necesitamos espacios donde seguir aprendiendo, compartiendo y sintiendo que pertenecemos.\n\nComo Coach de Salud en Nutrición Integrativa, llevo años acompañando a personas a construir una relación más consciente con su alimentación, su energía y su bienestar, respetando que cada historia y cada etapa de la vida son únicas.\n\nJunto con Nurit creamos Vivir Creciendo porque soñábamos con una comunidad en español donde las personas pudieran seguir aprendiendo, compartiendo y construyendo vínculos genuinos. Un lugar donde crecer no termina con la edad: simplemente cambia de forma.",
    image: "/images/alejandra.jpg", // foto real (Ian 2026-08-04)
    imagePosition: "object-top", // vertical 1126x1600 — centrada cortaría la cara
    mediaSlot: "nosotras.alejandra",
    cofounder: true,
  },
  {
    name: "Nurit Mileris-Zylbersztejn",
    role: "Cofundadora de Vivir Creciendo | Psicoterapeuta, docente y facilitadora de comunidades",
    quote: null,
    bio: "Hace casi cuarenta años acompaño a personas, parejas, familias y grupos en procesos de cambio. En ese recorrido comprendí que muchas de las transformaciones más profundas ocurren cuando encontramos espacios donde somos escuchados, reconocidos y dejamos de sentirnos solos.\n\nMi trabajo integra la psicoterapia, la docencia y el trabajo con grupos desde una mirada narrativa, colaborativa y existencial, siempre con la convicción de que el diálogo puede abrir nuevas posibilidades para vivir.\n\nJunto con Ale creamos Vivir Creciendo porque soñábamos con una comunidad en español donde las personas pudieran seguir aprendiendo, compartiendo y construyendo vínculos genuinos. Un espacio donde crecer no termina con la edad: simplemente cambia de forma.",
    image: "/images/nurit.png", // foto real (Ian 2026-06-28)
    mediaSlot: "nosotras.nurit",
    cofounder: true,
  },
  {
    name: "Abigail Sosa Mendoza",
    role: "Psicóloga clínica, especialista en sexualidad y vínculos 60+",
    quote: null,
    image: null,
    cofounder: false,
  },
  {
    name: "Diego Socolovsky",
    role: "Economista y Coach Financiero",
    quote: null,
    image: null,
    cofounder: false,
  },
  {
    name: "Ivonne Hodara",
    role: "Psicóloga, Instructora de Brain Gym\u00AE",
    quote: null,
    image: null,
    cofounder: false,
  },
  {
    name: "Pablo Maulella",
    role: "Docente en Habilidades Digitales",
    quote: null,
    image: null,
    cofounder: false,
  },
  {
    name: "Adriana Potel",
    role: "Psicodramatista, terapias corporales",
    quote: null,
    image: null,
    cofounder: false,
  },
  {
    name: "Mijal Luria",
    role: "Ginecóloga y Terapeuta Sexual",
    quote: null,
    image: null,
    cofounder: false,
  },
  {
    name: "Claudio Obremski",
    role: "Maestro de yoga y Reiki",
    quote: null,
    image: null,
    cofounder: false,
  },
];

export interface Activity {
  title: string;
  date: string;
  time: string;
  description: string;
  category: string;
}

export const upcomingActivities: Activity[] = [
  {
    title: "Bienestar Integral después de los 60",
    date: "Miércoles 29 de abril",
    time: "4:00 PM México / 7:00 PM Argentina",
    description:
      "Nutrición y bienestar después de los 60. Únete al grupo de WhatsApp para recibir el link.",
    category: "Nutrición y Bienestar",
  },
  {
    title: "Caminando Juntos — Formando Comunidad",
    date: "Miércoles 22 de abril",
    time: "4:00 PM México / 7:00 PM Argentina / 6:00 PM Chile",
    description:
      "Un espacio para conversar, escuchar y crear comunidad.",
    category: "Caminando Juntos",
  },
  {
    title: "El rol de las Grasas en el Envejecimiento Saludable",
    date: "Miércoles 5 de noviembre",
    time: "2:00 PM (CDMX)",
    description: "Taller gratuito online vía Zoom. Cupos limitados.",
    category: "Taller gratuito",
  },
];

export const pastActivities: Activity[] = [
  {
    title: "Master Class: Brain Gym\u00AE",
    date: "Marzo 2026",
    time: "",
    description:
      "Ejercicios prácticos para activar el cerebro con la psicóloga Ivonne Hodara.",
    category: "Taller",
  },
  // PLACEHOLDER: agregar más actividades pasadas
];

/**
 * Sección 06 — Prueba social (Error #3 del doc: la landing no tenía ninguna).
 *
 * El arreglo de citas que vivía acá se movió a la tabla `voces` de la base
 * (Ian 2026-08-12): ahora se administran en /admin/voces y se muestran en
 * carrusel. Las tres originales están migradas tal cual, con su procedencia.
 * Ver `src/lib/testimonios.ts`.
 *
 * Sigue en pie la regla que las gobierna: NO inventar testimonios ni atribuir
 * a "miembros" frases que no lo son. Para este público, una prueba social
 * falsa que se nota cuesta más que la ausencia de prueba social.
 */
export const testimonialsTitle = "Voces de la comunidad";

/** Título y bajada de la página /testimonios (videos). */
export const testimoniosPage = {
  title: "Testimonios",
  subtitle:
    "Miembros de Vivir Creciendo contando, en sus palabras, qué cambió desde que forman parte de la comunidad.",
  vacio:
    "Estamos grabando los primeros testimonios en video. Vuelve en unos días.",
};

/**
 * Sección 10 — FAQ (Parte IX del doc). Cada pregunta ataca una objeción
 * silenciosa concreta del target de 65+: miedo a la tecnología, miedo a
 * quedar atrapado, soledad geográfica, horarios, presión a hablar, datos
 * personales y "¿y si no me convence?".
 */
export const faqsTitle = "Preguntas frecuentes";
export const faqs = [
  {
    question: "¿Necesito saber mucho de tecnología para participar?",
    answer:
      "No. Si sabes abrir un link, ya sabes todo lo que necesitas. Nuestras actividades se hacen por Zoom — una plataforma que cualquier dispositivo soporta. Antes de tu primera sesión, te enviamos una guía paso a paso de cómo entrar. Y si algo no funciona, escríbenos y te ayudamos en tiempo real. Nadie se queda afuera por una cuestión técnica.",
  },
  {
    question: "¿Cuánto dura el compromiso? ¿Puedo cancelar?",
    answer:
      "No hay compromiso de permanencia. Puedes cancelar en cualquier momento desde tu cuenta, sin llamados ni burocracia. Si eliges el plan anual y decides cancelar, te devolvemos el proporcional de lo no usado. Queremos que estés porque quieres estar — no porque es complicado irse.",
  },
  {
    question: "¿Hay personas de mi país o de mi contexto en la comunidad?",
    answer:
      "Vivir Creciendo es una comunidad hispanohablante global. Tenemos miembros de varios países. La diversidad de contextos hace las conversaciones más ricas — es uno de los activos más valorados por nuestros miembros. Y el español compartido crea un terreno común inmediato.",
  },
  {
    question: "¿En qué horarios son las actividades? ¿Puedo ver las grabaciones después?",
    answer:
      // PENDIENTE fundadoras: el doc pide (a) link al calendario de horarios y
      // (b) el plazo durante el cual quedan disponibles las grabaciones. El
      // texto está redactado para que ambos datos entren sin reescribirlo.
      "Las actividades en vivo se realizan en horarios que buscan ser accesibles para varios husos horarios del mundo hispanohablante. Algunas sesiones quedan grabadas y disponibles para miembros; otras, en cambio, no se graban para resguardar la privacidad de quienes participan. Si quieres el detalle de horarios, escríbenos y te lo enviamos.",
  },
  {
    question: "¿Tengo que participar activamente o puedo solo escuchar?",
    answer:
      "Puedes participar tanto como quieras. Hay sesiones donde la cámara puede estar apagada, hay momentos de escucha y momentos de expresión. La única regla es el respeto mutuo. Nadie es presionado a hablar — aunque la mayoría termina queriendo hacerlo.",
  },
  {
    question: "¿Mis datos están seguros? ¿Qué hacen con mi información?",
    answer:
      "Tus datos personales (nombre, email, información de pago) son usados exclusivamente para gestionar tu membresía y comunicarte actividades. No los vendemos, no los cedemos a terceros, no los usamos para publicidad. Puedes ver nuestra Política de Privacidad completa en el pie de esta página.",
  },
  {
    question: "¿Qué pasa si la primera sesión no me convence?",
    answer:
      "La primera sesión es gratis y sin compromiso — precisamente para que puedas sentir si el espacio es para ti. Si no te convence, no pasa nada. No hay llamado de seguimiento ni presión para suscribirte. Queremos que el «sí» venga de adentro — no de una campaña de marketing.",
  },
];

export const blogPosts = [
  {
    title: "Escritos en Comunidad: Nuestros compañeros escriben",
    excerpt:
      "Historias y reflexiones escritas por los miembros de nuestra comunidad.",
    url: "https://vivircreciendo.com/blog/",
  },
  {
    title: "Volver al cuerpo: Aprende a escuchar sus señales",
    excerpt:
      "Cómo reconectar con tu cuerpo y entender lo que te dice.",
    url: "https://vivircreciendo.com/blog/",
  },
  {
    title: "Ubuntu: Yo soy porque nosotros somos",
    excerpt:
      "La filosofía africana que inspira nuestra forma de hacer comunidad.",
    url: "https://vivircreciendo.com/blog/",
  },
];

export const newsletterContent = {
  title: "MANTENTE AL DÍA",
  description:
    "Recibe novedades, actividades gratuitas y contenido pensado para ti, cada quincena.",
  consent:
    "Acepto recibir correos quincenales o mensuales e ingresar al grupo de WhatsApp.",
  hasNameField: true,
};

// Sección 11 — CTA final. Última oportunidad de conversión: mismo botón que
// el hero (un solo verbo en toda la página) sobre fondo azul marca.
export const finalCta = {
  title: "Tu próxima conversación importante empieza acá.",
  description: "Súmate sin compromiso. La primera actividad es gratis.",
  button: "Quiero mi actividad gratuita",
  note: "Sin compromiso de permanencia. Cancelas cuando quieras.",
};

// Soporte humano — el email ya es real; el WhatsApp se renderiza solo si
// `siteConfig.whatsapp` tiene número (ver `whatsappHref()`).
export const soporte = {
  titulo: "¿Prefieres escribirnos antes?",
  emailLabel: "Escríbenos por email",
  whatsappLabel: "Escríbenos por WhatsApp",
};

// Sección 12 — Footer.
export const footerContent = {
  // Alineado con siteConfig.brandTagline (Ian 2026-08-12): la bajada del pie
  // decía otra cosa que el tagline de marca, y era la única que se veía.
  tagline: siteConfig.brandTagline,
  navTitle: "Navegación",
  contactTitle: "Contacto",
  legal: "© 2026 Vivir Creciendo. Todos los derechos reservados.",
};
