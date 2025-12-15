import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SupplyOrdersTable } from "./supply-orders-table";

async function getSupplyOrders() {
  const orders = await prisma.supplyOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
  });
  return orders;
}

export default async function SupplyOrdersPage() {
  const orders = await getSupplyOrders();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compras</h1>
          <p className="text-muted-foreground">
            Gestiona tus pedidos a proveedores y recepción de stock
          </p>
        </div>
        <Link href="/panel-admin/compras/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nueva Orden
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Cargando ordenes...</div>}>
        <SupplyOrdersTable orders={orders} />
      </Suspense>
    </div>
  );
}
