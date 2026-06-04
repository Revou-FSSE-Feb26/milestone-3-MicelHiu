"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { products, categories, formatPrice } from "@/lib/data";

// produk untuk slider (rekomendasi produk)
const featured = products.slice(0, 4);

export default function UserDashboard() {
    const [slide, setSlide] = useState(0);

    //auto rotate slider setiap 3 detik
    useEffect(() => {
        const timer = setInterval(() => {
            setSlide((prev) => (prev + 1) % featured.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

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
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-1/2 object-cover"
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
                            {products
                                .filter((p) => p.category === cat)
                                .slice(0, 3)
                                .map((product) => (
                                    <Link key={product.id} href={`/products/${product.id}`} className="group border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
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
                    <h2 className="text-3xl font-bold mb-3">Have anything to sell?</h2>
                    <p className="text-gray-900 mb-6 max-w-md mx-auto">
                        Join thousands of sellers on Revoshop. List your products, reach more customers, and grow your business — all in one place.
                    </p>
                    <Link 
                        href="/login"
                        className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-200 hover:text-black transition"
                    >
                        Sign In
                    </Link>
                </section>
            </main>
            <Footer />
        </>
    );
}