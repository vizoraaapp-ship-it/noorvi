import { createSafeSupabaseClient } from '@/lib/supabase/server';
import HomeProductGrid from '@/components/HomeProductGrid';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
import ShopByCategory from '@/components/ShopByCategory';
import ShopByBrand from '@/components/ShopByBrand';
import ShopByPrice from '@/components/ShopByPrice';
import NewArrivals from '@/components/NewArrivals';
import TrendingProducts from '@/components/TrendingProducts';
import { getWishlistIds } from '@/actions/wishlist';
import { Product } from '@/types';

export const revalidate = 0;

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
    return (data as Product[]) || [];
  } catch (e) {
    console.error('Unexpected error fetching products:', e);
    return [];
  }
}

async function getBrands(): Promise<string[]> {
  const supabase = createSafeSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .order('brand');

    if (error) {
      console.error('Error fetching brands:', error);
      return [];
    }

    if (!data) return [];

    const uniqueBrands = [...new Set((data as any[]).map(p => p.brand).filter(Boolean))] as string[];
    return uniqueBrands;
  } catch (e) {
    console.error('Unexpected error fetching brands:', e);
    return [];
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getBalancedSelection(products: Product[], count: number, excludeIds: Set<string>): Product[] {
  const available = products.filter(p => !excludeIds.has(p.id));
  const grouped = available.reduce((acc, p) => {
    if (!p.category) return acc;
    const cat = p.category.toUpperCase();
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  // Shuffle within groups
  Object.keys(grouped).forEach(cat => {
    grouped[cat] = shuffleArray(grouped[cat]);
  });

  const selected: Product[] = [];
  const categories = Object.keys(grouped);
  let categoryIndex = 0;

  // Round-robin selection from categories
  while (selected.length < count && categories.length > 0) {
    const cat = categories[categoryIndex % categories.length];
    const item = grouped[cat].pop();

    if (item) {
      selected.push(item);
    } else {
      // Remove exhausted category
      categories.splice(categoryIndex % categories.length, 1);
      if (categories.length === 0) break;
      categoryIndex--; // adjust index after removal
    }
    categoryIndex++;
  }

  return selected;
}

export default async function Home() {
  const allProducts = await getProducts();
  const brands = await getBrands();
  const wishlistIds = await getWishlistIds();
  const wishlistSet = new Set(wishlistIds);

  if (!allProducts) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-veda-dark">
        <h1 className="text-2xl font-serif text-red-600">Configuration Error</h1>
        <p className="mt-4">Please connect your Supabase database.</p>
      </div>
    );
  }

  // Generate distinct sets of 35 products for each section
  const launched = getBalancedSelection(allProducts, 35, new Set());
  const launchedIds = new Set(launched.map(p => p.id));
  const trending = getBalancedSelection(allProducts, 35, launchedIds);

  return (
    <div className="bg-veda-background min-h-screen pb-20 overflow-x-hidden">
      {/* Immersive Hero Section - 100% Width */}
      <HeroBanner />

      {/* Wrapped Content Sections */}
      <div className="max-w-7xl mx-auto">
        {/* 2. Shop by Category */}
        <ShopByCategory />

        {/* 3. Shop by Brand */}
        <ShopByBrand brands={brands} />

        {/* 4. New Arrivals */}
        <NewArrivals products={launched} wishlistSet={wishlistSet} />

        {/* 5. Shop by Price */}
        <ShopByPrice />

        {/* 6. Trending Products */}
        <TrendingProducts products={trending} wishlistSet={wishlistSet} />

        {/* 7. All Products Listing (Client-side Paginated) */}
        <HomeProductGrid products={allProducts} wishlistSet={wishlistSet} />

        {/* Call to Action Footer Section */}
        <section className="mt-10 relative rounded-[40px] overflow-hidden bg-veda-dark py-20 px-8 md:px-20">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1522338222949-e4827099819e?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Scale Your Beauty Business with Veda</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="bg-veda-gold text-white px-10 py-4 rounded-full font-bold hover:bg-veda-tan transition-all duration-300 shadow-xl shadow-black/20">Apply for Wholesale</button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-white/20 transition-all duration-300">Download Catalog</button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-64">
                <p className="text-3xl font-bold text-veda-gold mb-1">45% OFF</p>
                <p className="text-white/60 text-sm">First bulk order sign-up</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-64">
                <p className="text-3xl font-bold text-veda-gold mb-1">24h</p>
                <p className="text-white/60 text-sm">Priority Dispatch Promise</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
