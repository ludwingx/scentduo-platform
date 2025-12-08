"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing";
import { createProduct, updateProduct } from "@/app/actions/products";
import { toast } from "sonner";
import Image from "next/image";
import { X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  priceDecant: any;
  priceFull: any;
  images: string[];
  isActive: boolean;
}

export function ProductForm({ product }: { product?: Product }) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("images", images.join(","));

    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
    } catch (error) {
      toast.error("Error al guardar el producto");
      setIsSubmitting(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Dior Sauvage Elixir"
                defaultValue={product?.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Input
                id="category"
                name="category"
                placeholder="Masculino / Femenino / Unisex"
                defaultValue={product?.category}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceDecant">Precio Decant (Bs)</Label>
              <Input
                id="priceDecant"
                name="priceDecant"
                type="number"
                step="0.01"
                placeholder="80.00"
                defaultValue={product?.priceDecant?.toString()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceFull">Precio Botella Full (Bs)</Label>
              <Input
                id="priceFull"
                name="priceFull"
                type="number"
                step="0.01"
                placeholder="1200.00"
                defaultValue={product?.priceFull?.toString()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe las características y notas del perfume..."
              rows={4}
              defaultValue={product?.description}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Imágenes del Producto</Label>
            <div className="border-2 border-dashed rounded-lg p-6">
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={img}
                        alt={`Imagen ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <UploadButton
                endpoint="productImage"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const newImages = res.map((file) => file.url);
                    setImages([...images, ...newImages]);
                    toast.success("Imágenes subidas correctamente");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Error: ${error.message}`);
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              className="h-4 w-4 rounded border-gray-300"
              defaultChecked={product?.isActive ?? true}
            />
            <Label htmlFor="isActive" className="font-normal cursor-pointer">
              Producto activo (visible en la tienda)
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting
                ? "Guardando..."
                : product
                ? "Actualizar Producto"
                : "Crear Producto"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
