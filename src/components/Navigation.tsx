"use client";

import Link from "next/link";

export function Navigation() {
    return (
        <header className="w-full border-b border-gray-300 bg-white dark:border-neutral-800 dark:bg-zinc-900">
            <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                <span>
                    <nav>
                        <Link 
                            href="/"
                            className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                            Products
                        </Link>
                        <Link
                            href="/cart"
                            className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                            Cart
                        </Link>
                        <Link
                            href="/sign-out"
                            className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                            Sign Out
                        </Link>
                    </nav>
                </span>
            </div>
        </header>
    );
}