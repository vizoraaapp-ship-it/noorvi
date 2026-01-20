import { createSafeSupabaseClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0;

import { Product } from '@/types';

interface SearchPageProps {
    searchParams: {
        q?: string;
    };
}

async function searchProducts(query: string): Promise<Product[]> {
    if (!query) return [];

    const supabase = createSafeSupabaseClient();
    if (!supabase) return [];

    try {
        // Fallback to simple ILIKE search if full-text vector is problematic or for broader matching
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`);

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
    const products = await searchProducts(query);

    return (
        <div className="bg-gray-100 min-h-screen pb-20">
            <div className="container mx-auto px-4 py-4">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <h1 className="text-xl font-medium text-gray-800">
                        {query ? (
                            <>
                                Search results for <span className="font-bold">&quot;{query}&quot;</span>
                                <span className="text-sm text-gray-500 ml-2">({products.length} items)</span>
                            </>
                        ) : (
                            'Search for products'
                        )}
                    </h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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

                {products.length === 0 && query && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
                        <Image
                            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png"
                            alt="No results"
                            width={256}
                            height={256}
                            className="w-64 mb-6 opacity-80"
                        />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Sorry, no results found!</h2>
                        <p className="text-gray-500 mb-6">Please check the spelling or try searching for something else</p>
                        <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-sm font-medium hover:bg-blue-700 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
