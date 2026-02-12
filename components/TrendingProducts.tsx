"use client";

import { useRef } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface TrendingProductsProps {
    products: Product[];
    wishlistSet: Set<string>;
}

const TrendingProducts = ({ products, wishlistSet }: TrendingProductsProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-2 mb-2 bg-transparent rounded-3xl">
            <div className="px-6 md:px-12 mb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif text-veda-dark">Trending Now</h2>
                </div>
                <div className="hidden md:flex gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="p-3 rounded-full border border-veda-gold/20 hover:bg-veda-gold hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-3 rounded-full border border-veda-gold/20 hover:bg-veda-gold hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-6 md:px-12 pb-6 scroll-smooth"
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[65%] sm:min-w-[40%] md:min-w-[30%] lg:min-w-[18%] snap-start">
                        <ProductCard
                            id={product.id}
                            name={product.name}
                            category={product.category}
                            price={product.price}
                            imageUrl={product.image_url}
                            brand={product.brand}
                            isWishlisted={wishlistSet.has(product.id)}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrendingProducts;
