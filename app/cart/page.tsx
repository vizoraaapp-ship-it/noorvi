'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateQuantity } from '@/lib/cart';
import { CartItem } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import BuyForm from '@/components/BuyForm';
import { Trash2, Plus, Minus, ShieldCheck, Tag } from 'lucide-react';

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showBuyForm, setShowBuyForm] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

    useEffect(() => {
        setCart(getCart());

        const handleCartUpdate = () => {
            setCart(getCart());
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxRate = 0.08;
    const estimatedTax = subtotal * taxRate;
    const total = subtotal + estimatedTax;

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-veda-background pt-24">
                <div className="w-24 h-24 mb-6 text-veda-gold/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-serif text-veda-dark mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 italic text-center max-w-md">Looks like you haven't added any professional beauty products to your wholesale order yet.</p>
                <Link href="/" className="bg-veda-gold text-white py-4 px-10 rounded-full font-bold shadow-lg hover:bg-veda-dark transition-all duration-300">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-veda-background min-h-screen pt-24 pb-32 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Custom Header */}
                <div className="mb-6 md:mb-10">
                    <h1 className="text-3xl md:text-5xl font-serif text-veda-dark mb-1">Shopping Cart</h1>
                    <p className="text-sm md:text-base text-gray-500 font-medium">
                        You have <span className="text-[#FF2D55] font-bold">{cart.length} items</span> in your wholesale order.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Cart Items List */}
                    <div className="flex-grow space-y-4 md:space-y-6">
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.shade || 'default'}`}
                                className="bg-white rounded-[25px] md:rounded-[40px] p-4 md:p-6 shadow-sm border border-veda-gold/5 flex items-center md:items-center gap-4 md:gap-6 relative transition-all duration-300 hover:shadow-md">

                                {/* Image Container */}
                                <div className="relative h-20 w-20 md:h-40 md:w-40 flex-shrink-0 bg-gray-50 rounded-2xl md:rounded-3xl p-2 md:p-4">
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-[#FF2D55] uppercase mb-1 block">
                                                {item.brand || 'LUMIÉRE PARIS'}
                                            </span>
                                            <h3 className="text-sm md:text-xl font-bold text-veda-dark mb-1 leading-tight line-clamp-2 md:line-clamp-none">
                                                {item.name}
                                            </h3>
                                            <p className="text-[10px] md:text-sm text-gray-400 mb-2 md:mb-6">
                                                Bulk Case (12 Units)
                                                {item.shade && <span className="text-[#FF2D55]"> • Shade: {item.shade}</span>}
                                            </p>
                                        </div>
                                        {/* Remove button moved to top right absolute for mobile, but here for flex */}
                                        <button
                                            onClick={() => removeFromCart(item.id, item.shade)}
                                            className="p-1 text-gray-300 hover:text-red-500 transition-colors md:mr-0 -mt-1"
                                            title="Remove item"
                                        >
                                            <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center bg-gray-100/50 rounded-full px-1 py-1 md:px-2 md:py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.shade)}
                                                className="p-1 rounded-full text-gray-400 hover:text-[#FF2D55] bg-white shadow-sm transition-all disabled:opacity-30"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3 md:h-4 md:w-4" />
                                            </button>
                                            <span className="w-6 md:w-8 text-center text-xs md:text-sm font-bold text-veda-dark">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.shade)}
                                                className="p-1 rounded-full text-white bg-[#FF2D55] shadow-md shadow-red-200 hover:scale-110 transition-all"
                                            >
                                                <Plus className="h-3 w-3 md:h-4 md:w-4" />
                                            </button>
                                        </div>

                                        <p className="text-lg md:text-2xl font-bold text-[#FF2D55] md:text-veda-dark italic md:not-italic">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Summary Sidebar */}
                    <div className="hidden lg:block lg:w-[400px] space-y-6">
                        {/* Order Summary Card */}
                        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-veda-gold/5 sticky top-24">
                            <h2 className="text-2xl font-serif text-veda-dark mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span className="text-veda-dark font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Estimated Shipping</span>
                                    <span className="text-green-500 font-bold uppercase text-xs tracking-wider">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Wholesale Tax (8%)</span>
                                    <span className="text-veda-dark font-medium">₹{estimatedTax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-veda-gold/20 pt-6 mb-10 flex justify-between items-end">
                                <span className="text-xl font-serif text-veda-dark">Total</span>
                                <span className="text-3xl font-bold text-veda-dark tracking-tighter">₹{total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={() => setShowBuyForm(true)}
                                className="w-full bg-gradient-to-r from-[#FF2D55] to-[#FF375F] text-white font-bold py-5 rounded-3xl shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider text-sm"
                            >
                                Proceed to Checkout
                                <Plus className="h-4 w-4 rotate-45" />
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold tracking-widest uppercase grayscale opacity-50">
                                <ShieldCheck className="h-4 w-4" />
                                SECURE SSL ENCRYPTED CHECKOUT
                            </div>
                        </div>

                        {/* Promo Code Card */}
                        <div className="bg-[#FFF0F3] rounded-[30px] p-6 border border-[#FF2D55]/10">
                            <div className="flex items-center gap-3 mb-4 text-[#FF2D55]">
                                <Tag className="h-5 w-5" />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Wholesale Promo Code</h3>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="flex-grow bg-white px-4 py-3 rounded-xl border-none text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-[#FF2D55]/20 transition-all font-medium"
                                />
                                <button className="bg-veda-dark text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-[60] block lg:hidden">
                {/* Collapsible Details */}
                <div className={`bg-white border-t border-veda-gold/10 px-6 py-6 transition-all duration-300 ${isSummaryExpanded ? 'max-h-60' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}>
                    <div className="space-y-3 pb-4">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal ({cart.length} items)</span>
                            <span className="font-bold text-veda-dark">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Shipping</span>
                            <span className="text-green-500 font-bold uppercase text-[10px]">Free</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Wholesale Tax (8%)</span>
                            <span className="font-bold text-veda-dark">₹{estimatedTax.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Main Action Bar */}
                <div className="bg-white border-t border-veda-gold/10 px-4 py-4 md:px-6 md:py-5 flex items-center gap-4 rounded-t-[30px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] pb-safe">
                    <div className="flex flex-col min-w-[30%]">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xl md:text-2xl font-bold text-veda-dark leading-none">₹{total.toFixed(2)}</span>
                            <button
                                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-[#FF2D55]"
                            >
                                <Plus className={`h-3 w-3 transition-transform duration-300 ${isSummaryExpanded ? 'rotate-[225deg]' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowBuyForm(true)}
                        className="flex-1 bg-[#FF2D55] text-white font-bold h-12 md:h-14 rounded-xl md:rounded-2xl shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider"
                    >
                        Proceed
                        <Plus className="h-4 w-4 rotate-45" />
                    </button>
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
