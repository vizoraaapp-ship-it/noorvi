'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface HomeProductGridProps {
    products: Product[];
    wishlistSet: Set<string>;
}

export default function HomeProductGrid({ products, wishlistSet }: HomeProductGridProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16; // 8 columns * 2 rows or just 16 items for now

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to the top of the grid section when page changes
        const section = document.getElementById('all-products-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section id="all-products-section" className="py-2">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-veda-dark">All Products</h2>
                    <p className="text-gray-500 text-sm mt-1">Discover our full professional collection</p>
                </div>

                <div className="flex gap-4">
                    <select className="bg-white border border-veda-gold/20 rounded-xl px-4 py-2 text-sm text-veda-dark focus:ring-veda-gold outline-none">
                        <option>Sort by: Newest</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6 px-4">
                {currentProducts.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-pink-soft/20 rounded-3xl border border-dashed border-veda-gold/20">
                        <p className="text-gray-400 font-serif italic text-xl">No products discovered yet.</p>
                    </div>
                ) : (
                    currentProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            category={product.category}
                            price={product.price}
                            imageUrl={product.image_url}
                            brand={product.brand}
                            isWishlisted={wishlistSet.has(product.id)}
                        />
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full bg-white text-veda-dark flex items-center justify-center border border-gray-100 hover:bg-veda-cream transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Show pages around current page if totalPages is large
                            let pageNum = i + 1;
                            if (totalPages > 5) {
                                if (currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                }
                            }

                            if (pageNum <= 0 || pageNum > totalPages) return null;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${currentPage === pageNum
                                            ? 'bg-veda-gold text-white shadow-lg shadow-veda-gold/20'
                                            : 'bg-white/50 text-veda-dark hover:bg-veda-cream border border-gray-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full bg-white text-veda-dark flex items-center justify-center border border-gray-100 hover:bg-veda-cream transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </section>
    );
}
