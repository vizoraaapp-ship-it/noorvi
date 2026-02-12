import { createSafeSupabaseClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Product } from '@/types';
import BrandProductGrid from '@/components/BrandProductGrid';

export const revalidate = 0;

interface PageProps {
    params: {
        slug: string;
    };
    searchParams: {
        sort?: string;
        category?: string;
    }
}

// Helper to shuffle array for "random" selections
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Fetch products by brand
async function getBrandProducts(brandName: string): Promise<Product[]> {
    const supabase = createSafeSupabaseClient();

    if (!supabase) return [];

    try {
        const decodedBrand = decodeURIComponent(brandName);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('brand', decodedBrand)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(`Error fetching products for brand ${brandName}:`, error);
            return [];
        }
        return data as Product[] || [];
    } catch (e) {
        console.error('Unexpected error fetching brand products:', e);
        return [];
    }
}

export default async function BrandPage({ params, searchParams }: PageProps) {
    const brandName = decodeURIComponent(params.slug);
    const products = await getBrandProducts(params.slug);

    // --- Derived Data for Sections ---
    const allCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

    // Best Sellers (Mock: take 8 random products)
    const bestSellers = shuffleArray(products).slice(0, 8);

    // Trending (Mock: take another 8 random)
    const trending = shuffleArray(products).slice(0, 8);

    // Brand Specific Assets (Mock based on example)
    const isMars = brandName.toLowerCase() === 'mars';
    const brandLogo = isMars ? '/brands/mars_logo.png' : null;
    const brandColor = isMars ? '#F05252' : '#B8860B'; // Red for Mars, Gold for others

    return (
        <div className="bg-[#FFF0F5] min-h-screen pb-20">
            {/* 1. Brand Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-white/50 z-0"></div>
                <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-pink-500 font-bold tracking-widest text-xs md:text-sm uppercase mb-3 text-center md:text-left">Est. 2013</h3>
                            <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-4 leading-tight">
                                Reach for the <span style={{ color: brandColor }} className="italic font-normal">{brandName}</span>
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base max-w-xl mb-8 leading-relaxed mx-auto md:mx-0">
                                {brandName} is dedicated to making high-fashion beauty accessible to everyone. Our wholesale partnership program ensures premium tools and pigments for artists and retailers globally.
                            </p>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <button className="px-8 py-3 bg-[#FF2D55] text-white rounded-full font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all active:scale-95">
                                    Download Catalog
                                </button>
                                <button className="px-8 py-3 bg-white text-gray-800 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all">
                                    Become a Seller
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 relative w-full max-w-md md:max-w-lg aspect-square md:aspect-[4/3]">
                            {/* Abstract or Hero Image */}
                            <div className="w-full h-full bg-gradient-to-tr from-pink-100 to-pink-50 rounded-[2rem] overflow-hidden relative shadow-inner">
                                <img
                                    src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2080&auto=format&fit=crop"
                                    alt="Brand Hero"
                                    className="w-full h-full object-cover mix-blend-multiply opacity-80 hover:scale-105 transition-transform duration-700"
                                />
                                {brandLogo && (
                                    <div className="absolute bottom-6 left-6 bg-white p-4 rounded-2xl shadow-xl">
                                        <img src={brandLogo} alt={brandName} className="h-8 md:h-12 object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Horizontal Category Navigation */}
            <div className="sticky top-20 md:top-20 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        <Link
                            href={`/brand/${params.slug}`}
                            className="px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap bg-[#FF2D55] text-white shadow-md transition-colors"
                        >
                            All Products
                        </Link>
                        {allCategories.map(cat => (
                            <div
                                key={cat}
                                className="px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                {cat}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-16">

                {/* 3. Best Sellers Slider */}
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-serif text-gray-900">Best Sellers</h2>
                            <p className="text-gray-500 text-sm mt-1">Highest rated items this month</p>
                        </div>
                        <div className="flex gap-2">
                            {/* Arrows could be functional with client component wrappers, static for now as this is a server component */}
                            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"><ChevronLeft className="h-4 w-4" /></button>
                            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 rotate-180"><ChevronLeft className="h-4 w-4" /></button>
                        </div>
                    </div>
                    <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 -mx-4 px-4 scroll-smooth no-scrollbar snap-x">
                        {bestSellers.map(product => (
                            <div key={product.id} className="min-w-[200px] md:min-w-[240px] snap-center">
                                <ProductCard {...product} isWishlisted={false} imageUrl={product.image_url} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Trending Now */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-6">Trending Now</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {trending.slice(0, 4).map(product => (
                            <ProductCard key={product.id} {...product} isWishlisted={false} imageUrl={product.image_url} />
                        ))}
                    </div>
                </section>

                {/* 5. Shop By Collections (Banners) */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative h-64 rounded-[2rem] overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1596462502278-27bfbef4f0f1?q=80&w=2080&auto=format&fit=crop" alt="Tools" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                            <h3 className="text-white text-2xl font-bold mb-1">Professional Tools</h3>
                            <p className="text-gray-300 text-sm mb-4">Precision at artist's hand</p>
                            <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold py-2 px-6 rounded-full w-fit hover:bg-white hover:text-black transition-colors">Explore Range</button>
                        </div>
                    </div>
                    <div className="relative h-64 rounded-[2rem] overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop" alt="Kits" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                            <h3 className="text-white text-2xl font-bold mb-1">Complete Kits</h3>
                            <p className="text-gray-300 text-sm mb-4">Curated bundles for wholesale</p>
                            <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold py-2 px-6 rounded-full w-fit hover:bg-white hover:text-black transition-colors">Explore Range</button>
                        </div>
                    </div>
                    <div className="relative h-64 rounded-[2rem] overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop" alt="Sponges" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                            <h3 className="text-white text-2xl font-bold mb-1">Super Sponges</h3>
                            <p className="text-gray-300 text-sm mb-4">Online exclusive blends</p>
                            <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold py-2 px-6 rounded-full w-fit hover:bg-white hover:text-black transition-colors">Explore Range</button>
                        </div>
                    </div>
                </section>

                {/* 6. Wholesale Steals (Budget) */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-6">Wholesale Steals</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { price: 99, label: "Under" },
                            { price: 199, label: "Under" },
                            { price: 299, label: "Under" },
                            { price: 499, label: "Under" }
                        ].map((deal) => (
                            <div key={deal.price} className="bg-pink-100/50 border border-pink-100 rounded-3xl p-8 text-center flex flex-col justify-center items-center hover:bg-pink-100 transition-colors cursor-pointer group">
                                <span className="text-4xl md:text-5xl font-bold text-[#FF2D55] group-hover:scale-110 transition-transform">₹{deal.price}</span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">{deal.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. All Products (Client Component with Pagination) */}
                <BrandProductGrid products={products} brandName={brandName} />

            </div>
        </div>
    );
}
