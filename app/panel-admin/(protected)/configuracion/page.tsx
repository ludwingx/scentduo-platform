import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings } from "lucide-react";

export default async function ConfiguracionPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/panel-admin");
  }

  if ((session.user.role || "").toUpperCase() !== "ADMIN") {
    redirect("/panel-admin/dashboard");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra catálogos y parámetros generales de la tienda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <MessageCircle className="h-4 w-4" />
              Checkout
            </div>
            <p className="text-sm text-muted-foreground">
              Configura WhatsApp, textos y métodos de pago para el pedido
            </p>
            <Link href="/panel-admin/configuracion/checkout">
              <Button className="w-full" type="button">
                Configurar checkout
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <Settings className="h-4 w-4" />
              Marcas
            </div>
            <p className="text-sm text-muted-foreground">
              Crea, edita y elimina marcas para asociarlas a tus perfumes
            </p>
            <Link href="/panel-admin/configuracion/marcas">
              <Button className="w-full" type="button">
                Gestionar marcas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
