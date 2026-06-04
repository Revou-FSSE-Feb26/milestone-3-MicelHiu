"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { products, categories, formatPrice } from "@/lib/data";
import Link from "next/link";

function ProductsContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";
    const [selected, setSelected] = useState(initialCategory);

    const filtered = 
        selected === "All" ? products : products.filter((p) => p.category === selected);
    
    return (
        <>
            <Navigation />
            <main className="bg-white text-black max-w-6xl mx-auto w-full px-6 py-10 flex gap-8 min-h-screen">
                {/* sidebar filter */}
                <aside className="w-48 shrink-0">
                    <h2 className="font-bold text-sm uppercase tracking-widest text-black mb-4">Category</h2>
                    <ul className="flex flex-col gap-2">
                        {["All", ...categories].map((cat) => (
                            <li key={cat}>
                                <button onClick={() => setSelected(cat)} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition ${
                                    selected === cat ? "bg-black text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
                                }`}>
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* product grid */}
                <section className="flex-1">
                    <h1 className="text-2xl font-bold mb-6">
                        {selected === "All" ? "All Products" : selected}
                        <span className="ml-2 text-sm font-normal text-gray-800">
                            ({filtered.length} items)
                        </span>
                    </h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {filtered.map((product) => (
                            <Link 
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group border border-gray-500 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                                <div className="p-4">
                                    <span className="text-xs text-gray-600 uppercase tracking-wide">{product.category}</span>
                                    <h3 className="font-semibold text-sm mt-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                                    <p className="font-bold mt-2">{formatPrice(product.price)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default function ProductsPage() {
    return (
        <Suspense>
            <ProductsContent />
        </Suspense>
    );
}