export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image_url: string;
    images: string[] | null;
    description: string | null;
    brand?: string | null;
    created_at?: string;
}

export interface CartItem extends Pick<Product, 'id' | 'name' | 'price' | 'image_url'> {
    quantity: number;
    shade?: string;
}
