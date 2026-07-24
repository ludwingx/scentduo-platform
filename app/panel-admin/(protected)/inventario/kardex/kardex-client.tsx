"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

interface KardexMovement {
  id: string;
  date: string;
  productName: string;
  brand: string;
  type: "COMPRA" | "VENTA_POS" | "FRACCIONAMIENTO" | "MERMA" | "AJUSTE";
  quantity: number;
  unit: "ml" | "botella" | "decant_5ml" | "decant_10ml";
  unitCost: number;
  totalValue: number;
  balanceStock: number;
  user: string;
  notes?: string;
}

const MOCK_KARDEX: KardexMovement[] = [
  {
    id: "K-1092",
    date: "2026-07-24 10:30",
    productName: "Parfums de Marly Layton",
    brand: "Parfums de Marly",
    type: "COMPRA",
    quantity: 5,
    unit: "botella",
    unitCost: 1200,
    totalValue: 6000,
    balanceStock: 12,
    user: "Admin ERP",
    notes: "Orden de Compra OC-402 confirmada",
  },
  {
    id: "K-1091",
    date: "2026-07-24 09:15",
    productName: "Parfums de Marly Layton",
    brand: "Parfums de Marly",
    type: "FRACCIONAMIENTO",
    quantity: -1,
    unit: "botella",
    unitCost: 1200,
    totalValue: -1200,
    balanceStock: 7,
    user: "Admin ERP",
    notes: "Conversión de Master 120ml -> 12 Decants de 10ml (+3% merma)",
  },
  {
    id: "K-1090",
    date: "2026-07-23 16:45",
    productName: "Afnan 9PM EDP",
    brand: "Afnan",
    type: "VENTA_POS",
    quantity: -2,
    unit: "decant_10ml",
    unitCost: 35,
    totalValue: -70,
    balanceStock: 18,
    user: "Caja POS #1",
    notes: "Venta directa en tienda física",
  },
  {
    id: "K-1089",
    date: "2026-07-23 14:20",
    productName: "Creed Aventus EDP",
    brand: "Creed",
    type: "MERMA",
    quantity: -5,
    unit: "ml",
    unitCost: 45,
    totalValue: -225,
    balanceStock: 85,
    user: "Admin ERP",
    notes: "Evaporación / volatilidad durante trasvase",
  },
  {
    id: "K-1088",
    date: "2026-07-22 11:10",
    productName: "Lattafa Khamrah",
    brand: "Lattafa",
    type: "COMPRA",
    quantity: 10,
    unit: "botella",
    unitCost: 280,
    totalValue: 2800,
    balanceStock: 25,
    user: "Admin ERP",
    notes: "Ingreso de lote nuevo Batch #2026B",
  },
];

export function KardexClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("TODOS");

  const filteredMovements = MOCK_KARDEX.filter((m) => {
    const matchesSearch =
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "TODOS" || m.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: KardexMovement["type"]) => {
    switch (type) {
      case "COMPRA":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 gap-1"><ArrowDownLeft className="h-3 w-3" /> Entrada Compra</Badge>;
      case "VENTA_POS":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-300 gap-1"><ArrowUpRight className="h-3 w-3" /> Venta POS</Badge>;
      case "FRACCIONAMIENTO":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-300 gap-1"><Layers className="h-3 w-3" /> Fraccionamiento</Badge>;
      case "MERMA":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-300 gap-1">Merma Trasvase</Badge>;
      case "AJUSTE":
        return <Badge variant="outline">Ajuste Conteo</Badge>;
    }
  };

  const handleExport = () => {
    toast.success("Kardex exportado correctamente en formato Excel/CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">
            Kardex de Inventario
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registro contable de entradas, salidas, mermas de trasvase y fraccionamiento de decants
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2 text-xs">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Exportar Excel
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Entradas por Compras (Mes)</CardDescription>
            <CardTitle className="text-2xl text-emerald-600 font-mono">Bs 8.800</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-sm border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Salidas (Ventas & Decants)</CardDescription>
            <CardTitle className="text-2xl text-blue-600 font-mono">Bs 1.495</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-sm border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Merma Configurada Promedio</CardDescription>
            <CardTitle className="text-2xl text-amber-600 font-mono">2.8%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar perfume, marca o nota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {["TODOS", "COMPRA", "VENTA_POS", "FRACCIONAMIENTO", "MERMA"].map((type) => (
              <Button
                key={type}
                size="sm"
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className="text-xs shrink-0"
              >
                {type.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Kardex Table */}
      <Card className="shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[140px]">Fecha & ID</TableHead>
                <TableHead>Perfume & Marca</TableHead>
                <TableHead>Tipo Movimiento</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Costo Unit.</TableHead>
                <TableHead className="text-right">Total (Bs)</TableHead>
                <TableHead className="text-right">Stock Resultante</TableHead>
                <TableHead>Notas / Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="font-mono text-xs font-semibold">{item.id}</div>
                    <div className="text-[11px] text-muted-foreground">{item.date}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{item.productName}</div>
                    <div className="text-xs text-muted-foreground">{item.brand}</div>
                  </TableCell>
                  <TableCell>{getTypeBadge(item.type)}</TableCell>
                  <TableCell className="text-right font-mono font-semibold text-sm">
                    <span className={item.quantity > 0 ? "text-emerald-600" : "text-slate-700 dark:text-slate-300"}>
                      {item.quantity > 0 ? `+${item.quantity}` : item.quantity} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">Bs {item.unitCost}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-sm">
                    Bs {Math.abs(item.totalValue)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-sm text-primary">
                    {item.balanceStock} un.
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">{item.notes}</div>
                    <div className="text-[10px] text-muted-foreground">{item.user}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
