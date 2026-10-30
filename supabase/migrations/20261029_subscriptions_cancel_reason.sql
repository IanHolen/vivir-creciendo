-- Motivo de cierre de una suscripción. Hoy solo 'duplicada': la cerró
-- cerrarDuplicadas() (src/lib/payments/access.ts) porque la misma persona ya
-- tenía otra activa. Sus cobros quedan en subscription_payments con
-- status 'duplicado' (no cuentan para paid_until) y /admin/suscripciones los
-- lista para reembolsar. Aditiva: no cambia datos existentes.
-- Proyecto Supabase: Vivir-Creciendo (nxyshvdamlezprlazzsf).
alter table public.subscriptions
  add column if not exists cancel_reason text;

comment on column public.subscriptions.cancel_reason is
  'Motivo de cierre. duplicada = otra suscripción de la misma persona ya estaba activa.';

-- my_subscription() devolvía la fila más reciente, que tras cerrar una
-- duplicada es justamente la cerrada: /perfil mostraría "cancelada" a una
-- socia con la membresía activa. Las duplicadas van al final del orden.
-- El acceso no cambia: sync_membership_from_subscriptions() y has_membership()
-- no miran cancel_reason (la ganadora sigue ACTIVE y su paid_until intacto).
create or replace function public.my_subscription()
 returns jsonb
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select to_jsonb(s) - 'raw'
    from public.subscriptions s
   where s.user_id = auth.uid()
   order by (s.cancel_reason is not distinct from 'duplicada'), s.created_at desc
   limit 1;
$function$;
