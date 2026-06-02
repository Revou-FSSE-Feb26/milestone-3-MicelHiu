"use client";

import { Navigation } from "@/components/Navigation";

export default function UserDashboard() {
    return (
        <>
            <Navigation />
            <main className="flex flex-col items-center justify-center gap-4 py-8">
                <h1 className="text-2xl font-bold">User Dashboard</h1>
                <p>Welcome to your dashboard! Here you can view your orders, manage your account, and more.</p>
            </main>
        </>
    );
}