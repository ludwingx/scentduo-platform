"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Package,
  Send,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  X,
  Search,
  Filter,
  Heart,
  Star,
  Check,
  ChevronDown,
  Menu,
} from "lucide-react";

// ==========================================
// MOCK DATA (Safe, realistic data)
// ==========================================

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Baccarat Rouge 540 Extrait",
    description: "Una alquimia poética, intensa y gráfica",
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
    originalPrice: 150,
    badge: "Más Vendido",
    discount: 20,
    rating: 5,
    reviews: 128,
  },
  {
    id: "2",
    name: "Creed Aventus",
    description: "La fragancia de los reyes. Notas de piña, bergamota y roble.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261d?q=80&w=1000&auto=format&fit=crop",
    ],
    hasDecant: true,
    priceDecant5ml: 90,
    priceDecant10ml: 150,
    stockDecant5ml: 5,
    stockDecant10ml: 8,
    hasFullBottle: false,
    rating: 5,
    reviews: 96,
  },
  {
    id: "3",
    name: "Baccarat Rouge 540",
    description: "Luminoso y sofisticado. Ambar cedro y jazmín.",
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
    rating: 5,
    reviews: 84,
  },
  {
    id: "4",
    name: "Chanel No 5",
    description: "La esencia de la feminidad. Floral y atemporal.",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    ],
    hasDecant: false,
    hasFullBottle: true,
    priceFull: 1400,
    fullBottleSize: "50ml",
    stockFull: 4,
    rating: 5,
    reviews: 256,
  },
  {
    id: "5",
    name: "Dior Sauvage",
    description: "Fresco y salvaje. Notas de bergamota y pimienta.",
    images: [
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1000&auto=format&fit=crop",
    ],
    hasDecant: true,
    priceDecant5ml: 80,
    priceDecant10ml: 140,
    stockDecant5ml: 8,
    stockDecant10ml: 12,
    hasFullBottle: true,
    priceFull: 1800,
    fullBottleSize: "100ml",
    stockFull: 5,
    rating: 4,
    reviews: 72,
  },
  {
    id: "6",
    name: "Tom Ford Black Orchid",
    description: "Misterioso y seductor. Vainilla y orquídea negra.",
    images: [
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=1000&auto=format&fit=crop",
    ],
    hasDecant: true,
    priceDecant5ml: 100,
    priceDecant10ml: 170,
    stockDecant5ml: 6,
    stockDecant10ml: 9,
    hasFullBottle: true,
    priceFull: 2800,
    fullBottleSize: "100ml",
    stockFull: 3,
    badge: "Premium",
    rating: 5,
    reviews: 64,
  },
];

const FEATURED_HERO_PRODUCT = MOCK_PRODUCTS[0];

// ==========================================
// UTILITY COMPONENTS
// ==========================================

function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gold/50";

  const variants = {
    default:
      "bg-gold text-black hover:bg-gold/90 shadow-lg hover:shadow-gold/20",
    outline:
      "border border-gold/50 hover:bg-gold/10 hover:text-gold bg-transparent text-foreground",
    ghost: "hover:bg-gold/10 hover:text-gold bg-transparent text-foreground",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-600/20",
  };

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-10 px-6 text-base",
    icon: "h-9 w-9 p-0",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-card text-card-foreground flex flex-col rounded-xl border border-border shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 pt-6 pb-2 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

function CardFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 pb-6 pt-0 ${className}`}>{children}</div>;
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "destructive" | "secondary" }) {
  const variants = {
    default: "bg-gold text-black",
    destructive: "bg-red-600 text-white",
    secondary: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ScentDuoApp() {
  // Cart state
  const [cartItems, setCartItems] = useState<Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variant: "decant-5ml" | "decant-10ml" | "original";
  }>>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Product selection state
  const [selectedDecantSizes, setSelectedDecantSizes] = useState<
    Record<string, "5ml" | "10ml">
  >({});

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "decant" | "full">("all");

  // Wishlist state
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "info";
  }>({ show: false, message: "", type: "success" });

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "decant" && product.hasDecant) ||
      (selectedCategory === "full" && product.hasFullBottle);

    return matchesSearch && matchesCategory;
  });

  // Cart functions
  const addToCart = (
    product: typeof MOCK_PRODUCTS[0],
    variant: "decant-5ml" | "decant-10ml" | "original"
  ) => {
    let price: number;
    if (variant === "decant-5ml") price = product.priceDecant5ml!;
    else if (variant === "decant-10ml") price = product.priceDecant10ml!;
    else price = product.priceFull!;

    const existingItem = cartItems.find(
      (item) => item.id === product.id && item.variant === variant
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id && item.variant === variant
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price,
          image: product.images[0],
          quantity: 1,
          variant,
        },
      ]);
    }

    showNotification("Producto agregado al carrito", "success");
  };

  const removeFromCart = (id: string, variant: string) => {
    setCartItems(cartItems.filter((item) => !(item.id === id && item.variant === variant)));
  };

  const updateQuantity = (id: string, variant: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id, variant);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id && item.variant === variant
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Wishlist functions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        showNotification("Eliminado de favoritos", "info");
      } else {
        newWishlist.add(productId);
        showNotification("Agregado a favoritos", "success");
      }
      return newWishlist;
    });
  };

  // Notification
  const showNotification = (message: string, type: "success" | "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  // WhatsApp checkout simulation
  const handleCheckout = () => {
    const orderLines = cartItems
      .map((item) => {
        const variantLabel =
          item.variant === "decant-5ml"
            ? "Decant 5ml"
            : item.variant === "decant-10ml"
            ? "Decant 10ml"
            : "Botella Full";
        return `- ${item.name} (${variantLabel}) x${item.quantity} = Bs ${item.price * item.quantity}`;
      })
      .join("\n");

    const message = `Hola! Quiero este pedido:\n\n${orderLines}\n\nTotal: Bs ${cartTotal}\n\nMi nombre: ...\nMi celular: ...`;

    // Simulate opening WhatsApp
    showNotification("Redirigiendo a WhatsApp...", "success");
    console.log("WhatsApp message:", message);
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#0A0A0A] text-white font-sans">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === "success" ? "bg-gold text-black" : "bg-muted text-foreground"
            }`}
          >
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-gold/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold tracking-tight">
                SCENT <span className="text-gold">DUO</span>
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar perfumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-gold/30 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlist.size > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-black text-xs rounded-full flex items-center justify-center font-bold">
                    {wishlist.size}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-black text-xs rounded-full flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-gold/30 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex items-center py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
            {/* Left: Featured Product */}
            <div className="relative flex justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-[380px] p-4">
                {/* Product Image */}
                <div className="relative aspect-square w-full bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl overflow-hidden border border-gold/20">
                  <img
                    src={FEATURED_HERO_PRODUCT.images[0]}
                    alt={FEATURED_HERO_PRODUCT.name}
                    className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Info Overlay */}
                <div className="absolute bottom-4 left-0 w-[60%] flex flex-col items-start space-y-2 p-4 rounded-xl bg-[#0A0A0A]/90 backdrop-blur-sm border border-gold/30 shadow-2xl shadow-gold/10">
                  <Badge>{FEATURED_HERO_PRODUCT.badge}</Badge>
                  <h3 className="text-xl font-serif font-bold text-white line-clamp-1">
                    {FEATURED_HERO_PRODUCT.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-gold">
                      Bs {FEATURED_HERO_PRODUCT.priceDecant10ml}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      Bs {FEATURED_HERO_PRODUCT.originalPrice}
                    </span>
                  </div>
                  <Button
                    className="w-full mt-2"
                    onClick={() => {
                      setSelectedDecantSizes((prev) => ({ ...prev, [FEATURED_HERO_PRODUCT.id]: "10ml" }));
                      addToCart(FEATURED_HERO_PRODUCT, "decant-10ml");
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar Ahora
                  </Button>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  {FEATURED_HERO_PRODUCT.discount}% OFF
                </div>
              </div>
            </div>

            {/* Right: Brand Info */}
            <div className="flex flex-col justify-center space-y-6 order-1 lg:order-2 text-center lg:text-left">
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-none mb-4">
                  SCENT <span className="text-gold">DUO</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 font-light italic mb-4">
                  Fragancias que hablan por vos.
                </p>
                <p className="text-base text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Perfumes originales y de alta duración. Envíos a toda Bolivia.
                </p>
              </div>

              {/* Info Points */}
              <div className="space-y-3 flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <Package className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>Envíos a toda Bolivia</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <Send className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>Pedidos por WhatsApp</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 flex justify-center lg:justify-start">
                <Button size="lg" className="w-full sm:w-auto px-10 py-6 rounded-full">
                  Explorar Catálogo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Catálogo
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 border border-gold/20">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-gold text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedCategory("decant")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedCategory === "decant"
                    ? "bg-gold text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Decants
              </button>
              <button
                onClick={() => setSelectedCategory("full")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedCategory === "full"
                    ? "bg-gold text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Originales
              </button>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const selectedSize = selectedDecantSizes[product.id] || "10ml";
                const hasDecant5ml = product.hasDecant && (product.stockDecant5ml || 0) > 0;
                const hasDecant10ml = product.hasDecant && (product.stockDecant10ml || 0) > 0;
                const hasAnyDecant = hasDecant5ml || hasDecant10ml;
                const hasFullBottle = product.hasFullBottle && (product.stockFull || 0) > 0;
                const hasAnyStock = hasAnyDecant || hasFullBottle;
                const isWishlisted = wishlist.has(product.id);

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:border-gold/50 transition-all duration-300 group relative"
                  >
                    {/* Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {!hasAnyStock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                          <Badge variant="destructive" className="text-sm">
                            Agotado
                          </Badge>
                        </div>
                      )}
                      {product.badge && (
                        <div className="absolute top-2 left-2">
                          <Badge>{product.badge}</Badge>
                        </div>
                      )}
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <Heart
                          className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`}
                        />
                      </button>
                      {/* Rating */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        <span className="text-xs font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-serif font-bold text-lg leading-tight line-clamp-2 group-hover:text-gold transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                        {product.description}
                      </p>

                      {/* Pricing Options */}
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        {hasAnyDecant && (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Package className="h-3.5 w-3.5 text-gold" />
                              <span className="font-medium">Decant</span>
                            </div>
                            <div className="flex gap-2">
                              {hasDecant5ml && (
                                <button
                                  onClick={() =>
                                    setSelectedDecantSizes((prev) => ({
                                      ...prev,
                                      [product.id]: "5ml",
                                    }))
                                  }
                                  className={`flex-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                    selectedSize === "5ml"
                                      ? "border-gold bg-gold/10 text-gold"
                                      : "border-border hover:border-gold/50"
                                  }`}
                                >
                                  <div>5ml</div>
                                  <div className="text-gold font-bold">
                                    Bs {product.priceDecant5ml}
                                  </div>
                                </button>
                              )}
                              {hasDecant10ml && (
                                <button
                                  onClick={() =>
                                    setSelectedDecantSizes((prev) => ({
                                      ...prev,
                                      [product.id]: "10ml",
                                    }))
                                  }
                                  className={`flex-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                    selectedSize === "10ml"
                                      ? "border-gold bg-gold/10 text-gold"
                                      : "border-border hover:border-gold/50"
                                  }`}
                                >
                                  <div>10ml</div>
                                  <div className="text-gold font-bold">
                                    Bs {product.priceDecant10ml}
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {hasFullBottle && (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Sparkles className="h-3.5 w-3.5 text-gold" />
                              <span className="font-medium">Perfume Original</span>
                            </div>
                            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg border border-gold/30 bg-gold/5">
                              <span className="text-xs">{product.fullBottleSize || "Full"}</span>
                              <span className="text-gold font-bold text-sm">
                                Bs {product.priceFull}
                              </span>
                            </div>
                          </div>
                        )}

                        {!hasAnyStock && (
                          <div className="text-center text-sm text-muted-foreground py-3">
                            Próximamente disponible
                          </div>
                        )}
                      </div>
                    </CardContent>

                    {/* Actions */}
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      {hasAnyDecant && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            addToCart(
                              product,
                              selectedSize === "5ml" ? "decant-5ml" : "decant-10ml"
                            )
                          }
                        >
                          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                          Decant {selectedSize}
                        </Button>
                      )}

                      {hasFullBottle && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => addToCart(product, "original")}
                        >
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                          Original
                        </Button>
                      )}

                      {!hasAnyStock && (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Sin Stock
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Benefits Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gold/20">
          <div className="text-center space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-gold" />
            </div>
            <h3 className="font-serif font-bold text-lg">Envíos Seguros</h3>
            <p className="text-sm text-muted-foreground">
              Entrega garantizada a toda Bolivia con seguimiento en tiempo real.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-gold" />
            </div>
            <h3 className="font-serif font-bold text-lg">100% Original</h3>
            <p className="text-sm text-muted-foreground">
              Todos nuestros perfumes son originales y de alta calidad.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
              <Send className="h-6 w-6 text-gold" />
            </div>
            <h3 className="font-serif font-bold text-lg">Pago Fácil</h3>
            <p className="text-sm text-muted-foreground">
              Paga por QR, transferencia o efectivo. Tu elección.
            </p>
          </div>
        </section>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-[#0A0A0A] border-l border-gold/20 shadow-2xl flex flex-col animate-in slide-in-from-right-2">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gold/20">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-serif font-bold">Tu Carrito</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <ShoppingBag className="h-16 w-16 opacity-20" />
                  <p>Tu carrito está vacío</p>
                  <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                    Continuar comprando
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.variant}`}
                      className="flex gap-4 py-2 border-b border-gold/10"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border border-gold/20 bg-muted shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium leading-none line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.variant === "decant-5ml"
                              ? "Decant 5ml"
                              : item.variant === "decant-10ml"
                              ? "Decant 10ml"
                              : "Botella Full"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(item.id, item.variant, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(item.id, item.variant, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">Bs {item.price * item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              onClick={() => removeFromCart(item.id, item.variant)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gold/20 space-y-4">
                <div className="flex items-center justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="text-gold font-bold">Bs {cartTotal}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Finalizar Pedido por WhatsApp
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .text-gold {
          color: #d4af37;
        }
        .bg-gold {
          background-color: #d4af37;
          color: #0a0a0a;
        }
        .border-gold {
          border-color: #d4af37;
        }
        .border-gold\/20 {
          border-color: rgba(212, 175, 55, 0.2);
        }
        .border-gold\/30 {
          border-color: rgba(212, 175, 55, 0.3);
        }
        .border-gold\/50 {
          border-color: rgba(212, 175, 55, 0.5);
        }
        .bg-gold\/10 {
          background-color: rgba(212, 175, 55, 0.1);
        }
        .bg-gold\/5 {
          background-color: rgba(212, 175, 55, 0.05);
        }
        .hover\:bg-gold\/10:hover {
          background-color: rgba(212, 175, 55, 0.1);
        }
        .hover\:bg-gold\/90:hover {
          background-color: rgba(212, 175, 55, 0.9);
        }
        .hover\:text-gold:hover {
          color: #d4af37;
        }
        .hover\:border-gold\/50:hover {
          border-color: rgba(212, 175, 55, 0.5);
        }
        .shadow-gold\/10 {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }
        .shadow-gold\/20 {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        }
        .ring-gold\/50 {
          --tw-ring-color: rgba(212, 175, 55, 0.5);
        }
        .animate-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .slide-in-from-right-2 {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
