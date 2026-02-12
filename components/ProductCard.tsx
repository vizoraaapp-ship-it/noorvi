'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { addToCart } from '@/lib/cart';
import { toggleWishlist } from '@/actions/wishlist';

interface ProductCardProps {
    id: string;
    name: string;
    category: string;
    price: number;
    imageUrl: string;
    brand?: string | null;
    isWishlisted?: boolean;
}

export default function ProductCard({
    id,
    name,
    category,
    price,
    imageUrl,
    brand,
    isWishlisted = false
}: ProductCardProps) {
    const [wishlisted, setWishlisted] = useState(isWishlisted);
    const [isLoading, setIsLoading] = useState(false);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        const newState = !wishlisted;
        setWishlisted(newState);
        setIsLoading(true);

        const result = await toggleWishlist(id);
        setIsLoading(false);

        if (result?.error) {
            setWishlisted(!newState);
            console.error(result.error);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id,
            name,
            price,
            quantity: 1,
            image_url: imageUrl
        });
    };

    return (
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:z-10 flex flex-col h-full border border-white/20">
            {/* Product Image Section */}
            <Link href={`/product/${id}`} className="block relative aspect-[4/5] overflow-hidden bg-transparent p-3">
                <img
                    src={imageUrl || 'https://via.placeholder.com/300?text=No+Image'}
                    alt={name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Beauty+Product';
                    }}
                />

                {/* Category Badge */}
                {category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-veda-dark text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-sm z-10">
                        {category}
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    disabled={isLoading}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-20 ${wishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-veda-gold'
                        } shadow-sm border border-gray-100`}
                >
                    <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
                </button>
            </Link>

            {/* Product Info Section */}
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-[10px] font-bold text-veda-gold uppercase tracking-[0.2em] mb-1">
                    {brand || 'Veda Beauty'}
                </p>
                <Link href={`/product/${id}`} className="block group/title mb-auto">
                    <h3 className="text-sm md:text-base font-medium text-veda-dark line-clamp-2 leading-tight group-hover/title:text-veda-gold transition-colors duration-300 min-h-[2.5rem]">
                        {name}
                    </h3>
                </Link>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-veda-dark">₹{price}</span>
                        <span className="text-[10px] text-gray-400 line-through">₹{Math.floor(price * 1.3)}</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="p-2 border border-veda-gold/20 rounded-xl text-veda-gold hover:bg-veda-gold hover:text-white transition-all duration-300 active:scale-95 group/add"
                    >
                        <Plus size={20} className="transition-transform group-hover/add:rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    );
}
