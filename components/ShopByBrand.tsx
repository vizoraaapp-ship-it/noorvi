import Link from 'next/link';

interface ShopByBrandProps {
    brands: string[];
}

const ShopByBrand = ({ brands }: ShopByBrandProps) => {
    // Reference brands from the user's image
    const referenceBrands = [
        { name: 'Insight', logo: null },
        { name: 'Blue Heaven', logo: null },
        { name: 'Miss Claire', logo: null },
        { name: 'ADS Professional', logo: null },
        { name: 'MARS', logo: '/brands/mars_logo.png' },
        { name: 'Swiss Beauty', logo: null }
    ];

    // Combine DB brands with reference brands for a full experience
    const displayBrands = brands.length > 0
        ? brands.map(b => ({ name: b, logo: b.toUpperCase() === 'MARS' ? '/brands/mars_logo.png' : null }))
        : referenceBrands;

    return (
        <section className="py-2 mb-2">
            <div className="container mx-auto px-4">
                <div className="flex overflow-x-auto no-scrollbar gap-8 md:gap-12 pb-4 scroll-smooth justify-center items-start">
                    {displayBrands.map((brand) => (
                        <Link
                            key={brand.name}
                            href={`/brand/${encodeURIComponent(brand.name)}`}
                            className="flex flex-col items-center flex-shrink-0 group"
                        >
                            {/* Circle with Gold Border */}
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-veda-gold/20 group-hover:border-veda-gold/50 transition-all duration-300 flex items-center justify-center bg-transparent shadow-sm overflow-hidden mb-4 p-4">
                                {brand.logo ? (
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-veda-gold/5 rounded-full">
                                        <span className="text-gray-400 font-bold text-xs md:text-sm text-center px-1 uppercase leading-tight">
                                            {brand.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Brand Label */}
                            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest text-center group-hover:text-veda-gold transition-colors duration-300 max-w-[100px]">
                                {brand.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByBrand;
