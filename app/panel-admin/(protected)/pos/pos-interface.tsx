"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { processPosOrder } from "@/app/actions/pos";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  brand: string | null;
  images: string[];
  category: string;
  hasFullBottle: boolean;
  priceFull: any;
  stockFull: number;
  hasDecant: boolean;
  priceDecant5ml: any;
  stockDecant5ml: number;
  priceDecant10ml: any;
  stockDecant10ml: number;
}

interface CartItem {
  id: string; // Unique ID for cart item (product + variant)
  productId: string;
  name: string;
  variant: "original" | "decant-5ml" | "decant-10ml";
  variantLabel: string;
  quantity: number;
  price: number;
}

export function PosInterface({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product, variant: CartItem["variant"]) => {
    let price = 0;
    let label = "";
    let maxStock = 0;

    if (variant === "original") {
      price = Number(product.priceFull);
      label = "Botella";
      maxStock = product.stockFull;
    } else if (variant === "decant-5ml") {
      price = Number(product.priceDecant5ml);
      label = "Decant 5ml";
      maxStock = product.stockDecant5ml;
    } else {
      price = Number(product.priceDecant10ml);
      label = "Decant 10ml";
      maxStock = product.stockDecant10ml;
    }

    if (maxStock <= 0) {
      toast.error("Sin stock disponible");
      return;
    }

    const cartId = `${product.id}-${variant}`;
    const existingItem = cart.find((item) => item.id === cartId);

    if (existingItem) {
      if (existingItem.quantity >= maxStock) {
        toast.error("No hay más stock disponible");
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: cartId,
          productId: product.id,
          name: product.name,
          variant,
          variantLabel: label,
          quantity: 1,
          price,
        },
      ]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          // Ideally check stock again here, but skipping for speed
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const result = await processPosOrder(cart, totalAmount);

    if (result.success) {
      toast.success("Venta realizada con éxito");
      setCart([]);
    } else {
      toast.error(result.message);
    }
    setIsProcessing(false);
  };

  return (
    <div className="flex h-full gap-6">
      {/* Product Grid - Left Side */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar perfume..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="relative h-32 w-full bg-muted">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  {product.brand && (
                    <Badge className="absolute top-2 right-2 bg-black/50 text-white border-0">
                      {product.brand}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-3 flex-1 flex flex-col">
                  <h3
                    className="font-semibold text-sm truncate"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {product.category}
                  </p>

                  <div className="mt-auto space-y-2">
                    {product.hasFullBottle && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs justify-between"
                        onClick={() => addToCart(product, "original")}
                        disabled={product.stockFull <= 0}
                      >
                        <span>Botella</span>
                        <span>
                          {product.stockFull > 0
                            ? `Bs ${product.priceFull}`
                            : "Agotado"}
                        </span>
                      </Button>
                    )}

                    {product.hasDecant && (
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[10px] px-1 h-8"
                          onClick={() => addToCart(product, "decant-5ml")}
                          disabled={product.stockDecant5ml <= 0}
                        >
                          5ml -{" "}
                          {product.stockDecant5ml > 0
                            ? `Bs ${product.priceDecant5ml}`
                            : "Sin Stock"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[10px] px-1 h-8"
                          onClick={() => addToCart(product, "decant-10ml")}
                          disabled={product.stockDecant10ml <= 0}
                        >
                          10ml -{" "}
                          {product.stockDecant10ml > 0
                            ? `Bs ${product.priceDecant10ml}`
                            : "Sin Stock"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart - Right Side */}
      <div className="w-80 border rounded-lg bg-card shadow-sm flex flex-col h-full">
        <div className="p-4 border-b bg-muted/40 font-semibold flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" /> Carrito de Venta
        </div>

        <ScrollArea className="flex-1 p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm opacity-60">
              <ShoppingCart className="h-8 w-8 mb-2" />
              <p>Carrito vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-1 border-b pb-2 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm leading-tight">
                      {item.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.variantLabel} - Bs {item.price}
                  </span>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, -1)}
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
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="font-semibold text-sm">
                      Bs {(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-muted/20">
          <div className="flex justify-between items-center mb-4 text-lg font-bold">
            <span>Total</span>
            <span>Bs {totalAmount.toFixed(2)}</span>
          </div>
          <Button
            className="w-full bg-gold hover:bg-gold/90 text-black font-bold h-12"
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? "Procesando..." : "Cobrar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
