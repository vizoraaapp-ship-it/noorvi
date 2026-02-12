import { createSafeSupabaseClient } from '@/lib/supabase/server';
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

    const uniqueBrands = [...new Set(data.map(p => p.brand).filter(Boolean))] as string[];
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

        {/* 7. All Products Listing */}
        <section className="py-2">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <div>
              <h2 className="text-3xl font-serif text-veda-dark">All Products</h2>
            </div>

            {/* Simple Filter/Sort Controls */}
            <div className="flex gap-4">
              <select className="bg-white border border-veda-gold/20 rounded-xl px-4 py-2 text-sm text-veda-dark focus:ring-veda-gold outline-none">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <button className="flex items-center gap-2 bg-veda-dark text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-veda-gold transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4">
            {allProducts.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-pink-soft/20 rounded-3xl border border-dashed border-veda-gold/20">
                <p className="text-gray-400 font-serif italic text-xl">No products discovered yet.</p>
              </div>
            ) : (
              allProducts.map((product) => (
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

          {/* Pagination Placeholder */}
          <div className="mt-16 flex justify-center gap-2">
            {[1, 2, 3].map(n => (
              <button key={n} className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${n === 1 ? 'bg-veda-gold text-white shadow-lg shadow-veda-gold/20' : 'bg-white/50 text-veda-dark hover:bg-veda-cream border border-gray-100'}`}>
                {n}
              </button>
            ))}
            <button className="w-10 h-10 rounded-full bg-white/50 text-veda-dark flex items-center justify-center border border-gray-100 hover:bg-veda-cream transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

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
