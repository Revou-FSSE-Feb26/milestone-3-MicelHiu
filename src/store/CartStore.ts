import { Product } from "@/lib/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = Product & { quantity: number};

interface CartStore {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product) => {
                const items = get().items;
                const existing = items.find((item) => item.id === product.id);

                if(existing) {
                    //kalau sudah ada, tambah quantity
                    set({
                        items: items.map((item) => 
                            item.id === product.id
                                ? {...item, quantity: item.quantity + 1}
                                : item
                    ),
                    });
                } else {
                    // kalau belum ada, tambah item baru
                    set({ items: [...items, {...product, quantity: 1}] });
                }
            },

            removeFromCart: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) });
            },
            
            clearCart:() => {
                set({ items: [] });
            },

            getCartTotal:() => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },
        }),
        {
            name: "revoshop_cart",
        }
    )
);