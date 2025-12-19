"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { upsertCheckoutConfig } from "@/app/actions/checkout-config";

export function CheckoutForm({
  initial,
}: {
  initial: {
    whatsappNumber: string;
    introText: string | null;
    paymentMethods: string | null;
    outroText: string | null;
  };
}) {
  const [whatsappNumber, setWhatsappNumber] = useState(initial.whatsappNumber);
  const [introText, setIntroText] = useState(initial.introText || "");
  const [paymentMethods, setPaymentMethods] = useState(
    initial.paymentMethods || ""
  );
  const [outroText, setOutroText] = useState(initial.outroText || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.set("whatsappNumber", whatsappNumber);
      fd.set("introText", introText);
      fd.set("paymentMethods", paymentMethods);
      fd.set("outroText", outroText);

      const res = await upsertCheckoutConfig(fd);
      if (!res.success) {
        toast.error(res.message || "Error al guardar");
        return;
      }

      toast.success("Configuración guardada");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp (formato wa.me)</Label>
            <Input
              id="whatsappNumber"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Ej: 59170000000"
            />
            <p className="text-xs text-muted-foreground">
              Recomendado: código de país + número, sin + ni espacios.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="introText">Texto inicial</Label>
            <Textarea
              id="introText"
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              rows={4}
              placeholder="Ej: Hola! Quiero hacer este pedido..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethods">Métodos de pago</Label>
            <Textarea
              id="paymentMethods"
              value={paymentMethods}
              onChange={(e) => setPaymentMethods(e.target.value)}
              rows={4}
              placeholder="Ej:\n- Pago móvil\n- Transferencia\n- Efectivo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outroText">Texto final</Label>
            <Textarea
              id="outroText"
              value={outroText}
              onChange={(e) => setOutroText(e.target.value)}
              rows={3}
              placeholder="Ej: Mi nombre es... Mi celular es..."
            />
          </div>

          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
