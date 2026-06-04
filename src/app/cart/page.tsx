"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { getCart, removeFromCart, clearCart, cartItem } from "@/lib/cartStore";
import { formatPrice } from "@/lib/data";
import Link from "next/link";

export default function CartPage() {
    const [cart, setCart] = useState<cartItem[]>([]);
    const [showThanks, setShowThanks] = useState(false);

    useEffect(() => {
        setCart(getCart());
    }, []);

    const handleRemove = (id: number) => {
        removeFromCart(id);
        setCart(getCart());
    };

    const handleCheckout = () => {
        clearCart();
        setCart([]);
        setShowThanks(true);
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
    <>
        <Navigation />
        <main className="max-w-3xl mx-auto w-full px-6 py-12 min-h-screen">
            <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

            {cart.length === 0 && !showThanks ? (
            <p className="text-gray-400 text-center mt-20">Your cart is empty.</p>
            ) : (
            <>
                <ul className="flex flex-col gap-4 mb-8">
                {cart.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                        <button
                        onClick={() => handleRemove(item.id)}
                        className="text-xs text-red-400 hover:text-red-600 mt-1"
                        >
                        Remove
                        </button>
                    </div>
                    </li>
                ))}
                </ul>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <div>
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-2xl font-bold">{formatPrice(total)}</p>
                </div>
                <button
                    onClick={handleCheckout}
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition cursor-pointer"
                >
                    Checkout
                </button>
                </div>
            </>
            )}
        </main>

        {/* ── POPUP THANKS ── */}
        {showThanks && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-sm w-full mx-4">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-black text-2xl font-bold mb-2">Thanks for shopping!</h2>
                <p className="text-gray-500 text-sm mb-6">Your order has been placed. We'll process it shortly.</p>
                <Link href="/dashboard" className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition">
                Back to Home
                </Link>
            </div>
            </div>
        )}
    </>
    );
}