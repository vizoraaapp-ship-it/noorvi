'use client';

import Image from 'next/image';
import Link from 'next/link';
import { addToCart } from '@/lib/cart';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { toggleWishlist } from '@/actions/wishlist'; // Import the action

import { Product } from '@/types';

interface ProductCardProps extends Partial<Product> {
    id: string;
    name: string;
    category: string;
    price: number;
    imageUrl: string;
    brand?: string | null;
    isWishlisted?: boolean; // New Prop
}

export default function ProductCard({ id, name, category, price, imageUrl, brand, isWishlisted = false }: ProductCardProps) {
    const [wishlisted, setWishlisted] = useState(isWishlisted);
    const [isLoading, setIsLoading] = useState(false);

    // Mock data for visual completeness matching the reference image
    const rating = 4.2;
    // Deterministic random based on ID to avoid hydration mismatch
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const ratingCount = 500 + (seed * 123) % 4500;
    const originalPrice = Math.round(price * 1.35);
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        // Optimistic update
        const newState = !wishlisted;
        setWishlisted(newState);
        setIsLoading(true);

        const result = await toggleWishlist(id);

        setIsLoading(false);

        if (result?.error) {
            // Revert on error
            setWishlisted(!newState);
            // Optionally show toast/alert (skipping for simplicity now)
            console.error(result.error);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        addToCart({
            id,
            name,
            price,
            quantity: 1,
            image_url: imageUrl
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col w-full relative group h-auto min-h-[280px] md:min-h-[380px]">

            {/* Wishlist Heart - Absolute Position, higher z-index to sit on top of Link */}
            <div className="absolute top-2 right-2 z-30">
                <div
                    onClick={handleWishlistToggle}
                    className={`bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm cursor-pointer transition-colors border border-gray-100 ${wishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                    <Heart className={`h-3 w-3 md:h-4 md:w-4 ${wishlisted ? 'fill-current' : ''}`} />
                </div>
            </div>

            {/* Main Card Link - Wraps everything else */}
            <Link href={`/product/${id}`} className="flex flex-col h-full w-full">
                {/* Image Section */}
                <div className="relative h-[150px] md:h-[220px] w-full block bg-white p-2">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 33vw"
                    />
                </div>

                <div className="p-2 md:p-3 flex flex-col flex-grow bg-white rounded-b-lg">
                    {/* Brand */}
                    <div className="text-[10px] md:text-xs text-gray-500 font-bold mb-0.5 md:mb-1 uppercase tracking-wider truncate">
                        {brand || category}
                    </div>

                    {/* Title - No longer a nested Link */}
                    <div className="text-xs md:text-sm text-gray-800 line-clamp-2 leading-tight mb-1 md:mb-2 hover:text-blue-600 transition-colors h-8 md:h-10">
                        {name}
                    </div>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                        <div className="px-1.5 py-0.5 bg-green-700 text-white text-[9px] md:text-[10px] font-bold rounded flex items-center gap-0.5 shadow-sm">
                            {rating} <Star size={8} className="fill-white" />
                        </div>
                        <span className="text-[10px] md:text-xs text-gray-500 font-medium truncate">({ratingCount.toLocaleString()})</span>
                    </div>

                    <div className="mt-auto">
                        {/* Price Row */}
                        <div className="flex flex-wrap items-baseline gap-1 md:gap-2 mb-1 md:mb-2">
                            <span className="text-sm md:text-base font-bold text-gray-900">₹{price}</span>
                            <span className="text-[10px] md:text-xs text-gray-500 line-through">₹{originalPrice}</span>
                            <span className="text-[10px] md:text-xs font-bold text-green-600">{discount}% off</span>
                        </div>

                        {/* Lowest Price Tag */}
                        <div className="inline-block px-1.5 py-0.5 bg-green-50 border border-green-100 rounded-full mb-1">
                            <span className="text-[9px] md:text-[10px] font-bold text-green-700 block text-center truncate">
                                Lowest price
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
