import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

async function getInventory() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      stockFull: true,
      stockDecant5ml: true,
      stockDecant10ml: true,
      hasFullBottle: true,
      hasDecant: true,
    },
  });
  return products;
}

export default async function InventoryPage() {
  const products = await getInventory();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        <p className="text-muted-foreground">
          Niveles de stock actuales por producto y variante
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-center">Stock Botella</TableHead>
              <TableHead className="text-center">Stock Decant 5ml</TableHead>
              <TableHead className="text-center">Stock Decant 10ml</TableHead>
              <TableHead className="text-center">Estado General</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const totalStock =
                product.stockFull +
                product.stockDecant5ml +
                product.stockDecant10ml;

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>

                  <TableCell className="text-center">
                    {product.hasFullBottle ? (
                      <Badge
                        variant={
                          product.stockFull > 0 ? "outline" : "destructive"
                        }
                      >
                        {product.stockFull}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {product.hasDecant ? (
                      <Badge
                        variant={
                          product.stockDecant5ml > 0 ? "outline" : "destructive"
                        }
                      >
                        {product.stockDecant5ml}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {product.hasDecant ? (
                      <Badge
                        variant={
                          product.stockDecant10ml > 0
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {product.stockDecant10ml}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {totalStock === 0 ? (
                      <Badge variant="destructive">Agotado</Badge>
                    ) : (
                      <Badge variant="secondary">En Stock</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
