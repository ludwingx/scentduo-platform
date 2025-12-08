import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant: "decant-5ml" | "decant-10ml" | "original";
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (
    id: string,
    variant: "decant-5ml" | "decant-10ml" | "original"
  ) => void;
  updateQuantity: (
    id: string,
    variant: "decant-5ml" | "decant-10ml" | "original",
    quantity: number
  ) => void;
  clearCart: () => void;
  total: () => number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (i) => i.id === item.id && i.variant === item.variant
        );

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id && i.variant === item.variant
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...currentItems, item] });
        }
        set({ isOpen: true });
      },
      removeItem: (id, variant) => {
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.variant === variant)
          ),
        });
      },
      updateQuantity: (id, variant, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === id && i.variant === variant
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
      },
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "scent-duo-cart",
    }
  )
);
