import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BrandsManager } from "./brands-manager";
import { Button } from "@/components/ui/button";
import { isDemoMode, MOCK_BRANDS } from "@/lib/demo";

async function getBrands() {
  if (await isDemoMode()) return MOCK_BRANDS;

  try {
    return await prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  } catch {
    return MOCK_BRANDS;
  }
}

export default async function BrandsConfigPage() {
  const isDemo = await isDemoMode();
  
  if (!isDemo) {
    const session = await auth();
    if (!session?.user) {
      redirect("/panel-admin");
    }
    if ((session.user.role || "").toUpperCase() !== "ADMIN") {
      redirect("/panel-admin/dashboard");
    }
  }

  const brands = await getBrands();
  const backLink = isDemo ? "/demo/panel-admin/configuracion" : "/panel-admin/configuracion";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marcas</h1>
          <p className="text-muted-foreground">
            Gestiona las marcas disponibles para tu catálogo
          </p>
        </div>

        <Link href={backLink}>
          <Button type="button" variant="outline">
            Volver
          </Button>
        </Link>
      </div>

      <BrandsManager initialBrands={brands} />
    </div>
  );
}
