'use client';

import { useState } from 'react';
import { CartItem, clearCart } from '@/lib/cart';
import { X, MessageCircle, Send } from 'lucide-react';

interface BuyFormProps {
    cart: CartItem[];
    total: number;
    onClose: () => void;
}

export default function BuyForm({ cart, total, onClose }: BuyFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Construct WhatsApp message
        const message = `Hello VEDA Beauty,\n\nI would like to place a wholesale order:\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}\n\n*Order Summary:*\n${cart.map(item => `- ${item.name} ${item.shade ? `(Shade: ${item.shade})` : ''} x ${item.quantity}`).join('\n')}\n\n*Total Amount: ₹${total.toFixed(2)}*\n\nPlease confirm my order.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/917900127488?text=${encodedMessage}`;

        // Clear cart and redirect
        clearCart();
        window.open(whatsappUrl, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-veda-dark/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[35px] shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-300 overflow-hidden">
                {/* Decorative header background */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FFF0F3] to-white pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-500 backdrop-blur-md"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative p-8 md:p-10">
                    <div className="text-center mb-8">
                        <span className="inline-block p-3 bg-[#E7F8F0] text-[#25D366] rounded-2xl mb-4">
                            <MessageCircle className="w-8 h-8" />
                        </span>
                        <h2 className="text-3xl font-serif text-veda-dark mb-2">Finalize Your Order</h2>
                        <p className="text-gray-500 text-sm">Send your order details directly to our wholesale team via WhatsApp for instant confirmation.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF2D55]/20 focus:border-[#FF2D55]/50 transition-all outline-none font-medium text-veda-dark placeholder:text-gray-300"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF2D55]/20 focus:border-[#FF2D55]/50 transition-all outline-none font-medium text-veda-dark placeholder:text-gray-300"
                                    placeholder="+91 Phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Delivery Address</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF2D55]/20 focus:border-[#FF2D55]/50 transition-all outline-none font-medium text-veda-dark placeholder:text-gray-300 resize-none"
                                    placeholder="Enter complete shipping address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Order Recap */}
                        <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100 mt-6">
                            <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-3">
                                <span className="text-xs font-bold text-gray-500 uppercase">Order Total</span>
                                <span className="text-xl font-bold text-veda-dark">₹{total.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-center text-gray-400">
                                Includes {cart.length} items • Free Shipping • Wholesale Tax Applied
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <span>Send Order on WhatsApp</span>
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
