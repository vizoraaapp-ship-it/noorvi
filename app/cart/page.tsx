'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateQuantity } from '@/lib/cart';
import { CartItem } from '@/types';
import Layout from '@/app/layout'; // Not needed if in app router but good for imports check
import Link from 'next/link';
import Image from 'next/image';
import BuyForm from '@/components/BuyForm';

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showBuyForm, setShowBuyForm] = useState(false);

    useEffect(() => {
        setCart(getCart());

        const handleCartUpdate = () => {
            setCart(getCart());
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <Link href="/" className="bg-primary text-white py-2 px-6 rounded-sm shadow-md hover:bg-blue-600 transition-colors">
                    Shop Now
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-grow">
                    <h1 className="text-xl font-bold mb-4">Shopping Cart ({cart.length})</h1>
                    <div className="bg-white shadow-sm rounded-sm">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 border-b last:border-b-0">
                                <div className="relative h-24 w-24 flex-shrink-0">
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                    <div className="text-lg font-bold text-gray-900 my-1">₹{item.price}</div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                                                disabled={item.quantity <= 1}
                                            >-</button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                                            >+</button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-sm font-medium text-gray-500 hover:text-red-500 uppercase"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Details */}
                <div className="lg:w-80 flex-shrink-0">
                    <div className="bg-white shadow-sm rounded-sm p-4 sticky top-20">
                        <h2 className="text-gray-500 font-medium uppercase border-b pb-2 mb-4">Price Details</h2>
                        <div className="flex justify-between mb-2">
                            <span>Price ({cart.length} items)</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-green-600">
                            <span>Delivery Charges</span>
                            <span>FREE</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed py-4 font-bold text-lg">
                            <span>Total Amount</span>
                            <span>₹{total}</span>
                        </div>
                        <button
                            onClick={() => setShowBuyForm(true)}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-sm shadow-md transition-colors uppercase"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>

            {showBuyForm && (
                <BuyForm
                    cart={cart}
                    total={total}
                    onClose={() => setShowBuyForm(false)}
                />
            )}
        </div>
    );
}
