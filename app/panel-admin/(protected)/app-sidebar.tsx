"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DemoModeToggle } from "@/components/demo-mode-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Sparkles,
  QrCode,
  PieChart,
} from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar({ isDemoMode = false }: { isDemoMode?: boolean }) {
  const pathname = usePathname() || "";
  const { isMobile, setOpenMobile } = useSidebar();

  // Auto-close sidebar on mobile whenever the route/pathname changes
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);
  const isDemo = isDemoMode || pathname.startsWith("/demo");
  const getLinkPath = (path: string) => (isDemo ? `/demo${path}` : path);

  const cleanPathname = pathname.replace(/^\/demo/, "");
  const isActiveRoute = (path: string) => {
    if (path === "/panel-admin/dashboard") {
      return cleanPathname === "/panel-admin/dashboard" || cleanPathname === "/panel-admin" || cleanPathname === "/panel-admin/";
    }
    if (path === "/panel-admin/inventario") {
      return cleanPathname === "/panel-admin/inventario";
    }
    if (path === "/panel-admin/configuracion") {
      return cleanPathname === "/panel-admin/configuracion";
    }
    return cleanPathname === path || cleanPathname.startsWith(path + "/");
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile && (e.target as HTMLElement).closest("a")) {
      setOpenMobile(false);
    }
  };

  const activeBtnClass = (path: string) =>
    isActiveRoute(path)
      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border-l-4 border-amber-500"
      : "text-muted-foreground hover:text-foreground";

  return (
    <aside
      onClick={handleNavClick}
      className="w-full md:w-64 bg-muted/40 border-r flex flex-col md:h-full overflow-y-auto flex-shrink-0"
    >
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold text-primary mb-8 font-serif">EssenceOS ERP</h2>
      </div>

      <nav className="flex-1 space-y-2 px-6">
        <Link href={getLinkPath("/panel-admin/dashboard")}>
          <Button variant="ghost" className={`w-full justify-start ${activeBtnClass("/panel-admin/dashboard")}`}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </Link>

        <Link href={getLinkPath("/panel-admin/productos")}>
          <Button variant="ghost" className={`w-full justify-start ${activeBtnClass("/panel-admin/productos")}`}>
            <Package className="mr-2 h-4 w-4" /> Productos
          </Button>
        </Link>

        <Link href={getLinkPath("/panel-admin/comprobantes")}>
          <Button variant="ghost" className={`w-full justify-start ${activeBtnClass("/panel-admin/comprobantes")}`}>
            <FileText className="mr-2 h-4 w-4" /> Comprobantes
          </Button>
        </Link>

        <div className="my-2 border-t border-border/50" />

        <Link href={getLinkPath("/panel-admin/inventario")}>
          <Button variant="ghost" className={`w-full justify-start ${activeBtnClass("/panel-admin/inventario")}`}>
            <ClipboardList className="mr-2 h-4 w-4" /> Inventario
          </Button>
        </Link>
        <div className="pl-6 space-y-0.5">
          <Link href={getLinkPath("/panel-admin/inventario/kardex")}>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start text-xs ${activeBtnClass("/panel-admin/inventario/kardex")}`}
            >
              Kardex de Movimientos
            </Button>
          </Link>
        </div>

        <Link href={getLinkPath("/panel-admin/compras")}>
          <Button variant="ghost" className={`w-full justify-start ${activeBtnClass("/panel-admin/compras")}`}>
            <ShoppingBag className="mr-2 h-4 w-4" /> Compras
          </Button>
        </Link>

        <Link href={getLinkPath("/panel-admin/pos")}>
          <Button variant="ghost" className={`w-full justify-start ${activeBtnClass("/panel-admin/pos")}`}>
            <Store className="mr-2 h-4 w-4" /> Punto de Venta
          </Button>
        </Link>

        <Link href={getLinkPath("/panel-admin/etiquetas")}>
          <Button variant="ghost" className={`w-full justify-start ${activeBtnClass("/panel-admin/etiquetas")}`}>
            <QrCode className="mr-2 h-4 w-4 text-amber-500" /> Etiquetas Térmicas QR
          </Button>
        </Link>

        <Link href={getLinkPath("/panel-admin/reportes/rentabilidad")}>
          <Button variant="ghost" className={`w-full justify-start ${activeBtnClass("/panel-admin/reportes/rentabilidad")}`}>
            <PieChart className="mr-2 h-4 w-4 text-purple-500" /> Rentabilidad & ABC
          </Button>
        </Link>

        <div className="my-2 border-t border-border/50" />

        <div className="space-y-1">
          <Link href={getLinkPath("/panel-admin/configuracion")}>
            <Button variant="ghost" className={`w-full justify-start ${activeBtnClass("/panel-admin/configuracion")}`}>
              <Settings className="mr-2 h-4 w-4" /> Configuración
            </Button>
          </Link>

          <div className="pl-6 space-y-0.5">
            <Link href={getLinkPath("/panel-admin/configuracion/marcas")}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs ${activeBtnClass("/panel-admin/configuracion/marcas")}`}
              >
                Marcas
              </Button>
            </Link>
            <Link href={getLinkPath("/panel-admin/configuracion/chatbot")}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs ${activeBtnClass("/panel-admin/configuracion/chatbot")}`}
              >
                Conexión API
              </Button>
            </Link>
            <Link href={getLinkPath("/panel-admin/configuracion/tienda")}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs ${activeBtnClass("/panel-admin/configuracion/tienda")}`}
              >
                Parámetros ERP
              </Button>
            </Link>
            <Link href={getLinkPath("/panel-admin/configuracion/perfil")}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs ${activeBtnClass("/panel-admin/configuracion/perfil")}`}
              >
                Perfil & Seguridad
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="px-6 pb-6 space-y-3">
        <DemoModeToggle isDemoMode={isDemoMode} />

        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <div className="text-sm text-muted-foreground font-medium">Tema</div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
