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
    <div className="flex flex-col space-y-3 lg:h-[calc(100vh-6.5rem)] lg:overflow-hidden min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-serif flex items-center gap-2">
            Punto de Venta (POS)
            {isDemo && (
              <span className="text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Modo Demo
              </span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cobranza en mostrador, fraccionamiento instantáneo e impresión de recibos
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 lg:overflow-hidden">
        <PosInterface products={products} />
      </div>
    </div>
  );
}
