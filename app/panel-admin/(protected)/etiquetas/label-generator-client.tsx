"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Printer, QrCode, Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function LabelGeneratorClient() {
  const [selectedPerfume, setSelectedPerfume] = useState("Parfums de Marly Layton");
  const [selectedBrand, setSelectedBrand] = useState("Parfums de Marly");
  const [selectedSize, setSelectedSize] = useState("10ml");
  const [topNotes, setTopNotes] = useState("Manzana, Bergamota, Lavanda");
  const [batchCode, setBatchCode] = useState("BATCH-2026X9");
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
    toast.success("Imprimiendo etiqueta térmica...");
  };

  const whatsappLink = `https://wa.me/59170000000?text=Hola!+Quiero+reordenar+el+decant+de+${encodeURIComponent(
    selectedPerfume
  )}+(${selectedSize})`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">
            Generador de Etiquetas Térmicas & QR
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Diseña e imprime etiquetas térmicas profesionales para decants de 5ml, 10ml y muestras con código QR de re-orden directo
          </p>
        </div>

        <Button onClick={handlePrint} className="gap-2 bg-gold text-black hover:bg-gold/90 font-bold">
          <Printer className="h-4 w-4" /> Imprimir Etiqueta
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Card */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg">Configuración de la Etiqueta</CardTitle>
            <CardDescription className="text-xs">
              Ajusta los datos que aparecerán en el frasco atomizador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre del Perfume</Label>
              <Input
                value={selectedPerfume}
                onChange={(e) => setSelectedPerfume(e.target.value)}
                placeholder="Ej: Creed Aventus"
              />
            </div>

            <div className="space-y-2">
              <Label>Casa Olfativa / Marca</Label>
              <Input
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                placeholder="Ej: Creed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Presentación Decant</Label>
                <div className="flex gap-2">
                  {["5ml", "10ml", "15ml"].map((size) => (
                    <Button
                      key={size}
                      type="button"
                      size="sm"
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="flex-1 text-xs"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Batch Code</Label>
                <Input
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="BATCH-2026"
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notas de Salida (Top Notes)</Label>
              <Input
                value={topNotes}
                onChange={(e) => setTopNotes(e.target.value)}
                placeholder="Ej: Piña, Grosella Negra, Manzana"
              />
            </div>
          </CardContent>
        </Card>

        {/* Live Thermal Label Preview (Printable Area) */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Vista Previa de Impresión Térmica (Zebra / Xprinter)
          </h2>

          {/* Printable Thermal Label Box */}
          <div
            id="printable-label"
            className="p-4 rounded-xl border-2 border-dashed border-primary/40 bg-card text-card-foreground shadow-md flex flex-col justify-between h-[200px] w-full max-w-[340px] mx-auto select-none print:border-none print:shadow-none print:w-[50mm] print:h-[30mm]"
          >
            <div className="flex items-start justify-between border-b pb-2">
              <div>
                <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  {selectedBrand}
                </div>
                <div className="text-sm font-extrabold font-serif line-clamp-1">
                  {selectedPerfume}
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
                {selectedSize}
              </Badge>
            </div>

            <div className="my-1.5 space-y-0.5">
              <div className="text-[9px] text-muted-foreground">
                <span className="font-semibold text-foreground">Notas:</span> {topNotes}
              </div>
              <div className="text-[9px] font-mono text-muted-foreground">
                Batch: {batchCode} | Fraccionado: 2026-07
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-[9px]">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground">ESSENCE OS</div>
                <div className="text-[8px] text-muted-foreground">Escanea para re-ordenar</div>
              </div>

              <div className="p-1 bg-white rounded border flex items-center justify-center shrink-0">
                <QrCode className="h-8 w-8 text-black" />
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Diseñado para etiquetas autoadhesivas estándar de 50mm x 30mm
          </p>
        </div>
      </div>
    </div>
  );
}
