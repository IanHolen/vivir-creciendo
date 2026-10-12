"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Pencil,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  GripVertical,
  CalendarDays,
  ImageOff,
} from "lucide-react";
import {
  toggleActivityActive,
  moveActivity,
  reorderActivities,
} from "@/lib/admin-actions";

/**
 * Lo mínimo que necesita pintar una fila. Serializable: cruza a cliente.
 *
 * El badge del plan viene ya resuelto (`planLabel` / `planBadgeClass`) en vez
 * de llamar acá a `planMeta`: `@/lib/activities` importa el cliente Supabase
 * de servidor, y basta con nombrarlo desde un componente "use client" para que
 * el bundler intente llevarse `next/headers` al navegador y el build falle.
 */
export interface ActivityRow {
  id: string;
  title: string;
  is_active: boolean;
  image_url: string | null;
  fecha: string | null;
  hora: string | null;
  facilitador: string | null;
  planLabel: string | null;
  planBadgeClass: string | null;
}

/**
 * Listado de actividades del panel, con arrastrar-y-soltar para reordenar.
 *
 * LAS FLECHAS ↑↓ SE QUEDAN, y no como reserva: el panel lo usan personas de
 * 65+, y sostener el botón mientras se apunta a un destino es justo el gesto
 * que peor les funciona. Arrastrar es el atajo para quien puede; las flechas
 * (y el teclado, vía el mismo tirador) son el camino que siempre funciona.
 *
 * Mientras haya filtros activos no se puede reordenar por ninguna de las dos
 * vías: el orden es global y mover algo respecto de una lista recortada es la
 * forma más rápida de desordenar todo.
 */
export default function ActivityList({
  rows,
  total,
  filtering,
}: {
  rows: ActivityRow[];
  /** Cuántas actividades hay en total (sin filtrar), para topar las flechas. */
  total: number;
  filtering: boolean;
}) {
  // El servidor manda: cada vez que llega un orden nuevo (tras guardar), se
  // pisa el estado local. Entre medio, el estado local sostiene la vista
  // optimista mientras la server action viaja.
  const signature = rows.map((r) => r.id).join("|");
  const [prevSignature, setPrevSignature] = useState(signature);
  const [items, setItems] = useState(rows);
  if (prevSignature !== signature) {
    setPrevSignature(signature);
    setItems(rows);
  }

  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    // 8px de tolerancia: sin esto, un clic con un temblor mínimo sobre el
    // tirador se interpreta como arrastre y la fila "salta" sin querer.
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    if (from === -1 || to === -1) return;

    const next = arrayMove(items, from, to);
    setItems(next);
    startTransition(() => {
      reorderActivities(next.map((i) => i.id));
    });
  }

  const list = (
    <ul className={`mt-6 space-y-3 ${isPending ? "opacity-70" : ""}`}>
      {items.map((a, i) => (
        <Row
          key={a.id}
          activity={a}
          position={i}
          total={total}
          sortable={!filtering}
        />
      ))}
    </ul>
  );

  if (filtering) return list;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) =>
            `Moviendo ${String(active.data.current?.title ?? "la actividad")}.`,
          onDragOver: ({ active, over }) =>
            over
              ? `${String(active.data.current?.title ?? "La actividad")} sobre la posición ${
                  items.findIndex((i) => i.id === over.id) + 1
                }.`
              : "",
          onDragEnd: ({ active, over }) =>
            over
              ? `${String(active.data.current?.title ?? "La actividad")} quedó en la posición ${
                  items.findIndex((i) => i.id === over.id) + 1
                }.`
              : "Movimiento cancelado.",
          onDragCancel: () => "Movimiento cancelado. Nada cambió.",
        },
      }}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {list}
      </SortableContext>
    </DndContext>
  );
}

