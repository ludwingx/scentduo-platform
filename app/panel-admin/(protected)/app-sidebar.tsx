"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";

export function AppSidebar() {
  return (
    <aside className="w-full md:w-64 bg-muted/40 border-r flex flex-col md:h-full overflow-y-auto flex-shrink-0">
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold text-primary mb-8">Admin Panel</h2>
      </div>

      <nav className="flex-1 space-y-2 px-6">
        <Link href="/panel-admin/dashboard">
          <Button variant="ghost" className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </Link>

        <Link href="/panel-admin/productos">
          <Button variant="ghost" className="w-full justify-start">
            <Package className="mr-2 h-4 w-4" /> Productos
          </Button>
        </Link>

        <Link href="/panel-admin/comprobantes">
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" /> Comprobantes
          </Button>
        </Link>

        <div className="my-2 border-t border-border/50" />

        <Link href="/panel-admin/inventario">
          <Button variant="ghost" className="w-full justify-start">
            <ClipboardList className="mr-2 h-4 w-4" /> Inventario
          </Button>
        </Link>

        <Link href="/panel-admin/compras">
          <Button variant="ghost" className="w-full justify-start">
            <ShoppingBag className="mr-2 h-4 w-4" /> Compras
          </Button>
        </Link>

        <Link href="/panel-admin/pos">
          <Button variant="ghost" className="w-full justify-start">
            <Store className="mr-2 h-4 w-4" /> Punto de Venta
          </Button>
        </Link>

        <div className="my-2 border-t border-border/50" />

        <div className="space-y-1">
          <Link href="/panel-admin/configuracion">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" /> Configuración
            </Button>
          </Link>

          <div className="pl-6">
            <Link href="/panel-admin/configuracion/checkout">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
              >
                Checkout
              </Button>
            </Link>
            <Link href="/panel-admin/configuracion/marcas">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
              >
                Marcas
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="px-6 pb-6">
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <div className="text-sm text-muted-foreground">Tema</div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
