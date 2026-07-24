import { prisma } from "@/lib/prisma";
import { PosInterface } from "./pos-interface";
import { isDemoMode, MOCK_POS_PRODUCTS } from "@/lib/demo";

export default async function PosPage() {
  const isDemo = await isDemoMode();

  let products = MOCK_POS_PRODUCTS;

  if (!isDemo) {
    try {
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
          olfactoryFamily: true,
        },
        orderBy: { name: "asc" },
      });

      if (dbProducts) {
        products = dbProducts.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand?.name || "Sin Marca",
          images: p.images,
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
      }
    } catch (error) {
      console.warn("Could not fetch DB products for POS, using mock data:", error);
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)]">
      <h1 className="text-2xl font-bold mb-4 font-serif">
        Punto de Venta (POS) {isDemo && "(Modo Demo)"}
      </h1>
      <PosInterface products={products} />
    </div>
  );
}
