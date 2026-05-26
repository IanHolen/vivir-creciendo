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
  { label: "Membresía", href: "#membresias" },
  { label: "Cursos y Talleres", href: "#cursos" },
  { label: "Actividades", href: "#actividades" },
  { label: "Contacto", href: "#contacto" },
];

export const heroContent = {
  title: "BIENVENIDAS Y BIENVENIDOS A LA COMUNIDAD VIVIR CRECIENDO",
  subtitle: "Comunidad online +60 que crece, comparte y se acompaña",
  description:
    "Conversamos, aprendemos y compartimos experiencias. Un espacio cálido donde tu voz importa y tu historia merece ser contada.",
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

export const membershipInfo = {
  title: "ÚNETE A LA COMUNIDAD",
  subtitle: "Una membresía, acceso a todo",
  description:
    "Con tu membresía mensual accedes a todos los programas, contenido exclusivo y una comunidad que te acompaña.",
  benefits: [
    "Acceso a todos los programas: Cine y Reflexión, Caminando Juntos, Salud y Bienestar",
    "Encuentros grupales mensuales por Zoom",
    "Grupo exclusivo de WhatsApp de la comunidad",
    "Grabaciones de clases y Master Class",
    "Descuento en invitados especiales y cursos",
    "Cancela cuando quieras, sin permanencia mínima",
  ],
  price: "PLACEHOLDER: precio mensual",
  cta: "SUSCRIBIRME AHORA",
  disclaimer:
    "Suscripción mensual recurrente. Te notificamos 7 días antes de cada cobro y puedes cancelar cuando quieras.",
};

export interface Program {
  icon: "Film" | "MessageCircle" | "Sparkles";
  title: string;
  description: string;
  freeForAll: boolean;
}

export const programs: Program[] = [
  {
    icon: "Film",
    title: "Cine y Reflexión",
    description:
      "Cada mes una película seleccionada y un foro de conversación donde compartimos lo que sentimos, pensamos y recordamos.",
    freeForAll: true,
  },
  {
    icon: "MessageCircle",
    title: "Caminando Juntos",
    description:
      "Rueda de Trabajo Comunitario basada en la metodología del Dr. Adalberto Barreto. Un espacio para conversar, escuchar y crear comunidad.",
    freeForAll: true,
  },
  {
    icon: "Sparkles",
    title: "Salud y Bienestar",
    description:
      "Clases con Alejandra Furman-Paz, Coach de Bienestar y Nutrición Integrativa. Hábitos que funcionan para ti, sin dietas extremas.",
    freeForAll: true,
  },
];


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
    title: "Deseo, conexión y ternura: resignificando la sexualidad después de los 60",
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
  {
    name: "Ivonne Hodara",
    role: "Psicóloga — Brain Gym\u00AE",
    quote: null,
    image: null, // PLACEHOLDER: agregar foto
  },
  // PLACEHOLDER: más facilitadores
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
    description: "Nutrición y bienestar después de los 60. Únete al grupo de WhatsApp para recibir el link.",
    category: "Nutrición y Bienestar",
  },
  {
    title: "Caminando Juntos — Formando Comunidad",
    date: "Miércoles 22 de abril",
    time: "4:00 PM México / 7:00 PM Argentina / 6:00 PM Chile",
    description: "Un espacio para conversar, escuchar y crear comunidad.",
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
    description: "Ejercicios prácticos para activar el cerebro con la psicóloga Ivonne Hodara.",
    category: "Taller",
  },
  // PLACEHOLDER: agregar más actividades pasadas
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
    excerpt: "Historias y reflexiones escritas por los miembros de nuestra comunidad.",
    url: "https://vivircreciendo.com/blog/",
  },
  {
    title: "Volver al cuerpo: Aprende a escuchar sus señales",
    excerpt: "Cómo reconectar con tu cuerpo y entender lo que te dice.",
    url: "https://vivircreciendo.com/blog/",
  },
  {
    title: "Ubuntu: Yo soy porque nosotros somos",
    excerpt: "La filosofía africana que inspira nuestra forma de hacer comunidad.",
    url: "https://vivircreciendo.com/blog/",
  },
];

export const newsletterContent = {
  title: "MANTENTE AL DÍA",
  description:
    "Recibe información periódica de nuestras actividades y contenidos.",
  consent:
    "Acepto recibir correos quincenales o mensuales e ingresar al grupo de WhatsApp.",
};

export const finalCta = {
  title: "¿LISTO PARA VIVIR CRECIENDO?",
  description:
    "Únete a una comunidad que te escucha, te acompaña y celebra cada etapa de tu vida. Tu historia merece ser compartida.",
  button: "VER MEMBRESÍAS",
};
