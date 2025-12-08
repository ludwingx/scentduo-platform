import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_IMAGE } from "@/app/(public)/constants";
import {
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Package,
  Send,
} from "lucide-react";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import BenefitsSection from "./components/BenefitsSection";
import CategoriesGrid from "./components/CategoriesGrid";
import StorySection from "./components/StorySection";
import NewsletterSection from "./components/NewsletterSection";
import Image from "next/image";

// Featured product for Hero
const FEATURED_HERO_PRODUCT = {
  id: "1",
  name: "Dior Sauvage Elixir",
  description: "Fragancia concentrada y extraordinaria",
  category: "Masculino",
  images: [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
  ],
  hasDecant: true,
  priceDecant5ml: 50,
  priceDecant10ml: 80,
  stockDecant5ml: 10,
  stockDecant10ml: 15,
  hasFullBottle: true,
  priceFull: 1200,
  fullBottleSize: "100ml",
  stockFull: 3,
  originalPrice: 120,
  badge: "Oferta Especial",
  discount: 33,
};

// Mock data for featured products section
const FEATURED_PRODUCTS = [
  {
    id: "2",
    name: "Creed Aventus",
    description: "La fragancia de los reyes.",
    category: "Masculino",
    images: [PLACEHOLDER_IMAGE],
    hasDecant: true,
    priceDecant5ml: 90,
    priceDecant10ml: 150,
    stockDecant5ml: 5,
    stockDecant10ml: 8,
    hasFullBottle: false,
  },
  {
    id: "3",
    name: "Baccarat Rouge 540",
    description: "Luminoso y sofisticado.",
    category: "Unisex",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    ],
    hasDecant: true,
    priceDecant5ml: 110,
    priceDecant10ml: 180,
    stockDecant5ml: 3,
    stockDecant10ml: 5,
    hasFullBottle: true,
    priceFull: 3000,
    fullBottleSize: "70ml",
    stockFull: 2,
  },
  {
    id: "4",
    name: "Chanel No 5",
    description: "La esencia de la feminidad.",
    category: "Femenino",
    images: [PLACEHOLDER_IMAGE],
    hasDecant: false,
    hasFullBottle: true,
    priceFull: 1400,
    fullBottleSize: "50ml",
    stockFull: 4,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 pb-6 md:pb-8 lg:pb-10">
      {/* Hero Section - Product Left, Brand Right */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-6 pt-20 sm:pt-22 md:pt-24 pb-6 sm:pb-8 md:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left: Brand & Slogan (Top on mobile) */}
          <div className="flex flex-col justify-center space-y-4 md:space-y-6 order-1 lg:order-2">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight mb-2 md:mb-3">
                SCENT <span className="text-gold">DUO</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light italic mb-3 md:mb-4">
                Fragancias que hablan por vos.
              </p>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-lg">
                Perfumes originales y de alta duración.
              </p>
            </div>

            {/* Info Points */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Package className="h-4 w-4 text-gold flex-shrink-0" />
                <span>Envíos a toda Bolivia</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Send className="h-4 w-4 text-gold flex-shrink-0" />
                <span>Pedidos por WhatsApp</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link href="/catalogo">
                <Button
                  size="default"
                  className="w-full sm:w-auto px-6 py-4 sm:px-7 sm:py-5 rounded-full bg-gold text-black hover:opacity-90 font-bold text-sm sm:text-base"
                >
                  Explorar Catálogo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Featured Product (Bottom on mobile) */}
          <div className="relative order-2 lg:order-1">
            {/* Product Card */}
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-5 md:p-6 shadow-xl sm:shadow-2xl">
              {/* Discount Badge */}
              <div className="absolute -top-2 -right-2 bg-gold text-black px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg z-10">
                <Sparkles className="h-3 w-3" />
                {FEATURED_HERO_PRODUCT.discount}% OFF
              </div>

              {/* Product Image */}
              <div className="relative aspect-square w-full mb-3 sm:mb-4">
                <Image
                  src={FEATURED_HERO_PRODUCT.images[0]}
                  alt={FEATURED_HERO_PRODUCT.name}
                  fill
                  className="object-contain p-2"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="text-gold text-xs font-bold uppercase tracking-wider">
                    {FEATURED_HERO_PRODUCT.badge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1 line-clamp-1">
                    {FEATURED_HERO_PRODUCT.name}
                  </h3>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gold">
                    Bs {FEATURED_HERO_PRODUCT.priceDecant10ml}
                  </span>
                  <span className="text-base text-gray-500 line-through">
                    Bs {FEATURED_HERO_PRODUCT.originalPrice}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href={`/producto/${FEATURED_HERO_PRODUCT.id}`}
                  className="block"
                >
                  <Button className="w-full py-3 sm:py-4 rounded-full bg-gold text-black hover:opacity-90 font-bold flex items-center justify-center gap-1 text-sm">
                    <ShoppingCart className="h-3 w-3" />
                    Comprar Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Más Destacados
          </h2>
          <Link
            href="/catalogo"
            className="text-primary hover:underline flex items-center gap-1 text-sm sm:text-base"
          >
            Ver todos <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-8 sm:py-12">
              Cargando destacados...
            </div>
          }
        >
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>
      </section>

      <BenefitsSection />
      <CategoriesGrid />
      <StorySection />
      <NewsletterSection />
    </div>
  );
}
