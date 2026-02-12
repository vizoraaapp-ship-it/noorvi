'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { addToCart } from '@/lib/cart';
import { ShoppingCart, MessageSquare, AlertCircle } from 'lucide-react';
import { clearCart } from '@/lib/cart';

interface ProductPurchaseActionsProps {
    product: Product;
    discountedPrice: number;
}

export default function ProductPurchaseActions({ product, discountedPrice }: ProductPurchaseActionsProps) {
    const [shade, setShade] = useState('');
    const [error, setError] = useState(false);
    const [added, setAdded] = useState(false);

    const isShadeRequired = product.name.toLowerCase().includes('lipstick pencil');

    const handleAddToCart = () => {
        if (isShadeRequired && !shade) {
            setError(true);
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: discountedPrice,
            quantity: 1,
            image_url: product.image_url,
            shade: isShadeRequired ? shade : undefined
        });

        setError(false);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (isShadeRequired && !shade) {
            setError(true);
            return;
        }

        const message = `Hello VEDA Beauty,\n\nI want to buy:\n- ${product.name}${shade ? ` (Shade: ${shade})` : ''}\n\nPrice: ₹${discountedPrice}\n\nPlease confirm availability.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/917900127488?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="flex flex-col gap-6">
            {isShadeRequired && (
                <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                        <p className="text-sm font-bold text-gray-800 mb-2">Select Your Shade</p>
                        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-white mb-3">
                            <Image
                                src="/images/mars/lipstick_pencil_shades.png"
                                alt="Shades Reference"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase">Enter Shade Number</label>
                            <input
                                type="text"
                                placeholder="e.g. 01, 12, etc."
                                value={shade}
                                onChange={(e) => {
                                    setShade(e.target.value);
                                    if (e.target.value) setError(false);
                                }}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                            />
                            {error && (
                                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" /> Please enter a shade number to continue
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 md:static md:p-0 md:bg-transparent md:border-0 z-50 flex gap-3 shadow-top md:shadow-none">
                <button
                    onClick={handleAddToCart}
                    className={`flex-1 font-bold py-3 px-4 rounded-md transition-all flex items-center justify-center gap-2 border ${added
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                        }`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    {added ? 'Added!' : 'Add to Cart'}
                </button>
                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                    <MessageSquare className="w-5 h-5 text-gray-700" />
                    Buy Now
                </button>
            </div>
        </div>
    );
}
