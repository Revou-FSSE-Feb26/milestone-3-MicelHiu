"use client";

import Link from "next/link";

export function Navigation() {
    return (
        <header className=" relative flex flex-row items-center justify-between w-full border-b border-gray-300 bg-white px-8 py-2">
            <h1 className="text-2xl font-bold text-black">Revoshop</h1>
            
            
            <nav className=" absolute left-1/2 -translate-x-1/2 flex items-center gap-4 text-black">
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
            <Link 
                href="/login"
                className="ml-auto text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
            >
                Sign In
            </Link>
        </header>
    );
}