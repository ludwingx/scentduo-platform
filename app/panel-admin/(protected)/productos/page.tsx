import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductsTable } from "./products-table";
import { isDemoMode, MOCK_PRODUCTS } from "@/lib/demo";

async function getProducts() {
  if (await isDemoMode()) return MOCK_PRODUCTS;

  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { brand: { select: { name: true } } },
    });
  } catch {
    return MOCK_PRODUCTS;
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Administra tu catálogo de perfumes
          </p>
        </div>
        <Link href="/panel-admin/productos/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Cargando productos...</div>}>
        <ProductsTable products={products} />
      </Suspense>
    </div>
  );
}
