'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(
            formData.email === "admin@gmail.com" &&
            formData.password === "admin"
        ) {
            alert("Login successful!");
            router.push("/dashboard/admin");
        } else if (
            formData.email === "user@gmail.com" &&
            formData.password === "user"
        ) {
            alert("Login successful!");
            router.push("/dashboard/user");
        } else {
            alert("Invalid email or password. Please try again.");
        }
    };

    return (
        <main className="min-h-screen justify-center items-center bg-slate-100 flex flex-col">
            <section className="flex flex-col justify-center align-center w-full shadow-2xl p-12 gap-4 rounded-2xl max-w-md text-center bg-white text-black">
                <header>
                    <h1 className="text-3xl font-bold text-slate-800">Welcome to Revoshop</h1>
                    <p className="mt-2 text-xs text-slate-500">please use admin@gmail.com / admin or user@gmail.com / user</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-row justify-center items-center gap-2 mb-4 border-b border-gray-300 pb-4">
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email: </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-slate-200"
                            required
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 mb-4 border-gray-300 pb-4">
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password: </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-slate-200"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-black py-3 font-medium text-white hover:bg-white hover:text-black">Login</button>
                </form>
            </section>
        </main>
    );
}