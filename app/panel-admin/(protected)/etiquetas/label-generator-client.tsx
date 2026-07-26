"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, QrCode, Sparkles, RefreshCw, Copy, Check, ExternalLink, SlidersHorizontal, Store } from "lucide-react";
import { toast } from "sonner";

const PRESET_PRODUCTS = [
  {
    name: "Parfums de Marly Layton",
    brand: "Parfums de Marly",
    topNotes: "Manzana, Bergamota, Lavanda",
    concentration: "EDP",
    defaultSize: "10ml",
    batch: "BATCH-2026X9",
  },
  {
    name: "Creed Aventus",
    brand: "Creed",
    topNotes: "Piña, Grosella Negra, Manzana",
    concentration: "EDP",
    defaultSize: "10ml",
    batch: "BATCH-AV2601",
  },
  {
    name: "Afnan 9PM",
    brand: "Afnan",
    topNotes: "Manzana, Canela, Beramota",
    concentration: "EDP",
    defaultSize: "10ml",
    batch: "BATCH-9PM882",
  },
  {
    name: "Lattafa Khamrah",
    brand: "Lattafa",
    topNotes: "Canela, Nuez Moscada, Bergamota",
    concentration: "Extrait",
    defaultSize: "10ml",
    batch: "BATCH-KHM771",
  },
  {
    name: "Xerjoff Naxos",
    brand: "Xerjoff",
    topNotes: "Lavanda, Bergamota, Limón",
    concentration: "EDP",
    defaultSize: "10ml",
    batch: "BATCH-NX9920",
  },
  {
    name: "Dior Sauvage Elixir",
    brand: "Dior",
    topNotes: "Canela, Nuez Moscada, Cardamomo",
    concentration: "Elixir",
    defaultSize: "5ml",
    batch: "BATCH-SE1102",
  },
];

