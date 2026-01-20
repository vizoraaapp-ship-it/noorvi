import { createClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Package, Heart, AlertCircle } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

export default async function WishlistPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Step 1: Fetch list of product IDs from wishlist
    // We avoid using a JOIN here to prevent "Could not find relationship" errors
    const { data: wishlistItems, error: wishlistError } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id)

    if (wishlistError) {
        console.error('Error fetching wishlist:', wishlistError);
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 text-center">
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow text-red-600">
                    <AlertCircle className="h-10 w-10 mx-auto mb-4" />
                    <h2 className="text-lg font-bold mb-2">Error loading wishlist</h2>
                    <p className="text-sm text-gray-600 border bg-gray-50 p-2 rounded relative">
                        {wishlistError.message || "Unknown Database Error"}
                        <span className="block text-xs mt-2 text-gray-500">
                            (Hint: Did you run the wishlist_setup.sql script in Supabase?)
                        </span>
                    </p>
                    <Link href="/account" className="mt-4 inline-block text-blue-600 hover:underline">
                        Return to Account
                    </Link>
                </div>
            </div>
        )
    }

    const productIds = wishlistItems?.map(item => item.product_id) || [];

    // Step 2: Fetch products details
    let products: Product[] = [];

    if (productIds.length > 0) {
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds)

        if (productsError) {
            console.error('Error fetching products for wishlist:', productsError);
        } else {
            products = productsData as Product[] || [];
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link href="/account" className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Account
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">My Wishlist</h1>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                category={product.category}
                                price={product.price}
                                imageUrl={product.image_url}
                                brand={product.brand}
                                isWishlisted={true} // Its the wishlist page, so its wishlisted!
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                        <p className="text-gray-500 mt-1">Found something you like? Tap the heart icon to save it here.</p>
                        <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
