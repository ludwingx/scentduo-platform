"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Layers,
  Plus,
  Sparkles,
  Search,
  Droplets,
  DollarSign,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface CustomBlend {
  id: string;
  name: string;
  size: "5ml" | "10ml" | "15ml";
  perfumeA: string;
  volumeA: number;
  perfumeB: string;
  volumeB: number;
  totalCost: number;
  suggestedPrice: number;
  profitMarginPct: number;
  createdDate: string;
}

const MOCK_BLENDS: CustomBlend[] = [
  {
    id: "BLEND-101",
    name: "Duo Seduction (Layton + Khamrah)",
    size: "10ml",
    perfumeA: "Parfums de Marly Layton",
    volumeA: 5,
    perfumeB: "Lattafa Khamrah",
    volumeB: 5,
    totalCost: 68,
    suggestedPrice: 155,
    profitMarginPct: 56.1,
    createdDate: "2026-07-24",
  },
  {
    id: "BLEND-102",
    name: "Royal Citrus (Aventus + 9PM)",
    size: "10ml",
    perfumeA: "Creed Aventus",
    volumeA: 7,
    perfumeB: "Afnan 9PM",
    volumeB: 3,
    totalCost: 112,
    suggestedPrice: 240,
    profitMarginPct: 53.3,
    createdDate: "2026-07-22",
  },
];

export function BlendsClient({ isDemoMode = false }: { isDemoMode?: boolean }) {
  const [blends, setBlends] = useState<CustomBlend[]>(MOCK_BLENDS);
  const [name, setName] = useState("");
  const [perfumeA, setPerfumeA] = useState("Parfums de Marly Layton");
  const [volumeA, setVolumeA] = useState(5);
  const [perfumeB, setPerfumeB] = useState("Lattafa Khamrah");
  const [volumeB, setVolumeB] = useState(5);
  const [price, setPrice] = useState(150);

  const handleCreateBlend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Por favor ingresa un nombre para la mezcla");
      return;
    }

    const calculatedCost = 65; // Estimated cost for demo
    const margin = (((price - calculatedCost) / price) * 100).toFixed(1);

    const newBlend: CustomBlend = {
      id: "BLEND-" + Math.floor(100 + Math.random() * 900),
      name,
      size: `${volumeA + volumeB}ml` as any,
      perfumeA,
      volumeA,
      perfumeB,
      volumeB,
      totalCost: calculatedCost,
      suggestedPrice: price,
      profitMarginPct: Number(margin),
      createdDate: new Date().toISOString().split("T")[0],
    };

    setBlends([newBlend, ...blends]);
    setName("");
    toast.success("✨ Mezcla Custom Blend registrada exitosamente", {
      description: "Se descontó el volumen proporcional de ambas botellas Master.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif flex items-center gap-2">
          <Layers className="h-7 w-7 text-gold" /> Combos & Custom Blends (Layering Guide)
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Crea y fracciona combinaciones personalizadas de perfumes descontando automáticamente el volumen proporcional de ambas botellas Master
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Blend Form */}
        <Card className="shadow-sm border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Crear Nueva Mezcla Custom</CardTitle>
            <CardDescription className="text-xs">
              Combina dos fragancias en un solo decant atomizador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBlend} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre de la Mezcla</Label>
                <Input
                  placeholder="Ej: Custom Royalty Blend"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Primera Fragancia (Base)</Label>
                <Input
                  value={perfumeA}
                  onChange={(e) => setPerfumeA(e.target.value)}
                  placeholder="Perfume A"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Volumen (ml):</Label>
                  <Input
                    type="number"
                    value={volumeA}
                    onChange={(e) => setVolumeA(Number(e.target.value))}
                    className="w-20 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Segunda Fragancia (Acorde Top)</Label>
                <Input
                  value={perfumeB}
                  onChange={(e) => setPerfumeB(e.target.value)}
                  placeholder="Perfume B"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Volumen (ml):</Label>
                  <Input
                    type="number"
                    value={volumeB}
                    onChange={(e) => setVolumeB(Number(e.target.value))}
                    className="w-20 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Precio de Venta (Bs)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="font-mono text-sm font-bold"
                />
              </div>

              <Button type="submit" className="w-full bg-gold text-black hover:bg-gold/90 font-bold gap-2">
                <Sparkles className="h-4 w-4" /> Registrar & Fraccionar Blend
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Blends Table */}
        <Card className="shadow-sm border lg:col-span-2 overflow-hidden">
          <CardHeader className="border-b bg-muted/40">
            <CardTitle className="text-lg">Mezclas Registradas & Margen de Ganancia</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Mezcla & Código</TableHead>
                  <TableHead>Composición (Fragancias)</TableHead>
                  <TableHead className="text-right">Costo Total</TableHead>
                  <TableHead className="text-right">Precio Venta</TableHead>
                  <TableHead className="text-right">Margen %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blends.map((b) => (
                  <TableRow key={b.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="font-semibold text-sm">{b.name}</div>
                      <div className="text-xs font-mono text-muted-foreground">{b.id} ({b.size})</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Droplets className="h-3 w-3 text-blue-500" />
                          <span>{b.perfumeA} ({b.volumeA}ml)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Droplets className="h-3 w-3 text-purple-500" />
                          <span>{b.perfumeB} ({b.volumeB}ml)</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">Bs {b.totalCost}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">Bs {b.suggestedPrice}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-extrabold text-emerald-600">
                      {b.profitMarginPct}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
