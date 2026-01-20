'use client';

import { useState } from 'react';
import { CartItem, clearCart } from '@/lib/cart';
import { X } from 'lucide-react';

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
        const message = `Hello VEDA Beauty,\n\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}\n\nProducts:\n${cart.map(item => `- ${item.name} (Qty: ${item.quantity})`).join('\n')}\n\nTotal: ₹${total}\n\nPlease confirm availability.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/917900127488?text=${encodedMessage}`;

        // Clear cart and redirect
        clearCart();
        window.open(whatsappUrl, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Complete Purchase</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border rounded-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-4 py-2 border rounded-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full px-4 py-2 border rounded-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-sm">
                            <p className="text-sm text-gray-600 mb-2">Order Summary:</p>
                            <div className="max-h-24 overflow-y-auto text-xs space-y-1">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between">
                                        <span className="truncate w-2/3">{item.name}</span>
                                        <span>x{item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                                <span>Total to Pay:</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-sm shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                            Order on WhatsApp
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
