import { createSafeSupabaseClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

export const revalidate = 0;

// Fetch products by category
async function getCategoryProducts(category: string): Promise<Product[]> {
    const supabase = createSafeSupabaseClient();

    // Graceful fallback if env vars missing (build time protection)
    if (!supabase) {
        console.warn('Supabase client invalid (missing env vars?), returning empty products.');
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('category', category) // Case insensitive match
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }
        return data as Product[] || [];
    } catch (e) {
        console.error('Unexpected error fetching products:', e);
        return [];
    }
}

interface CategoryPageProps {
    params: { slug: string };
}

import { getWishlistIds } from '@/actions/wishlist';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function CategoryPage({ params }: CategoryPageProps) {
    const categoryName = decodeURIComponent(params.slug);
    console.log(`[CategoryPage] Fetching products for category: "${categoryName}"`);

    const products = await getCategoryProducts(categoryName);
    const wishlistIds = await getWishlistIds();
    const wishlistSet = new Set(wishlistIds);

    console.log(`[CategoryPage] Found ${products.length} products for category: "${categoryName}"`);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 h-12 flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back to Home</span>
                    </Link>
                    <div className="h-6 w-[1px] bg-gray-200" />
                    <h1 className="text-sm md:text-base font-bold text-gray-800 capitalize truncate">
                        {categoryName}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-2 md:px-4 py-6">
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg text-gray-500">No products found in this category.</h3>
                        <p className="text-sm text-gray-400 mt-2">
                            (If this is a fresh deploy, ensure Supabase env vars are set)
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                        {products.map((product) => (
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
