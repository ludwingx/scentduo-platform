import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  FileText,
  ShoppingBag,
  Plus,
  Store,
  Settings,
  Droplets,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import { isDemoMode, MOCK_DASHBOARD } from "@/lib/demo";

async function getDashboardData() {
  if (await isDemoMode()) return MOCK_DASHBOARD;

  try {
    const [
      productCount,
      activeProducts,
      decantProductsCount,
      proofCount,
      pendingProofCount,
      supplyOrdersCount,
      recentProducts,
      recentProofs,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { hasDecant: true } }),
      prisma.paymentProof.count(),
      prisma.paymentProof.count({ where: { status: "PENDING" } }),
      prisma.supplyOrder.count(),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { brand: { select: { name: true } } },
      }),
      prisma.paymentProof.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      productCount,
      activeProducts,
      decantProductsCount,
      proofCount,
      pendingProofCount,
      supplyOrdersCount,
      recentProducts,
      recentProofs,
    };
  } catch {
    return MOCK_DASHBOARD;
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">
            Panel de Control Executive
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resumen en tiempo real del catálogo, inventario y ventas de EssenceOS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/panel-admin/pos">
            <Button className="gap-2 shadow-md">
              <Store className="h-4 w-4" /> Punto de Venta POS
            </Button>
          </Link>
          <Link href="/panel-admin/productos/nuevo">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Nuevo Perfume
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Catálogo
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.productCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>{data.activeProducts} activos en tienda</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Modalidad Decants
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Droplets className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.decantProductsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Perfumes fraccionables (5ml / 10ml)
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Comprobantes
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.proofCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {data.pendingProofCount > 0 ? (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {data.pendingProofCount} pendientes de revisión
                </span>
              ) : (
                <span>Comprobantes de pago cargados</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Órdenes de Insumos
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.supplyOrdersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pedidos a proveedores registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Toolbar */}
      <Card className="p-4 bg-muted/20 border shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-sm">Accesos Rápidos de Gestión</h3>
            <p className="text-xs text-muted-foreground">
              Navega rápidamente a las principales secciones operativas del ERP
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/panel-admin/productos/nuevo">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Perfume
              </Button>
            </Link>
            <Link href="/panel-admin/compras/nuevo">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <ShoppingBag className="h-3.5 w-3.5" /> Compra Stock
              </Button>
            </Link>
            <Link href="/panel-admin/configuracion/marcas">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Layers className="h-3.5 w-3.5" /> Marcas
              </Button>
            </Link>
            <Link href="/panel-admin/configuracion">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Settings className="h-3.5 w-3.5" /> Configuración
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Products */}
        <Card className="lg:col-span-2 shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-base font-bold">Últimos Perfumes Agregados</CardTitle>
              <p className="text-xs text-muted-foreground">
                Resumen de los últimos registros incorporados al catálogo
              </p>
            </div>
            <Link href="/panel-admin/productos">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Ver Todos <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentProducts.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No hay productos registrados aún.
              </div>
            ) : (
              <div className="divide-y">
                {data.recentProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 rounded-lg overflow-hidden border bg-muted shrink-0">
                        {p.images[0] ? (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        ) : (
                          <Package className="h-5 w-5 m-auto text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{p.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {p.brand?.name || "Sin Marca"} {p.gender ? `• ${p.gender}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold">
                          {p.priceFull ? `Bs ${p.priceFull}` : "Solo Decants"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Stock: {p.stockFull} u.
                        </p>
                      </div>
                      <Badge variant={p.isActive ? "default" : "secondary"} className="text-[10px]">
                        {p.isActive ? "Activo" : "Borrador"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right 1 Col: Recent Payment Proofs */}
        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-base font-bold">Comprobantes Recientes</CardTitle>
              <p className="text-xs text-muted-foreground">Últimos pagos de clientes</p>
            </div>
            <Link href="/panel-admin/comprobantes">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Ver Todos <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentProofs.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No hay comprobantes cargados.
              </div>
            ) : (
              <div className="divide-y">
                {data.recentProofs.map((proof) => (
                  <div key={proof.id} className="p-4 hover:bg-muted/30 transition-colors space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{proof.customerName}</span>
                      <Badge
                        variant={
                          proof.status === "PENDING"
                            ? "secondary"
                            : proof.status === "APPROVED"
                            ? "default"
                            : "destructive"
                        }
                        className="text-[10px]"
                      >
                        {proof.status === "PENDING"
                          ? "Pendiente"
                          : proof.status === "APPROVED"
                          ? "Aprobado"
                          : "Rechazado"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Teléfono: {proof.customerPhone}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

