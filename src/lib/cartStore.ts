import { Product } from "./data";

export type cartItem = Product & { quantity: number};

const CART_KEY = "revoshop_cart";

export function getCart(): cartItem[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
        return [];
    }
}

export function addToCart(product: Product): void {
    const cart = getCart();
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

export function removeFromCart(productId: number): void {
    const cart = getCart().filter((item) => item.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart(): void {
    localStorage.removeItem(CART_KEY);
}

export function getCartTotal(): number {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}