import axios from "axios";
import { privateDecrypt } from "node:crypto";
import { title } from "node:process";

const api = axios.create({
    baseURL: "https://fakestoreapi.com",
});

const CUSTOMS_PRODUCTS_KEY = "revoshop_custom_products";
const DELETED_IDS_KEY = "revoshop_deleted_ids";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isCustom? : boolean;
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
        isCustom: false,
    };
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }). format(price);
};

//localstorage - CRUD
function getCustomProducts(): Product[] {
    if(typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(CUSTOMS_PRODUCTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveCustomProducts(products: Product[]) {
    localStorage.setItem(CUSTOMS_PRODUCTS_KEY, JSON.stringify(products));
}

function getDeletedIds(): number[] {
    if(typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(DELETED_IDS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveDeletedIds(ids: number[]) {
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(ids));
}

//API
//gabungin api dan local
export async function fetchProducts(limit=20): Promise<Product[]> {
    const res = await api.get<FakeStoreProduct[]>("/products", {params: {limit}});

    const deletedIds = getDeletedIds();
    const customProducts = getCustomProducts();

    //produk dari api, filter yang sudah dihapus admin
    const apiProducts = res.data
        .map(mapFakeStoreProduct)
        .filter((p) => !deletedIds.includes(p.id));
    
    return [...customProducts, ...apiProducts];
}

export async function fetchProductById(id: number): Promise<Product | null> {
    //cek dlu di custom products
    const customProducts = getCustomProducts();
    const custom = customProducts.find((p) => p.id === id);
    if(custom) return custom;

    //kalau ga ada, fetch dari api
    try {
        const deletedIds = getDeletedIds();
        if(deletedIds.includes(id)) return null;

        const res = await api.get<FakeStoreProduct>(`/products/${id}`);
        return mapFakeStoreProduct(res.data);
    } catch {
        return null;
    }
}

export async function fetchCategories(): Promise<string[]> {
    const res = await api.get<string[]>("products/categories");
    
    //tambahkan kategori custom yang belum ada di api
    const customProducts = getCustomProducts();
    const customCategories = customProducts.map((p) => p.category);
    const allCategories = [...new Set([...res.data, ...customCategories])];

    return allCategories;
}

//create disimpan ke local
export async function createProduct(data: ProductFormInput): Promise<Product> {
    const customProducts = getCustomProducts();
    //generate id unik - pakai timestamp agar ga bentrok dengan api
    const newId = Date.now();

    const newProduct: Product = {
        id: newId,
        name: data.name,
        price: data.price * USD_TO_IDR,
        description: data.description,
        image: data.image,
        category: data.category,
        isCustom: true,
    };

    saveCustomProducts([newProduct, ...customProducts]);
    return newProduct;
}

//update: kalau custom -> update di local, kalau api -> pindahin ke local
export async function updateProduct(id: number, data: ProductFormInput): Promise<Product> {
    const customProducts = getCustomProducts();
    const isCustom = customProducts.some((p) => p.id === id);

    const updatedProduct: Product = {
        id,
        name: data.name,
        price: data.price * USD_TO_IDR,
        description: data.description,
        image: data.image,
        category: data.category,
        isCustom: true,
    };
    
    if(isCustom) {
        //update langsung di custom list
        const updated = customProducts.map((p) => (p.id === id ? updatedProduct : p));
        saveCustomProducts(updated);
    } else {
        //produk dari api, disimpan versi edited ke custom list
        //dan tandai id aslinya sebagai "deleted" supaya tidak muncul duplikat
        const deletedIds = getDeletedIds();
        saveDeletedIds([...deletedIds, id]);
        saveCustomProducts([updatedProduct, ...customProducts]);
    }

    return updatedProduct;
}

//delete
//custom -> hapus di local, api --> tambah ke deleted list
export async function deleteProduct(id:number): Promise<boolean> {
    const customProducts = getCustomProducts();
    const isCustom = customProducts.some((p) => p.id === id);

    if(isCustom) {
        //hapus dari custom list
        const filtered = customProducts.filter((p) => p.id !== id);
        saveCustomProducts(filtered);
    } else {
        //tandai sebagai deleted supaya tidak muncul lagi
        const deletedIds = getDeletedIds();
        saveDeletedIds([...deletedIds, id]);
    }
    return true;
}