export function LabelGeneratorClient() {
  const [selectedPerfume, setSelectedPerfume] = useState("Parfums de Marly Layton");
  const [selectedBrand, setSelectedBrand] = useState("Parfums de Marly");
  const [selectedSize, setSelectedSize] = useState("10ml");
  const [concentration, setConcentration] = useState("EDP");
  const [topNotes, setTopNotes] = useState("Manzana, Bergamota, Lavanda");
  const [batchCode, setBatchCode] = useState("BATCH-2026X9");
  const [phoneNumber, setPhoneNumber] = useState("59170000000");
  const [labelFormat, setLabelFormat] = useState<"50x30" | "40x20" | "50x50">("50x30");
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (indexStr: string) => {
    const idx = parseInt(indexStr, 10);
    const item = PRESET_PRODUCTS[idx];
    if (item) {
      setSelectedPerfume(item.name);
      setSelectedBrand(item.brand);
      setTopNotes(item.topNotes);
      setConcentration(item.concentration);
      setSelectedSize(item.defaultSize);
      setBatchCode(item.batch);
      toast.success(`Cargada plantilla de "${item.name}"`);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success("Enviando etiqueta a impresora...");
  };

  // WhatsApp re-order URL encoded in QR Code
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hola! Quiero re-ordenar el decant de ${selectedPerfume} (${selectedSize} - ${concentration}). Batch: ${batchCode}`
  )}`;

  // Dynamic QR Code API URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    whatsappLink
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(whatsappLink);
    setCopied(true);
    toast.success("Enlace de WhatsApp copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  // Style classes according to format
  const getFormatDimensions = () => {
    switch (labelFormat) {
      case "40x20":
        return {
          width: "w-[300px]",
          height: "h-[150px]",
          printWidth: "40mm",
          printHeight: "20mm",
          titleSize: "text-xs",
          brandSize: "text-[9px]",
          notesSize: "text-[8px]",
          qrSize: "h-9 w-9",
        };
      case "50x50":
        return {
          width: "w-[340px]",
          height: "h-[340px]",
          printWidth: "50mm",
          printHeight: "50mm",
          titleSize: "text-base",
          brandSize: "text-[11px]",
          notesSize: "text-[10px]",
          qrSize: "h-16 w-16",
        };
      case "50x30":
      default:
        return {
          width: "w-[340px]",
          height: "h-[200px]",
          printWidth: "50mm",
          printHeight: "30mm",
          titleSize: "text-sm",
          brandSize: "text-[10px]",
          notesSize: "text-[9px]",
          qrSize: "h-12 w-12",
        };
    }
  };

  const dim = getFormatDimensions();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Dynamic Print CSS for Thermal Printers */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-label, #printable-label * {
            visibility: visible !important;
          }
          #printable-label {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: ${dim.printWidth} !important;
            height: ${dim.printHeight} !important;
            margin: 0 !important;
            padding: 2mm 3mm !important;
            box-shadow: none !important;
            border: 1px solid #000 !important;
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            border-radius: 0 !important;
            z-index: 99999 !important;
          }
          @page {
            size: ${dim.printWidth} ${dim.printHeight};
            margin: 0;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif flex items-center gap-2.5">
            <Printer className="h-7 w-7 text-primary" /> Generador de Etiquetas Térmicas & QR
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Diseña e imprime etiquetas térmicas autoadhesivas (Zebra / Xprinter) con código QR dinámico para re-ordenes por WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleCopyLink} variant="outline" className="gap-2">
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar Link QR"}
          </Button>
          <Button onClick={handlePrint} className="gap-2 bg-primary text-primary-foreground font-bold shadow-md">
            <Printer className="h-4 w-4" /> Imprimir Etiqueta
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Selector */}
          <Card className="shadow-sm border border-primary/20">
            <CardHeader className="py-3 px-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <SlidersHorizontal className="h-4 w-4 text-primary" /> Cargar Plantilla Rápida
                </div>
                <Badge variant="secondary" className="text-[10px]">6 Perfumes Populares</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Select onValueChange={handleSelectPreset}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una fragancia del catálogo..." />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_PRODUCTS.map((p, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {p.brand} — {p.name} ({p.concentration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Configuration Form */}
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-lg">Parámetros de la Etiqueta</CardTitle>
              <CardDescription className="text-xs">
                Personaliza la información que se imprimirá en el adhesivo del frasco
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Presentación</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2ml">2ml (Muestra)</SelectItem>
                      <SelectItem value="5ml">5ml Decant</SelectItem>
                      <SelectItem value="10ml">10ml Decant</SelectItem>
                      <SelectItem value="15ml">15ml Travel</SelectItem>
                      <SelectItem value="30ml">30ml Atomizador</SelectItem>
                      <SelectItem value="100ml">100ml Botella</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Concentración</Label>
                  <Select value={concentration} onValueChange={setConcentration}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EDP">Eau de Parfum (EDP)</SelectItem>
                      <SelectItem value="Extrait">Extrait de Parfum</SelectItem>
                      <SelectItem value="Parfum">Parfum</SelectItem>
                      <SelectItem value="EDT">Eau de Toilette (EDT)</SelectItem>
                      <SelectItem value="Elixir">Elixir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Batch Code</Label>
                  <Input
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    placeholder="BATCH-2026"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notas Principales (Top Notes)</Label>
                <Input
                  value={topNotes}
                  onChange={(e) => setTopNotes(e.target.value)}
                  placeholder="Ej: Piña, Grosella Negra, Manzana"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label>Formato de Etiqueta Térmica</Label>
                  <Select value={labelFormat} onValueChange={(val: any) => setLabelFormat(val)}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50x30">50mm x 30mm (Decant Estándar)</SelectItem>
                      <SelectItem value="40x20">40mm x 20mm (Muestra Compacta)</SelectItem>
                      <SelectItem value="50x50">50mm x 50mm (Caja Cuadrada)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>WhatsApp de Re-Orden</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="59170000000"
                      className="pl-8 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Thermal Label Preview (Print Container) */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-gold" /> Vista Previa Térmica Live
            </h2>
            <Badge variant="outline" className="text-[11px] font-mono">
              {dim.printWidth} x {dim.printHeight}
            </Badge>
          </div>

          {/* Printable Thermal Label Component */}
          <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border flex items-center justify-center min-h-[280px]">
            <div
              id="printable-label"
              className={`${dim.width} ${dim.height} p-3 rounded-lg border-2 border-slate-900 bg-white text-slate-900 shadow-xl flex flex-col justify-between select-none relative overflow-hidden transition-all duration-300`}
            >
              {/* Top Header Section */}
              <div className="flex items-start justify-between border-b border-slate-900/30 pb-1.5">
                <div className="pr-2 min-w-0">
                  <div className={`${dim.brandSize} font-bold tracking-wider text-slate-700 uppercase truncate`}>
                    {selectedBrand || "CASA OLFATIVA"}
                  </div>
                  <div className={`${dim.titleSize} font-extrabold font-serif text-slate-950 truncate leading-tight`}>
                    {selectedPerfume || "Perfume"}
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 gap-0.5">
                  <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {selectedSize}
                  </span>
                  <span className="text-[8px] font-mono font-bold text-slate-700">
                    {concentration}
                  </span>
                </div>
              </div>

              {/* Middle Notes & Batch Section */}
              <div className="my-1 space-y-0.5">
                <div className={`${dim.notesSize} text-slate-800 line-clamp-1 leading-tight`}>
                  <span className="font-bold">Notas:</span> {topNotes || "Notas Olfativas"}
                </div>
                <div className="text-[8px] font-mono text-slate-600 flex items-center justify-between">
                  <span>Batch: <strong className="text-slate-900">{batchCode || "BATCH"}</strong></span>
                  <span>Fracc: 2026-07</span>
                </div>
              </div>

              {/* Bottom Re-order QR Code Section */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-900/30 text-[8px]">
                <div className="space-y-0.5 pr-2">
                  <div className="font-extrabold text-slate-900 tracking-wider">ESSENCE OS</div>
                  <div className="text-[7.5px] text-slate-700 font-medium">
                    Escanea para re-ordenar por WhatsApp
                  </div>
                </div>

                {/* Real Dynamic QR Code Image */}
                <div className="p-0.5 bg-white rounded border border-slate-900 shrink-0 shadow-xs">
                  <img
                    src={qrCodeUrl}
                    alt="QR Re-Orden"
                    className={`${dim.qrSize} object-contain`}
                    onError={(e) => {
                      // Fallback icon if offline
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-3 rounded-xl border text-xs text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Formato de Impresión Configurado
            </div>
            <p>
              Al presionar <strong>"Imprimir Etiqueta"</strong> o <kbd className="bg-muted px-1 rounded">Ctrl+P</kbd>, el navegador enviará directamente la etiqueta de <strong>{dim.printWidth} x {dim.printHeight}</strong> omitiendo la interfaz web.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
