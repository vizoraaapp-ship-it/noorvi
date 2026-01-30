import { createSafeSupabaseClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import ProductImageGallery from '@/components/ProductImageGallery';
import { ChevronLeft, Star, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { getWishlistIds } from '@/actions/wishlist';

export const revalidate = 0;

import { Product } from '@/types';

interface PageProps {
    params: {
        id: string;
    };
}

async function getProduct(id: string): Promise<Product | null> {
    const supabase = createSafeSupabaseClient();
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            return null;
        }
        return data as Product;
    } catch (e) {
        console.error('Unexpected error fetching product:', e);
        return null;
    }
}

async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
    const supabase = createSafeSupabaseClient();
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .neq('id', currentId)
            .limit(10); // Fetch a few related items

        if (error) {
            console.error('Error fetching related products:', error);
            return [];
        }
        return data as Product[] || [];
    } catch (e) {
        console.error('Unexpected error fetching related products:', e);
        return [];
    }
}

import BackButton from '@/components/BackButton';

export default async function ProductPage({ params }: PageProps) {
    const product = await getProduct(params.id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-800 font-semibold mb-4">Product not found</div>
                <Link href="/" className="text-blue-600 hover:underline">
                    Back to Home
                </Link>
            </div>
        );
    }

    const relatedProducts = await getRelatedProducts(product.category, product.id);
    const wishlistIds = await getWishlistIds();
    const wishlistSet = new Set(wishlistIds);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white sticky top-0 md:top-14 z-40 shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 h-14 flex items-center gap-2">
                    <BackButton />
                    <Link href="/" className="hidden md:flex items-center text-sm text-gray-500 hover:text-blue-600 mr-2">
                        Home
                    </Link>
                    <span className="hidden md:block text-gray-300">/</span>
                    <span className="hidden md:block text-sm text-gray-500">{product.category}</span>
                    <span className="hidden md:block text-gray-300">/</span>
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[200px] md:max-w-md">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
                <div className="bg-white md:rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 lg:w-2/5 relative bg-white p-4 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                        <ProductImageGallery
                            images={product.images}
                            fallbackImage={product.image_url}
                            name={product.name}
                        />
                        {/* Optional: Add Like/Share buttons absolute here or inside gallery */}
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 lg:w-3/5 p-4 md:p-8 flex flex-col">
                        <div className="mb-1">
                            {product.brand && (
                                <span className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1 block">
                                    {product.brand}
                                </span>
                            )}
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                    4.2 <Star className="h-3 w-3 fill-white" />
                                </div>
                                <span className="text-sm text-gray-500">(1,250 ratings)</span>
                            </div>
                        </div>

                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-3xl font-bold text-gray-900">₹{Math.round(product.price * 0.75)}</span>
                            <span className="text-sm text-gray-500 line-through mb-1">₹{product.price}</span>
                            <span className="text-sm font-bold text-green-600 mb-1">25% OFF</span>
                        </div>

                        {/* Offers/Coupons mock */}
                        <div className="mb-6 p-3 bg-green-50 rounded border border-green-100 text-sm md:text-base">
                            <span className="font-bold text-green-700">Bank Offer</span> 10% off on SBI Credit Cards, up to ₹1250.
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {product.description || "Experience the best quality with this premium product. Designed for long-lasting performance and superior finish. Perfect for daily use or special occasions."}
                            </p>
                        </div>

                        {/* Icons */}
                        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <span className="text-xs text-gray-600">Free Delivery</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-purple-50 rounded-full text-purple-600">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <span className="text-xs text-gray-600">Genuine Product</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-orange-50 rounded-full text-orange-600">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <span className="text-xs text-gray-600">Easy Returns</span>
                            </div>
                        </div>

                        {/* Action Buttons - Sticky on mobile */}
                        <div className="mt-auto fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 md:static md:p-0 md:bg-transparent md:border-0 z-50 flex gap-3 shadow-top md:shadow-none">
                            <AddToCartButton product={{ ...product, price: Math.round(product.price * 0.75) }} />
                            <a
                                href={`https://wa.me/?text=I want to buy ${product.name} - Price: ${Math.round(product.price * 0.75)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                Buy Now
                            </a>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-8">
                        <div className="bg-white md:rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 px-2 border-l-4 border-blue-600 pl-2">
                                Similar Products
                            </h2>
                            <div className="flex overflow-x-auto gap-4 pb-4 px-2 no-scrollbar snap-x">
                                {relatedProducts.map(p => (
                                    <div key={p.id} className="min-w-[160px] md:min-w-[220px] snap-start flex-shrink-0">
                                        <ProductCard
                                            id={p.id}
                                            name={p.name}
                                            category={p.category}
                                            price={p.price}
                                            imageUrl={p.image_url}
                                            brand={p.brand}
                                            isWishlisted={wishlistSet.has(p.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Spacer for sticky bottom bar on mobile */}
            <div className="h-16 md:hidden"></div>
        </div>
    );
}
