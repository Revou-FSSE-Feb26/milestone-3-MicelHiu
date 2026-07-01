"use client";

import { Footer } from "@/components/Footer";
import { AuthUser } from "@/lib/auth";
import useSWR from "swr";

const fetcher = (url: string) => 
    fetch(url).then((res) => {
        if(!res.ok) throw new Error(String(res.status));
        return res.json();
    });

export default function Profile() {
    const { data: user, error, isLoading } = useSWR<AuthUser>("/api/auth/me", fetcher, {
        shouldRetryOnError: false,
        onErrorRetry: (error) => {
            if (error.status === 401) return; // ← abaikan 401
        },
    });

    // Render a loading state during validation
    if (isLoading || (!user && !error)) {
        return (
        <>
            <main className="min-h-screen bg-sky-50 flex items-center justify-center font-sans">
                <div className="text-center p-8 bg-white border border-sky-100 rounded-3xl shadow-sm max-w-sm mx-auto">
                    <span className="text-3xl block mb-3 animate-spin">📦</span>
                    <p className="text-xs text-slate-500 animate-pulse font-extrabold font-toy">
                    Checking session...
                    </p>
                </div>
            </main>
            <Footer />
        </>
        );
    }

    return (
        <>
            <main className="bg-white text-black min-h-screen">
                <section className="flex justify-center gap-8 items-center py-30">
                    <div className="md:col-span-3 bg-white border-2 border-sky-200 border-b-4 border-b-sky-300 rounded-3xl p-8 shadow-sm flex flex-col gap-6 items-center sm:items-start">
                        <img
                            src={user?.image}
                            alt={user?.username}
                            className="w-24 h-24 self-center rounded-full border-4 border-sky-100 bg-sky-50 shadow-inner shrink-0"
                        />
                        <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                            
                            <span className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 font-toy">
                                User Profile
                            </span>
                            <h2 className="text-lg font-black text-black font-toy leading-tight">
                                {user?.firstName} {user?.lastName} ({user?.username})
                            </h2>
                        </div>

                        <div>
                            <span className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 font-toy">
                                Assigned Email: 
                            </span>
                            <p className="text-xs text-slate-600 font-bold">{user?.email}</p>
                        </div>

                        <div>
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest block mb-1.5 font-toy">
                                User Access Permission
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-indigo-50 border border-indigo-100 text-black shadow-2xs">
                                {user?.role === "admin" ? "CEO of Revoshop" : "Customer"}
                            </span>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}