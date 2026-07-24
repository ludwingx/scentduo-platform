import { prisma } from "@/lib/prisma";
import { InventoryClient } from "./inventory-client";
import { isDemoMode, MOCK_INVENTORY } from "@/lib/demo";

async function getInventory() {
  if (await isDemoMode()) return MOCK_INVENTORY;

  try {
    return await prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        brand: { select: { name: true } },
        stockFull: true,
        stockDecant5ml: true,
        stockDecant10ml: true,
        hasFullBottle: true,
        hasDecant: true,
        allowReservation: true,
        estimatedRestockDays: true,
      },
    });
  } catch {
    return MOCK_INVENTORY;
  }
}

export default async function InventoryPage() {
  const products = await getInventory();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif">
          Control de Inventario & Stock
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Supervisa las existencias por botella completa y fraccionados (decants) en tiempo real
        </p>
      </div>

      <InventoryClient products={products} />
    </div>
  );
}
