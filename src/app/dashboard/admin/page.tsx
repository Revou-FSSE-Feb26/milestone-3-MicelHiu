"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
    Product, ProductFormInput, fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct,
} from "@/lib/data"
import { Footer } from "@/components/Footer";
import { ProductItem } from "@/components/ProductItem";
import useSWR, { mutate } from "swr";
import { AuthUser } from "@/lib/auth";

const fetcher = (url: string) => 
    fetch(url).then((res) => {
        if(!res.ok) throw new Error(String(res.status));
        return res.json();
    });

export default function AdminDashboard() {
    const router = useRouter();
    /* const { isLoggedIn, user, logout } = useAuth(); */

    const { data: user } = useSWR<AuthUser>("/api/auth/me", fetcher, {
        shouldRetryOnError: false,
        onErrorRetry: (error) => {
            if (error.status === 401) return; // ← abaikan 401
        },
    });

    const isLoggedIn = !!user;

    //CRUD
    const [productList, setProductList] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    //load products in the store
    useEffect(() => {
        if (!isLoggedIn) return;

        const load = async() => {
            try {
                setLoading(true);
                const [prods, cats] = await Promise.all([
                    fetchProducts(),
                    fetchCategories(),
                ]);
                setProductList(prods);
                setCategories(cats);
            } catch (err: any) {
                setError(err.message || 'Failed to load products.')
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [isLoggedIn]);

    const handleSignOut = async () => {
        try {
            await fetch("/api/auth/logout", {method: 'POST'});
            await mutate("/api/auth/me", null, false);
            router.push("/dashboard");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    //initialize useForm with types and defaults
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm<ProductFormInput>({
        defaultValues: {
            name: "",
            price: 0,
            description: "",
            image: "",
            category: "",
        },
    });
    
    //submit
    const onSubmit = async (data: ProductFormInput) => {
        try {
            setActionLoading(true);
            const payload = {
                ...data,
                price: Number(data.price),
            };

            if(editingId) {
                const updated = await updateProduct(editingId, payload);
                setProductList((prev) =>
                    prev.map((p) => (p.id === editingId ? updated : p))
                );
                setEditingId(null);
            } else {
                const created = await createProduct(payload);
                setProductList((prev) => [created, ...prev]);
            }
            reset();
        } catch (err:any) {
            alert(err.message || "Failed to save");
        } finally {
            setActionLoading(false);
        }
    };

    // populate form with item details to trigger edit mode
    const startEdit = (product: Product) => {
        setEditingId(product.id);
        setValue("name", product.name);
        setValue("price", product.price);
        setValue("description", product.description);
        setValue("image", product.image);
        setValue("category", product.category);
    };

    // cancel edit mode and reset form inputs
    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    //handle delete
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return; 

        try {
            setActionLoading(true);
            await deleteProduct(id);
            setProductList((prev) => prev.filter((p) => p.id !== id));
            if(editingId === id) cancelEdit();
        } catch (err:any) {
            alert(err.message || "Failed to delete.")
        } finally {
            setActionLoading(false);
        }
    };

    if(!isLoggedIn) {
        return (
            <>
                <main className="container text-center py-24">
                    <p className="text-sm text-slate-500 animate-pulse font-semibold">
                        Checking credentials session...
                    </p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <main className="shop-container mx-auto px-6 py-10 bg-white text-black min-h-screen min-w-screen">
                {/* Header */}
                <header className="mb-10 border-b border-slate-200 pb-6 flex flex-col items-center justify-between gap-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-black">
                    Your Products
                </h1>
                <p className="mt-2 text-slate-500 text-sm">
                    Authenticated as: <span className="font-bold">{user?.firstName} {user?.lastName}</span>
                </p>
                <button
                    onClick={handleSignOut}
                    className="text-sm px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition text-black"
                >
                    Sign Out
                </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* Form */}
                <div className="bg-white border border-gray-500 rounded-2xl p-6 shadow-xs lg:col-span-1">
                    <h2 className="text-lg font-extrabold text-black mb-5">
                    {editingId ? "Edit Product Details" : "Add Product Arrangement"}
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Product Name
                        </label>
                        <input
                        type="text"
                        placeholder="e.g. Wireless Headphones"
                        {...register("name", {
                            required: "Product name is required",
                            minLength: { value: 3, message: "Min. 3 characters" },
                        })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {errors.name && <p className="text-xs text-red-500">⚠ {errors.name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Price ($)
                        </label>
                        <input
                        type="number"
                        step="any"
                        placeholder="e.g. 299.99"
                        {...register("price", {
                            required: "Price is required",
                            min: { value: 1, message: "Min. Rp1" },
                        })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {errors.price && <p className="text-xs text-red-500">⚠ {errors.price.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Image URL
                        </label>
                        <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        {...register("image", { required: "Image URL is required" })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {errors.image && <p className="text-xs text-red-500">⚠ {errors.image.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Description
                        </label>
                        <textarea
                        rows={3}
                        placeholder="Describe your product..."
                        {...register("description", {
                            required: "Description is required",
                            minLength: { value: 10, message: "Min. 10 characters" },
                        })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {errors.description && <p className="text-xs text-red-500">⚠ {errors.description.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Category
                        </label>
                        <select
                        {...register("category", { required: "Category is required" })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        </select>
                        {errors.category && <p className="text-xs text-red-500">⚠ {errors.category.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full bg-black text-white text-sm py-2.5 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
                        >
                        {actionLoading ? "Saving..." : editingId ? "Update Product" : "Post Product"}
                        </button>
                        {editingId && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={actionLoading}
                            className="w-full border border-gray-300 text-sm py-2.5 rounded-full font-semibold hover:bg-gray-100 transition cursor-pointer"
                        >
                            Cancel Edit
                        </button>
                        )}
                    </div>
                    </form>
                </div>

                {/* Tabel produk */}
                <div className="lg:col-span-2 flex flex-col gap-6 w-full">
                    <h2 className="text-lg font-extrabold text-black">
                    Arrangement Inventory
                    </h2>

                    {error && (
                    <div className="flex flex-col items-center justify-center p-10 text-center text-red-500 bg-red-50 border border-red-200 rounded-2xl">
                        <span className="text-2xl mb-1">⚠</span>
                        <h3 className="font-bold text-black text-sm">Failed to Load Products</h3>
                        <p className="text-xs mt-1 text-slate-500">{error}</p>
                    </div>
                    )}

                    {loading && !error && (
                    <div className="animate-pulse">
                        <div className="h-48 bg-gray-100 rounded-2xl" />
                    </div>
                    )}

                    {!loading && !error && productList.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-400 rounded-2xl">
                        <span className="text-3xl mb-2">📦</span>
                        <h3 className="font-bold text-black text-sm">Inventory is Empty</h3>
                        <p className="text-xs mt-1 text-gray-600">
                        Use the entry form to sell your first product!
                        </p>
                    </div>
                    )}

                    {!loading && !error && productList.length > 0 && (
                    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productList.map((product) => (
                            <ProductItem
                                key={product.id}
                                product={product}
                                onEdit={startEdit}
                                onDelete={handleDelete}
                                disabled={actionLoading}
                            />
                            ))}
                        </tbody>
                        </table>
                    </div>
                    )}
                </div>
                </div>
            </main>
            <Footer />
        </>
    )
}