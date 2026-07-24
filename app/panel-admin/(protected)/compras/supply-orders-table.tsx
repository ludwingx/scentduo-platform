"use client";

import { useState } from "react";
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
import { CheckCircle2, Trash2, Search, Clock, ShoppingBag } from "lucide-react";
import {
  receiveSupplyOrder,
  deleteSupplyOrder,
} from "@/app/actions/supply-orders";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SupplyOrderItem {
  id: string;
  variant: string;
  quantity: number;
  costPerUnit: any;
  product?: { name: string } | null;
}

interface SupplyOrder {
  id: string;
  providerName: string;
  status: string;
  totalCost: any;
  orderDate: Date;
  receivedDate: Date | null;
  items: SupplyOrderItem[];
}

export function SupplyOrdersTable({ orders }: { orders: SupplyOrder[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleReceive = async (id: string) => {
    if (
      confirm(
        "¿Confirmar recepción de pedido? Esto aumentará el stock de los productos automáticamente."
      )
    ) {
      const result = await receiveSupplyOrder(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar esta orden de compra?")) {
      const result = await deleteSupplyOrder(id);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const providerMatch = o.providerName.toLowerCase().includes(term);
    const itemMatch = o.items.some((item) =>
      item.product?.name.toLowerCase().includes(term)
    );
    return providerMatch || itemMatch;
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por proveedor o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{filteredOrders.length}</span> ordenes
        </div>
      </div>

      <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Fecha de Orden</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Detalle de Insumos / Perfumes</TableHead>
              <TableHead>Inversión Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  {searchTerm ? "No se encontraron órdenes coincidentes." : "No hay órdenes de compra registradas."}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="text-xs font-medium">
                    {format(new Date(order.orderDate), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">{order.providerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5 max-w-md">
                      {order.items.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[11px] font-normal">
                          {item.product?.name || "Producto"} ({item.quantity}u. {item.variant})
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-sm">
                    Bs {Number(order.totalCost).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {order.status === "RECEIVED" ? (
                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 gap-1 text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Recibido
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200 gap-1 text-[11px]">
                        <Clock className="h-3 w-3" /> Pendiente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReceive(order.id)}
                          className="h-8 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Recibir Stock
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(order.id)}
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

