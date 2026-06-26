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

const USD_TO_IDR = 16000;

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }). format(price);
};


//API
export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch("/api/products");
    const data: Product[] = await res.json();
    return data.map((p) => ({
        ...p,
        id: Number(p.id),
        price: p.price * USD_TO_IDR,
    }));
}

export async function fetchProductById(id: number): Promise<Product | null> {
    try {
        const res = await fetch(`/api/products/${id}`);
        if(!res.ok) return null;
        const data:Product = await res.json();
        return {
            ...data,
            id: Number(data.id),
            price: data.price*USD_TO_IDR,
        };
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
export async function createProduct(data: ProductFormInput) {
    const payload = {
        ...data,
        price: Number(data.price) / USD_TO_IDR,
    }

    const res = await fetch("/api/products", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    return {
        ...result,
        id: Number(result.id),
        price: result.price * USD_TO_IDR,
    };
}

//update
export async function updateProduct(id: number, data: ProductFormInput) {
    const payload = {
        ...data,
        price: Number(data.price) / USD_TO_IDR,
    };
    
    const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });

    const result = await res.json();
    return {
        ...result,
        id: Number(result.id),
        price: result.price * USD_TO_IDR,
    };
}

//delete
export async function deleteProduct(id:number) {
    await fetch(`/api/products/${id}`, {method: 'DELETE'});
    return true;
}
