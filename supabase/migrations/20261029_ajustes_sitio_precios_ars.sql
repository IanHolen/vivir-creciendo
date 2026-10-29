-- Ajustes editables desde /admin (hoy: precios en pesos de Mercado Pago).
-- Aplicada en el proyecto nxyshvdamlezprlazzsf el 29-oct-2026.
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
comment on table public.site_settings is 'Ajustes del sitio que editan las administradoras (clave/valor).';
alter table public.site_settings enable row level security;
-- Lectura pública: los precios se muestran en /membresia sin sesión.
create policy site_settings_select_all on public.site_settings for select using (true);
create policy site_settings_insert_admin on public.site_settings for insert with check (is_admin());
create policy site_settings_update_admin on public.site_settings for update using (is_admin()) with check (is_admin());
-- Sin DELETE para nadie desde la API.
