"use client";

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
import { CheckCircle, Trash2 } from "lucide-react";
import {
  receiveSupplyOrder,
  deleteSupplyOrder,
} from "@/app/actions/supply-orders";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SupplyOrder {
  id: string;
  providerName: string;
  status: string;
  totalCost: any;
  orderDate: Date;
  receivedDate: Date | null;
  items: any[];
}

export function SupplyOrdersTable({ orders }: { orders: SupplyOrder[] }) {
  const handleReceive = async (id: string) => {
    if (
      confirm(
        "¿Confirmar recepción de pedido? Esto aumentará el stock de los productos."
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
    if (confirm("¿Eliminar esta orden?")) {
      const result = await deleteSupplyOrder(id);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Costo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No hay ordenes registradas
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  {format(new Date(order.orderDate), "dd MMM yyyy", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>{order.providerName}</TableCell>
                <TableCell>{order.items.length} productos</TableCell>
                <TableCell>Bs {Number(order.totalCost).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "RECEIVED" ? "default" : "secondary"
                    }
                  >
                    {order.status === "RECEIVED" ? "Recibido" : "Pendiente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {order.status === "PENDING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReceive(order.id)}
                        className="text-green-500 hover:text-green-600 border-green-500/20"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Recibir
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
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
  );
}
