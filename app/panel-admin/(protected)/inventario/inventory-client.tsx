"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Package, Droplets, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ProductInventory {
  id: string;
  name: string;
  brand?: { name: string } | null;
  stockFull: number;
  stockDecant5ml: number;
  stockDecant10ml: number;
  hasFullBottle: boolean;
  hasDecant: boolean;
  allowReservation?: boolean;
  estimatedRestockDays?: number | null;
}

export function InventoryClient({ products }: { products: ProductInventory[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate totals
  const totalFullStock = products.reduce((acc, p) => acc + (p.hasFullBottle ? p.stockFull : 0), 0);
  const totalDecant5mlStock = products.reduce((acc, p) => acc + (p.hasDecant ? p.stockDecant5ml : 0), 0);
  const totalDecant10mlStock = products.reduce((acc, p) => acc + (p.hasDecant ? p.stockDecant10ml : 0), 0);
  const outOfStockCount = products.filter(
    (p) => (p.hasFullBottle ? p.stockFull : 0) + (p.hasDecant ? p.stockDecant5ml + p.stockDecant10ml : 0) === 0
  ).length;

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term);
    const brandMatch = p.brand?.name.toLowerCase().includes(term);
    return nameMatch || brandMatch;
  });

  return (
    <div className="space-y-6">
      {/* Inventory KPI Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Stock Botellas
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFullStock} u.</div>
            <p className="text-xs text-muted-foreground mt-1">Botellas completas originales</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Decants 5ml
            </CardTitle>
            <Droplets className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDecant5mlStock} u.</div>
            <p className="text-xs text-muted-foreground mt-1">Fraccionados de 5ml</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Decants 10ml
            </CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDecant10mlStock} u.</div>
            <p className="text-xs text-muted-foreground mt-1">Fraccionados de 10ml</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Agotados
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Productos sin existencias</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table */}
      <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtrar por perfume o marca..."
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
              <TableHead>Producto & Marca</TableHead>
              <TableHead className="text-center">Stock Botella</TableHead>
              <TableHead className="text-center">Decant 5ml</TableHead>
              <TableHead className="text-center">Decant 10ml</TableHead>
              <TableHead className="text-center">Política de Reserva</TableHead>
              <TableHead className="text-center">Estado Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  {searchTerm ? "No se encontraron coincidencias." : "No hay existencias registradas."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const totalStock =
                  (product.hasFullBottle ? product.stockFull : 0) +
                  (product.hasDecant ? product.stockDecant5ml + product.stockDecant10ml : 0);

                return (
                  <TableRow key={product.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand?.name || "Sin Marca"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {product.hasFullBottle ? (
                        <Badge
                          variant={product.stockFull > 0 ? "outline" : "destructive"}
                          className="font-mono text-xs"
                        >
                          {product.stockFull} u.
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {product.hasDecant ? (
                        <Badge
                          variant={product.stockDecant5ml > 0 ? "outline" : "destructive"}
                          className="font-mono text-xs"
                        >
                          {product.stockDecant5ml} u.
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {product.hasDecant ? (
                        <Badge
                          variant={product.stockDecant10ml > 0 ? "outline" : "destructive"}
                          className="font-mono text-xs"
                        >
                          {product.stockDecant10ml} u.
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {product.allowReservation ? (
                        <Badge variant="secondary" className="text-[10px]">
                          Reserva ({product.estimatedRestockDays || 7}d restock)
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Sin reserva</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {totalStock === 0 ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" /> Agotado
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Disponible
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
