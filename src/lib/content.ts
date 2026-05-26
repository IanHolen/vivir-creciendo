export const siteConfig = {
  name: "Vivir Creciendo",
  tagline: "Comunidad +60",
  email: "hola@vivircreciendo.com",
  whatsapp: "+52 1 55 0000 0000", // PLACEHOLDER
  social: {
    facebook: "https://facebook.com/vivircreciendo",
    instagram: "https://instagram.com/vivir_creciendo",
    youtube: "https://youtube.com/@VivirCreciendoComunidad",
  },
};

export const navLinks = [
  { label: "Inicio", href: "#" },
  { label: "Quiénes Somos", href: "#quienes" },
  { label: "Membresías", href: "#membresias" },
  { label: "Actividades", href: "#actividades" },
  { label: "Blog", href: "#" },
  { label: "Contacto", href: "#contacto" },
];

export const heroContent = {
  title: "TU HISTORIA CONTINÚA",
  subtitle: "con protagonismo, transformación y trascendencia",
  description:
    "Vivir Creciendo es una comunidad online en español para personas +60 que crece, comparte y se acompaña. Conversamos, aprendemos y compartimos experiencias.",
  ctaPrimary: "CONOCE NUESTRAS MEMBRESÍAS",
  ctaSecondary: "Participa en una actividad gratis",
};

export const pillars = [
  {
    icon: "Users" as const,
    title: "COMUNIDAD",
    description:
      "Un grupo que escucha, acompaña y crece contigo. Nadie escribe su historia en soledad.",
  },
  {
    icon: "BookOpen" as const,
    title: "APRENDIZAJE",
    description:
      "Talleres, conversaciones y reflexiones para seguir descubriendo. La edad no es un límite, es una oportunidad.",
  },
  {
    icon: "Heart" as const,
    title: "ACOMPAÑAMIENTO",
    description:
      "Espacios cálidos, sin juicios, donde tu voz importa.",
  },
];

export interface Membership {
  icon: "Film" | "MessageCircle" | "Sparkles";
  title: string;
  accent: string;
  accentBg: string;
  description: string;
  includes: string[];
  price: string;
  badge?: string;
}

export const memberships: Membership[] = [
  {
    icon: "Film",
    title: "Cine y Reflexión",
    accent: "text-vc-blue",
    accentBg: "bg-vc-blue",
    description:
      "Recibe cada mes una película seleccionada y únete al foro de conversación donde compartimos lo que sentimos, pensamos y recordamos.",
    includes: [
      "Película mensual seleccionada",
      "Encuentro mensual por Zoom",
      "Foro de discusión en comunidad",
      "Acceso al grupo de WhatsApp del plan",
    ],
    price: "PLACEHOLDER: precio mensual",
  },
  {
    icon: "MessageCircle",
    title: "Caminando Juntos",
    accent: "text-vc-orange",
    accentBg: "bg-vc-orange",
    badge: "Más elegida",
    description:
      "Una Rueda de Trabajo Comunitario basada en la metodología del Dr. Adalberto Barreto. Un espacio para conversar, escuchar y crear comunidad.",
    includes: [
      "Encuentros grupales mensuales por Zoom",
      "Espacio terapéutico-educativo guiado",
      "Acceso al grupo de WhatsApp del plan",
      "Conexión con la comunidad",
    ],
    price: "PLACEHOLDER: precio mensual",
  },
  {
    icon: "Sparkles",
    title: "Salud y Bienestar",
    accent: "text-vc-blue-dark",
    accentBg: "bg-vc-blue-dark",
    description:
      "Clases mensuales con Alejandra Furman-Paz, Coach de Bienestar y Nutrición Integrativa. Aprende hábitos que funcionan para ti, sin dietas extremas.",
    includes: [
      "Clase mensual con Alejandra",
      "Sesión de preguntas y respuestas",
      "Material complementario",
      "Acceso al grupo de WhatsApp del plan",
    ],
    price: "PLACEHOLDER: precio mensual",
  },
];

export const membershipsDisclaimer =
  "Todas las membresías incluyen suscripción mensual recurrente. Te notificamos por correo y WhatsApp 7 días antes de cada cobro y puedes cancelar cuando quieras.";

