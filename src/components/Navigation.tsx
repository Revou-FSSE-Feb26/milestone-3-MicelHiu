"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from"swr";
import axios from "axios";
import { AuthUser } from "@/lib/auth";

const fetcher = (url:string) => axios.get(url).then((res) => res.data);

export function Navigation() {
    const router = useRouter();

    const { data: user } = useSWR<AuthUser>("/api/auth/me", fetcher, {
    shouldRetryOnError: false,
    });

    const isLoggedIn = !!user;

    const handleSignOut = async () => {
        try {
            await axios.post("/api/auth/logout");
            await mutate("/api/auth/me", null, false);
            router.push("/dashboard");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <header className=" relative flex flex-row items-center justify-between w-full border-b border-gray-300 bg-white px-8 py-2">
            <h1 className="text-2xl font-bold text-black">Revoshop</h1>
            
            
            <nav className=" absolute left-1/2 -translate-x-1/2 flex items-center gap-4 text-black">
                <Link 
                    href="/dashboard"
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
                    href={isLoggedIn? "/cart" : "/login"}
                    className="text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
                >
                    Cart
                </Link>
                <Link
                    href="/faq"
                    className="text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
                >
                    FAQ
                </Link>
            </nav>

            { isLoggedIn ? (
                <div className="ml-auto flex items-center gap-3">
                    {user?.role === "admin" && (
                        <Link 
                        href="/dashboard/admin"
                        className="ml-auto text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
                        >
                            Your Store
                        </Link>
                    )}
                    <Link 
                        href="/profile"
                        className="ml-auto text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <Link href="/login" className="ml-auto text-sm font-medium text-black hover:text-slate-500">
                    Sign In
                </Link>
            )}
        </header>
    );
}