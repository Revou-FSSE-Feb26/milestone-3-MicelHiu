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

export const products: Product[] = [
    {
        id: 1,
        name: "Wireless Noise-Cancelling Headphones",
        description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal clear sound. Perfect for travel, work, or relaxation.",
        price: 299000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        category: "Electronics",
    },
    {
        id: 2,
        name: "Smart Watch Series 5",
        description: "Track your fitness, reveive notifications, and monitor your health with this sleek smartwatch. Water resistant up to 50 meters and 100 hour battery life.",
        price: 125000,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        category: "Electronics",
    },
    {
        id: 3,
        name: "Portable Bluetooth Speaker",
        description: "360 degree sound, IPX7 waterproof, and 12-hour playtime. The ideal companion for outdoor adventures, beach days, or backyard parties.",
        price: 450000,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        category: "Electronics",
    },
    {
        id: 5,
        name: "Minimalist Canvas Backpack",
        description: "Clean lines, durable canvas material, and plenty of compartments. Fits a 15-inch laptop and all your daily essentials.",
        price: 320000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        category: "Fashion",
    },
    {
        id: 6,
        name: "Slim-Fit Chino Pants",
        description: "Versatile chino pants crafted from stretch cotton blend. Goes from casual to smart-casual effortlessly.",
        price: 199000,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400",
        category: "Fashion",
    },
    // Home & Living
    {
        id: 7,
        name: "Ceramic Pour-Over Coffee Set",
        description: "Handcrafted ceramic dripper with matching server. Brew barista-quality coffee at home with precise pour control.",
        price: 385000,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        category: "Home & Living",
    },
    {
        id: 8,
        name: "Scented Soy Candle Set",
        description: "Set of 3 hand-poured soy wax candles in calming lavender, warm vanilla, and fresh eucalyptus scents. 40-hour burn time each.",
        price: 145000,
        image: "https://images.unsplash.com/photo-1643122966676-29e8597257f7",
        category: "Home & Living",
    },
    {
        id: 9,
        name: "Wooden Desk Organizer",
        description: "Keep your workspace tidy with this 5-slot bamboo desk organizer. Holds pens, notebooks, phone, and more.",
        price: 98000,
        image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
        category: "Home & Living",
    },
    // Sports
    {
        id: 10,
        name: "Yoga Mat Premium",
        description: "6mm thick eco-friendly TPE mat with non-slip surface and carrying strap. Supports all yoga styles and intensity levels.",
        price: 265000,
        image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400",
        category: "Sports",
    },
    {
        id: 11,
        name: "Stainless Steel Water Bottle",
        description: "Double-wall vacuum insulated. Keeps drinks cold 24 hours, hot 12 hours. BPA-free and leak-proof.",
        price: 175000,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
        category: "Sports",
    },
    {
        id: 12,
        name: "Resistance Band Set",
        description: "Set of 5 resistance bands with varying tension levels. Perfect for home workouts, stretching, and physical therapy.",
        price: 115000,
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
        category: "Sports",
    },
];

export const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Sports",
];

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }). format(price);
};

export function getProducts(): Product[] {
    if(typeof window === "undefined") return products;

    try {
        const stored = localStorage.getItem("revoshop_products");
        return stored ? JSON.parse(stored) : products;
    } catch {
        return products;
    }
}