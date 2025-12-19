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
  name: "Baccarat Rouge 540 Extrait",
  description: "Una alquimia poética, intensa y gráfica",
  // category: "Unisex", // Removed
  images: [
    "https://aromadrop.mu/cdn/shop/files/baccarat_extrait_aa8fd775-1ad1-40ef-ad1d-907cb703f91d.png?v=1700907097",
  ],
  hasDecant: true,
  priceDecant5ml: 120,
  priceDecant10ml: 220,
  stockDecant5ml: 10,
  stockDecant10ml: 15,
  hasFullBottle: true,
  priceFull: 3500,
  fullBottleSize: "70ml",
  stockFull: 3,
  originalPrice: 150, // Reference price for 5/10ml display usually
  badge: "Más Vendido",
  discount: 20,
};

// Mock data for featured products section
const FEATURED_PRODUCTS = [
  {
    id: "2",
    name: "Creed Aventus",
    description: "La fragancia de los reyes.",
    // category: "Masculino", // Removed
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
    // category: "Unisex", // Removed
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
    // category: "Femenino", // Removed
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
    <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
      {/* Hero Section - Product Left, Brand Right */}
      <section className="container mx-auto px-4 min-h-[calc(100vh-80px)] flex flex-col justify-center py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center max-w-7xl mx-auto w-full">
          {/* Left: Brand & Slogan (Top on mobile) */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-8 order-1 lg:order-2 text-center lg:text-left min-h-[75vh] lg:min-h-0 lg:pt-0">
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-serif font-bold tracking-tight leading-none mb-4">
                SCENT <span className="text-gold">DUO</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-light italic mb-4 md:mb-6">
                Fragancias que hablan por vos.
              </p>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Perfumes originales y de alta duración.
              </p>
            </div>

            {/* Info Points */}
            <div className="space-y-3 flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-3 text-gray-300 text-sm sm:text-base">
                <Package className="h-5 w-5 text-gold flex-shrink-0" />
                <span>Envíos a toda Bolivia</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm sm:text-base">
                <Send className="h-5 w-5 text-gold flex-shrink-0" />
                <span>Pedidos por WhatsApp</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 flex justify-center lg:justify-start">
              <Link href="/catalogo">
                <Button
                  size="default"
                  className="w-full cursor-pointer hover:opacity-90 sm:w-auto px-10 py-7 rounded-full bg-gold text-black hover:opacity-90 font-bold text-lg shadow-xl hover:shadow-gold/20 transition-all"
                >
                  Explorar Catálogo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Featured Product (Bottom on mobile) */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-end">
            {/* Contenedor del producto, ahora centrado en la imagen con la info superpuesta */}
            <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] p-4 sm:p-6">
              {/* Product Image */}
              <div className="relative aspect-square w-full">
                <Image
                  src={FEATURED_HERO_PRODUCT.images[0]}
                  alt={FEATURED_HERO_PRODUCT.name}
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Product Info - Posicionado A LA IZQUIERDA Y ARRIBA UN POCO */}
              <div className="absolute **bottom-4** left-0 w-[62%] sm:w-[60%] lg:w-[55%] flex flex-col items-start space-y-2 p-3 rounded-xl shadow-2xl shadow-gold/10">
                {/* Badge & Name */}
                <div className="text-left">
                  <span className="bg-gold text-black text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded block mb-1">
                    {FEATURED_HERO_PRODUCT.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white line-clamp-1">
                    {FEATURED_HERO_PRODUCT.name}
                  </h3>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline justify-start gap-2">
                  <span className="text-3xl font-extrabold text-gold">
                    Bs {FEATURED_HERO_PRODUCT.priceDecant10ml}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    Bs {FEATURED_HERO_PRODUCT.originalPrice}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href={`/producto/${FEATURED_HERO_PRODUCT.id}`}
                  className="w-full mt-2"
                >
                  <Button className="w-full cursor-pointer hover:opacity-90 py-2 sm:py-3 rounded-full bg-gold text-black hover:bg-gold/90 font-bold flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg">
                    <ShoppingCart className="h-4 w-4" />
                    Comprar Ahora
                  </Button>
                </Link>
              </div>

              {/* Discount Badge - Se mantiene arriba a la derecha */}
              <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg z-10">
                <Sparkles className="h-3 w-3" />
                {FEATURED_HERO_PRODUCT.discount}% OFF
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
      {/* <CategoriesGrid /> */}
      <StorySection />
      <NewsletterSection />
    </div>
  );
}
