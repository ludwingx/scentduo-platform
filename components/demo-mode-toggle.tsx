"use client";

import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function DemoModeToggle({ isDemoMode = false }: { isDemoMode?: boolean }) {
  const pathname = usePathname();
  const isDemo = isDemoMode || pathname?.startsWith("/demo");

  const handleToggle = (checked: boolean) => {
    if (checked) {
      window.location.href = "/demo/panel-admin/dashboard";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
        <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        <span className="truncate">Modo Demo</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Switch
          checked={isDemo}
          onCheckedChange={handleToggle}
          aria-label="Alternar Modo Demo"
        />
      </div>
    </div>
  );
}
