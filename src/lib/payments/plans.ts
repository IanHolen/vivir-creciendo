/**
 * Los dos planes de la membresía única, en un solo lugar.
 *
 * Los precios en USD son los que ya publica la landing (`membershipPlans` en
 * content.ts): $30/mes y $270/año. PayPal cobra en USD tal cual. Mercado Pago
 * Argentina solo cobra en pesos, así que ese monto sale de variables de
 * entorno (MP_PRECIO_MENSUAL_ARS / MP_PRECIO_ANUAL_ARS) y lo mantienen las
 * fundadoras según el tipo de cambio.
 *
 * PERIODO DE PRUEBA (documento de las fundadoras, nov-2026): los primeros
 * 30 días son gratis en los dos planes y con los dos proveedores. En PayPal
 * es un ciclo TRIAL de 30 días a USD 0 dentro del plan; en Mercado Pago es
 * `auto_recurring.free_trial`. El acceso se otorga al activarse la
 * suscripción (el primer cobro llega el día 31) y, si la socia cancela antes,
 * no se cobra nada y conserva el acceso hasta el fin de los 30 días.
 *
 * Módulo puro: lo importan componentes de cliente y de servidor.
 */
export const TRIAL_DIAS = 30;

/**
 * PRE-INSCRIPCIÓN (fundadoras, 17-nov-2026): quien se suscriba hasta el 31 de
 * diciembre de 2026 no paga nada hasta el 1 de febrero de 2027. En PayPal se
 * logra con un plan SIN trial y `start_time` = 1-feb; en Mercado Pago con
 * `auto_recurring.start_date`. Pasada la fecha límite, vuelve el trial normal
 * de 30 días. Para cambiar la campaña, basta con editar estas dos fechas.
 */
export const PREINSCRIPCION = {
  /** Último instante en que aplica (fin del 31-dic en Argentina/Uruguay, UTC-3). */
  hasta: new Date("2027-01-01T02:59:59.000Z"),
  /** Primer cobro para quien se pre-inscribe (1-feb-2027, 10:00 UTC). */
  primerCobro: new Date("2027-02-01T10:00:00.000Z"),
};

export function enPreinscripcion(ahora: Date = new Date()): boolean {
  return ahora.getTime() <= PREINSCRIPCION.hasta.getTime();
}

/** Fecha del primer cobro si alguien se suscribe en `desde`. */
export function fechaPrimerCobro(desde: Date = new Date()): Date {
  if (enPreinscripcion(desde)) return new Date(PREINSCRIPCION.primerCobro);
  const d = new Date(desde);
  d.setDate(d.getDate() + TRIAL_DIAS);
  return d;
}

/** Texto corto para la fecha del primer cobro. */
export function fechaLarga(d: Date): string {
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}
export type PlanKey = "mensual" | "anual";
export type Provider = "paypal" | "mercadopago";

export interface Plan {
  key: PlanKey;
  nombre: string;
  /** Precio en USD (PayPal). */
  usd: number;
  usdLabel: string;
  /** Cuántos meses cubre cada cobro. */
  meses: number;
  nota: string;
}

export const PLANES: Record<PlanKey, Plan> = {
  mensual: {
    key: "mensual",
    nombre: "Mensual",
    usd: 30,
    usdLabel: "$30 USD / mes",
    meses: 1,
    nota: "Los primeros 30 días son gratis. Después se renueva cada mes. Cancelas cuando quieras.",
  },
  anual: {
    key: "anual",
    nombre: "Anual",
    usd: 270,
    usdLabel: "$270 USD / año",
    meses: 12,
    nota: "Los primeros 30 días son gratis. Equivale a 9 meses: 3 meses gratis.",
  },
};

export function isPlanKey(v: unknown): v is PlanKey {
  return v === "mensual" || v === "anual";
}

export function isProvider(v: unknown): v is Provider {
  return v === "paypal" || v === "mercadopago";
}

export const PROVIDER_LABEL: Record<Provider, string> = {
  paypal: "PayPal",
  mercadopago: "Mercado Pago",
};
