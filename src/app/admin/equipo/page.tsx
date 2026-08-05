import { ShieldCheck, KeyRound, UserPlus, Info } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { setAdmin, adminResetPassword } from "@/lib/admin-actions";
import {
  Card,
  Field,
  TextInput,
  btnPrimary,
  btnBlue,
  hintClass,
} from "@/components/admin/ui";

export const metadata = {
  title: "Equipo y accesos — Panel de Vivir Creciendo",
};

export default async function EquipoPage() {
  const { supabase, user } = await requireAdmin();

  const { data } = await supabase.rpc("list_admins");
  const admins = (data ?? []) as { id: string; email: string }[];

  return (
    <>
      <div className="mb-6">
        <h2 className="font-(family-name:--font-display) text-2xl md:text-3xl font-black text-vc-blue-dark uppercase tracking-tight">
          Equipo y accesos
        </h2>
        <p className="mt-1 text-base text-vc-ink/60">
          Quién puede entrar a este panel y cómo ayudar a alguien que perdió su
          contraseña.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card
          icon={ShieldCheck}
          title="Administradoras"
          hint="Ven y editan todo el contenido del sitio."
        >
          <ul className="divide-y divide-vc-cream">
            {admins.map((admin) => {
              const esTu = admin.id === user.id;
              return (
                <li
                  key={admin.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="min-w-0">
                    <span className="block text-lg text-vc-ink break-all">
                      {admin.email}
                    </span>
                    {esTu && (
                      <span className="text-sm text-vc-ink/50">
                        Tu propia cuenta
                      </span>
                    )}
                  </span>
                  {!esTu && (
                    <form action={setAdmin} className="shrink-0">
                      <input type="hidden" name="email" value={admin.email} />
                      <input type="hidden" name="is_admin" value="false" />
                      <button
                        type="submit"
                        className="min-h-[44px] px-4 py-2 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold rounded-xl"
                      >
                        Quitar acceso
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>

          <form action={setAdmin} className="mt-6 pt-6 border-t border-vc-cream">
            <Field
              label="Agregar administradora"
              hint="La persona ya tiene que haberse registrado en el sitio."
            >
              <TextInput
                name="email"
                type="email"
                required
                placeholder="correo@ejemplo.com"
              />
            </Field>
            <input type="hidden" name="is_admin" value="true" />
            <button type="submit" className={`${btnPrimary} mt-4 w-full sm:w-auto`}>
              <UserPlus className="w-5 h-5" aria-hidden="true" />
              Dar acceso
            </button>
          </form>
        </Card>

        <Card
          icon={KeyRound}
          title="Restablecer contraseña"
          hint="Si alguien no puede entrar, fíjale una contraseña nueva y pásasela."
        >
          <form action={adminResetPassword} className="space-y-5">
            <Field label="Correo de la persona">
              <TextInput
                name="target_email"
                type="email"
                required
                placeholder="correo@ejemplo.com"
              />
            </Field>
            <Field label="Contraseña nueva" hint="Al menos 8 caracteres.">
              {/* type="text" a propósito: quien la fija tiene que poder leerla
                  para dictarla por teléfono. */}
              <TextInput
                name="new_password"
                type="text"
                required
                minLength={8}
                placeholder="Ej. vivircreciendo2026"
              />
            </Field>
            <button type="submit" className={`${btnBlue} w-full sm:w-auto`}>
              <KeyRound className="w-5 h-5" aria-hidden="true" />
              Restablecer contraseña
            </button>
          </form>

          <p className={`${hintClass} flex items-start gap-2 mt-6`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Esto existe porque todavía no hay envío de correos configurado.
              Cuando lo haya, la gente podrá recuperarla sola.
            </span>
          </p>
        </Card>
      </div>
    </>
  );
}
