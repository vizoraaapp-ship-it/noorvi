import { CartItem } from '@/types';
export type { CartItem };

export const getCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('veda_cart');
    return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: CartItem) => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('veda_cart', JSON.stringify(cart));
    // Dispatch a custom event to update UI immediately
    window.dispatchEvent(new Event('cart-updated'));
};

export const removeFromCart = (productId: string) => {
    const cart = getCart();
    const newCart = cart.filter((item) => item.id !== productId);
    localStorage.setItem('veda_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
};

export const updateQuantity = (productId: string, quantity: number) => {
    const cart = getCart();
    const itemIndex = cart.findIndex((item) => item.id === productId);

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
