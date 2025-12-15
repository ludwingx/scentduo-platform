"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, History } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  hasDecant: boolean;
  priceDecant5ml: any;
  priceDecant10ml: any;
  hasFullBottle: boolean;
  priceFull: any;
  images: string[];
  isActive: boolean;
}

export function ProductsTable({ products }: { products: Product[] }) {
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar "${name}"?`)) {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Decant (5ml / 10ml)</TableHead>
            <TableHead>Botella</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No hay productos registrados
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {product.hasDecant ? (
                    <div className="flex flex-col text-xs">
                      <span>
                        5ml:{" "}
                        {product.priceDecant5ml
                          ? `Bs ${product.priceDecant5ml}`
                          : "-"}
                      </span>
                      <span>
                        10ml:{" "}
                        {product.priceDecant10ml
                          ? `Bs ${product.priceDecant10ml}`
                          : "-"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No disponible
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {product.hasFullBottle && product.priceFull ? (
                    `Bs ${product.priceFull}`
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No disponible
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/panel-admin/productos/${product.id}/historial`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Historial de Precios"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/panel-admin/productos/${product.id}/editar`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
