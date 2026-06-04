"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-auto w-full bg-white text-black py-10 px-8 border-gray-300">
            <div className="max-w-6xl mx-16 flex flex-row justify-between gap-4">
                <section className="flex flex-col flex-wrap">
                    <h2 className="text-lg font-bold mb-2">Revoshop</h2>
                    <p className="text-sm text-gray-600 flex-wrap">
                        Your one stop destination for quality products<br />
                        across electronics, fashion, and more!
                    </p>
                </section>
                <section className="flex flex-col">
                    <h3 className="font-semibold mb-2">Navigation</h3>
                    <nav className="flex items-center gap-4 text-black">
                        <Link 
                            href="/"
                            className="text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
                        >
                            Products
                        </Link>
                        <Link
                            href="/cart"
                            className="text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
                        >
                            Cart
                        </Link>
                    </nav>
                </section>
                <section className="flex flex-col">
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <ul className="text-sm text-gray-600">
                        <li>📧 support@revoshop.id</li>
                        <li>📞 +62 21 1234 5678</li>
                        <li>📍 Jakarta, Indonesia</li>
                    </ul>
                </section>
            </div>
            <div className="mt-8 border-t border-gray-300text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Revoshop. All rights reserved.
            </div>
        </footer>
    );
}