import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PLACEHOLDER_IMAGE } from "@/app/(public)/constants";
import { AddToCartButtons } from "./add-to-cart-buttons";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ProductView = {
  id: string;
  name: string;
  description: string;
  images: string[];
  gender: string | null;
  brandName: string | null;
  concentration: string | null;
  hasDecant: boolean;
  priceDecant5ml: number | null;
  priceDecant10ml: number | null;
  stockDecant5ml: number;
  stockDecant10ml: number;
  hasFullBottle: boolean;
  priceFull: number | null;
  fullBottleSize: string | null;
  stockFull: number;
};

// Mock data lookup
const PRODUCTS = [
  {
    id: "1",
    name: "Dior Sauvage Elixir",
    description:
      "Una fragancia concentrada y extraordinaria. Sauvage Elixir reescribe las reglas del perfume masculino explorando los límites de una concentración extrema. Frescura, madera y especias se llevan al límite.",
    priceDecant: 80,
    priceFull: 1200,
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    ],
    category: "Masculino",
  },
  {
    id: "2",
    name: "Creed Aventus",
    description:
      "La fragancia de los reyes. Aventus celebra la fuerza, la visión y el éxito, inspirado en la vida dramática de la guerra, la paz y el romance vivido por el emperador Napoleón.",
    priceDecant: 150,
    priceFull: 2500,
    images: [PLACEHOLDER_IMAGE],
    category: "Masculino",
  },
  {
    id: "3",
    name: "Baccarat Rouge 540",
    description:
      "Luminoso y sofisticado. Baccarat Rouge 540 se posa sobre la piel como un soplo floral ambarino y amaderado. Una alquimia poética.",
    priceDecant: 180,
    priceFull: 3000,
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    ],
    category: "Unisex",
  },
  {
    id: "4",
    name: "Chanel No 5",
    description:
      "La esencia de la feminidad. Un bouquet floral aldehído, mítico y atemporal.",
    priceDecant: 90,
    priceFull: 1400,
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    ],
    category: "Femenino",
  },
  {
    id: "5",
    name: "Tom Ford Oud Wood",
    description:
      "Raro, exótico, distintivo. Uno de los ingredientes más raros, preciosos y caros en el arsenal de un perfumista, la madera de oud se quema a menudo en los templos llenos de incienso de Bhután.",
    priceDecant: 140,
    priceFull: 2200,
    images: [PLACEHOLDER_IMAGE],
    category: "Unisex",
  },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dbProduct = await prisma.product.findUnique({
    where: { id },
    include: { brand: true },
  });

  const mockProduct = PRODUCTS.find((p) => p.id === id);

  if (!dbProduct && !mockProduct) {
    notFound();
  }

  const product: ProductView = dbProduct
    ? {
        id: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description,
        images: dbProduct.images,
        brandName: dbProduct.brand?.name ?? null,
        concentration: dbProduct.concentration ?? null,
        gender: dbProduct.gender ?? null,
        hasDecant: dbProduct.hasDecant,
        priceDecant5ml: dbProduct.priceDecant5ml
          ? Number(dbProduct.priceDecant5ml)
          : null,
        priceDecant10ml: dbProduct.priceDecant10ml
          ? Number(dbProduct.priceDecant10ml)
          : null,
        stockDecant5ml: dbProduct.stockDecant5ml,
        stockDecant10ml: dbProduct.stockDecant10ml,
        hasFullBottle: dbProduct.hasFullBottle,
        priceFull: dbProduct.priceFull ? Number(dbProduct.priceFull) : null,
        fullBottleSize: dbProduct.fullBottleSize ?? null,
        stockFull: dbProduct.stockFull,
      }
    : {
        id: mockProduct!.id,
        name: mockProduct!.name,
        description: mockProduct!.description,
        images: mockProduct!.images,
        gender: mockProduct!.category ?? null,
        brandName: null,
        concentration: null,
        hasDecant: !!mockProduct!.priceDecant,
        priceDecant5ml: null,
        priceDecant10ml: mockProduct!.priceDecant ? Number(mockProduct!.priceDecant) : null,
        stockDecant5ml: 0,
        stockDecant10ml: mockProduct!.priceDecant ? 1 : 0,
        hasFullBottle: !!mockProduct!.priceFull,
        priceFull: mockProduct!.priceFull ? Number(mockProduct!.priceFull) : null,
        fullBottleSize: null,
        stockFull: mockProduct!.priceFull ? 1 : 0,
      };

  const mainImage = product.images?.[0] || PLACEHOLDER_IMAGE;

  const hasDecant5ml =
    product.hasDecant &&
    (product.stockDecant5ml || 0) > 0 &&
    !!product.priceDecant5ml;
  const hasDecant10ml =
    product.hasDecant &&
    (product.stockDecant10ml || 0) > 0 &&
    !!product.priceDecant10ml;
  const hasFullBottle =
    product.hasFullBottle &&
    (product.stockFull || 0) > 0 &&
    !!product.priceFull;

  return (
    <div className="container mx-auto px-4 py-10 lg:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Images */}
        <div className="lg:sticky lg:top-24">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square w-full bg-muted">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center gap-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                {product.gender && (
                  <Badge variant="outline" className="border-primary text-primary">
                    {product.gender}
                  </Badge>
                )}
                {product.brandName && (
                  <Badge variant="secondary">{product.brandName}</Badge>
                )}
                {product.concentration && (
                  <Badge variant="secondary">{product.concentration}</Badge>
                )}
              </div>

              <CardTitle className="text-3xl font-serif font-bold tracking-tight md:text-4xl">
                {product.name}
              </CardTitle>

              <CardDescription className="text-base leading-relaxed">
                {product.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium">Disponibilidad</div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Badge
                      variant="outline"
                      className={
                        (product.stockDecant5ml || 0) > 0
                          ? "border-emerald-500/40 text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      5ml: {product.stockDecant5ml}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        (product.stockDecant10ml || 0) > 0
                          ? "border-emerald-500/40 text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      10ml: {product.stockDecant10ml}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        (product.stockFull || 0) > 0
                          ? "border-emerald-500/40 text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      Full: {product.stockFull}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">Marca</div>
                    <div className="font-medium">
                      {product.brandName || "—"}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">Concentración</div>
                    <div className="font-medium">
                      {product.concentration || "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium">Opciones de compra</div>

                <div className="grid gap-3">
                  <div
                    className={
                      hasDecant5ml
                        ? "flex items-start justify-between gap-6 rounded-lg border bg-card/50 p-4"
                        : "flex items-start justify-between gap-6 rounded-lg border bg-muted/20 p-4 opacity-60"
                    }
                  >
                    <div>
                      <div className="font-medium">Decant 5ml</div>
                      <div className="text-sm text-muted-foreground">
                        Ideal para probar
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Stock: {product.stockDecant5ml}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {product.priceDecant5ml ? `Bs ${product.priceDecant5ml}` : "—"}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      hasDecant10ml
                        ? "flex items-start justify-between gap-6 rounded-lg border bg-card/50 p-4"
                        : "flex items-start justify-between gap-6 rounded-lg border bg-muted/20 p-4 opacity-60"
                    }
                  >
                    <div>
                      <div className="font-medium">Decant 10ml</div>
                      <div className="text-sm text-muted-foreground">
                        Más rendimiento
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Stock: {product.stockDecant10ml}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {product.priceDecant10ml ? `Bs ${product.priceDecant10ml}` : "—"}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      hasFullBottle
                        ? "flex items-start justify-between gap-6 rounded-lg border bg-card/50 p-4"
                        : "flex items-start justify-between gap-6 rounded-lg border bg-muted/20 p-4 opacity-60"
                    }
                  >
                    <div>
                      <div className="font-medium">
                        Botella Full{product.fullBottleSize ? ` ${product.fullBottleSize}` : ""}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.fullBottleSize
                          ? `Presentación ${product.fullBottleSize}`
                          : "Presentación original"}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Stock: {product.stockFull}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {product.priceFull ? `Bs ${product.priceFull}` : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <AddToCartButtons product={product} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
