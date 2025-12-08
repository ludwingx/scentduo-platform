"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import CartSidebar from "./CartSidebar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function FloatingCartButton() {
  const { items, isOpen, setOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <CartSidebar open={isOpen} onOpenChange={setOpen}>
        <Button
          size="lg"
          className={cn(
            "h-16 w-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
            itemCount > 0 ? "animate-in zoom-in" : ""
          )}
          onClick={() => setOpen(true)}
        >
          <div className="relative">
            <ShoppingBag className="h-8 w-8" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold border-2 border-background">
                {itemCount}
              </span>
            )}
          </div>
        </Button>
      </CartSidebar>
    </div>
  );
}
