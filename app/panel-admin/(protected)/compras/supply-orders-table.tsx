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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Trash2, Search, Clock, ShoppingBag, AlertTriangle } from "lucide-react";
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
  const [receivingOrder, setReceivingOrder] = useState<SupplyOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<SupplyOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmReceive = async () => {
    if (!receivingOrder) return;
    setIsSubmitting(true);
    try {
      const result = await receiveSupplyOrder(receivingOrder.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Error al procesar la recepción del pedido");
    } finally {
      setIsSubmitting(false);
      setReceivingOrder(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingOrder) return;
    setIsSubmitting(true);
    try {
      const result = await deleteSupplyOrder(deletingOrder.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Error al eliminar la orden de compra");
    } finally {
      setIsSubmitting(false);
      setDeletingOrder(null);
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
                      <Badge variant="success" className="gap-1 text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Recibido
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1 text-[11px]">
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
                          onClick={() => setReceivingOrder(order)}
                          className="h-8 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 gap-1 font-semibold"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Recibir Stock
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingOrder(order)}
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

      {/* Confirmation Modal for Receiving Stock */}
      <Dialog open={!!receivingOrder} onOpenChange={() => setReceivingOrder(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <CheckCircle2 className="h-5 w-5" /> Confirmar Recepción de Stock
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-foreground">
              ¿Confirmar la recepción del pedido de proveedor{" "}
              <span className="font-bold text-foreground">"{receivingOrder?.providerName}"</span> por{" "}
              <span className="font-bold text-emerald-600">
                Bs {Number(receivingOrder?.totalCost || 0).toFixed(2)}
              </span>?
              <br />
              <span className="block mt-2 text-xs text-muted-foreground">
                Esta acción actualizará e incrementará automáticamente el stock disponible en el inventario para todos los insumos y fragancias incluidas.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              onClick={() => setReceivingOrder(null)}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmReceive}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-1.5"
            >
              {isSubmitting ? "Procesando..." : "Confirmar & Cargar Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Deleting Supply Order */}
      <Dialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-bold text-lg">
              <AlertTriangle className="h-5 w-5" /> Eliminar Orden de Compra
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-foreground">
              ¿Estás seguro de eliminar la orden de compra de{" "}
              <span className="font-bold">"{deletingOrder?.providerName}"</span>?
              <br />
              <span className="block mt-2 text-xs text-muted-foreground">
                Esta acción eliminará el registro del historial de compras.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              onClick={() => setDeletingOrder(null)}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
              className="font-bold rounded-xl gap-1.5"
            >
              {isSubmitting ? "Eliminando..." : "Sí, Eliminar Orden"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

