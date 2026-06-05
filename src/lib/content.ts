export const siteConfig = {
  name: "Vivir Creciendo",
  tagline: "Comunidad +60",
  email: "contacto@vivircreciendo.com",
  whatsapp: "+52 1 55 0000 0000", // PLACEHOLDER
  social: {
    facebook: "https://facebook.com/vivircreciendo",
    instagram: "https://instagram.com/vivir_creciendo",
    youtube: "https://youtube.com/@VivirCreciendoComunidad",
  },
};

export const navLinks = [
  { label: "Quiénes somos", href: "#quienes-somos" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Actividades", href: "#actividades" },
  { label: "Membresías", href: "#membresias" },
];

export const heroContent = {
  title: "SEGUIR CRECIENDO TAMBIÉN ES PARTE DE ENVEJECER",
  subtitle: "Una comunidad para vivir esta etapa con propósito y conexión",
  description:
    "Somos una comunidad online en español para personas mayores de 65 años. Conversamos, aprendemos y compartimos experiencias. Porque la vida no se detiene a los 65.",
  ctaPrimary: "CONOCE NUESTRAS MEMBRESÍAS",
  ctaSecondary: "Conoce nuestras actividades",
};

export const quienesSomos = {
  title: "QUIÉNES SOMOS",
  lead: "Una comunidad para vivir esta etapa con propósito y conexión.",
  paragraphs: [
    "Vivir Creciendo es una comunidad online diseñada para personas mayores de 65 años que desean vivir esta etapa de la vida con propósito, conexión y crecimiento continuo.",
    "Creemos que envejecer no significa detenerse, sino abrir nuevas posibilidades de aprendizaje, reflexión, vínculo y participación.",
    "Ofrecemos experiencias semanales que combinan conversaciones con expertos, reflexión sobre películas y temas culturales, talleres de aprendizaje, espacios de intercambio y grupos de pares que estimulan la mente, fortalecen los vínculos y enriquecen la vida cotidiana.",
    "Nuestra propuesta busca acompañar a las personas a cultivar relaciones humanas profundas, desarrollar confianza, mantener la curiosidad viva y seguir construyendo un rol protagonista en su propia historia de vida.",
    "Vivir Creciendo es una comunidad virtual, participativa y cercana, donde cada persona puede sentirse escuchada, acompañada y parte de algo significativo.",
    "Sin importar dónde viva o las limitaciones físicas que pueda tener, cada integrante puede acceder desde la comodidad de su hogar a encuentros que promueven bienestar emocional, conexión humana, creatividad y sentido de comunidad.",
    "Nos une la convicción de que siempre es posible seguir creciendo.",
  ],
  highlights: [
    "Nunca es tarde para aprender, compartir y transformarse.",
    "Más que actividades online, construimos comunidad.",
    "Un espacio para seguir pensando, sintiendo y creando junto a otros.",
  ],
};

export const emotionalQuestions = [
  "¿Sientes que esta etapa pide algo distinto, pero no sabes qué?",
  "¿Te gustaría conversar con personas que estén viviendo lo mismo?",
  "¿Buscas un espacio para seguir aprendiendo, sin sentirte fuera de lugar?",
];

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
    facilitator: "Nurit Mileris",
    facilitatorBio:
      "Psicoterapeuta con más de 30 años de experiencia. Cofundadora de Vivir Creciendo.",
    closingQuote: "Comunidad, humor y emoción.",
    price: "PLACEHOLDER USD/mes",
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
      "Espacio terapéutico-educativo guiado por Nurit Mileris",
      "Grupo de WhatsApp exclusivo",
      "Material complementario",
    ],
    facilitator: "Nurit Mileris",
    facilitatorBio:
      "Psicoterapeuta con más de 30 años de experiencia. Cofundadora de Vivir Creciendo. Formada en Terapia Comunitaria Integrativa.",
    closingQuote: "Ninguna de nuestras historias se escribe en soledad.",
    price: "PLACEHOLDER USD/mes",
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
    price: "PLACEHOLDER USD/mes",
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

export interface MembershipTier {
  name: string;
  kind: "gratis" | "paga";
  tagline: string;
  activities: string[];
  extras: string[];
  badge?: string;
  featured?: boolean;
  // Vista logueada — contenido completo
  priceLabel: string; // PLACEHOLDER: precios pendientes de Ian
  fullDescription: string;
}

