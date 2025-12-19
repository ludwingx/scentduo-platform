import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BrandsManager } from "./brands-manager";
import { Button } from "@/components/ui/button";

async function getBrands() {
  const brands = await prisma.brand.findMany({
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

  return brands;
}

export default async function BrandsConfigPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/panel-admin");
  }

  if ((session.user.role || "").toUpperCase() !== "ADMIN") {
    redirect("/panel-admin/dashboard");
  }

  const brands = await getBrands();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
        <h1 className="text-3xl font-bold tracking-tight">Marcas</h1>
        <p className="text-muted-foreground">
          Gestiona las marcas disponibles para tu catálogo
        </p>
        </div>

        <Link href="/panel-admin/configuracion">
          <Button type="button" variant="outline">
            Volver
          </Button>
        </Link>
      </div>

      <BrandsManager initialBrands={brands} />
    </div>
  );
}
