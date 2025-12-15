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
import { X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBrand } from "@/app/actions/brands";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brandId?: string | null;
  // Olfactory
  olfactoryFamily?: string | null;
  topNotes?: string | null;
  heartNotes?: string | null;
  baseNotes?: string | null;
  concentration?: string | null;
  gender?: string | null;
  season?: string | null;
  occasion?: string | null;

  // Prices
  hasDecant: boolean;
  priceDecant5ml: any;
  priceDecant10ml: any;
  hasFullBottle: boolean;
  priceFull: any;
  // Metadata
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export function ProductForm({
  product,
  brands = [],
}: {
  product?: Product;
  brands?: Brand[];
}) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localBrands, setLocalBrands] = useState<Brand[]>(brands);
  const [selectedBrand, setSelectedBrand] = useState<string>(
    product?.brandId || ""
  );
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  // Toggles state
  const [hasDecant, setHasDecant] = useState(product?.hasDecant ?? false);
  const [hasFullBottle, setHasFullBottle] = useState(
    product?.hasFullBottle ?? true
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("images", images.join(","));
    if (selectedBrand) {
      formData.set("brandId", selectedBrand);
    }

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

  const handleCreateBrand = async () => {
    if (!newBrandName) return;
    const formData = new FormData();
    formData.append("name", newBrandName);

    const res = await createBrand(formData);
    if (res.success && res.brand) {
      setLocalBrands([...localBrands, res.brand]);
      setSelectedBrand(res.brand.id);
      setIsBrandDialogOpen(false);
      setNewBrandName("");
      toast.success("Marca creada");
    } else {
      toast.error(res.message || "Error al crear marca");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Columna Principal (2/3) */}
      <div className="lg:col-span-2 space-y-8">
        {/* Card 1: Información Básica */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold">Información Básica</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ej: Sauvage Elixir"
                  defaultValue={product?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Marca</Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedBrand}
                    onValueChange={setSelectedBrand}
                    name="brandId"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar marca..." />
                    </SelectTrigger>
                    <SelectContent>
                      {localBrands.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog
                    open={isBrandDialogOpen}
                    onOpenChange={setIsBrandDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        title="Crear nueva marca"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear Nueva Marca</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nombre de la Marca</Label>
                          <Input
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            placeholder="Ej: Dior, Chanel"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handleCreateBrand}>
                          Guardar Marca
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría (Interna) *</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Ej: Perfumes"
                  defaultValue={product?.category}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select
                  name="gender"
                  defaultValue={product?.gender || "Masculino"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe las notas olfativas y características..."
                rows={4}
                defaultValue={product?.description}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Card: Detalles Olfativos (Nuevo) */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Perfil Olfativo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="olfactoryFamily">Familia Olfativa</Label>
                <Input
                  id="olfactoryFamily"
                  name="olfactoryFamily"
                  placeholder="Ej: Amaderada Especiada"
                  defaultValue={product?.olfactoryFamily || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concentration">Concentración</Label>
                <Select
                  name="concentration"
                  defaultValue={product?.concentration || "EDP"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Extrait">Extrait de Parfum</SelectItem>
                    <SelectItem value="EDP">Eau de Parfum (EDP)</SelectItem>
                    <SelectItem value="EDT">Eau de Toilette (EDT)</SelectItem>
                    <SelectItem value="EDC">Eau de Cologne</SelectItem>
                    <SelectItem value="Parfum">Parfum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topNotes">Notas de Salida</Label>
                <Input
                  id="topNotes"
                  name="topNotes"
                  placeholder="Ej: Bergamota"
                  defaultValue={product?.topNotes || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartNotes">Notas de Corazón</Label>
                <Input
                  id="heartNotes"
                  name="heartNotes"
                  placeholder="Ej: Lavanda"
                  defaultValue={product?.heartNotes || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseNotes">Notas de Fondo</Label>
                <Input
                  id="baseNotes"
                  name="baseNotes"
                  placeholder="Ej: Sándalo"
                  defaultValue={product?.baseNotes || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="season">Estación</Label>
                <Input
                  id="season"
                  name="season"
                  placeholder="Ej: Invierno"
                  defaultValue={product?.season || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occasion">Ocasión</Label>
                <Input
                  id="occasion"
                  name="occasion"
                  placeholder="Ej: Noche"
                  defaultValue={product?.occasion || ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 2: Multimedia */}
          <Card className="h-full">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Multimedia
              </h3>
              <div className="space-y-2">
                <Label>Galería de Imágenes</Label>
                <div className="border-2 border-dashed rounded-lg p-4 bg-muted/50">
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-square group"
                        >
                          <Image
                            src={img}
                            alt={`Imagen ${index + 1}`}
                            fill
                            className="object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
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
                        toast.success("Imágenes subidas");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Error: ${error.message}`);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Variantes y Precios */}
          <Card className="h-full">
            <CardContent className="pt-6 space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">
                Precios y Variantes
              </h3>

              <div className="space-y-6">
                {/* Botella Completa */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasFullBottle"
                      name="hasFullBottle"
                      className="h-4 w-4 rounded border-gray-300 accent-primary"
                      checked={hasFullBottle}
                      onChange={(e) => setHasFullBottle(e.target.checked)}
                    />
                    <Label
                      htmlFor="hasFullBottle"
                      className="font-medium cursor-pointer"
                    >
                      Venta por Botella
                    </Label>
                  </div>
                  {hasFullBottle && (
                    <div className="pl-6">
                      <Label
                        htmlFor="priceFull"
                        className="text-xs text-muted-foreground"
                      >
                        Precio (Bs)
                      </Label>
                      <Input
                        id="priceFull"
                        name="priceFull"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="mt-1"
                        defaultValue={product?.priceFull?.toString()}
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-dashed" />

                {/* Decants */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasDecant"
                      name="hasDecant"
                      className="h-4 w-4 rounded border-gray-300 accent-primary"
                      checked={hasDecant}
                      onChange={(e) => setHasDecant(e.target.checked)}
                    />
                    <Label
                      htmlFor="hasDecant"
                      className="font-medium cursor-pointer"
                    >
                      Venta por Decants
                    </Label>
                  </div>
                  {hasDecant && (
                    <div className="pl-6 grid grid-cols-2 gap-3">
                      <div>
                        <Label
                          htmlFor="priceDecant5ml"
                          className="text-xs text-muted-foreground"
                        >
                          5ml (Bs)
                        </Label>
                        <Input
                          id="priceDecant5ml"
                          name="priceDecant5ml"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="mt-1"
                          defaultValue={product?.priceDecant5ml?.toString()}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="priceDecant10ml"
                          className="text-xs text-muted-foreground"
                        >
                          10ml (Bs)
                        </Label>
                        <Input
                          id="priceDecant10ml"
                          name="priceDecant10ml"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="mt-1"
                          defaultValue={product?.priceDecant10ml?.toString()}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Columna Lateral (1/3) */}
      <div className="space-y-8">
        {/* Card 4: Estado y Publicación */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Estado y Visibilidad
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-md border hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  className="mt-1 h-4 w-4 rounded border-gray-300 accent-primary"
                  defaultChecked={product?.isActive ?? true}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="isActive"
                    className="font-medium cursor-pointer"
                  >
                    Activo
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Visible para los clientes en la tienda.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-md border hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  className="mt-1 h-4 w-4 rounded border-gray-300 accent-primary"
                  defaultChecked={product?.isFeatured ?? false}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="isFeatured"
                    className="font-medium cursor-pointer"
                  >
                    Destacado
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Aparece en la sección principal (Hero).
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting
                  ? "Guardando..."
                  : product
                  ? "Actualizar Producto"
                  : "Crear Producto"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
