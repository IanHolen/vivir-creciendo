-- Datos estructurados para "Agregar a mi calendario" (.ics / Google Calendar).
-- Proyecto Supabase: Vivir-Creciendo (nxyshvdamlezprlazzsf). YA APLICADA el 29-oct-2026.
--
-- `fecha` y `hora` siguen siendo texto libre para mostrar; estos campos son
-- los que entiende un calendario. Todos opcionales: sin cal_inicio no se
-- ofrece agregar al calendario. Es aditiva: no borra ni cambia datos.
alter table public.activities
  add column if not exists cal_inicio timestamp without time zone,
  add column if not exists cal_zona text not null default 'America/Mexico_City',
  add column if not exists cal_duracion_min integer
    check (cal_duracion_min is null or cal_duracion_min between 5 and 1440),
  add column if not exists cal_repeticion text not null default 'unica'
    check (cal_repeticion in ('unica', 'semanal', 'mensual'));

comment on column public.activities.cal_inicio is 'Primera sesión, hora local de cal_zona (sin zona).';
comment on column public.activities.cal_zona is 'Zona horaria IANA de cal_inicio.';
comment on column public.activities.cal_repeticion is 'unica | semanal | mensual (mismo n-ésimo día de la semana).';

-- Cambia el tipo de retorno: hay que recrear la función.
begin;
drop function if exists public.get_activities();
create function public.get_activities()
 returns table(id uuid, title text, short_preview text, full_description text, week integer, sort_order integer, image_url text, fecha text, hora text, modalidad text, duracion text, frecuencia text, icono text, facilitador text, facilitador_rol text, publico_objetivo text, precio text, precio_nota text, beneficios text, enlace_inscripcion text, faq text, plan text, cal_inicio timestamp without time zone, cal_zona text, cal_duracion_min integer, cal_repeticion text)
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select
    a.id,
    a.title,
    a.short_preview,
    case when auth.uid() is not null then a.full_description else null end,
    a.week,
    a.sort_order,
    a.image_url,
    a.fecha,
    a.hora,
    a.modalidad,
    a.duracion,
    a.frecuencia,
    a.icono,
    a.facilitador,
    a.facilitador_rol,
    a.publico_objetivo,
    a.precio,
    a.precio_nota,
    a.beneficios,
    a.enlace_inscripcion,
    a.faq,
    a.plan,
    a.cal_inicio,
    a.cal_zona,
    a.cal_duracion_min,
    a.cal_repeticion
  from public.activities a
  where a.is_active = true
  order by a.sort_order asc, a.week asc nulls last, a.created_at asc;
$function$;
grant execute on function public.get_activities() to anon, authenticated;
commit;
