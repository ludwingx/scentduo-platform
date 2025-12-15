import { prisma } from "@/lib/prisma";
import { PosInterface } from "./pos-interface";

export default async function PosPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      brand: true,
      images: true,
      hasFullBottle: true,
      priceFull: true,
      stockFull: true,
      hasDecant: true,
      priceDecant5ml: true,
      stockDecant5ml: true,
      priceDecant10ml: true,
      stockDecant10ml: true,
      category: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="h-[calc(100vh-6rem)]">
      <h1 className="text-2xl font-bold mb-4">Punto de Venta</h1>
      <PosInterface products={products} />
    </div>
  );
}
