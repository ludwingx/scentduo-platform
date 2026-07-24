import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StoreConfigClient } from "./store-config-client";
import { isDemoMode } from "@/lib/demo";

export default async function StoreConfigPage() {
  const isDemo = await isDemoMode();

  if (!isDemo) {
    const session = await auth();
    if (!session?.user) {
      redirect("/panel-admin");
    }

    if ((session.user.role || "").toUpperCase() !== "ADMIN") {
      redirect("/panel-admin/dashboard");
    }
  }

  const backLink = isDemo ? "/demo/panel-admin/configuracion" : "/panel-admin/configuracion";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">
            Parámetros de Tienda & Catálogo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configura la identidad comercial, moneda y preferencias de visualización del catálogo público
          </p>
        </div>

        <Link href={backLink}>
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      <StoreConfigClient />
    </div>
  );
}
