"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  priceDecant5ml: number | null;
  priceDecant10ml: number | null;
  priceFull: number | null;
  fullBottleSize: string | null;
  stockDecant5ml: number;
  stockDecant10ml: number;
  stockFull: number;
  images: string[];
}

export function AddToCartButtons({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (
    variant: "decant-5ml" | "decant-10ml" | "original"
  ) => {
    const price =
      variant === "decant-5ml"
        ? product.priceDecant5ml
        : variant === "decant-10ml"
          ? product.priceDecant10ml
          : product.priceFull;

    if (!price) {
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: Number(price),
      image: product.images[0],
      quantity: 1,
      variant,
    });

    const variantLabel =
      variant === "decant-5ml"
        ? "Decant 5ml"
        : variant === "decant-10ml"
          ? "Decant 10ml"
          : product.fullBottleSize
            ? `Original ${product.fullBottleSize}`
            : "Original";

    toast.success(
      `Agregado al carrito: ${product.name} (${variantLabel})`
    );
  };

  return (
    <div className="flex flex-col gap-3 pt-4">
      {product.priceDecant5ml && product.stockDecant5ml > 0 && (
        <Button
          size="lg"
          variant="outline"
          className="w-full text-lg h-12"
          onClick={() => handleAddToCart("decant-5ml")}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar Decant 5ml (Bs {product.priceDecant5ml})
        </Button>
      )}

      {product.priceDecant10ml && product.stockDecant10ml > 0 && (
        <Button
          size="lg"
          variant="outline"
          className="w-full text-lg h-12"
          onClick={() => handleAddToCart("decant-10ml")}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar Decant 10ml (Bs {product.priceDecant10ml})
        </Button>
      )}

      {product.priceFull && product.stockFull > 0 && (
        <Button
          size="lg"
          className="w-full text-lg h-12"
          onClick={() => handleAddToCart("original")}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar Botella Full
          {product.fullBottleSize ? ` ${product.fullBottleSize}` : ""} (Bs {product.priceFull})
        </Button>
      )}
    </div>
  );
}
