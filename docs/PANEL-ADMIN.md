# Panel de administración — reestructuración

**5 de agosto de 2026** · continuación de [CAMBIOS-2026-08-04.md](./CAMBIOS-2026-08-04.md)

El panel había quedado desalineado con la landing nueva: seguía ofreciendo los
tres planes de membresía que el doc eliminó, y todo —listado, formulario de alta,
administradores y contraseñas— vivía apilado en un solo archivo de 658 líneas y
una sola columna angosta.

---

## 1. Qué estaba mal

| # | Problema | Consecuencia |
|---|---|---|
| 1 | El selector de plan ofrecía **Gratuita / Básica / Plus** | Contradecía la membresía única de la landing. Etiquetar una actividad como "Plus" ya no significaba nada. |
| 2 | Una sola página con **todo** (658 líneas) | Para llegar a "Administradores" había que pasar por el formulario completo de cada actividad. |
| 3 | El formulario de alta estaba **siempre desplegado** al final | 8 bloques de campos vacíos ocupando la pantalla aunque no se fuera a crear nada. |
| 4 | Formulario en **una columna** de `max-w-3xl` | Editar una actividad eran ~2.000 px de scroll, con el botón de guardar hasta abajo del todo. |
| 5 | **Eliminar** era un botón pegado a "Guardar cambios" | Un clic de más borraba la actividad sin preguntar nada. |
| 6 | Solo había mensajes de **error** | Guardar con éxito no decía nada; quedaba la duda de si se había guardado. |
| 7 | Reordenar exigía **escribir números** en "Semana" y "Orden" | Nadie sabe qué número poner sin ver el resto de la lista. |
| 8 | Sin buscador ni filtros | Con 20 actividades, encontrar una es scrollear. |
| 9 | El permiso de admin se comprobaba **solo en la página** | Cualquier vista nueva nacía sin protección, y las server actions confiaban únicamente en la RLS. |

---

## 2. Estructura nueva

Antes: un archivo. Ahora, cuatro pantallas con una barra de pestañas arriba.

```
/admin                          Listado de actividades (resumen, buscador, filtros, reordenar)
/admin/actividades/nueva        Alta
/admin/actividades/[id]         Edición + zona de eliminación
/admin/equipo                   Administradoras + restablecer contraseñas
```

```
src/app/admin/
├── layout.tsx                       ← puerta de admin + cabecera + pestañas + mensajes
├── page.tsx                         ← listado
├── actividades/nueva/page.tsx
├── actividades/[id]/page.tsx
└── equipo/page.tsx

src/components/admin/
├── ActivityForm.tsx                 ← el formulario, compartido por alta y edición
├── AdminNav.tsx                     ← pestañas (cliente: necesita usePathname)
├── Flash.tsx                        ← mensajes de ok/error, descartables
├── ui.tsx                           ← botones, campos, tarjetas — una sola definición
├── FechaPicker.tsx                  ← sin cambios de fondo, ahora usa ui.tsx
└── HoraPicker.tsx                   ← ídem

src/lib/
├── admin-auth.ts                    ← NUEVO: requireAdmin()
├── admin-actions.ts                 ← + toggleActivityActive, moveActivity
└── activities.ts                    ← taxonomía de planes reescrita
```

---

## 3. La membresía única, también acá

`ActivityPlan` pasó de `gratuita | basica | plus` a **`gratuita | membresia`**.

El selector del formulario ahora pregunta **"¿Cómo se accede?"** con tres
opciones —Sin definir / Gratuita / Membresía— y cada una explica qué significa.

**No hace falta migrar la base para que funcione.** Las filas que hoy tienen
`basica` o `plus` se traducen a `membresia` al leerlas (`normalizePlan`), así que
la etiqueta correcta aparece de entrada y el botón correcto sale premarcado. Y
como el panel guarda siempre el valor canónico, la columna se va limpiando sola
cada vez que alguien edita una actividad.

Queda pendiente —opcional, cosmético— un `UPDATE` que normalice las filas que
nadie vuelva a tocar:

```sql
update public.activities
   set plan = 'membresia'
 where lower(trim(plan)) in ('basica', 'básica', 'plus', 'paga');
```

Esto cierra el punto 7.6 de `CAMBIOS-2026-08-04.md`.

---

## 4. Qué se puede hacer ahora que antes no

