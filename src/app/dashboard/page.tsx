"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import {
    fetchProducts, fetchCategories, formatPrice, Product
} from "@/lib/data";
import Image from "next/image";
import useSWR from "swr";
import { AuthUser } from "@/lib/auth";

const fetcher = (url: string) => 
    fetch(url).then((res) => {
        if(!res.ok) throw new Error(String(res.status));
        return res.json();
    });

export default function UserDashboard() {
    const [slide, setSlide] = useState(0);
    const [productList, setProductList] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isProductLoading, setIsProductLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { data: user, isLoading } = useSWR<AuthUser>("/api/auth/me", fetcher, {
        shouldRetryOnError: false,
        onErrorRetry: (error) => {
            if (error.status === 401) return; // ← abaikan 401
        },
    });
    const isLoggedIn = !!user;
    // produk untuk slider (rekomendasi produk)
    const featured = productList.slice(0, 4);

    useEffect(() => {
        Promise.all([fetchProducts(), fetchCategories()])
            .then(([prods, cats]) => {
                setProductList(prods);
                setCategories(cats);
            })
            .catch(() => setError('Product loading failed. Please try again later'))
            .finally(() => setIsProductLoading(false));
    }, []);

    //auto rotate slider setiap 3 detik
    useEffect(() => {
        if(featured.length === 0) return;
        const timer = setInterval(() => {
            setSlide((prev) => (prev + 1) % featured.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [featured.length]);

    if(isLoading || isProductLoading) {
        return (
            <>
                <Navigation />
                <main className="container text-center py-24 bg-white text-black min-h-screen min-w-screen">
                    <p className="text-sm text-slate-500 animate-pulse">Setting up the environment, please wait a moment...</p>
                </main>
                <Footer />
            </>
        );
    }

    if(error) {
        return (
            <>
                <Navigation />
                <main className="container text-center py-24 bg-white text-black min-h-screen min-w-screen">
                    <p className="text-sm text-red-600">{error}</p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navigation />
            <main className="flex flex-col bg-white text-black min-h-screen">
                <section className="w-full py-16 px-6 text-center">
                    <h1 className="text-5xl font-bold">Welcome to Revoshop</h1>
                    <p>Everything you need, all in one place.</p>
                </section>
                
                {/* hero slider */}
                <section className="relative w-full overflow-hidden bg-gray-100" style={{height: 380 }}>
                    {featured.map((product, i) => (
                        <div
                            key={product.id}
                            className={`absolute inset-0 flex transition-opacity duration-700 ${i === slide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                className="w-1/2 object-cover"
                                width={800}
                                height={400}
                            />
                            <div className="w-1/2 flex flex-col justify-center px-12 gap-3 bg-white">
                                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                    {product.category}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                                <p className="text-sm text-gray-500 line-clamp-3">{product.description}</p>
                                <p className="text-xl font-bold text-black">{formatPrice(product.price)}</p>
                                <Link 
                                    href={`/products/${product.id}`}
                                    className="mt-2 w-fit bg-black text-white text-sm px-6 py-2 rounded-full hover:bg-gray-800 transition"
                                >
                                    View Product →
                                </Link>
                            </div>
                        </div>
                    ))};
                    {/* dot indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {featured.map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setSlide(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === slide ? "bg-black w-4" : "bg-gray-400"}`}
                            />
                        ))}
                    </div>
                </section>

                {/* produk per kategori */}
                {categories.map((cat) => (
                    <section key={cat} className="max-w-6xl mx-auto w-full px-6 py-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">{cat}</h2>
                            <Link href={`/products?category=${encodeURIComponent(cat)}`} className="text-sm text-gray-500 hover:underline">
                                See all →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {productList
                                .filter((p) => p.category === cat)
                                .slice(0, 3)
                                .map((product) => (
                                    <Link key={product.id} href={`/products/${product.id}`} className="group border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                        <Image 
                                            src={product.image} 
                                            alt={product.name} 
                                            width={400} 
                                            height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="p-4">
                                            <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                                            <p className="font-bold mt-2">{formatPrice(product.price)}</p>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </section>
                ))}

                {/* sign in */}
                <section className="w-full bg-gray-200 text-black py-16 px-6 text-center">
                    <h2 className="text-3xl font-bold mb-3">See any interesting?</h2>
                    <p className="text-gray-900 mb-6 max-w-md mx-auto">
                        Join thousands of customers on Revoshop. Search products, buy, explore more like there's no tomorrow!.
                    </p>
                    <Link 
                        href={isLoggedIn ? "/products" : "/login"}
                        className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-200 hover:text-black transition"
                    >
                        {isLoggedIn ? "Explore more" : "Sign In"}
                    </Link>
                </section>
            </main>
            <Footer />
        </>
    );
}