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
  { label: "Membresías", href: "#membresias" },
  { label: "Cursos y Talleres", href: "#cursos" },
  { label: "Actividades", href: "#actividades" },
  { label: "Contacto", href: "#contacto" },
];

export const heroContent = {
  title: "TU HISTORIA CONTINÚA",
  subtitle: "con protagonismo, transformación y trascendencia",
  description:
    "Somos una comunidad online en español para personas mayores de 60 años. Conversamos, aprendemos y compartimos experiencias. Ninguna de nuestras historias se escribe en soledad.",
  ctaPrimary: "CONOCE NUESTRAS MEMBRESÍAS",
  ctaSecondary: "Vive una actividad gratis",
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
  title: string;
  description: string;
  dates: string;
  time: string;
  instructor?: string;
  format: string;
  price?: string;
}

export const courses: Course[] = [
  {
    title:
      "Deseo, conexión y ternura: resignificando la sexualidad después de los 60",
    description:
      "Un taller para explorar y resignificar la sexualidad en esta etapa de la vida, con apertura y respeto.",
    dates: "Miércoles 16, 23 y 30 de julio",
    time: "10:00 AM (CDMX)",
    format: "100% online vía Zoom",
  },
  {
    title: "Tranquilidad Financiera para mayores de 60",
    description:
      "3 sesiones grupales para ordenar tus finanzas y vivir con más tranquilidad.",
    dates: "11, 18 y 25 de junio",
    time: "Horario por confirmar",
    format: "Online",
  },
  {
    title: "Activa tu Cerebro con Brain Gym\u00AE",
    description:
      "Ejercicios prácticos para mantener la mente activa y mejorar la coordinación, con la psicóloga Ivonne Hodara.",
    dates: "Desde el miércoles 12 de marzo",
    time: "Horarios ajustados por país",
    instructor: "Psicóloga Ivonne Hodara",
    format: "Online vía Zoom",
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