- **Buscar** por título, facilitadora o fecha, sin acentos ni mayúsculas.
- **Filtrar** por visibles/ocultas y por tipo de acceso.
- **Ver el resumen** de un vistazo: total, visibles, ocultas, gratuitas.
- **Mostrar u ocultar** una actividad desde el listado, sin abrir el formulario.
- **Reordenar con flechas** ↑ ↓ en vez de adivinar números.
- **Ver en el sitio** cada actividad con un clic, para revisar cómo quedó.
- **Saber que se guardó**: cada acción responde con un mensaje verde.

### Cómo funciona el reordenar

Las flechas no intercambian dos `sort_order`: eso se rompe con empates y con el
`0` por defecto que arrastran las filas viejas. En su lugar reescriben el orden
completo como `0, 1, 2, …` sobre el mismo criterio que muestra la pantalla. Es
idempotente y deja la columna sana después del primer uso.

Las flechas **desaparecen mientras haya un filtro activo**: mover algo una
posición cuando no ves a su vecino real es la forma más rápida de desordenar
todo sin darse cuenta.

---

## 5. Decisiones de diseño

**Dos columnas.** A la izquierda lo que se *escribe* (título, descripciones,
fechas, facilitadora, qué incluye, FAQ). A la derecha, en una columna que
acompaña el scroll, lo que se *decide*: publicación, acceso, imagen, precio,
orden. El formulario pasó de ~2.000 px de alto a caber casi en una pantalla.

**Barra de guardado fija abajo.** "Guardar cambios" ya no se escapa al final del
documento; está siempre visible mientras se edita.

**Eliminar, fuera del formulario y detrás de una puerta.** Vive en su propio
bloque al pie de la pantalla de edición, dentro de un `<details>` que hay que
abrir a propósito, y el botón nombra la actividad que se va a borrar. Es HTML
puro: funciona aunque el JavaScript no haya cargado.

**El radio de plan es visible.** El anterior estaba oculto (`sr-only`) y el único
indicador de qué estaba elegido era el color del borde — insuficiente para quien
no distingue bien los tonos.

**Filtros por GET.** El buscador es un `<form method="get">`; funciona sin
JavaScript y el filtro queda en la URL, así que se puede guardar o compartir.

---

## 6. Seguridad

`requireAdmin()` vive en `src/lib/admin-auth.ts` y se llama en dos lugares:

1. En `admin/layout.tsx`, una sola vez para las cuatro pantallas. Antes el
   chequeo estaba dentro del archivo de la página, así que cualquier vista nueva
   nacía sin protección.
2. Al principio de **cada server action** (`adminClient()`). Las server actions
   son alcanzables por POST directo sin pasar por la interfaz; la RLS de la base
   ya lo cubría, pero la propia documentación de Next lo marca como requisito y
   una RLS mal configurada dejaría la puerta abierta.

---

## 7. Un efecto colateral que conviene saber

Tailwind v4 escanea **todo el repositorio** buscando clases, incluida la carpeta
`docs/`. Una clase citada dentro de un `.md` se compila igual que si estuviera en
un componente — y el ejemplo `font-[var(...)]` del documento anterior generaba
CSS inválido que tumbaba el dev server entero con un 500.

Arreglado en `globals.css` con `@source not "../../docs";`. La documentación no
es código fuente.

---

## 8. Lo que este trabajo *no* toca

- **Las actividades de la base siguen sin aparecer en la portada.** La estructura
  nueva de la landing (Parte VI del doc) no las incluye: la portada muestra el
  catálogo fijo de cuatro actividades que vive en `content.ts`. Las de la base
  solo se ven entrando a `/actividades/<id>`. El panel ahora lo dice en pantalla
  para que no haya confusión, pero **decidir si vuelven a la portada es de
  ustedes** — sigue anotado en el punto 7.4 de `CAMBIOS-2026-08-04.md`.
- Los campos de la tabla `activities` son los mismos; no se agregó ni quitó
  ninguna columna.
- `week` sigue existiendo como campo editable, aunque el listado ya ordena por
  posición. Si no lo usan, se puede retirar.

---

## 9. Verificación

- `npx tsc --noEmit` — sin errores.
- `npm run build` — compila, 23/23 páginas, las cuatro rutas de `/admin` presentes.
- `npx eslint src` — cero problemas en los archivos del panel (los 8 errores que
  quedan son previos, en `talleres/`, `membresias/` y `actividades/[id]`).
- Rutas probadas sin sesión: las cuatro responden `307` hacia `/login`.
- Formulario renderizado con una actividad de prueba con `plan: "plus"`: el radio
  que sale marcado es **Membresía**, confirmando la traducción de los valores
  heredados.
