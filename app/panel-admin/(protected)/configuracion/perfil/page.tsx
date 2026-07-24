import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileConfigClient } from "./profile-config-client";
import { isDemoMode } from "@/lib/demo";

export default async function ProfileConfigPage() {
  const isDemo = await isDemoMode();
  let userName = "Invitado Portafolio";
  let userEmail = "demo@essenceos.app";

  if (!isDemo) {
    const session = await auth();
    if (!session?.user) {
      redirect("/panel-admin");
    }

    if ((session.user.role || "").toUpperCase() !== "ADMIN") {
      redirect("/panel-admin/dashboard");
    }

    userName = session.user.name ?? "Administrador EssenceOS";
    userEmail = session.user.email ?? "admin@essenceos.app";
  }

  const backLink = isDemo ? "/demo/panel-admin/configuracion" : "/panel-admin/configuracion";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">
            Perfil de Administrador & Seguridad
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona tus datos personales y credenciales de acceso al panel ERP
          </p>
        </div>

        <Link href={backLink}>
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      <ProfileConfigClient
        user={{
          name: userName,
          email: userEmail,
        }}
      />
    </div>
  );
}