function Row({
  activity: a,
  position,
  total,
  sortable,
}: {
  activity: ActivityRow;
  position: number;
  total: number;
  sortable: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: a.id,
    disabled: !sortable,
    data: { title: a.title },
  });

  return (
    <li
      ref={setNodeRef}
      // translate3d a mano en vez de `CSS.Transform` de @dnd-kit/utilities:
      // ese paquete solo llega acá como dependencia transitiva y no está en
      // nuestro package.json. Con el eje restringido a vertical no hay escala
      // que aplicar, así que la traslación es todo lo que hace falta.
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className={`bg-white rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
        a.is_active ? "border-vc-cream" : "border-dashed border-vc-ink/20"
      } ${isDragging ? "relative z-10 shadow-xl ring-2 ring-vc-blue" : ""}`}
    >
      {/* Reordenar: tirador para arrastrar + flechas de a una posición */}
      {sortable && (
        <div className="flex sm:flex-col items-center gap-1 shrink-0 order-last sm:order-first">
          <button
            ref={setActivatorNodeRef}
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Arrastrar "${a.title}" para reordenar`}
            title="Arrastrar para reordenar"
            className="flex items-center justify-center w-11 h-9 rounded-lg border border-vc-cream text-vc-ink/60 hover:border-vc-blue hover:text-vc-blue cursor-grab touch-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vc-blue/30"
          >
            <GripVertical className="w-5 h-5" aria-hidden="true" />
          </button>
          <MoveButton
            id={a.id}
            dir="up"
            disabled={position === 0}
            title={a.title}
          />
          <MoveButton
            id={a.id}
            dir="down"
            disabled={position === total - 1}
            title={a.title}
          />
        </div>
      )}

      {/* Miniatura */}
      <div className="shrink-0 w-24 h-[4.5rem] rounded-xl overflow-hidden bg-vc-cream flex items-center justify-center">
        {a.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageOff className="w-6 h-6 text-vc-ink/25" aria-hidden="true" />
        )}
      </div>

      {/* Datos */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/actividades/${a.id}`}
            className="text-xl font-bold text-vc-blue-dark hover:text-vc-orange"
          >
            {a.title}
          </Link>
          {a.planLabel && (
            <span
              className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${a.planBadgeClass ?? ""}`}
            >
              {a.planLabel}
            </span>
          )}
          {!a.is_active && (
            <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-vc-ink/10 text-vc-ink/70">
              Oculta
            </span>
          )}
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-vc-ink/60">
          {a.fecha ? (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" aria-hidden="true" />
              {a.fecha}
              {a.hora ? ` · ${a.hora}` : ""}
            </span>
          ) : (
            <span className="text-vc-orange-dark">Sin fecha</span>
          )}
          {a.facilitador && <span>{a.facilitador}</span>}
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <form action={toggleActivityActive}>
          <input type="hidden" name="id" value={a.id} />
          <input
            type="hidden"
            name="next"
            value={a.is_active ? "false" : "true"}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border-2 border-vc-cream text-vc-ink hover:border-vc-blue hover:text-vc-blue font-semibold"
          >
            {a.is_active ? (
              <>
                <EyeOff className="w-5 h-5" aria-hidden="true" />
                Ocultar
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" aria-hidden="true" />
                Mostrar
              </>
            )}
          </button>
        </form>
        <Link
          href={`/actividades/${a.id}`}
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border-2 border-vc-cream text-vc-ink hover:border-vc-blue hover:text-vc-blue"
          aria-label={`Ver "${a.title}" en el sitio`}
          title="Ver en el sitio"
        >
          <ExternalLink className="w-5 h-5" aria-hidden="true" />
        </Link>
        <Link
          href={`/admin/actividades/${a.id}`}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-vc-orange-dark hover:bg-vc-orange text-white font-semibold"
        >
          <Pencil className="w-5 h-5" aria-hidden="true" />
          Editar
        </Link>
      </div>
    </li>
  );
}

/** Flecha de reordenar. Deshabilitada en los extremos en vez de desaparecer. */
function MoveButton({
  id,
  dir,
  disabled,
  title,
}: {
  id: string;
  dir: "up" | "down";
  disabled: boolean;
  title: string;
}) {
  const Icon = dir === "up" ? ChevronUp : ChevronDown;
  return (
    <form action={moveActivity}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={`${dir === "up" ? "Subir" : "Bajar"} "${title}"`}
        className="flex items-center justify-center w-11 h-9 rounded-lg border border-vc-cream text-vc-ink/60 hover:border-vc-blue hover:text-vc-blue disabled:opacity-30 disabled:hover:border-vc-cream disabled:hover:text-vc-ink/60 disabled:cursor-not-allowed"
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </button>
    </form>
  );
}
