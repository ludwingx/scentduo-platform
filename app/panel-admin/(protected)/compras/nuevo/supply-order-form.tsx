"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSupplyOrder } from "@/app/actions/supply-orders";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  hasDecant: boolean;
  hasFullBottle: boolean;
}

interface OrderItem {
  productId: string;
  variant: "original" | "decant-5ml" | "decant-10ml";
  quantity: number;
  costPerUnit: number;
}

export function SupplyOrderForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providerName, setProviderName] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { productId: "", variant: "original", quantity: 1, costPerUnit: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", variant: "original", quantity: 1, costPerUnit: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    // @ts-ignore
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce(
      (acc, item) => acc + item.quantity * item.costPerUnit,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!providerName.trim()) {
      toast.error("Ingresa el nombre del proveedor");
      setIsSubmitting(false);
      return;
    }

    if (
      items.some((i) => !i.productId || i.quantity <= 0 || i.costPerUnit < 0)
    ) {
      toast.error("Completa todos los campos de los productos correctamente");
      setIsSubmitting(false);
      return;
    }

    const result = await createSupplyOrder({
      providerName,
      items,
    });

    if (result.success) {
      toast.success(result.message);
      router.push("/panel-admin/compras");
    } else {
      toast.error(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href="/panel-admin/compras">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="provider">Proveedor *</Label>
              <Input
                id="provider"
                placeholder="Nombre del proveedor"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Productos</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Producto
                </Button>
              </div>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border p-4 rounded-lg bg-muted/10 relative"
                >
                  <div className="md:col-span-4 space-y-2">
                    <Label>Producto</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(val) =>
                        updateItem(index, "productId", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <Label>Variante</Label>
                    <Select
                      value={item.variant}
                      onValueChange={(val) => updateItem(index, "variant", val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">
                          Botella Original
                        </SelectItem>
                        <SelectItem value="decant-5ml">Decant 5ml</SelectItem>
                        <SelectItem value="decant-10ml">Decant 10ml</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Costo Unit. (Bs)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.costPerUnit}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "costPerUnit",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="md:col-span-1">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-xl font-bold">
                Total Estimado: Bs {calculateTotal().toFixed(2)}
              </div>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Crear Orden de Compra"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
