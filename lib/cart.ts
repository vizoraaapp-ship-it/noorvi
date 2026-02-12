import { CartItem } from '@/types';
export type { CartItem };

export const getCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('veda_cart');
    return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: CartItem) => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex((item) =>
        item.id === product.id && item.shade === product.shade
    );

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ ...product });
    }

    localStorage.setItem('veda_cart', JSON.stringify(cart));
    // Dispatch a custom event to update UI immediately
    window.dispatchEvent(new Event('cart-updated'));
};

export const removeFromCart = (productId: string, shade?: string) => {
    const cart = getCart();
    const newCart = cart.filter((item) => !(item.id === productId && item.shade === shade));
    localStorage.setItem('veda_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
};

export const updateQuantity = (productId: string, quantity: number, shade?: string) => {
    const cart = getCart();
    const itemIndex = cart.findIndex((item) => item.id === productId && item.shade === shade);

    if (itemIndex > -1) {
        if (quantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = quantity;
        }
        localStorage.setItem('veda_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
    }
};

export const clearCart = () => {
    localStorage.removeItem('veda_cart');
    window.dispatchEvent(new Event('cart-updated'));
}
