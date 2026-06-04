"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { products, formatPrice } from "@/lib/data";
import { addToCart } from "@/lib/cartStore";

export default function ProductDetailPage({ params }: { params: Promise<{id: string }> }) {
    const {id} = use(params);
    const router = useRouter();
    const product = products.find((p) => p.id === Number(id));

    if (!product) {
        return (
            <>
                <Navigation />
                <main className="flex flex-col items-center justify-center min-h-screen">
                    <p className="text-gray-500">
                        Product not found.
                    </p>
                </main>
            </>
        )
    }

    const handleAddToCart = () => {
        addToCart(product);
        router.push("/cart");
    }

    return (
        <>
        <Navigation />
            <main className="bg-white text-black max-w-5xl mx-auto w-full px-6 py-12 min-h-screen">
                <button
                onClick={() => router.back()}
                className="text-sm text-gray-500 hover:text-black hover:bg-white mb-8 flex items-center gap-1 cursor-pointer"
                >
                ← Back
                </button>

                <div className="flex flex-col md:flex-row gap-12">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full md:w-1/2 h-80 object-cover rounded-2xl shadow"
                />
                <div className="flex flex-col justify-center gap-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {product.category}
                    </span>
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
                    <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
                    <button
                    onClick={handleAddToCart}
                    className="mt-4 w-fit bg-black text-white px-8 py-3 rounded-full hover:bg-gray-200 hover:text-black transition text-sm font-semibold cursor-pointer"
                    >
                    Add to Cart
                    </button>
                </div>
                </div>
            </main>                     
        </>
    );
}