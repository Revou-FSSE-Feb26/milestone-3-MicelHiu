import { Product } from "./data";

export type CartItem = Product & { quantity: number};

const CART_KEY = "revoshop_cart";

export function GetCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
        return [];
    }
}

export function AddToCart(product: Product): void {
    const cart = GetCart();
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(
            { ...product, quantity: 1}
        );
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function RemoveFromCart(productId: number): void {
    const cart = GetCart().filter((item) => item.id === productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function ClearCart(): void {
    localStorage.removeItem(CART_KEY);
}

export function GetCartTotal(): number {
    return GetCart().reduce((sum, item) => sum + item.quantity, 0);
}