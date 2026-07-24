import { ProductFormWrapper } from "../product-form-wrapper";
import { getBrands } from "@/app/actions/brands";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PackagePlus } from "lucide-react";

export default async function NewProductPage() {
  const brands = await getBrands();

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
              <PackagePlus className="h-6 w-6 text-gold" /> Nuevo Perfume
            </h1>
            <p className="text-sm text-muted-foreground">
              Agrega un nuevo perfume o decant al catálogo comercial
            </p>
          </div>
        </div>
      </div>

      <ProductFormWrapper brands={brands} />
    </div>
  );
}
