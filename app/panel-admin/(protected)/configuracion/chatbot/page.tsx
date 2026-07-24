import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChatbotConfigClient } from "./chatbot-config-client";
import { isDemoMode } from "@/lib/demo";

export default async function ChatbotConfigPage() {
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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">
            Conexión de API & Webhooks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Genera credenciales de API Key y configura Webhooks para conectar tus aplicaciones externas con el backend de EssenceOS
          </p>
        </div>

        <Link href={backLink}>
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      <ChatbotConfigClient />
    </div>
  );
}
