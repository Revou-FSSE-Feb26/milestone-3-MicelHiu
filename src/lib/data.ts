import axios from "axios";
import { privateDecrypt } from "node:crypto";
import { title } from "node:process";

const api = axios.create({
    baseURL: "https://fakestoreapi.com",
});

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
};

export interface ProductFormInput {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

export interface ProductItemProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    disabled: boolean;
}

interface FakeStoreProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

const USD_TO_IDR = 16000;
function mapFakeStoreProduct(p: FakeStoreProduct): Product {
    return {
        id: p.id,
        name: p.title,
        description: p.description,
        price: p.price * USD_TO_IDR,
        image: p.image,
        category: p.category,
    };
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }). format(price);
};

export async function fetchProducts(limit=20): Promise<Product[]> {
    const res = await api.get<FakeStoreProduct[]>("/products");
    return res.data.map(mapFakeStoreProduct);
}

export async function fetchProductById(id: number): Promise<Product | null> {
    try {
        const res = await api.get<FakeStoreProduct>(`/products/${id}`);
        return mapFakeStoreProduct(res.data);
    } catch {
        return null;
    }
}

export async function fetchCategories(): Promise<string[]> {
    const res = await api.get<string[]>("products/categories");
    return res.data;
}

export async function createProduct(data: ProductFormInput): Promise<Product> {
    const payload = {
        title: data.name,
        price: data.price,
        description: data.description,
        images: data.image,
        categoryId: data.category,
    };
    const res = await api.post<FakeStoreProduct>("/products", payload);
    return mapFakeStoreProduct(res.data);
}

export async function updateProduct(id: number, data: ProductFormInput): Promise<Product> {
    const payload = {
        title: data.name,
        price: data.price,
        description: data.description,
        images: data.image,
        category: data.category,
    };
    const res = await api.put<FakeStoreProduct>(`/products/${id}`, payload);
    return mapFakeStoreProduct(res.data);
}

export async function deleteProduct(id:number): Promise<boolean> {
    const res = await api.delete<boolean>(`/products/${id}`);
    return res.status === 200;
}
