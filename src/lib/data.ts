import axios from "axios";

const api = axios.create({
    baseURL: "https://6a3590b3708f62230b192890.mockapi.io/products",
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

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }). format(price);
};


//API
export async function fetchProducts(limit=20): Promise<Product[]> {
    const res = await api.get<Product[]>("/products");
    return res.data.map((p) => ({
        ...p,
        id: Number(p.id),
        price: p.price * USD_TO_IDR,
    }));
}

export async function fetchProductById(id: number): Promise<Product | null> {
    try {
        const res = await api.get<Product>(`/products/${id}`);
        return { ...res.data, id: Number(res.data.id), price: res.data.price * USD_TO_IDR, };
    } catch {
        return null;
    }
}

export async function fetchCategories(): Promise<string[]> {
    const products = await fetchProducts();
    const categories = [...new Set(products.map((p) => p.category))];
    return categories;
}

//create
export async function createProduct(data: ProductFormInput): Promise<Product> {
    const res = await api.post<Product>("/products", data);
    return { ...res.data, id: Number(res.data.id), price: res.data.price * USD_TO_IDR, };
}

//update
export async function updateProduct(id: number, data: ProductFormInput): Promise<Product> {
    const res = await api.put<Product>(`/products/${id}`, data);
    return { ...res.data, id: Number(res.data.id), price: res.data.price * USD_TO_IDR, };
}

//delete
export async function deleteProduct(id:number): Promise<boolean> {
    await api.delete(`/products/${id}`);
    return true;
}
