import { prisma } from "@/lib/prisma";
import { SupplyOrderForm } from "./supply-order-form";
import { isDemoMode, MOCK_PRODUCTS } from "@/lib/demo";

async function getProductsForSupplyOrder() {
  if (await isDemoMode()) return MOCK_PRODUCTS;

  try {
    return await prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        hasDecant: true,
        hasFullBottle: true,
      },
    });
  } catch {
    return MOCK_PRODUCTS;
  }
}

export default async function NewSupplyOrderPage() {
  const products = await getProductsForSupplyOrder();

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
