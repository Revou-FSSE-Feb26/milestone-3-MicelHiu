"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { fetchProductById, formatPrice, Product } from "@/lib/data";
import { useCartStore } from "@/store/CartStore";
import Image from "next/image";
import useSWR from "swr";
import { AuthUser } from "@/lib/auth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductDetailPage({ params }: { params: Promise<{id: string }> }) {
    const {id} = use(params);
    const router = useRouter();

    const { addToCart } = useCartStore();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    
    const { data: user } = useSWR<AuthUser>("/api/auth/me", fetcher, {
        shouldRetryOnError: false,
        onErrorRetry: (error) => {
            if (error.status === 401) return; // ← abaikan 401
        },
    });
    const isLoggedIn = !!user;

    useEffect(() => {
        fetchProductById(Number(id)).then((data) => {
            setProduct(data ?? undefined);
            setLoading(false);
        })
    }, [id]);

    if (loading) {
        return (
            <>
                <Navigation />
                <main className="flex items-center justify-center min-h-screen">
                    <p className="text-gray-400 animate-pulse">Loading...</p>
                </main>
            </>
        );
    }

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
        if(!isLoggedIn) {
            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }
        addToCart(product);
        router.push("/cart");
    }

    return (
        <>
        <Navigation />
            <main className="bg-white text-black max-w-5xl mx-auto w-full px-6 py-12 min-h-screen min-w-screen">
                <button
                onClick={() => router.back()}
                className="text-sm text-gray-500 hover:text-black hover:bg-white mb-8 flex items-center gap-1 cursor-pointer"
                >
                ← Back
                </button>

                <div className="flex flex-col md:flex-row gap-12">
                    <Image
                        src={product.image}
                        alt={product.name}
                        className="w-full md:w-1/2 h-80 object-cover rounded-2xl shadow"
                        width={600}
                        height={400}
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
            <Footer />                     
        </>
    );
}