"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { products as defaultProducts, Product, ProductFormInput, categories } from "@/lib/data";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductItem } from "@/components/ProductItem";

const STORAGE_KEY = "revoshop_products"; //ekstrak key localstorage

export default function AdminDashboard() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState<boolean>(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    //CRUD
    const [productList, setProductList] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    /* login */
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const email = localStorage.getItem("userEmail");

        if(isLoggedIn !== "true") {
            router.push("/login");
        } else {
            setUserEmail(email);
            setIsChecking(false);
        }
    }, [router]);

    //load products in the store
    useEffect(() => {
        if (isChecking) return;

        const fetchProducts = async() => {
            try {
                setLoading(true);
                const stored = localStorage.getItem(STORAGE_KEY);
                setProductList(stored ? JSON.parse(stored) : defaultProducts);
            } catch (error: any) {
                setError(error.message || "Failed to load products.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [isChecking]);

    const handleSignOut = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        router.push("/dashboard");
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
    const onSubmit = (data: ProductFormInput) => {
        try {
            setActionLoading(true);
            const payload = {
                ...data,
                price: Number(data.price),
            };

            if(editingId) {
                //PUT (update) operation -> update state dn local storage
                const updated = productList.map((p) => p.id === editingId ? {...p, ...payload} : p);
                setProductList(updated);
                localStorage.setItem("revoshop_products", JSON.stringify(updated));
                setEditingId(null);
            } else {
                // tambah ke state & local storage (POST)
                const newProduct = {
                    ...payload,
                    id: productList.length > 0
                        ? Math.max(...productList.map((p) => p.id)) + 1
                        : 1,
                };
                const updated = [newProduct, ...productList];
                setProductList(updated);
                localStorage.setItem("revoshop_products", JSON.stringify(updated));
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
    const handleDelete = (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return; 

        const updated = productList.filter((product) => product.id !== id);
        setProductList(updated);
        localStorage.setItem("revoshop_products", JSON.stringify(updated));

        if(editingId === id) cancelEdit();
    }

    if(isChecking) {
        return (
            <>
                <Navigation />
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
            <Navigation />
            <main className="shop-container mx-auto px-6 py-10 bg-white text-black min-h-screen min-w-screen">
                {/* Header Dashboard Info */}
                <header className="mb-10 border-b border-slate-200 pb-6 flex flex-col items-center justify-between gap-4">
                    <h1 className="text-3xl font-extrabold tracking-tight text-black">
                        Your Products</h1>
                    <p className="mt-2 text-slate-500 text-sm">
                        Authenticated as: <span className="font-bold">{userEmail}</span>
                    </p>

                    <button
                        onClick={handleSignOut}
                        className="text-sm px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition text-black"
                    >
                        Sign Out
                    </button>
                </header>

                {/* Form and Table Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                
                {/* Left Side: Create / Update Form Card */}
                <div className="bg-white border border-gray-500 rounded-2xl p-6 shadow-xs lg:col-span-1">
                    <h2 className="text-lg font-extrabold text-black mb-5">
                        {editingId ? "Edit Product Details" : "Add Product Arrangement"}
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Product Name Input */}
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

                    {/* Product Price Input */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Price (IDR)
                            </label>
                            <input
                                type="number"
                                step="1"
                                placeholder="e.g. 299000"
                                {...register("price", {
                                    required: "Price is required",
                                    min: { value: 1, message: "Min. Rp1" },
                                })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                            {errors.price && <p className="text-xs text-red-500">⚠ {errors.price.message}</p>}
                        </div>

                    {/* Product Image URL input */}
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

                    {/* Product Description Textarea */}
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

                    {/* Submit Buttons */}
                    <div className="flex flex-col gap-2 mt-2">
                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="btn-primary w-full bg-black text-white text-sm py-2.5 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {actionLoading ? "Saving..." : editingId ? "Product updated" : "Product posted"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={actionLoading}
                                className="btn-secondary w-full border border-gray-300 text-sm py-2.5 rounded-full font-semibold hover:bg-gray-100 transition"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    </form>
                </div>

                {/* Right Side: Listings CRUD Table */}
                <div className="lg:col-span-2 flex flex-col gap-6 w-full">
                    <h2 className="text-lg font-extrabold text-black">
                        Arrangement Inventory
                    </h2>

                    {/* Error Feedback Component */}
                    {error && (
                        <div className="flex flex-col items-center justify-center p-10 text-center text-red-500 bg-red-50 border border-red-200 rounded-2xl">
                            <span className="text-2xl mb-1">⚠</span>
                            <h3 className="font-bold text-black text-sm">Failed to Load Listings</h3>
                            <p className="text-xs mt-1 text-slate-500">{error}</p>
                        </div>
                    )}

                    {/* Loading Spinner table row */}
                    {loading && !error && (
                        <div className="admin-table-container animate-pulse">
                            <div className="h-48 bg-white" />
                        </div>
                    )}

                    {/* Empty inventory listing message */}
                    {!loading && !error && productList.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-400 rounded-2xl">
                            <span className="text-3xl mb-2">📦</span>
                            <h3 className="font-bold text-black text-sm">Inventory is Empty</h3>
                            <p className="text-xs mt-1 text-gray-600">
                                Use the entry form to sell your first product!.
                            </p>
                        </div>
                    )}

                    {/* Inventory CRUD Table Grid */}
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