'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const router = useRouter();
    const { login } = useAuth();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(username.trim(), password);
            router.push('/dashboard/admin');
        } catch (err) {
            setError(err.message || 'invalid username or password');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <main className="min-h-screen justify-center items-center bg-slate-100 flex flex-col">
                <section className="flex flex-col justify-center align-center w-full shadow-2xl p-12 gap-4 rounded-2xl max-w-md text-center bg-white text-black">
                    <header className="mb-6 text-center">
                        <h1 className="text-2xl font-extrabold text-black">
                            Welcome to Revoshop
                        </h1>
                        <p className="text-xs text-gray-600 mt-1.5">
                            Sign in to promote your products.
                        </p>
                    </header>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs font-semibold text-red-600 rounded-xl">
                            ⚠ {error}
                        </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center items-center gap-2 mb-4 border-b border-gray-300 pb-4">
                            <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g mor_22314"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        <div className="flex flex-row justify-center items-center gap-2 mb-4 border-gray-300 pb-4">
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full rounded-lg bg-black py-3 font-medium text-white hover:bg-white hover:text-black cursor-pointer"
                        >
                            {loading ? "Signing in..." : "Login"}
                        </button>
                    </form>

                    <footer className="mt-6 border-t border-slate-100 pt-4 text-center">
                        <p className="text-[10px] text-slate-400 leading-normal">
                            Demo Credentials:<br />
                        <span className="font-semibold text-slate-550">mor_2314</span> / <span className="font-semibold text-slate-550">83r5^_</span>
                        </p>
                    </footer>
                </section>
            </main>
        </>
    );
}