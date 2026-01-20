import { createSafeSupabaseClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';
import CategorySection from '@/components/CategorySection';
import BannerCarousel from '@/components/BannerCarousel';
import BrandSection from '@/components/BrandSection';

export const revalidate = 0; // Disable caching for now to see real-time updates

import { Product } from '@/types';

interface Category {
  id: string;
  name: string;
}

// Data fetching
async function getProducts(): Promise<Product[] | null> {
  const supabase = createSafeSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
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

async function getCategories(): Promise<Category[]> {
  const supabase = createSafeSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data as Category[] || [];
  } catch (e) {
    console.error('Unexpected error fetching categories:', e);
    return [];
  }
}

import { getWishlistIds } from '@/actions/wishlist';

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const wishlistIds = await getWishlistIds();
  const wishlistSet = new Set(wishlistIds);

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <div className="container mx-auto px-2 md:px-4 py-2">
        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <CategorySection categories={categories} />
        </div>

        {/* Shop By Brand */}
        <BrandSection />

        {/* Featured Products */}
        <h2 className="text-lg font-bold text-gray-800 mb-2 px-1 mt-4 md:mt-6">Best Selling Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 px-0.5 md:px-1">
          {products === null ? (
            <div className="col-span-full text-center py-12 bg-red-50 rounded-lg border border-red-100 p-4">
              <h3 className="text-red-800 font-bold mb-2">Configuration Error</h3>
              <p className="text-red-600 mb-4">The application is not connected to the database.</p>
              <div className="text-sm text-red-700 bg-white p-3 rounded inline-block text-left">
                <p className="font-semibold">Action Required in Netlify:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Go to <strong>Site configuration &gt; Environment variables</strong></li>
                  <li>Add <code>NEXT_PUBLIC_SUPABASE_URL</code></li>
                  <li>Add <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                  <li>Redeploy the site</li>
                </ul>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg">
              No products found. Please ensure database is seeded.
            </div>
          ) : (
            products.map((product) => (
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
      </div>
    </div>
  );
}
