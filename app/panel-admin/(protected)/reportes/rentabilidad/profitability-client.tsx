"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  TrendingUp,
  Award,
  DollarSign,
  AlertTriangle,
  Search,
  Sparkles,
  PieChart,
} from "lucide-react";

interface ProfitabilityItem {
  id: string;
  name: string;
  brand: string;
  abcClass: "A" | "B" | "C";
  fullBottleCost: number;
  fullBottlePrice: number;
  fullBottleProfit: number;
  fullBottleMarginPct: number;
  decant10mlRevenueTotal: number;
  decant10mlCostTotal: number;
  decant10mlProfit: number;
  decant10mlMarginPct: number;
  daysWithoutSale: number;
}

const MOCK_PROFITABILITY_DATA: ProfitabilityItem[] = [
  {
    id: "p1",
    name: "Parfums de Marly Layton",
    brand: "Parfums de Marly",
    abcClass: "A",
    fullBottleCost: 1200,
    fullBottlePrice: 1800,
    fullBottleProfit: 600,
    fullBottleMarginPct: 33.3,
    decant10mlRevenueTotal: 2640,
    decant10mlCostTotal: 1350,
    decant10mlProfit: 1290,
    decant10mlMarginPct: 48.8,
    daysWithoutSale: 2,
  },
  {
    id: "p2",
    name: "Creed Aventus EDP",
    brand: "Creed",
    abcClass: "A",
    fullBottleCost: 2200,
    fullBottlePrice: 3200,
    fullBottleProfit: 1000,
    fullBottleMarginPct: 31.2,
    decant10mlRevenueTotal: 4500,
    decant10mlCostTotal: 2400,
    decant10mlProfit: 2100,
    decant10mlMarginPct: 46.6,
    daysWithoutSale: 85, // Capital Inmovilizado / Dinero Durmiendo
  },
  {
    id: "p3",
    name: "Afnan 9PM EDP",
    brand: "Afnan",
    abcClass: "A",
    fullBottleCost: 210,
    fullBottlePrice: 380,
    fullBottleProfit: 170,
    fullBottleMarginPct: 44.7,
    decant10mlRevenueTotal: 650,
    decant10mlCostTotal: 245,
    decant10mlProfit: 405,
    decant10mlMarginPct: 62.3,
    daysWithoutSale: 1,
  },
  {
    id: "p4",
    name: "Xerjoff Naxos EDP",
    brand: "Xerjoff",
    abcClass: "B",
    fullBottleCost: 1800,
    fullBottlePrice: 2600,
    fullBottleProfit: 800,
    fullBottleMarginPct: 30.7,
    decant10mlRevenueTotal: 3600,
    decant10mlCostTotal: 1950,
    decant10mlProfit: 1650,
    decant10mlMarginPct: 45.8,
    daysWithoutSale: 12,
  },
  {
    id: "p5",
    name: "Parfums de Marly Pegasus",
    brand: "Parfums de Marly",
    abcClass: "C",
    fullBottleCost: 1300,
    fullBottlePrice: 1900,
    fullBottleProfit: 600,
    fullBottleMarginPct: 31.5,
    decant10mlRevenueTotal: 2700,
    decant10mlCostTotal: 1450,
    decant10mlProfit: 1250,
    decant10mlMarginPct: 46.2,
    daysWithoutSale: 62, // Dinero Durmiendo
  },
];

export function ProfitabilityClient() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = MOCK_PROFITABILITY_DATA.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAbcBadge = (abc: ProfitabilityItem["abcClass"]) => {
    switch (abc) {
      case "A":
        return <Badge variant="success" className="font-bold">Clase A (80% Ingresos)</Badge>;
      case "B":
        return <Badge variant="secondary">Clase B (15%)</Badge>;
      case "C":
        return <Badge variant="outline" className="text-muted-foreground">Clase C (5%)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif">
          Reporte de Rentabilidad por Fragancia & Mililitro
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Demuestra la diferencia de margen al fraccionar en decants vs vender frascos cerrados, clasificación ABC y ranking de Dinero Durmiendo
        </p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Margen Promedio Frasco Cerrado</CardDescription>
              <Award className="h-4 w-4 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-blue-600 font-mono">34.2%</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-sm border bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Margen Promedio Fraccionado (Decants 10ml)
              </CardDescription>
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <CardTitle className="text-2xl text-amber-600 dark:text-amber-400 font-mono">
              49.9% (+15.7% Extra)
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Capital Inmovilizado (Dinero Durmiendo &gt;60d)</CardDescription>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <CardTitle className="text-2xl text-amber-600 font-mono">Bs 6.700</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm border p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por perfume o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </Card>

      {/* Comparative Profitability Table */}
      <Card className="shadow-sm border overflow-hidden">
        <CardHeader className="border-b bg-muted/40">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Comparativa de Rentabilidad: Botella vs Decants</CardTitle>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Perfume & Marca</TableHead>
                <TableHead>Clasificación ABC</TableHead>
                <TableHead className="text-right">Costo Master</TableHead>
                <TableHead className="text-right">Utilidad Botella</TableHead>
                <TableHead className="text-right bg-amber-500/5">Utilidad Decants 10ml</TableHead>
                <TableHead className="text-right bg-amber-500/5">Ganancia Extra Decants</TableHead>
                <TableHead className="text-center">Estado Rotación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const extraProfit = item.decant10mlProfit - item.fullBottleProfit;
                const isSleeping = item.daysWithoutSale > 60;

                return (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.brand}</div>
                    </TableCell>
                    <TableCell>{getAbcBadge(item.abcClass)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">Bs {item.fullBottleCost}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold">
                      Bs {item.fullBottleProfit} ({item.fullBottleMarginPct}%)
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold bg-amber-500/5 text-amber-600 dark:text-amber-400">
                      Bs {item.decant10mlProfit} ({item.decant10mlMarginPct}%)
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-extrabold bg-amber-500/5 text-emerald-600">
                      +Bs {extraProfit} (+{((extraProfit / item.fullBottleProfit) * 100).toFixed(1)}%)
                    </TableCell>
                    <TableCell className="text-center">
                      {isSleeping ? (
                        <Badge variant="warning" className="text-[10px] gap-1">
                          <AlertTriangle className="h-3 w-3" /> Dinero Durmiendo ({item.daysWithoutSale}d)
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Rotación Activa
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
