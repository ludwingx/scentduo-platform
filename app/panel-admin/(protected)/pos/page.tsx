import { prisma } from "@/lib/prisma";
import { PosInterface } from "./pos-interface";

export default async function PosPage() {
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      brand: {
        select: {
          name: true,
        },
      },
      images: true,
      hasFullBottle: true,
      priceFull: true,
      stockFull: true,
      hasDecant: true,
      priceDecant5ml: true,
      stockDecant5ml: true,
      priceDecant10ml: true,
      stockDecant10ml: true,
      // category: true, // Removed
      olfactoryFamily: true,
    },
    orderBy: { name: "asc" },
  });

  // Transform data to match PosInterface
  const products = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand?.name ?? null,
    images: p.images,
    // Use olfactoryFamily as primary category if available
    category: p.olfactoryFamily || "Sin Categoría",
    hasFullBottle: p.hasFullBottle,
    priceFull: p.priceFull ? Number(p.priceFull) : 0,
    stockFull: p.stockFull,
    hasDecant: p.hasDecant,
    priceDecant5ml: p.priceDecant5ml ? Number(p.priceDecant5ml) : 0,
    stockDecant5ml: p.stockDecant5ml,
    priceDecant10ml: p.priceDecant10ml ? Number(p.priceDecant10ml) : 0,
    stockDecant10ml: p.stockDecant10ml,
  }));

  return (
    <div className="h-[calc(100vh-6rem)]">
      <h1 className="text-2xl font-bold mb-4">Punto de Venta</h1>
      <PosInterface products={products} />
    </div>
  );
}
