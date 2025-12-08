"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  priceDecant: number | null;
  priceFull: number | null;
  images: string[];
}

export function AddToCartButtons({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (variant: "decant" | "full") => {
    const price =
      variant === "decant" ? product.priceDecant : product.priceFull;
    if (!price) return;

    addItem({
      id: product.id,
      name: product.name,
      price: Number(price),
      image: product.images[0],
      quantity: 1,
      variant,
    });

    toast.success(
      `Agregado al carrito: ${product.name} (${
        variant === "decant" ? "Decant" : "Full"
      })`
    );
  };

  return (
    <div className="flex flex-col gap-3 pt-4">
      {product.priceDecant && (
        <Button
          size="lg"
          variant="outline"
          className="w-full text-lg h-12"
          onClick={() => handleAddToCart("decant")}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar Decant (Bs {product.priceDecant})
        </Button>
      )}
      {product.priceFull && (
        <Button
          size="lg"
          className="w-full text-lg h-12"
          onClick={() => handleAddToCart("full")}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar Botella Full (Bs {product.priceFull})
        </Button>
      )}
    </div>
  );
}
