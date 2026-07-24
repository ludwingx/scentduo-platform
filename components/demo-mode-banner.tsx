"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Zap, X, LogOut } from "lucide-react";
import Link from "next/link";

export function DemoModeBanner({ isDemoMode = true }: { isDemoMode?: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  const isDemo = isDemoMode || pathname?.startsWith("/demo");
  const getLinkPath = (path: string) => (isDemo ? `/demo${path}` : path);

  if (!isDemo || dismissed) return null;

  return (
    <div className="bg-linear-to-r from-amber-500/15 via-purple-500/15 to-blue-500/15 border-b border-amber-500/20 px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs transition-all">
      <div className="flex items-center gap-2">
        <Badge className="bg-amber-500 text-black hover:bg-amber-400 font-bold text-[10px] gap-1 shrink-0">
          <Sparkles className="h-3 w-3" /> MODO DEMO LIVE
        </Badge>
        <span className="text-foreground/90 font-medium hidden sm:inline">
          Exploración de Portafolio — Interactúa libremente con todas las funciones del ERP.
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link href={getLinkPath("/panel-admin/pos")}>
          <Button size="sm" variant="ghost" className="h-7 text-[11px] gap-1 px-2.5 font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10">
            <Zap className="h-3 w-3" /> Probar POS
          </Button>
        </Link>
        <Link href={getLinkPath("/panel-admin/configuracion/chatbot")}>
          <Button size="sm" variant="ghost" className="h-7 text-[11px] gap-1 px-2.5 font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10">
            <ShieldCheck className="h-3 w-3" /> API Engine
          </Button>
        </Link>
        <a href="/login">
          <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 px-2.5 font-bold border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20">
            <LogOut className="h-3 w-3" /> Salir de Modo Demo
          </Button>
        </a>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => setDismissed(true)}
          title="Ocultar Banner Demo"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
