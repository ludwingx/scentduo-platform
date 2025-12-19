"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing";
import { createProduct, updateProduct } from "@/app/actions/products";
import { toast } from "sonner";
import Image from "next/image";
import { X, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  OLFACTORY_FAMILIES,
  CONCENTRATIONS,
  GENDERS,
  SEASONS,
  OCCASIONS,
  TOP_NOTES,
  HEART_NOTES,
  BASE_NOTES,
} from "@/app/lib/product-constants";
import { createBrand } from "@/app/actions/brands";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { MultiSelect } from "@/components/ui/multi-select";

interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
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
  fullBottleSize?: string | null;
  stockFull: number;
  bottleVariants?: { sizeMl: number; price: any; stock: number }[];
  // Decants stock
  stockDecant5ml: number;
  stockDecant10ml: number;
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
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localBrands, setLocalBrands] = useState<Brand[]>(brands);
  const [selectedBrand, setSelectedBrand] = useState<string>(
    product?.brandId || ""
  );
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  const getServerActionErrorMessage = (res: unknown) => {
    const fallback = "Revisa los campos e inténtalo nuevamente";
    if (!res || typeof res !== "object") return fallback;

    const anyRes = res as any;
    if (typeof anyRes.message === "string" && anyRes.message.trim()) {
      return anyRes.message;
    }

    const errors = anyRes.errors;
    if (!errors || typeof errors !== "object") return fallback;

    const firstError = Object.values(errors)
      .flatMap((v) => (Array.isArray(v) ? v : []))
      .find((msg) => typeof msg === "string" && msg.trim());

    return typeof firstError === "string" && firstError.trim()
      ? firstError
      : fallback;
  };

  // MultiSelect States
  const [selectedTopNotes, setSelectedTopNotes] = useState<string[]>(
    product?.topNotes ? product.topNotes.split(",") : []
  );
  const [selectedHeartNotes, setSelectedHeartNotes] = useState<string[]>(
    product?.heartNotes ? product.heartNotes.split(",") : []
  );
  const [selectedBaseNotes, setSelectedBaseNotes] = useState<string[]>(
    product?.baseNotes ? product.baseNotes.split(",") : []
  );
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(
    product?.season ? product.season.split(",") : []
  );
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    product?.occasion ? product.occasion.split(",") : []
  );
  const [selectedGender, setSelectedGender] = useState<string[]>(
    product?.gender ? product.gender.split(",") : []
  );

  // Toggles state
  const [hasDecant, setHasDecant] = useState(product?.hasDecant ?? false);
  const [hasFullBottle, setHasFullBottle] = useState(
    product?.hasFullBottle ?? true
  );

  const [bottleVariants, setBottleVariants] = useState<
    { sizeMl: string; price: string; stock: string }[]
  >(() => {
    if (product?.bottleVariants && product.bottleVariants.length > 0) {
      return [...product.bottleVariants]
        .sort((a, b) => a.sizeMl - b.sizeMl)
        .map((v) => ({
          sizeMl: String(v.sizeMl),
          price: v.price ? String(v.price) : "",
          stock: String(v.stock ?? 0),
        }));
    }

    if (product?.hasFullBottle && product.priceFull && product.fullBottleSize) {
      const sizeMl = parseInt(
        String(product.fullBottleSize).replace(/[^0-9]/g, ""),
        10
      );
      return [
        {
          sizeMl: Number.isFinite(sizeMl) && sizeMl > 0 ? String(sizeMl) : "100",
          price: String(product.priceFull),
          stock: String(product.stockFull ?? 0),
        },
      ];
    }

    return [];
  });

  // Default stocks
  // If product exists, use its values, else 0
  const defaultStockFull = product?.stockFull ?? 0;
  const defaultStockDecant5ml = product?.stockDecant5ml ?? 0;
  const defaultStockDecant10ml = product?.stockDecant10ml ?? 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("images", images.join(","));
    if (selectedBrand) {
      formData.set("brandId", selectedBrand);
    }

    formData.set("bottleVariants", JSON.stringify(bottleVariants));

    try {
      if (product) {
        const res = await updateProduct(product.id, formData);
        if (res && typeof res === "object" && "success" in res && res.success === false) {
          toast.error(getServerActionErrorMessage(res));
          return;
        }
      } else {
        const res = await createProduct(formData);
        if (res && typeof res === "object" && "success" in res && res.success === false) {
          toast.error(getServerActionErrorMessage(res));
          return;
        }
      }
    } catch (error) {
      const digest = (error as any)?.digest;
      if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
      toast.error("Error al guardar el producto");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }

    router.push("/panel-admin/productos");
    router.refresh();
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

  const addBottleVariantRow = () => {
    setBottleVariants((prev) => {
      const maxSize = prev.reduce((acc, v) => {
        const n = Number(v.sizeMl);
        return Number.isFinite(n) ? Math.max(acc, n) : acc;
      }, 0);

      const nextSize = maxSize > 0 ? maxSize + 25 : 100;
      return [...prev, { sizeMl: String(nextSize), price: "", stock: "0" }];
    });
  };

  const updateBottleVariant = (
    index: number,
    field: "sizeMl" | "price" | "stock",
    value: string
  ) => {
    setBottleVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const removeBottleVariantRow = (index: number) => {
    setBottleVariants((prev) => prev.filter((_, i) => i !== index));
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
                <Label htmlFor="gender">Género</Label>
                <Select
                  name="gender"
                  defaultValue={product?.gender || "Masculino"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
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
                <Select
                  name="olfactoryFamily"
                  defaultValue={product?.olfactoryFamily || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {OLFACTORY_FAMILIES.map((family) => (
                      <SelectItem key={family} value={family}>
                        {family}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="concentration">Concentración</Label>
                <Select
                  name="concentration"
                  defaultValue={
                    product?.concentration ||
                    CONCENTRATIONS.find((c) => c.includes("EDP")) ||
                    CONCENTRATIONS[0]
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CONCENTRATIONS.map((conc) => (
                      <SelectItem key={conc} value={conc}>
                        {conc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topNotes">Notas de Salida</Label>
                <MultiSelect
                  options={TOP_NOTES}
                  selected={selectedTopNotes}
                  onChange={setSelectedTopNotes}
                  placeholder="Selecciona notas..."
                />
                <input
                  type="hidden"
                  name="topNotes"
                  value={selectedTopNotes.join(",")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartNotes">Notas de Corazón</Label>
                <MultiSelect
                  options={HEART_NOTES}
                  selected={selectedHeartNotes}
                  onChange={setSelectedHeartNotes}
                  placeholder="Selecciona notas..."
                />
                <input
                  type="hidden"
                  name="heartNotes"
                  value={selectedHeartNotes.join(",")}
                />
              </div>
              <Label htmlFor="baseNotes">Notas de Fondo</Label>
              <MultiSelect
                options={BASE_NOTES}
                selected={selectedBaseNotes}
                onChange={setSelectedBaseNotes}
                placeholder="Selecciona notas..."
              />
              <input
                type="hidden"
                name="baseNotes"
                value={selectedBaseNotes.join(",")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="season">Estación</Label>
                <MultiSelect
                  options={SEASONS}
                  selected={selectedSeasons}
                  onChange={setSelectedSeasons}
                  placeholder="Selecciona..."
                />
                <input
                  type="hidden"
                  name="season"
                  value={selectedSeasons.join(",")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occasion">Ocasión</Label>
                <MultiSelect
                  options={OCCASIONS}
                  selected={selectedOccasions}
                  onChange={setSelectedOccasions}
                  placeholder="Selecciona..."
                />
                <input
                  type="hidden"
                  name="occasion"
                  value={selectedOccasions.join(",")}
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
                    <div className="pl-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
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
                        <div>
                          <Label
                            htmlFor="fullBottleSize"
                            className="text-xs text-muted-foreground"
                          >
                            Tamaño (ml)
                          </Label>
                          <Input
                            id="fullBottleSize"
                            name="fullBottleSize"
                            type="text"
                            placeholder="Ej: 100ml"
                            className="mt-1"
                            defaultValue={product?.fullBottleSize || "100ml"}
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="stockFull"
                            className="text-xs text-muted-foreground"
                          >
                            Stock (Unidades)
                          </Label>
                          <Input
                            id="stockFull"
                            name="stockFull"
                            type="number"
                            placeholder="0"
                            className="mt-1"
                            defaultValue={defaultStockFull}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">
                            Presentaciones (ml / precio / stock)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addBottleVariantRow}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Agregar
                          </Button>
                        </div>

                        <input
                          type="hidden"
                          name="bottleVariants"
                          value={JSON.stringify(bottleVariants)}
                        />

                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tamaño (ml)</TableHead>
                                <TableHead>Precio (Bs)</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">
                                  Acción
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {bottleVariants.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    className="text-center text-muted-foreground"
                                  >
                                    Sin presentaciones
                                  </TableCell>
                                </TableRow>
                              ) : (
                                bottleVariants.map((v, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={v.sizeMl}
                                        onChange={(e) =>
                                          updateBottleVariant(
                                            index,
                                            "sizeMl",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={v.price}
                                        onChange={(e) =>
                                          updateBottleVariant(
                                            index,
                                            "price",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={v.stock}
                                        onChange={(e) =>
                                          updateBottleVariant(
                                            index,
                                            "stock",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => removeBottleVariantRow(index)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
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
                    <div className="pl-6 space-y-4">
                      {/* 5ml Section */}
                      <div className="grid grid-cols-2 gap-3 items-end border-b pb-3">
                        <div>
                          <Label
                            htmlFor="priceDecant5ml"
                            className="text-xs text-muted-foreground"
                          >
                            Precio 5ml (Bs)
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
                            htmlFor="stockDecant5ml"
                            className="text-xs text-muted-foreground"
                          >
                            Stock 5ml
                          </Label>
                          <Input
                            id="stockDecant5ml"
                            name="stockDecant5ml"
                            type="number"
                            placeholder="0"
                            className="mt-1"
                            defaultValue={defaultStockDecant5ml}
                          />
                        </div>
                      </div>

                      {/* 10ml Section */}
                      <div className="grid grid-cols-2 gap-3 items-end">
                        <div>
                          <Label
                            htmlFor="priceDecant10ml"
                            className="text-xs text-muted-foreground"
                          >
                            Precio 10ml (Bs)
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
                        <div>
                          <Label
                            htmlFor="stockDecant10ml"
                            className="text-xs text-muted-foreground"
                          >
                            Stock 10ml
                          </Label>
                          <Input
                            id="stockDecant10ml"
                            name="stockDecant10ml"
                            type="number"
                            placeholder="0"
                            className="mt-1"
                            defaultValue={defaultStockDecant10ml}
                          />
                        </div>
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
