"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, History, Search, Sparkles } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  brand?: { name: string } | null;
  hasDecant: boolean;
  priceDecant5ml: any;
  priceDecant10ml: any;
  hasFullBottle: boolean;
  priceFull: any;
  stockFull?: number;
  images: string[];
  isActive: boolean;
  isFeatured?: boolean;
}

export function ProductsTable({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term);
    const brandMatch = p.brand?.name.toLowerCase().includes(term);
    return nameMatch || brandMatch;
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{filteredProducts.length}</span> de {products.length} productos
        </div>
      </div>

      <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modalidad Decants</TableHead>
              <TableHead>Botella Completa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  {searchTerm ? "No se encontraron productos coincidentes." : "No hay productos registrados."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 rounded-lg overflow-hidden border bg-muted shrink-0">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{product.name}</span>
                          {product.isFeatured && (
                            <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200 text-[10px] gap-1 px-1.5 py-0">
                              <Sparkles className="h-2.5 w-2.5" /> Hero
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.brand?.name ? (
                      <Badge variant="outline" className="text-xs font-normal">
                        {product.brand.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs font-italic">
                        Sin marca
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.hasDecant ? (
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className="text-[11px]">
                          5ml: {product.priceDecant5ml ? `Bs ${product.priceDecant5ml}` : "-"}
                        </Badge>
                        <Badge variant="secondary" className="text-[11px]">
                          10ml: {product.priceDecant10ml ? `Bs ${product.priceDecant10ml}` : "-"}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        No fraccionable
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.hasFullBottle && product.priceFull ? (
                      <div className="text-xs">
                        <span className="font-semibold">Bs {product.priceFull}</span>
                        {product.stockFull !== undefined && (
                          <span className="text-muted-foreground block text-[11px]">
                            (Stock: {product.stockFull})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        No disponible
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Activo" : "Borrador"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/panel-admin/productos/${product.id}/historial`}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Historial de Precios"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/panel-admin/productos/${product.id}/editar`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
    </div>
  );
}

