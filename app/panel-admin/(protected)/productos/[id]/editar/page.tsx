import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductFormWrapper } from "../../product-form-wrapper";
import { getBrands } from "@/app/actions/brands";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { isDemoMode, MOCK_PRODUCTS } from "@/lib/demo";

async function getProduct(id: string) {
  if (await isDemoMode()) {
    return MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        bottleVariants: {
          orderBy: { sizeMl: "asc" },
        },
      },
    });
    return product || MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
  } catch {
    return MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const brands = await getBrands();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/panel-admin/productos">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight flex items-center gap-2">
              <Edit className="h-6 w-6 text-gold" /> Editar Perfume
            </h1>
            <p className="text-sm text-muted-foreground">
              Modifica los precios, stock e información de {product.name}
            </p>
          </div>
        </div>
      </div>

      <ProductFormWrapper product={product} brands={brands} />
    </div>
  );
}
