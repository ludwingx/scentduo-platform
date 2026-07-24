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
import {
  X,
  Plus,
  Trash2,
  Clock,
  Sliders,
  ChevronDown,
  ChevronUp,
  Package,
  Image as ImageIcon,
  Tag,
  Eye,
  Save,
  CheckCircle2,
  Droplets,
} from "lucide-react";
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
  LONGEVITY_OPTIONS,
  SILLAGE_OPTIONS,
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
import { Badge } from "@/components/ui/badge";

interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  brandId?: string | null;
  olfactoryFamily?: string | null;
  topNotes?: string | null;
  heartNotes?: string | null;
  baseNotes?: string | null;
  concentration?: string | null;
  gender?: string | null;
  season?: string | null;
  occasion?: string | null;
  hasDecant: boolean;
  priceDecant5ml: any;
  priceDecant10ml: any;
  hasFullBottle: boolean;
  priceFull: any;
  fullBottleSize?: string | null;
  stockFull: number;
  bottleVariants?: { sizeMl: number; price: any; stock: number }[];
  stockDecant5ml: number;
  stockDecant10ml: number;
  longevity?: string | null;
  sillage?: string | null;
  allowReservation?: boolean;
  estimatedRestockDays?: number | null;
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

  const [hasDecant, setHasDecant] = useState(product?.hasDecant ?? false);
  const [hasFullBottle, setHasFullBottle] = useState(
    product?.hasFullBottle ?? true
  );

  const [priceFullInput, setPriceFullInput] = useState<string>(
    product?.priceFull ? String(product.priceFull) : ""
  );
  const [fullBottleSizeInput, setFullBottleSizeInput] = useState<string>(
    product?.fullBottleSize || "100ml"
  );
  const [priceDecant5ml, setPriceDecant5ml] = useState<string>(
    product?.priceDecant5ml ? String(product.priceDecant5ml) : ""
  );
  const [priceDecant10ml, setPriceDecant10ml] = useState<string>(
    product?.priceDecant10ml ? String(product.priceDecant10ml) : ""
  );

  const [showOlfactoryDetails, setShowOlfactoryDetails] = useState(
    Boolean(
      product?.topNotes ||
        product?.heartNotes ||
        product?.baseNotes ||
        product?.olfactoryFamily ||
        product?.season ||
        product?.occasion
    )
  );
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(
    Boolean(product?.longevity || product?.sillage)
  );
  const [allowReservation, setAllowReservation] = useState<boolean>(
    product?.allowReservation ?? true
  );
  const [estimatedRestockDays, setEstimatedRestockDays] = useState<string>(
    product?.estimatedRestockDays ? String(product.estimatedRestockDays) : "7"
  );
  const [longevity, setLongevity] = useState<string>(product?.longevity || "");
  const [sillage, setSillage] = useState<string>(product?.sillage || "");

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
      toast.success("Marca creada correctamente");
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Columna Principal (2/3 en Pantallas Grandes, 1/1 en Móviles y Tablets) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Card 1: Información Básica */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 border-b pb-3">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Información General</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium">
                  Nombre del Producto *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ej: Baccarat Rouge 540"
                  defaultValue={product?.name}
                  className="text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="font-medium">Marca o Casa de Perfumería</Label>
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
                              placeholder="Ej: Maison Francis Kurkdjian"
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

                <div className="space-y-2">
                  <Label htmlFor="gender" className="font-medium">
                    Género
                  </Label>
                  <Select
                    name="gender"
                    defaultValue={product?.gender || "Unisex"}
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
                <Label htmlFor="description" className="font-medium">
                  Descripción Comercial *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe la personalidad, aromas y características del perfume..."
                  rows={4}
                  defaultValue={product?.description}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Multimedia */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Galería de Fotos</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {images.length} foto{images.length === 1 ? "" : "s"}
                </Badge>
              </div>

              <div className="space-y-3">
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square group rounded-lg overflow-hidden border bg-muted"
                      >
                        <Image
                          src={img}
                          alt={`Imagen ${index + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {index === 0 && (
                          <Badge className="absolute top-2 left-2 bg-primary text-[10px] shadow">
                            Portada
                          </Badge>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-2 border-dashed rounded-xl p-6 bg-muted/30 text-center hover:bg-muted/50 transition-colors">
                  <UploadButton
                    endpoint="productImage"
                    onClientUploadComplete={(res) => {
                      if (res) {
                        const newImages = res.map((file) => file.url);
                        setImages([...images, ...newImages]);
                        toast.success("Imágenes cargadas correctamente");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Error de carga: ${error.message}`);
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Sube imágenes de alta resolución en formato JPG, PNG o WebP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Variantes y Precios de Venta */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="flex items-center gap-2 border-b pb-3">
                <Tag className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">
                  Precios y Modalidades de Venta
                </h3>
              </div>

              {/* Botella Completa */}
              <div className="space-y-4 rounded-xl border p-4 bg-card">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasFullBottle"
                    name="hasFullBottle"
                    className="h-5 w-5 rounded border-gray-300 accent-primary cursor-pointer"
                    checked={hasFullBottle}
                    onChange={(e) => setHasFullBottle(e.target.checked)}
                  />
                  <Label
                    htmlFor="hasFullBottle"
                    className="text-base font-semibold cursor-pointer"
                  >
                    Venta por Botella Completa (Original / Tester)
                  </Label>
                </div>

                {hasFullBottle && (
                  <div className="pl-0 sm:pl-8 space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priceFull" className="text-xs font-medium">
                          Precio Principal (Bs)
                        </Label>
                        <Input
                          id="priceFull"
                          name="priceFull"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="mt-1"
                          value={priceFullInput}
                          onChange={(e) => setPriceFullInput(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fullBottleSize" className="text-xs font-medium">
                          Tamaño de Botella (ml)
                        </Label>
                        <Input
                          id="fullBottleSize"
                          name="fullBottleSize"
                          type="text"
                          placeholder="Ej: 100ml"
                          className="mt-1"
                          value={fullBottleSizeInput}
                          onChange={(e) => setFullBottleSizeInput(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Tabla de Presentaciones Adicionales */}
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Otras Presentaciones de Botellas Completa
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addBottleVariantRow}
                          className="text-xs gap-1"
                        >
                          <Plus className="h-3.5 w-3.5" /> Agregar Tamaño
                        </Button>
                      </div>

                      {bottleVariants.length > 0 && (
                        <div className="border rounded-lg overflow-x-auto">
                          <Table className="min-w-[400px]">
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead className="text-xs">Tamaño (ml)</TableHead>
                                <TableHead className="text-xs">Precio (Bs)</TableHead>
                                <TableHead className="text-xs">Stock</TableHead>
                                <TableHead className="text-xs text-right">Acción</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {bottleVariants.map((v, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={v.sizeMl}
                                      onChange={(e) =>
                                        updateBottleVariant(index, "sizeMl", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={v.price}
                                      onChange={(e) =>
                                        updateBottleVariant(index, "price", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={v.stock}
                                      onChange={(e) =>
                                        updateBottleVariant(index, "stock", e.target.value)
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
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Decants */}
              <div className="space-y-4 rounded-xl border p-4 bg-card">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasDecant"
                    name="hasDecant"
                    className="h-5 w-5 rounded border-gray-300 accent-primary cursor-pointer"
                    checked={hasDecant}
                    onChange={(e) => setHasDecant(e.target.checked)}
                  />
                  <Label
                    htmlFor="hasDecant"
                    className="text-base font-semibold cursor-pointer flex items-center gap-2"
                  >
                    <Droplets className="h-4 w-4 text-primary" /> Venta por Decants / Fraccionados
                  </Label>
                </div>

                {hasDecant && (
                  <div className="pl-0 sm:pl-8 space-y-4 pt-2">
                    {/* 5ml Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4">
                      <div>
                        <Label htmlFor="priceDecant5ml" className="text-xs font-medium">
                          Precio Decant 5ml (Bs)
                        </Label>
                        <Input
                          id="priceDecant5ml"
                          name="priceDecant5ml"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="mt-1"
                          value={priceDecant5ml}
                          onChange={(e) => setPriceDecant5ml(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="stockDecant5ml" className="text-xs font-medium">
                          Stock Disponible (5ml)
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priceDecant10ml" className="text-xs font-medium">
                          Precio Decant 10ml (Bs)
                        </Label>
                        <Input
                          id="priceDecant10ml"
                          name="priceDecant10ml"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="mt-1"
                          value={priceDecant10ml}
                          onChange={(e) => setPriceDecant10ml(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="stockDecant10ml" className="text-xs font-medium">
                          Stock Disponible (10ml)
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
            </CardContent>
          </Card>

          {/* Card 4: Perfil Olfativo (Opcional) */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Perfil Olfativo & Pirámide</h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                  onClick={() => setShowOlfactoryDetails(!showOlfactoryDetails)}
                >
                  {showOlfactoryDetails ? (
                    <>
                      <ChevronUp className="h-4 w-4" /> Ocultar campos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" /> Especificar notas
                    </>
                  )}
                </Button>
              </div>

              {showOlfactoryDetails && (
                <div className="space-y-4 pt-2 animate-in fade-in-50 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                    <div className="space-y-2 sm:col-span-2 md:col-span-1">
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="season">Estación Recomendada</Label>
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
                      <Label htmlFor="occasion">Ocasión Recomendada</Label>
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 5: Rendimiento (Opcional) */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Ficha de Rendimiento</h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                  onClick={() => setShowPerformanceDetails(!showPerformanceDetails)}
                >
                  {showPerformanceDetails ? (
                    <>
                      <ChevronUp className="h-4 w-4" /> Ocultar rendimiento
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" /> Añadir longevidad y estela
                    </>
                  )}
                </Button>
              </div>

              {showPerformanceDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-in fade-in-50 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="longevity">Longevidad / Duración</Label>
                    <Select name="longevity" value={longevity} onValueChange={setLongevity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar duración..." />
                      </SelectTrigger>
                      <SelectContent>
                        {LONGEVITY_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sillage">Estela / Proyección (Sillage)</Label>
                    <Select name="sillage" value={sillage} onValueChange={setSillage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estela..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SILLAGE_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna Lateral (1/3 en Pantallas Extra Grandes, 1/1 en Pantallas Menores) */}
        <div className="space-y-6">
          <Card className="shadow-sm xl:sticky xl:top-6">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 border-b pb-3">
                <Eye className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Estado & Publicación</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    className="mt-1 h-5 w-5 rounded border-gray-300 accent-primary cursor-pointer"
                    defaultChecked={product?.isActive ?? true}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="isActive"
                      className="font-semibold cursor-pointer"
                    >
                      Producto Activo
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Visible para los clientes en la tienda pública.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    className="mt-1 h-5 w-5 rounded border-gray-300 accent-primary cursor-pointer"
                    defaultChecked={product?.isFeatured ?? false}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="isFeatured"
                      className="font-semibold cursor-pointer"
                    >
                      Destacado en Portada
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Aparece en la sección principal y recomendaciones.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    id="allowReservation"
                    name="allowReservation"
                    className="mt-1 h-5 w-5 rounded border-gray-300 accent-primary cursor-pointer"
                    checked={allowReservation}
                    onChange={(e) => setAllowReservation(e.target.checked)}
                  />
                  <div className="space-y-1 w-full">
                    <Label
                      htmlFor="allowReservation"
                      className="font-semibold cursor-pointer"
                    >
                      Permitir Reservas sin Stock
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      El cliente puede encargar o reservar cuando esté agotado.
                    </p>
                    {allowReservation && (
                      <div className="pt-2">
                        <Label
                          htmlFor="estimatedRestockDays"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Días estimados de reposición
                        </Label>
                        <Input
                          id="estimatedRestockDays"
                          name="estimatedRestockDays"
                          type="number"
                          min="1"
                          value={estimatedRestockDays}
                          onChange={(e) => setEstimatedRestockDays(e.target.value)}
                          className="mt-1 h-8 text-xs"
                          placeholder="Ej: 7"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2 text-base py-6 shadow-md"
                  size="lg"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  {isSubmitting
                    ? "Guardando..."
                    : product
                      ? "Actualizar Producto"
                      : "Guardar Perfume"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/panel-admin/productos")}
                >
                  Volver a la Lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
