"use client";

import ProductCard from './ProductCard';
import { Product } from '@/types';
import Link from 'next/link';

interface NewArrivalsProps {
    products: Product[];
    wishlistSet: Set<string>;
}

const NewArrivals = ({ products, wishlistSet }: NewArrivalsProps) => {
    return (
        <section className="py-2 mb-2">
            <div className="flex justify-between items-end mb-4 px-2 md:px-4">
                <div>
                    <h2 className="text-3xl font-serif text-veda-dark">Just Launched</h2>
                </div>
                <Link
                    href="/search?sort=newest"
                    className="text-veda-gold hover:text-veda-dark font-semibold transition-colors duration-300 border-b border-transparent hover:border-veda-dark"
                >
                    View Collection
                </Link>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-4 pb-6 scroll-smooth">
                {products.map((product) => (
                    <div key={product.id} className="min-w-[45%] sm:min-w-[30%] md:min-w-[20%] lg:min-w-[15%] snap-start">
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

export default NewArrivals;
