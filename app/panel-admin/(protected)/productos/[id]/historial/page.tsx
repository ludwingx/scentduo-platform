import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getProductHistory(productId: string) {
  const history = await prisma.productPriceHistory.findMany({
    where: { productId },
    include: {
      changedBy: {
        select: { name: true, username: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return history;
}

export default async function ProductHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const history = await getProductHistory(id);
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/panel-admin/productos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Historial de Precios
          </h1>
          <p className="text-muted-foreground">
            Producto: {product?.name || "Desconocido"}
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Variante</TableHead>
              <TableHead>Precio Anterior</TableHead>
              <TableHead>Nuevo Precio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No hay cambios de precio registrados
                </TableCell>
              </TableRow>
            ) : (
              history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {format(new Date(record.createdAt), "dd MMM yyyy HH:mm", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    {record.changedBy?.name ||
                      record.changedBy?.username ||
                      "Sistema"}
                  </TableCell>
                  <TableCell>
                    {record.priceType === "FULL"
                      ? "Botella"
                      : record.priceType === "DECANT_5ML"
                      ? "Decant 5ml"
                      : "Decant 10ml"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.oldPrice ? `Bs ${record.oldPrice}` : "-"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {record.newPrice ? `Bs ${record.newPrice}` : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
