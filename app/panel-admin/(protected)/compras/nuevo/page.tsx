import { prisma } from "@/lib/prisma";
import { SupplyOrderForm } from "./supply-order-form";

export default async function NewSupplyOrderPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      // We might need to know which variants are valid, but for now we assume all can be ordered?
      // Or maybe check hasDecant/hasFullBottle? Let's fetch those.
      hasDecant: true,
      hasFullBottle: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Nueva Orden de Compra
        </h1>
        <p className="text-muted-foreground">
          Registra un pedido a tu proveedor
        </p>
      </div>
      <SupplyOrderForm products={products} />
    </div>
  );
}
