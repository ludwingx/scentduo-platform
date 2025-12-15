import { ProductFormWrapper } from "../product-form-wrapper";
import { getBrands } from "@/app/actions/brands";

export default async function NewProductPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Producto</h1>
        <p className="text-muted-foreground">
          Agrega un nuevo perfume al catálogo
        </p>
      </div>

      <ProductFormWrapper brands={brands} />
    </div>
  );
}