export const howItWorksSteps = [
  {
    number: 1,
    title: "Elige tu plan",
    description: "Suscríbete con tu correo y método de pago seguro.",
  },
  {
    number: 2,
    title: "Te damos la bienvenida",
    description: "Recibes un mensaje con todos los datos por correo y WhatsApp.",
  },
  {
    number: 3,
    title: "Únete a la comunidad",
    description: "Te sumamos al grupo de WhatsApp del plan que elegiste.",
  },
  {
    number: 4,
    title: "Vive cada encuentro",
    description: "Recibes el link de Zoom y participas en comunidad.",
  },
];

export const teamMembers = [
  {
    name: "Alejandra Furman-Paz",
    role: "Coach de Bienestar y Nutrición Integrativa",
    quote:
      "Te voy a decir algo: yo viví 50 años engañada. A mis 55 viví una experiencia transformadora para mi cuerpo y mente.",
    image: null, // PLACEHOLDER: agregar foto
  },
  // PLACEHOLDER: más facilitadores
];

export const freeActivities = [
  {
    title: "Cine Reflexión",
    date: "Próximamente", // PLACEHOLDER: fecha próxima
    description: "Mira una película y conversa con la comunidad.",
  },
  {
    title: "Caminando Juntos",
    date: "Próximamente",
    description: "Participa en una rueda de conversación abierta.",
  },
  {
    title: "Master Class del mes",
    date: "Próximamente",
    description: "Clase especial con un invitado experto.",
  },
];

export const testimonials = [
  {
    quote:
      "Encontré un espacio donde me siento escuchada y acompañada. Cada encuentro me llena de energía.",
    name: "María G.",
    age: 68,
    country: "México",
  },
  {
    quote:
      "A mis 75 años descubrí que nunca es tarde para seguir aprendiendo y hacer nuevas amistades.",
    name: "Roberto L.",
    age: 75,
    country: "Argentina",
  },
  {
    quote:
      "Las clases de bienestar cambiaron mi forma de cuidarme. Me siento mejor que hace 10 años.",
    name: "Carmen S.",
    age: 63,
    country: "Chile",
  },
];
// [PENDIENTE: testimonios reales]

export const faqs = [
  {
    question: "¿Necesito saber usar tecnología para participar?",
    answer:
      "No te preocupes. Te guiamos paso a paso. Solo necesitas un celular o computadora con internet. Te enviamos instrucciones claras por WhatsApp y correo, y siempre hay alguien disponible para ayudarte.",
  },
  {
    question: "¿Qué pasa si me pierdo un encuentro?",
    answer:
      "Entendemos que la vida tiene imprevistos. Dependiendo del plan, algunas sesiones quedan grabadas para que las veas cuando puedas. Además, siempre puedes ponerte al día en el grupo de WhatsApp.",
  },
  {
    question: "¿Cómo puedo cancelar mi membresía?",
    answer:
      "Puedes cancelar en cualquier momento escribiéndonos por WhatsApp o correo electrónico. No hay permanencia mínima ni penalizaciones. Tu suscripción se mantiene activa hasta el final del período pagado.",
  },
  {
    question: "¿Cuáles son los métodos de pago disponibles?",
    answer:
      "Aceptamos tarjetas de crédito y débito internacionales. Próximamente habilitaremos pagos por Mercado Pago para mayor comodidad en Latinoamérica.",
  },
  {
    question: "¿Hay devoluciones?",
    answer:
      "Si no estás satisfecho con tu primer mes, contáctanos dentro de los primeros 7 días y te devolvemos el 100% de tu pago. Sin preguntas.",
  },
  {
    question: "¿Puedo cambiar de plan?",
    answer:
      "Sí, puedes cambiar de plan en cualquier momento. El cambio se aplica en tu próximo ciclo de facturación. Escríbenos por WhatsApp y te ayudamos.",
  },
  {
    question: "¿Las clases quedan grabadas?",
    answer:
      "Depende del plan. Las Master Class y clases de Salud y Bienestar quedan grabadas. Las ruedas de Caminando Juntos son en vivo para mantener la intimidad del espacio.",
  },
  {
    question: "¿Tienen invitados especiales? ¿Cómo accedo a ellos?",
    answer:
      "Sí, periódicamente invitamos a expertos y personalidades especiales. Los miembros reciben descuento exclusivo cuando hay invitados especiales. Los no-miembros pueden acceder pagando aparte.",
  },
];

export const finalCta = {
  title: "¿LISTO PARA VIVIR CRECIENDO?",
  description:
    "Únete a una comunidad que te escucha, te acompaña y celebra cada etapa de tu vida. Tu historia merece ser compartida.",
  button: "VER MEMBRESÍAS",
};
