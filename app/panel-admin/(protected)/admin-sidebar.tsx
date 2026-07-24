"use client";

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
import { Badge } from "@/components/ui/badge";
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
  const pathname = usePathname();
  const isDemo = isDemoMode || pathname?.startsWith("/demo");
  const getLinkPath = (path: string) => (isDemo ? `/demo${path}` : path);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="px-2 py-1">
          <div className="text-sm font-semibold text-sidebar-foreground">
            Admin Panel
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href={getLinkPath("/panel-admin/dashboard")}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Productos">
                <Link href={getLinkPath("/panel-admin/productos")}>
                  <Package />
                  <span>Productos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Comprobantes">
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
              <SidebarMenuButton asChild tooltip="Inventario">
                <Link href={getLinkPath("/panel-admin/inventario")}>
                  <ClipboardList />
                  <span>Inventario</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={getLinkPath("/panel-admin/inventario/kardex")}>
                      <span>Kardex de Movimientos</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Compras">
                <Link href={getLinkPath("/panel-admin/compras")}>
                  <ShoppingBag />
                  <span>Compras</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Punto de Venta">
                <Link href={getLinkPath("/panel-admin/pos")}>
                  <Store />
                  <span>Punto de Venta</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Combos & Mezclas">
                <Link href={getLinkPath("/panel-admin/mezclas")}>
                  <Layers className="text-gold" />
                  <span>Combos & Custom Blends</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Etiquetas QR">
                <Link href={getLinkPath("/panel-admin/etiquetas")}>
                  <QrCode />
                  <span>Etiquetas Térmicas QR</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Rentabilidad">
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
              <SidebarMenuButton asChild tooltip="Configuración">
                <Link href={getLinkPath("/panel-admin/configuracion")}>
                  <Settings />
                  <span>Configuración</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={getLinkPath("/panel-admin/configuracion/marcas")}>
                      <span>Marcas</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={getLinkPath("/panel-admin/configuracion/chatbot")}>
                      <span>Conexión API</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={getLinkPath("/panel-admin/configuracion/tienda")}>
                      <span>Parámetros ERP</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
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
