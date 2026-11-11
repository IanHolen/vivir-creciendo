-- Landing según el documento "El orden en que debe aparecer la información"
-- (fundadoras, nov-2026). Aplicada en nxyshvdamlezprlazzsf el 11-nov-2026.
-- Foto pequeña en cada testimonio del carrusel (punto 6 del documento).
alter table public.voces
  add column if not exists foto_media_id uuid references public.media_assets(id) on delete set null;
comment on column public.voces.foto_media_id is 'Foto pequeña de la persona (biblioteca de /admin/multimedia). Opcional.';
-- El link de YouTube del video de las fundadoras vive en site_settings
-- (clave video_youtube_url); no necesita columna nueva.
