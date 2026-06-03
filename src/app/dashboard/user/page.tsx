"use client";

import { Navigation } from "@/components/Navigation";


export default function UserDashboard() {
    return (
        <>
            <Navigation />
            <main className="flex flex-col items-center justify-center gap-4 py-8 bg-white text-black">
                <h1 className="text-2xl font-bold">Welcome to Revoshop</h1>
                <p>Everything you need, all in one place.</p>
            </main>
        </>
    );
}