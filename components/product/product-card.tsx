"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart-store";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];

  // Decant availability
  hasDecant?: boolean;
  priceDecant5ml?: number | null;
  priceDecant10ml?: number | null;
  stockDecant5ml?: number;
  stockDecant10ml?: number;

  // Full bottle availability
  hasFullBottle?: boolean;
  priceFull?: number | null;
  fullBottleSize?: string;
  stockFull?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedDecantSize, setSelectedDecantSize] = useState<"5ml" | "10ml">(
    "10ml"
  );

  const handleAddToCart = (
    variant: "decant-5ml" | "decant-10ml" | "original"
  ) => {
    let price: number | null | undefined;

    if (variant === "decant-5ml") price = product.priceDecant5ml;
    else if (variant === "decant-10ml") price = product.priceDecant10ml;
    else price = product.priceFull;

    if (!price) return;

    addItem({
      id: product.id,
      name: product.name,
      price: Number(price),
      image: product.images[0],
      quantity: 1,
      variant,
    });
  };

  const hasDecant5ml = product.hasDecant && (product.stockDecant5ml || 0) > 0;
  const hasDecant10ml = product.hasDecant && (product.stockDecant10ml || 0) > 0;
  const hasAnyDecant = hasDecant5ml || hasDecant10ml;
  const hasFullBottle = product.hasFullBottle && (product.stockFull || 0) > 0;
  const hasAnyStock = hasAnyDecant || hasFullBottle;

  return (
    <Card className="overflow-hidden border-border bg-card hover:border-gold/30 transition-all duration-300 group relative">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {!hasAnyStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-sm font-bold">
                Agotado
              </Badge>
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-black/60 text-white border-0"
            >
              {product.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <Link href={`/producto/${product.id}`} className="group/link">
          <h3 className="font-serif font-bold text-lg leading-tight line-clamp-2 group-hover/link:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Pricing Options */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          {hasAnyDecant && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Package className="h-3.5 w-3.5 text-gold" />
                <span className="font-medium">Decant</span>
              </div>
              <div className="flex gap-2">
                {hasDecant5ml && (
                  <button
                    onClick={() => setSelectedDecantSize("5ml")}
                    className={cn(
                      "flex-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all",
                      selectedDecantSize === "5ml"
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border hover:border-gold/50"
                    )}
                  >
                    <div>5ml</div>
                    <div className="text-gold font-bold">
                      Bs {product.priceDecant5ml}
                    </div>
                  </button>
                )}
                {hasDecant10ml && (
                  <button
                    onClick={() => setSelectedDecantSize("10ml")}
                    className={cn(
                      "flex-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all",
                      selectedDecantSize === "10ml"
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border hover:border-gold/50"
                    )}
                  >
                    <div>10ml</div>
                    <div className="text-gold font-bold">
                      Bs {product.priceDecant10ml}
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {hasFullBottle && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span className="font-medium">Perfume Original</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 rounded-lg border border-gold/30 bg-gold/5">
                <span className="text-xs">
                  {product.fullBottleSize || "Full"}
                </span>
                <span className="text-gold font-bold text-sm">
                  Bs {product.priceFull}
                </span>
              </div>
            </div>
          )}

          {!hasAnyStock && (
            <div className="text-center text-sm text-muted-foreground py-3">
              Próximamente disponible
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {hasAnyDecant && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-gold/50 hover:bg-gold/10 hover:text-gold transition-all"
            onClick={() =>
              handleAddToCart(
                selectedDecantSize === "5ml" ? "decant-5ml" : "decant-10ml"
              )
            }
          >
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            Decant {selectedDecantSize}
          </Button>
        )}

        {hasFullBottle && (
          <Button
            size="sm"
            className="flex-1 bg-gold text-black hover:bg-gold/90 font-bold transition-all"
            onClick={() => handleAddToCart("original")}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Original
          </Button>
        )}

        {!hasAnyStock && (
          <Button size="sm" variant="outline" className="flex-1" disabled>
            Sin Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
