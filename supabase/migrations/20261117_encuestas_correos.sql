-- Encuesta post-actividad y registro de correos automáticos (fundadoras, 17-nov-2026).
create table if not exists public.encuestas (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id uuid references public.activities(id) on delete set null,
  activity_title text not null,
  enviada_at timestamptz not null default now(),
  respondida_at timestamptz,
  calificacion smallint check (calificacion between 1 and 5),
  comentario text,
  permite_publicar boolean not null default false,
  nombre_publico text,
  ciudad text,
  voz_id uuid references public.voces(id) on delete set null,
  created_at timestamptz not null default now()
);
comment on table public.encuestas is 'Encuesta que se manda por correo después de una actividad; la respuesta puede convertirse en una voz del carrusel.';
alter table public.encuestas enable row level security;
create policy encuestas_admin_select on public.encuestas for select using (is_admin());
create policy encuestas_admin_update on public.encuestas for update using (is_admin()) with check (is_admin());
-- La página pública /encuesta/[token] y el cron escriben con la clave de servicio.

create table if not exists public.correos_enviados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('bienvenida','encuesta','invitacion')),
  referencia text not null,
  enviado_at timestamptz not null default now(),
  unique (user_id, tipo, referencia)
);
comment on table public.correos_enviados is 'Qué correo automático se mandó a quién y por qué motivo; evita duplicados.';
alter table public.correos_enviados enable row level security;
create policy correos_admin_select on public.correos_enviados for select using (is_admin());
