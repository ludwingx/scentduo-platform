"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useState } from "react";

export default function CartIcon() {
  const items = useCartStore((state) => state.items);
  const [open, setOpen] = useState(false);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <button
        aria-label="Ver carrito"
        className="relative flex items-center gap-1 text-primary"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {itemCount}
          </span>
        )}
      </button>
    </>
  );
}
