"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useState } from "react";

interface CartSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export default function CartSidebar({
  open,
  onOpenChange,
  children,
}: CartSidebarProps) {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  const [checkoutConfig, setCheckoutConfig] = useState<{
    whatsappNumber: string;
    introText: string | null;
    paymentMethods: string | null;
    outroText: string | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/checkout-config")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data || typeof data !== "object") return;
        setCheckoutConfig({
          whatsappNumber: String(data.whatsappNumber || ""),
          introText: data.introText ?? null,
          paymentMethods: data.paymentMethods ?? null,
          outroText: data.outroText ?? null,
        });
      })
      .catch(() => {
        // ignore; fallback is env
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fallbackWhatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "591XXXXXXXX";

  const whatsappNumber =
    checkoutConfig?.whatsappNumber || fallbackWhatsappNumber;

  const introText =
    (checkoutConfig?.introText || "").trim() || "Hola! Quiero este pedido:";

  const paymentMethodsText = (checkoutConfig?.paymentMethods || "").trim();
  const outroText = (checkoutConfig?.outroText || "").trim();

  const orderLines = useMemo(() => {
    return items
      .map((item) => {
        const variantLabel =
          item.variant === "decant-5ml"
            ? "Decant 5ml"
            : item.variant === "decant-10ml"
              ? "Decant 10ml"
              : "Botella Full";

        return `- ${item.name} (${variantLabel}) x${item.quantity} = Bs ${
          item.price * item.quantity
        }`;
      })
      .join("\n");
  }, [items]);

  const handleCheckout = () => {
    const blocks: string[] = [];
    blocks.push(introText);
    blocks.push("");
    blocks.push(orderLines);
    blocks.push("");
    blocks.push(`Total: Bs ${total()}`);

    if (paymentMethodsText) {
      blocks.push("");
      blocks.push("Métodos de pago:");
      blocks.push(paymentMethodsText);
    }

    blocks.push("");
    blocks.push(outroText || "Mi nombre: ...\nMi celular: ...");

    const message = blocks.join("\n");

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Tu Carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <ShoppingBag className="h-16 w-16 opacity-20" />
              <p>Tu carrito está vacío</p>
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                Continuar comprando
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    className="flex gap-4 py-2"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium leading-none line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.variant === "decant-5ml"
                            ? "Decant 5ml"
                            : item.variant === "decant-10ml"
                              ? "Decant 10ml"
                              : "Botella Full"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
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
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-4 text-center">
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
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">
                            Bs {item.price * item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/90"
                            onClick={() => removeItem(item.id, item.variant)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between font-medium text-lg">
              <span>Total</span>
              <span>Bs {total()}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Finalizar Pedido por WhatsApp
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
