import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLACEHOLDER_IMAGE } from "@/app/(public)/constants";
import { AddToCartButtons } from "./add-to-cart-buttons";

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
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <Badge
              variant="outline"
              className="mb-2 border-primary text-primary"
            >
              {product.category}
            </Badge>
            <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-serif font-semibold">
              Opciones de compra:
            </h3>
            <div className="grid gap-4">
              {product.priceDecant && (
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                  <div>
                    <span className="font-medium block">Decant 10ml</span>
                    <span className="text-sm text-muted-foreground">
                      Ideal para probar
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold block">
                      Bs {product.priceDecant}
                    </span>
                  </div>
                </div>
              )}
              {product.priceFull && (
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                  <div>
                    <span className="font-medium block">Botella Full</span>
                    <span className="text-sm text-muted-foreground">
                      Presentación original
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold block">
                      Bs {product.priceFull}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <AddToCartButtons product={product} />
        </div>
      </div>
    </div>
  );
}
