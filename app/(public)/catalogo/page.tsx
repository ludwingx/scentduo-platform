"use client";

import { Suspense, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/app/(public)/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const PRODUCTS = [
  {
    id: "1",
    name: "Dior Sauvage Elixir",
    description: "Una fragancia concentrada y extraordinaria.",
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
  },
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
  {
    id: "5",
    name: "Tom Ford Oud Wood",
    description: "Raro, exótico, distintivo.",
    category: "Unisex",
    images: [PLACEHOLDER_IMAGE],
    hasDecant: true,
    priceDecant5ml: 85,
    priceDecant10ml: 140,
    stockDecant5ml: 0, // Out of stock
    stockDecant10ml: 0, // Out of stock
    hasFullBottle: true,
    priceFull: 2200,
    fullBottleSize: "100ml",
    stockFull: 0, // Out of stock
  },
];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("name");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // Filter and sort products
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    // Price filter based on lowest available price
    const lowestPrice = Math.min(
      product.hasDecant && product.priceDecant5ml
        ? product.priceDecant5ml
        : Infinity,
      product.hasDecant && product.priceDecant10ml
        ? product.priceDecant10ml
        : Infinity,
      product.hasFullBottle && product.priceFull ? product.priceFull : Infinity
    );
    const matchesPrice =
      lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1];

    // Availability filter
    let matchesAvailability = true;
    if (availabilityFilter === "decant") {
      matchesAvailability =
        product.hasDecant &&
        ((product.stockDecant5ml || 0) > 0 ||
          (product.stockDecant10ml || 0) > 0);
    } else if (availabilityFilter === "full") {
      matchesAvailability =
        product.hasFullBottle && (product.stockFull || 0) > 0;
    } else if (availabilityFilter === "in-stock") {
      matchesAvailability =
        (product.hasDecant &&
          ((product.stockDecant5ml || 0) > 0 ||
            (product.stockDecant10ml || 0) > 0)) ||
        (product.hasFullBottle && (product.stockFull || 0) > 0);
    }

    return (
      matchesSearch && matchesCategory && matchesPrice && matchesAvailability
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        const priceA = Math.min(
          a.priceDecant5ml || Infinity,
          a.priceDecant10ml || Infinity,
          a.priceFull || Infinity
        );
        const priceB = Math.min(
          b.priceDecant5ml || Infinity,
          b.priceDecant10ml || Infinity,
          b.priceFull || Infinity
        );
        return priceA - priceB;
      case "price-high":
        const priceA2 = Math.max(
          a.priceDecant5ml || 0,
          a.priceDecant10ml || 0,
          a.priceFull || 0
        );
        const priceB2 = Math.max(
          b.priceDecant5ml || 0,
          b.priceDecant10ml || 0,
          b.priceFull || 0
        );
        return priceB2 - priceA2;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 200 ? 1 : 0) +
    (availabilityFilter !== "all" ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 200]);
    setSortBy("name");
    setAvailabilityFilter("all");
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 pt-24 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            Catálogo
          </h1>
          <p className="text-sm text-gray-400">
            {filteredProducts.length} producto
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar perfumes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nombre (A-Z)</SelectItem>
              <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-gold text-black rounded-full px-2 py-0.5 text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Category Filter */}
                <div className="space-y-3">
                  <Label>Categoría</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Filter */}
                <div className="space-y-3">
                  <Label>Disponibilidad</Label>
                  <Select
                    value={availabilityFilter}
                    onValueChange={setAvailabilityFilter}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="in-stock">En Stock</SelectItem>
                      <SelectItem value="decant">Solo Decants</SelectItem>
                      <SelectItem value="full">Solo Perfumes Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <Label>
                    Rango de Precio: Bs {priceRange[0]} - Bs {priceRange[1]}
                  </Label>
                  <Slider
                    min={0}
                    max={200}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>

                {/* Reset Button */}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar Filtros
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "all" && (
              <div className="bg-gold/10 border border-gold/20 text-gold px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {availabilityFilter !== "all" && (
              <div className="bg-gold/10 border border-gold/20 text-gold px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {availabilityFilter === "decant"
                  ? "Solo Decants"
                  : availabilityFilter === "full"
                  ? "Solo Full"
                  : "En Stock"}
                <button
                  onClick={() => setAvailabilityFilter("all")}
                  className="hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {(priceRange[0] !== 0 || priceRange[1] !== 200) && (
              <div className="bg-gold/10 border border-gold/20 text-gold px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Bs {priceRange[0]} - Bs {priceRange[1]}
                <button
                  onClick={() => setPriceRange([0, 200])}
                  className="hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <Suspense
        fallback={
          <div className="text-center py-12">Cargando productos...</div>
        }
      >
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">
              No se encontraron productos
            </p>
            <Button onClick={resetFilters} variant="outline">
              Limpiar Filtros
            </Button>
          </div>
        )}
      </Suspense>
    </div>
  );
}