export const membershipTiers: MembershipTier[] = [
  {
    name: "Gratis",
    kind: "gratis",
    tagline: "Una actividad gratuita para conocernos, sin compromiso.",
    activities: ["1 actividad gratuita al mes"],
    extras: [],
    priceLabel: "Sin costo",
    fullDescription:
      "Una puerta de entrada a la comunidad: participá de una actividad gratuita al mes y viví en primera persona cómo conversamos, aprendemos y nos acompañamos. Ideal para conocernos antes de dar el siguiente paso.",
  },
  {
    name: "Básica",
    kind: "paga",
    tagline: "Tres espacios para conversar, reflexionar y cuidarte.",
    activities: [
      "Cine reflexión",
      "Caminemos juntos",
      "Salud y bienestar",
    ],
    extras: ["Incluye la actividad gratuita", "Acceso a YouTube"],
    priceLabel: "Precio por confirmar",
    fullDescription:
      "Acceso mensual a nuestras tres actividades fundamentales — Cine reflexión, Caminemos juntos y Salud y bienestar — más la actividad gratuita y el acceso a nuestro canal de YouTube. Una rutina semanal de encuentros que estimulan la mente, cuidan el cuerpo y fortalecen los vínculos.",
  },
  {
    name: "Plus",
    kind: "paga",
    tagline: "La experiencia completa de la comunidad.",
    activities: [
      "Cine reflexión",
      "Caminemos juntos",
      "Salud y bienestar",
      "Círculo cultural",
      "1 plática con foro",
    ],
    extras: ["Incluye la actividad gratuita", "Acceso a YouTube"],
    badge: "Más completa",
    featured: true,
    priceLabel: "Precio por confirmar",
    fullDescription:
      "La membresía más completa: todo lo de Básica más el Círculo cultural y una plática mensual con foro de intercambio. Cinco actividades pensadas para quienes quieren vivir la comunidad a pleno, con más espacios de aprendizaje, cultura y conversación profunda.",
  },
];

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
    facilitator: "Nurit Mileris",
    preview:
      "Vemos juntos una película que conmueve y la conversamos por Zoom.",
    description:
      "Cada mes vemos una película que toca temas profundamente humanos y nos reunimos por Zoom para conversar sobre lo que sentimos, pensamos y recordamos. No hace falta saber de cine: lo que importa es tu mirada.",
    cadence: "Mensual · Zoom",
  },
  {
    title: "Caminemos Juntos",
    facilitator: "Nurit Mileris",
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
  author: "Nurit Mileris, cofundadora",
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
  image: string | null;
  cofounder: boolean;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Alejandra Furman-Paz",
    role: "Coach de Bienestar y Nutrición Integrativa. Cofundadora.",
    quote:
      "Te voy a decir algo: yo viví 50 años engañada. A mis 55 viví una experiencia transformadora para mi cuerpo y mente.",
    image: null, // PLACEHOLDER: agregar foto
    cofounder: true,
  },
  {
    name: "Nurit Mileris",
    role: "Psicoterapeuta con más de 30 años de experiencia. Cofundadora.",
    quote:
      "Vivir Creciendo es una comunidad que sostiene, que transforma, que legitima.",
    image: null, // PLACEHOLDER: agregar foto
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

export const testimonials = [
  {
    quote:
      "En Vivir Creciendo encontré un grupo tan contenedor, tan agradable que espero con gusto los miércoles para reunirnos.",
    name: "Virginia Estela Cohan",
    age: 82,
    country: "México",
  },
  {
    quote:
      "Ya no pongan a los viejos a jugar lotería, enséñenles a bailar",
    name: "Participante",
    age: null,
    country: "Congreso Latinoamericano de Prácticas Narrativas",
  },
  {
    quote:
      "Elijo creer que mi vejez será como un papel por escribir, por explorar y honrar",
    name: "Participante",
    age: null,
    country: "Congreso Latinoamericano de Prácticas Narrativas",
  },
];

export const faqs = [
  {
    question: "¿Necesito saber usar tecnología para participar?",
    answer:
      "No te preocupes. Te guiamos paso a paso. Solo necesitas un celular o computadora con internet. Te enviamos instrucciones claras por WhatsApp y correo.",
  },
  {
    question: "¿Cómo puedo cancelar mi membresía?",
    answer:
      "Puedes cancelar en cualquier momento escribiéndonos por WhatsApp o correo electrónico. No hay permanencia mínima ni penalizaciones.",
  },
  {
    question: "¿Cuáles son los métodos de pago disponibles?",
    answer:
      "Aceptamos tarjetas de crédito y débito internacionales. Próximamente habilitaremos pagos por Mercado Pago para mayor comodidad en Latinoamérica.",
  },
  {
    question: "¿Las clases quedan grabadas?",
    answer:
      "Las Master Class y clases de Salud y Bienestar quedan grabadas. Las ruedas de Caminando Juntos son en vivo para mantener la intimidad del espacio.",
  },
  {
    question: "¿Tienen invitados especiales?",
    answer:
      "Sí, periódicamente invitamos a expertos. Los miembros reciben descuento exclusivo. Los no-miembros pueden acceder pagando aparte.",
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

export const finalCta = {
  title: "¿LISTO PARA VIVIR CRECIENDO?",
  description:
    "Únete a una comunidad que te escucha, te acompaña y celebra cada etapa de tu vida. Tu historia merece ser compartida.",
  button: "VER MEMBRESÍAS",
};

export const footerText =
  "Vivir Creciendo Comunidad +60 © 2026. Hecho con cariño en México, Uruguay y para todo el mundo de habla hispana.";
