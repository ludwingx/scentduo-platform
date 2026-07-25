"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Layers,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { DemoModeToggle } from "@/components/demo-mode-toggle";
import dynamic from "next/dynamic";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const ThemeToggle = dynamic(
  () => import("@/components/theme-toggle").then((m) => m.ThemeToggle),
  { ssr: false }
);

export function AdminSidebar({
  signOutAction,
  user,
  isDemoMode = false,
}: {
  signOutAction: () => void;
  user: { name?: string | null; email?: string | null; avatar?: string | null };
  isDemoMode?: boolean;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname() || "";

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

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile && (e.target as HTMLElement).closest("a")) {
      setOpenMobile(false);
    }
  };

  const activeMenuClass =
    "data-[active=true]:bg-amber-500/15 data-[active=true]:text-amber-600 dark:data-[active=true]:text-amber-400 data-[active=true]:font-bold data-[active=true]:border-l-4 data-[active=true]:border-amber-500 transition-all";

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="px-2 py-1 flex items-center justify-between">
          <div className="text-sm font-bold text-sidebar-foreground tracking-wide font-serif">
            EssenceOS ERP
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent onClick={handleContentClick}>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Dashboard"
                isActive={isActiveRoute("/panel-admin/dashboard")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/dashboard")}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Productos"
                isActive={isActiveRoute("/panel-admin/productos")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/productos")}>
                  <Package />
                  <span>Productos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Comprobantes"
                isActive={isActiveRoute("/panel-admin/comprobantes")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/comprobantes")}>
                  <FileText />
                  <span>Comprobantes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Operación & Reportes</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Inventario"
                isActive={isActiveRoute("/panel-admin/inventario")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/inventario")}>
                  <ClipboardList />
                  <span>Inventario</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActiveRoute("/panel-admin/inventario/kardex")}
                    className="data-[active=true]:bg-amber-500/15 data-[active=true]:text-amber-600 dark:data-[active=true]:text-amber-400 data-[active=true]:font-bold"
                  >
                    <Link href={getLinkPath("/panel-admin/inventario/kardex")}>
                      <span>Kardex de Movimientos</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Compras"
                isActive={isActiveRoute("/panel-admin/compras")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/compras")}>
                  <ShoppingBag />
                  <span>Compras</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Punto de Venta"
                isActive={isActiveRoute("/panel-admin/pos")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/pos")}>
                  <Store />
                  <span>Punto de Venta</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Combos & Mezclas"
                isActive={isActiveRoute("/panel-admin/mezclas")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/mezclas")}>
                  <Layers className="text-gold" />
                  <span>Combos & Custom Blends</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Etiquetas QR"
                isActive={isActiveRoute("/panel-admin/etiquetas")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/etiquetas")}>
                  <QrCode />
                  <span>Etiquetas Térmicas QR</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Rentabilidad"
                isActive={isActiveRoute("/panel-admin/reportes/rentabilidad")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/reportes/rentabilidad")}>
                  <PieChart />
                  <span>Rentabilidad por Fragancia</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Configuración"
                isActive={isActiveRoute("/panel-admin/configuracion")}
                className={activeMenuClass}
              >
                <Link href={getLinkPath("/panel-admin/configuracion")}>
                  <Settings />
                  <span>Configuración</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActiveRoute("/panel-admin/configuracion/marcas")}
                    className="data-[active=true]:bg-amber-500/15 data-[active=true]:text-amber-600 dark:data-[active=true]:text-amber-400 data-[active=true]:font-bold"
                  >
                    <Link href={getLinkPath("/panel-admin/configuracion/marcas")}>
                      <span>Marcas</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActiveRoute("/panel-admin/configuracion/chatbot")}
                    className="data-[active=true]:bg-amber-500/15 data-[active=true]:text-amber-600 dark:data-[active=true]:text-amber-400 data-[active=true]:font-bold"
                  >
                    <Link href={getLinkPath("/panel-admin/configuracion/chatbot")}>
                      <span>Conexión API</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActiveRoute("/panel-admin/configuracion/tienda")}
                    className="data-[active=true]:bg-amber-500/15 data-[active=true]:text-amber-600 dark:data-[active=true]:text-amber-400 data-[active=true]:font-bold"
                  >
                    <Link href={getLinkPath("/panel-admin/configuracion/tienda")}>
                      <span>Parámetros ERP</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActiveRoute("/panel-admin/configuracion/perfil")}
                    className="data-[active=true]:bg-amber-500/15 data-[active=true]:text-amber-600 dark:data-[active=true]:text-amber-400 data-[active=true]:font-bold"
                  >
                    <Link href={getLinkPath("/panel-admin/configuracion/perfil")}>
                      <span>Perfil & Seguridad</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="space-y-2 p-3 border-t">
        <DemoModeToggle isDemoMode={isDemoMode} />

        <div className="flex items-center justify-between gap-2 px-1">
          <div className="text-xs text-sidebar-foreground/70 font-medium">Tema</div>
          <ThemeToggle />
        </div>

        <NavUser user={user} signOutAction={signOutAction} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
