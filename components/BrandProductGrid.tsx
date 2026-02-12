'use client';

import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface BrandProductGridProps {
    products: Product[];
    brandName: string;
}

export default function BrandProductGrid({ products, brandName }: BrandProductGridProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('popular');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // items per page (5 columns x 3 rows = 15)
    const itemsPerPage = 15;

    // Derived categories for filter dropdown
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category).filter(Boolean));
        return ['All', ...Array.from(cats).sort()];
    }, [products]);

    // Filter and Sort Logic
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // Filter
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Sort
        if (sortOption === 'price_asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price_desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'newest') {
            // Assuming created_at exists, else fallback to id or similar
            result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        }
        // 'popular' is default/random mix for now or original order

        return result;
    }, [products, selectedCategory, sortOption]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const currentProducts = filteredAndSortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, sortOption]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Optional: Smooth scroll to top of grid
            document.getElementById('all-products-grid')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="all-products-grid" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl md:text-3xl font-serif text-gray-900">
                    All Products <span className="text-base text-gray-400 font-sans font-normal ml-2">({filteredAndSortedProducts.length})</span>
                </h2>

                <div className="flex flex-wrap justify-center gap-3">
                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <SlidersHorizontal className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer shadow-sm font-medium"
                        >
                            <option value="popular">Sort By: Popularity</option>
                            <option value="newest">Sort By: Newest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                        <ChevronLeft className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 min-h-[400px]">
                {currentProducts.map(product => (
                    <ProductCard key={product.id} {...product} isWishlisted={false} imageUrl={product.image_url} />
                ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400">No products found matching your criteria.</p>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <span className="font-bold text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </section>
    );
}
