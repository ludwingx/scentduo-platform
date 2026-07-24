"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Store, DollarSign, Calendar, Eye, Save } from "lucide-react";

export function StoreConfigClient() {
  const [storeName, setStoreName] = useState("EssenceOS Perfumería & Decants");
  const [currency, setCurrency] = useState("Bs (Bolivianos)");
  const [defaultRestockDays, setDefaultRestockDays] = useState("7");
  const [showStockPublic, setShowStockPublic] = useState(true);
  const [allowPublicReservation, setAllowPublicReservation] = useState(true);
  const [autoExpandNotes, setAutoExpandNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Parámetros de la tienda guardados correctamente");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="shadow-sm border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle>Identidad Comercial</CardTitle>
          </div>
          <CardDescription>Datos generales para la cabecera y comprobantes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre Oficial de la Tienda</Label>
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Moneda Principal</Label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} readOnly className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-600" />
            <CardTitle>Políticas de Reserva & Restock</CardTitle>
          </div>
          <CardDescription>Configuración por defecto para perfumes agotados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-xs">
            <Label>Días Estimados de Reposición (Por defecto)</Label>
            <Input
              type="number"
              min="1"
              max="60"
              value={defaultRestockDays}
              onChange={(e) => setDefaultRestockDays(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Se mostrará como "Reserva estimada en X días" si un producto no tiene stock pero permite reserva.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <CardTitle>Visibilidad en Catálogo Público</CardTitle>
          </div>
          <CardDescription>Controla qué información visual ven los clientes en la web pública</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Mostrar insignias de stock exacto</Label>
              <p className="text-xs text-muted-foreground">
                Si está activo, los clientes verán exactamente cuántas unidades quedan (ej: "Quedan 3 u.").
              </p>
            </div>
            <Switch checked={showStockPublic} onCheckedChange={setShowStockPublic} />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label className="text-base">Permitir botón de reserva directa</Label>
              <p className="text-xs text-muted-foreground">
                Permite a los clientes añadir productos agotados a la bolsa en modo reserva de pre-orden.
              </p>
            </div>
            <Switch checked={allowPublicReservation} onCheckedChange={setAllowPublicReservation} />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label className="text-base">Desplegar pirámide olfativa por defecto</Label>
              <p className="text-xs text-muted-foreground">
                Muestra las notas de salida, corazón y fondo abiertas automáticamente en las tarjetas.
              </p>
            </div>
            <Switch checked={autoExpandNotes} onCheckedChange={setAutoExpandNotes} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} className="gap-2 px-6">
          <Save className="h-4 w-4" />
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
