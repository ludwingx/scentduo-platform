import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductFormWrapper } from "../../product-form-wrapper";
import { getBrands } from "@/app/actions/brands";

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
        <p className="text-muted-foreground">
          Modifica la información del perfume
        </p>
      </div>

      <ProductFormWrapper product={product} brands={brands} />
    </div>
  );
}
