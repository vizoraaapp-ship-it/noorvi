import { createSafeSupabaseClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

export const revalidate = 0;

import { Product } from '@/types';

interface SearchPageProps {
    searchParams: {
        q?: string;
        maxPrice?: string;
        category?: string;
    };
}

async function searchProducts(query: string, maxPrice?: number): Promise<Product[]> {
    const supabase = createSafeSupabaseClient();
    if (!supabase) return [];

    try {
        let supabaseQuery = supabase.from('products').select('*');

        if (query) {
            supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`);
        }

        if (maxPrice) {
            supabaseQuery = supabaseQuery.lte('price', maxPrice);
        }

        const { data, error } = await supabaseQuery;

        if (error) {
            console.error('Error searching products:', error);
            return [];
        }
        return data as Product[] || [];
    } catch (e) {
        console.error('Unexpected error searching products:', e);
        return [];
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || '';
    const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined;
    const products = await searchProducts(query, maxPrice);

    return (
        <div className="bg-veda-background min-h-screen pt-20 pb-20">
            {/* Header Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-veda-gold/10 sticky top-20 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-veda-dark hover:text-veda-gold transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                        <span>Back</span>
                    </Link>
                    <div className="h-8 w-[1px] bg-veda-gold/20" />
                    <h1 className="text-lg font-serif text-veda-dark truncate">
                        {maxPrice ? `Products under ₹${maxPrice}` : query ? `Search: ${query}` : 'Explorer'}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-veda-dark">
                        {maxPrice ? (
                            <>
                                Wholesale Deals <span className="text-veda-gold italic">Under ₹{maxPrice}</span>
                                <span className="text-sm text-gray-500 font-sans ml-4 italic">({products.length} found)</span>
                            </>
                        ) : query ? (
                            <>
                                Results for <span className="text-veda-gold italic">&quot;{query}&quot;</span>
                                <span className="text-sm text-gray-500 font-sans ml-4 italic">({products.length} found)</span>
                            </>
                        ) : (
                            'Browse Our Collection'
                        )}
                    </h1>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-[40px] border border-veda-gold/10 shadow-xl">
                        <div className="w-24 h-24 mb-6 text-veda-gold/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-serif text-veda-dark mb-2">No products discovered</h2>
                        <p className="text-gray-500 mb-8 italic">Try adjusting your filters or search terms</p>
                        <Link href="/" className="px-10 py-4 bg-veda-gold text-white rounded-full font-bold hover:bg-veda-dark transition-all duration-300 shadow-lg">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                category={product.category}
                                price={product.price}
                                imageUrl={product.image_url}
                                brand={product.brand}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
