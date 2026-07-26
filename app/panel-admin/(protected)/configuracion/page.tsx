import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Store,
  User,
  Bot,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
} from "lucide-react";
import { isDemoMode } from "@/lib/demo";

export default async function ConfiguracionPage() {
  const isDemo = await isDemoMode();
  const getLinkPath = (path: string) => (isDemo ? `/demo${path}` : path);

  if (!isDemo) {
    const session = await auth();
    if (!session?.user) {
      redirect("/panel-admin");
    }
    if ((session.user.role || "").toUpperCase() !== "ADMIN") {
      redirect("/panel-admin/dashboard");
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif">
          Centro de Configuración ERP
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administra las casas olfativas, credenciales de API para tu creador de chatbots y parámetros generales de EssenceOS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Marcas */}
        <Card className="shadow-sm border hover:border-primary/50 transition-all flex flex-col justify-between">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                <Layers className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-xs">Catálogo</Badge>
            </div>
            <CardTitle className="text-lg">Marcas & Casas Olfativas</CardTitle>
            <CardDescription className="text-xs">
              Crea, edita y gestiona las marcas registradas (Afnan, Lattafa, Armaf, Chanel, Dior, etc.) asociadas a tus perfumes.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href={getLinkPath("/panel-admin/configuracion/marcas")}>
              <Button className="w-full justify-between group" variant="outline">
                <span>Gestionar Marcas</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Module 2: Chatbots & API Engine */}
        <Card className="shadow-sm border hover:border-primary/50 transition-all flex flex-col justify-between border-primary/30 bg-card">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                <Bot className="h-6 w-6" />
              </div>
              <Badge variant="purple" className="text-xs gap-1">
                <Zap className="h-3 w-3" /> API Backend Live
              </Badge>
            </div>
            <CardTitle className="text-lg">API Backend & Chatbot Engine</CardTitle>
            <CardDescription className="text-xs">
              Conecta tu aplicación externa de chatbots (WhatsApp / Telegram) mediante API Key y Webhooks para consumir inventario, precios de decants y crear pedidos directamente en este ERP.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href={getLinkPath("/panel-admin/configuracion/chatbot")}>
              <Button className="w-full justify-between group bg-primary text-primary-foreground shadow">
                <span className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" /> Conectar App Externa de Chatbots
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Module 3: Parámetros de Tienda */}
        <Card className="shadow-sm border hover:border-primary/50 transition-all flex flex-col justify-between">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                <Store className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-xs">Parámetros ERP</Badge>
            </div>
            <CardTitle className="text-lg">Parámetros de Negocio & Stock</CardTitle>
            <CardDescription className="text-xs">
              Ajusta el nombre oficial de la perfumería, moneda principal (Bs), días estimados de reposición (restock) y reglas de visualización de existencias.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href={getLinkPath("/panel-admin/configuracion/tienda")}>
              <Button className="w-full justify-between group" variant="outline">
                <span>Ajustar Parámetros</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Module 4: Perfil Admin */}
        <Card className="shadow-sm border hover:border-primary/50 transition-all flex flex-col justify-between">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-300">
                <User className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" /> Seguridad
              </Badge>
            </div>
            <CardTitle className="text-lg">Perfil Admin & Seguridad</CardTitle>
            <CardDescription className="text-xs">
              Modifica tu nombre de usuario, correo electrónico de notificación y cambia tu contraseña de acceso al panel ERP.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href={getLinkPath("/panel-admin/configuracion/perfil")}>
              <Button className="w-full justify-between group" variant="outline">
                <span>Mi Perfil & Seguridad</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


