import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  type Burger,
  type CartItem,
  type Order,
  type Topping,
  PAST_ORDERS,
} from "./demo-data";

type AppStore = {
  // Cart
  cartItems: CartItem[];
  addToCart: (burger: Burger, toppings: Topping[], quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Favorites
  favoriteIds: string[];
  toggleFavorite: (burgerId: string) => void;
  isFavorite: (burgerId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: () => void;

  // Discount
  discountCode: string;
  discountPercent: number;
  applyDiscount: (code: string) => boolean;
  clearDiscount: () => void;

  // Onboarding
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
};

let cartIdCounter = 100;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Cart
      cartItems: [],
      addToCart: (burger, toppings, quantity) => {
        const toppingsTotal = toppings.reduce((sum, t) => sum + t.price, 0);
        const totalPrice = (burger.price + toppingsTotal) * quantity;
        const newItem: CartItem = {
          id: `cart-${++cartIdCounter}`,
          burger,
          quantity,
          selectedToppings: toppings,
          totalPrice,
        };
        set((s) => ({ cartItems: [...s.cartItems, newItem] }));
      },
      removeFromCart: (itemId) =>
        set((s) => ({ cartItems: s.cartItems.filter((i) => i.id !== itemId) })),
      updateQuantity: (itemId, quantity) =>
        set((s) => ({
          cartItems: s.cartItems.map((item) => {
            if (item.id !== itemId) return item;
            const toppingsTotal = item.selectedToppings.reduce(
              (sum, t) => sum + t.price,
              0
            );
            return {
              ...item,
              quantity,
              totalPrice: (item.burger.price + toppingsTotal) * quantity,
            };
          }),
        })),
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () => {
        const state = get();
        const subtotal = state.cartItems.reduce((s, i) => s + i.totalPrice, 0);
        if (state.discountPercent > 0) {
          return subtotal * (1 - state.discountPercent / 100);
        }
        return subtotal;
      },
      getCartCount: () =>
        get().cartItems.reduce((s, i) => s + i.quantity, 0),

      // Favorites
      favoriteIds: [],
      toggleFavorite: (burgerId) =>
        set((s) => ({
          favoriteIds: s.favoriteIds.includes(burgerId)
            ? s.favoriteIds.filter((id) => id !== burgerId)
            : [...s.favoriteIds, burgerId],
        })),
      isFavorite: (burgerId) => get().favoriteIds.includes(burgerId),

      // Orders
      orders: PAST_ORDERS,
      placeOrder: () => {
        const state = get();
        if (state.cartItems.length === 0) return;
        const newOrder: Order = {
          id: `o-${Date.now()}`,
          items: [...state.cartItems],
          total: state.getCartTotal(),
          status: "Preparing",
          date: "May 15, 2026",
          orderNumber: `#BG-${Math.floor(5000 + Math.abs(Date.now() % 1000))}`,
        };
        set((s) => ({
          orders: [newOrder, ...s.orders],
          cartItems: [],
          discountCode: "",
          discountPercent: 0,
        }));
      },

      // Discount
      discountCode: "",
      discountPercent: 0,
      applyDiscount: (code) => {
        const upper = code.toUpperCase().trim();
        if (upper === "BURGER20") {
          set({ discountCode: upper, discountPercent: 20 });
          return true;
        }
        if (upper === "FIRST10") {
          set({ discountCode: upper, discountPercent: 10 });
          return true;
        }
        return false;
      },
      clearDiscount: () => set({ discountCode: "", discountPercent: 0 }),

      // Onboarding
      hasSeenOnboarding: false,
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: "burger-app-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
        hasSeenOnboarding: state.hasSeenOnboarding,
        orders: state.orders,
      }),
    }
  )
);
