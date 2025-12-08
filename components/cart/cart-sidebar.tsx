"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

export function CartSidebar() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = () => {
    const message = `Hola! Quiero este pedido:\n\n${items
      .map(
        (item) =>
          `- ${item.name} (${item.variant === "decant" ? "Decant" : "Full"}) x${
            item.quantity
          } = Bs ${item.price * item.quantity}`
      )
      .join("\n")}\n\nTotal: Bs ${total()}\n\nMi nombre: ...\nMi celular: ...`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/591XXXXXXXX?text=${encodedMessage}`, "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Tu Carrito</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <span className="text-lg font-medium text-muted-foreground">
                Tu carrito está vacío
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  className="flex items-center space-x-4 rounded-lg border p-3"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium leading-none">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.variant === "decant"
                        ? "Decant 10ml"
                        : "Full Bottle"}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      Bs {item.price * item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id, item.variant)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.variant,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="text-xs w-4 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.variant,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>Bs {total()}</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Finalizar Pedido por WhatsApp
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
