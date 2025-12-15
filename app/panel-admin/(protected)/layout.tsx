import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Package,
  FileText,
  LayoutDashboard,
  LogOut,
  ClipboardList,
  ShoppingBag,
  Store,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/panel-admin");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-muted/40 border-r min-h-screen p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="flex-1 space-y-2">
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
        </nav>
        <div className="mt-auto pt-6 border-t">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
