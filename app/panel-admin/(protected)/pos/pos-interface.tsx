"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Store,
  Sparkles,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  X,
  LayoutGrid,
  List,
  RotateCcw,
  Receipt,
  Printer,
  User,
  Filter,
  ArrowRight,
  ChevronRight,
  Droplets,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { processPosOrder } from "@/app/actions/pos";

export interface PosProduct {
  id: string;
  name: string;
  brand: string | null;
  images: string[];
  category?: string; // Olfactory family or category
  hasFullBottle: boolean;
  priceFull: number | string;
  stockFull: number;
  hasDecant: boolean;
  priceDecant5ml: number | string;
  stockDecant5ml: number;
  priceDecant10ml: number | string;
  stockDecant10ml: number;
}

export interface CartItem {
  id: string; // Unique ID for cart item (productId + variant)
  productId: string;
  name: string;
  variant: "original" | "decant-5ml" | "decant-10ml";
  variantLabel: string;
  quantity: number;
  price: number;
}

type PaymentMethod = "CASH" | "QR" | "CARD" | "TIGO_MONEY";

export function PosInterface({ products }: { products: PosProduct[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Modal for Variant Selection
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<PosProduct | null>(null);

  // Success Receipt Modal State
  const [completedSale, setCompletedSale] = useState<{
    items: CartItem[];
    total: number;
    cashTendered: number;
    change: number;
    method: PaymentMethod;
    customer: string;
    date: Date;
  } | null>(null);

  // Extract unique categories / olfactory families
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [products]);

  // Filter products by search term & category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        (p.brand && p.brand.toLowerCase().includes(term));

      const matchesCategory =
        selectedCategory === "ALL" || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const addToCart = (product: PosProduct, variant: CartItem["variant"]) => {
    let price = 0;
    let label = "";
    let maxStock = 0;

    if (variant === "original") {
      price = Number(product.priceFull) || 0;
      label = "Botella Sellada";
      maxStock = product.stockFull;
    } else if (variant === "decant-5ml") {
      price = Number(product.priceDecant5ml) || 0;
      label = "Decant 5ml";
      maxStock = product.stockDecant5ml;
    } else {
      price = Number(product.priceDecant10ml) || 0;
      label = "Decant 10ml";
      maxStock = product.stockDecant10ml;
    }

    if (maxStock <= 0) {
      toast.error(`Sin stock disponible de ${label}`);
      return;
    }

    const cartId = `${product.id}-${variant}`;
    const existingItem = cart.find((item) => item.id === cartId);

    if (existingItem) {
      if (existingItem.quantity >= maxStock) {
        toast.error(`No hay más stock suficiente (${maxStock} disponbles)`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: cartId,
          productId: product.id,
          name: product.name,
          variant,
          variantLabel: label,
          quantity: 1,
          price,
        },
      ]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCashTendered("");
    setCustomerName("");
  };

  const totalItemsCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const numericCashTendered = Number(cashTendered) || 0;
  const changeDue = Math.max(0, numericCashTendered - totalAmount);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (paymentMethod === "CASH" && numericCashTendered > 0 && numericCashTendered < totalAmount) {
      toast.error("El efectivo entregado es menor al total a cobrar");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await processPosOrder(cart, totalAmount);

      if (result.success) {
        setCompletedSale({
          items: [...cart],
          total: totalAmount,
          cashTendered: numericCashTendered || totalAmount,
          change: changeDue,
          method: paymentMethod,
          customer: customerName || "Cliente Mostrador",
          date: new Date(),
        });
        clearCart();
        setMobileCartOpen(false);
        toast.success("¡Venta registrada con éxito!");
      } else {
        toast.error(result.message || "Ocurrió un error al procesar la venta");
      }
    } catch {
      toast.error("Error al procesar la venta. Revisa la conexión.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 overflow-hidden">
      {/* ─── LEFT COLUMN: Catalog & Filters (PC & Mobile) ─────────────────────────── */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 h-full overflow-hidden">
        {/* Search Header & Category Filters */}
        <div className="bg-card p-3 rounded-2xl border shadow-xs space-y-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por fragancia, marca u notas..."
                className="pl-9 pr-8 h-10 text-sm rounded-xl border-muted"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="hidden sm:flex items-center bg-muted/60 p-1 rounded-xl border border-muted">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setViewMode("grid")}
                title="Vista Cuadrícula"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setViewMode("list")}
                title="Vista Lista Compacta"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Olfactory Family Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-muted-foreground px-1 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Familias:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground border-transparent"
                }`}
              >
                {cat === "ALL" ? "Todas" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid / List Container (Native Touch Scroll) */}
        <div className="flex-1 overflow-y-auto touch-pan-y pr-1 lg:pr-2 min-h-0">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-card border border-dashed rounded-2xl">
              <Store className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="font-semibold text-sm">No se encontraron fragancias</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Intenta ajustar la búsqueda o el filtro de familias olfativas
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-1.5 text-xs rounded-xl"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("ALL");
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Limpiar Filtros
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 pb-32 lg:pb-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => setSelectedProductForVariants(product)}
                  className="overflow-hidden border shadow-xs hover:border-primary/50 transition-all flex flex-col group bg-card cursor-pointer"
                >
                  {/* Top Image & Badges */}
                  <div className="relative h-28 sm:h-40 w-full bg-muted/40 overflow-hidden flex items-center justify-center">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Package className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30" />
                    )}
                    {product.brand && (
                      <Badge className="absolute top-2 left-2 bg-background/90 dark:bg-card/90 text-foreground border shadow-xs text-[10px] sm:text-xs font-bold px-2 py-0.5">
                        {product.brand}
                      </Badge>
                    )}
                    {product.category && (
                      <Badge
                        variant="secondary"
                        className="absolute bottom-2 right-2 text-[10px] sm:text-xs backdrop-blur-md bg-black/60 text-white font-medium px-2 py-0.5"
                      >
                        {product.category}
                      </Badge>
                    )}
                  </div>

                  {/* Card Info & Availability Badges */}
                  <CardContent className="p-3 flex-1 flex items-center justify-between gap-2">
                    <h3
                      className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors flex-1"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Minimalist Icon-Only Availability Indicators */}
                    <div className="flex items-center gap-1 shrink-0">
                      {product.hasFullBottle && (
                        <div
                          className="h-5 w-5 rounded-md flex items-center justify-center border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0"
                          title="Botella Completa 100ml"
                        >
                          <Package className="h-3 w-3" />
                        </div>
                      )}
                      {product.hasDecant && (
                        <div
                          className="h-5 w-5 rounded-md flex items-center justify-center border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 shrink-0"
                          title="Decants 5ml/10ml"
                        >
                          <Droplets className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Compact List View */
            <div className="space-y-2 pb-20 lg:pb-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/40 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0 border">
                      {product.images[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill unoptimized className="object-cover" />
                      ) : (
                        <Package className="h-5 w-5 m-auto text-muted-foreground/30" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm leading-tight">{product.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.brand || "Sin Marca"} {product.category ? `• ${product.category}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    {product.hasFullBottle && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => addToCart(product, "original")}
                        disabled={product.stockFull <= 0}
                      >
                        Botella (Bs {product.priceFull})
                      </Button>
                    )}
                    {product.hasDecant && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                          onClick={() => addToCart(product, "decant-5ml")}
                          disabled={product.stockDecant5ml <= 0}
                        >
                          5ml (Bs {product.priceDecant5ml})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                          onClick={() => addToCart(product, "decant-10ml")}
                          disabled={product.stockDecant10ml <= 0}
                        >
                          10ml (Bs {product.priceDecant10ml})
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Order Ticket & Checkout (Desktop PC / Tablet) ───────────── */}
      <div className="hidden lg:flex w-96 border rounded-2xl bg-card shadow-sm flex-col h-full shrink-0 overflow-hidden">
        {/* Ticket Header */}
        <div className="p-4 border-b bg-muted/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Receipt className="h-4 w-4 text-primary" />
            <span>Ticket de Venta</span>
            {totalItemsCount > 0 && (
              <Badge variant="secondary" className="text-[10px] font-extrabold bg-primary/10 text-primary">
                {totalItemsCount} ítems
              </Badge>
            )}
          </div>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:bg-destructive/10 gap-1 px-2 font-medium"
              onClick={clearCart}
            >
              <Trash2 className="h-3.5 w-3.5" /> Vaciar
            </Button>
          )}
        </div>

        {/* Customer Reference Input */}
        <div className="p-3 border-b bg-muted/10 space-y-2 shrink-0">
          <div className="relative">
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Nombre del cliente / Ref (Opcional)"
              className="pl-8 h-8 text-xs rounded-lg"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <ScrollArea className="flex-1 min-h-0 p-3">
          {cart.length === 0 ? (
            <div className="h-60 flex flex-col items-center justify-center text-center p-4 text-muted-foreground opacity-60">
              <ShoppingCart className="h-10 w-10 mb-2 stroke-1" />
              <p className="font-semibold text-sm">Carrito Vacío</p>
              <p className="text-xs mt-1">Haz clic en una presentación de perfume para añadir al ticket</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border bg-muted/20 flex flex-col gap-2 transition-all hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-semibold text-xs leading-snug line-clamp-1">{item.name}</h5>
                      <span className="text-[11px] font-medium text-muted-foreground">{item.variantLabel}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1.5 bg-background rounded-lg border px-1 py-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-md"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-md"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold">Bs {(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Payment Configuration & Totals */}
        <div className="p-4 border-t bg-muted/30 space-y-3 shrink-0">
          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Método de Pago:
            </span>
            <div className="grid grid-cols-4 gap-1">
              <Button
                variant={paymentMethod === "CASH" ? "default" : "outline"}
                size="sm"
                className="h-8 text-[10px] px-1 font-semibold gap-1"
                onClick={() => setPaymentMethod("CASH")}
              >
                <Banknote className="h-3 w-3" /> Efectivo
              </Button>
              <Button
                variant={paymentMethod === "QR" ? "default" : "outline"}
                size="sm"
                className="h-8 text-[10px] px-1 font-semibold gap-1"
                onClick={() => setPaymentMethod("QR")}
              >
                <QrCode className="h-3 w-3" /> QR
              </Button>
              <Button
                variant={paymentMethod === "CARD" ? "default" : "outline"}
                size="sm"
                className="h-8 text-[10px] px-1 font-semibold gap-1"
                onClick={() => setPaymentMethod("CARD")}
              >
                <CreditCard className="h-3 w-3" /> Tarjeta
              </Button>
              <Button
                variant={paymentMethod === "TIGO_MONEY" ? "default" : "outline"}
                size="sm"
                className="h-8 text-[10px] px-1 font-semibold gap-1"
                onClick={() => setPaymentMethod("TIGO_MONEY")}
              >
                <Sparkles className="h-3 w-3" /> Tigo
              </Button>
            </div>
          </div>

          {/* Cash Tendered Calculator (Only if CASH selected) */}
          {paymentMethod === "CASH" && (
            <div className="p-2.5 rounded-xl bg-card border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">Efectivo Entregado:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Cambio: Bs {changeDue.toFixed(2)}
                </span>
              </div>
              <Input
                type="number"
                placeholder="Monto pagado..."
                className="h-8 text-xs font-bold rounded-lg"
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
              />
              {/* Quick Cash Denomination Buttons */}
              <div className="flex items-center gap-1">
                {[50, 100, 200].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setCashTendered(amount.toString())}
                    className="flex-1 text-[10px] font-bold py-1 bg-muted/60 hover:bg-muted rounded-md border text-foreground"
                  >
                    Bs {amount}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCashTendered(totalAmount.toString())}
                  className="flex-1 text-[10px] font-bold py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md border border-primary/20"
                >
                  Exacto
                </button>
              </div>
            </div>
          )}

          {/* Total & Checkout Button */}
          <div className="flex justify-between items-center text-lg font-black">
            <span>Total:</span>
            <span className="text-primary">Bs {totalAmount.toFixed(2)}</span>
          </div>

          <Button
            className="w-full bg-gold hover:bg-gold/90 text-black font-extrabold h-11 text-sm shadow-md rounded-xl"
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? (
              "Procesando Venta..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                Cobrar Bs {totalAmount.toFixed(2)} <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* ─── MOBILE FLOATING BOTTOM BAR & SHEET (Smartphone View) ────────────────── */}
      {totalItemsCount > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <Button
            className="w-full h-14 bg-gold hover:bg-gold/90 text-black shadow-xl rounded-2xl flex items-center justify-between px-5 font-bold"
            onClick={() => setMobileCartOpen(true)}
          >
            <div className="flex items-center gap-2 text-left">
              <div className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center text-black">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold">{totalItemsCount} ítems en ticket</p>
                <p className="text-sm font-black">Bs {totalAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs uppercase tracking-wider font-extrabold bg-black/10 px-3 py-1.5 rounded-xl">
              <span>Ver Carrito</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Button>
        </div>
      )}

      {/* Mobile Cart Sheet Dialog */}
      <Dialog open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-4 border-b bg-muted/40 shrink-0">
            <DialogTitle className="flex items-center justify-between text-base font-bold">
              <span className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" /> Ticket de Venta
              </span>
              <Badge variant="secondary" className="text-xs">
                {totalItemsCount} ítems
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 p-4">
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="p-3 rounded-xl border bg-muted/20 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-xs">{item.name}</h5>
                      <span className="text-[11px] text-muted-foreground">{item.variantLabel}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <div className="flex items-center gap-2 border bg-background rounded-lg px-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold text-xs">Bs {(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-card space-y-3 shrink-0">
            {/* Payment Method Selector for Mobile */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Método de Pago:
              </span>
              <div className="grid grid-cols-4 gap-1">
                <Button
                  variant={paymentMethod === "CASH" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-[10px] px-1 font-semibold gap-1"
                  onClick={() => setPaymentMethod("CASH")}
                >
                  <Banknote className="h-3 w-3" /> Efectivo
                </Button>
                <Button
                  variant={paymentMethod === "QR" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-[10px] px-1 font-semibold gap-1"
                  onClick={() => setPaymentMethod("QR")}
                >
                  <QrCode className="h-3 w-3" /> QR
                </Button>
                <Button
                  variant={paymentMethod === "CARD" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-[10px] px-1 font-semibold gap-1"
                  onClick={() => setPaymentMethod("CARD")}
                >
                  <CreditCard className="h-3 w-3" /> Tarjeta
                </Button>
                <Button
                  variant={paymentMethod === "TIGO_MONEY" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-[10px] px-1 font-semibold gap-1"
                  onClick={() => setPaymentMethod("TIGO_MONEY")}
                >
                  <Sparkles className="h-3 w-3" /> Tigo
                </Button>
              </div>
            </div>

            {paymentMethod === "CASH" && (
              <div className="p-2 bg-muted/30 rounded-xl border space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Efectivo Entregado:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Cambio: Bs {changeDue.toFixed(2)}
                  </span>
                </div>
                <Input
                  type="number"
                  placeholder="Monto pagado..."
                  className="h-8 text-xs font-bold rounded-lg"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-between items-center text-base font-black pt-1">
              <span>Total a Cobrar:</span>
              <span className="text-primary text-lg">Bs {totalAmount.toFixed(2)}</span>
            </div>

            <Button
              className="w-full bg-gold hover:bg-gold/90 text-black font-extrabold h-12 text-sm rounded-xl"
              disabled={cart.length === 0 || isProcessing}
              onClick={handleCheckout}
            >
              {isProcessing ? "Procesando..." : `Confirmar Venta (Bs ${totalAmount.toFixed(2)})`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── SALE SUCCESS MODAL DIALOG ─────────────────────────────────────────── */}
      <Dialog open={!!completedSale} onOpenChange={() => setCompletedSale(null)}>
        <DialogContent className="sm:max-w-md p-6 text-center rounded-2xl space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <DialogTitle className="text-xl font-bold font-serif">¡Venta Exitosa!</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Transacción procesada e inventario actualizado en tiempo real
            </DialogDescription>
          </div>

          {completedSale && (
            <div className="p-3 bg-muted/40 rounded-xl border text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cliente:</span>
                <span className="font-semibold">{completedSale.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Pagado:</span>
                <span className="font-bold text-foreground">Bs {completedSale.total.toFixed(2)}</span>
              </div>
              {completedSale.method === "CASH" && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Cambio devuelto:</span>
                  <span>Bs {completedSale.change.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 gap-1.5 text-xs h-10 rounded-xl"
              onClick={() => {
                window.print();
              }}
            >
              <Printer className="h-4 w-4" /> Imprimir Recibo
            </Button>
            <Button
              className="flex-1 gap-1.5 text-xs h-10 rounded-xl bg-gold text-black hover:bg-gold/90 font-bold"
              onClick={() => setCompletedSale(null)}
            >
              Nueva Venta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── VARIANT SELECTOR MODAL DIALOG ─────────────────────────────────────────── */}
      <Dialog
        open={!!selectedProductForVariants}
        onOpenChange={() => setSelectedProductForVariants(null)}
      >
        <DialogContent className="sm:max-w-md p-5 rounded-2xl space-y-4">
          {selectedProductForVariants && (
            <>
              <DialogHeader className="p-0 text-left">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted border shrink-0">
                    {selectedProductForVariants.images[0] ? (
                      <Image
                        src={selectedProductForVariants.images[0]}
                        alt={selectedProductForVariants.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 m-auto text-muted-foreground/40" />
                    )}
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {selectedProductForVariants.brand || "Perfume"}
                    </Badge>
                    <DialogTitle className="text-base font-bold font-serif leading-tight mt-0.5">
                      {selectedProductForVariants.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      {selectedProductForVariants.category || "Selecciona la presentación a añadir"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-2 pt-2 border-t">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Presentaciones Disponibles:
                </span>

                {/* Botella Completa (100ml) */}
                {selectedProductForVariants.hasFullBottle && (
                  <div className="p-3 rounded-xl border bg-emerald-500/5 border-emerald-500/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs">Botella Sellada (100ml)</h5>
                        <p className="text-[11px] text-muted-foreground">
                          {selectedProductForVariants.stockFull > 0
                            ? `Stock: ${selectedProductForVariants.stockFull} unidades`
                            : "Agotado"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold h-9 text-xs rounded-xl gap-1 shrink-0"
                      disabled={selectedProductForVariants.stockFull <= 0}
                      onClick={() => {
                        addToCart(selectedProductForVariants, "original");
                        setSelectedProductForVariants(null);
                      }}
                    >
                      + Bs {selectedProductForVariants.priceFull}
                    </Button>
                  </div>
                )}

                {/* Decant 5ml */}
                {selectedProductForVariants.hasDecant && (
                  <div className="p-3 rounded-xl border bg-amber-500/5 border-amber-500/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                        <Droplets className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs">Decant Fraccionado 5ml</h5>
                        <p className="text-[11px] text-muted-foreground">
                          {selectedProductForVariants.stockDecant5ml > 0
                            ? `Stock: ${selectedProductForVariants.stockDecant5ml} u.`
                            : "Sin Stock"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold h-9 text-xs rounded-xl gap-1 shrink-0"
                      disabled={selectedProductForVariants.stockDecant5ml <= 0}
                      onClick={() => {
                        addToCart(selectedProductForVariants, "decant-5ml");
                        setSelectedProductForVariants(null);
                      }}
                    >
                      + Bs {selectedProductForVariants.priceDecant5ml}
                    </Button>
                  </div>
                )}

                {/* Decant 10ml */}
                {selectedProductForVariants.hasDecant && (
                  <div className="p-3 rounded-xl border bg-purple-500/5 border-purple-500/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                        <Droplets className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs">Decant Fraccionado 10ml</h5>
                        <p className="text-[11px] text-muted-foreground">
                          {selectedProductForVariants.stockDecant10ml > 0
                            ? `Stock: ${selectedProductForVariants.stockDecant10ml} u.`
                            : "Sin Stock"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold h-9 text-xs rounded-xl gap-1 shrink-0"
                      disabled={selectedProductForVariants.stockDecant10ml <= 0}
                      onClick={() => {
                        addToCart(selectedProductForVariants, "decant-10ml");
                        setSelectedProductForVariants(null);
                      }}
                    >
                      + Bs {selectedProductForVariants.priceDecant10ml}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
