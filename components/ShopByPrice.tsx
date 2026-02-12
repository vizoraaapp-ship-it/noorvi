import Link from 'next/link';

const pricePoints = [
    { label: 'Under ₹99', min: 0, max: 99, color: 'from-amber-50 to-amber-100' },
    { label: 'Under ₹199', min: 0, max: 199, color: 'from-rose-50 to-rose-100' },
    { label: 'Under ₹299', min: 0, max: 299, color: 'from-emerald-50 to-emerald-100' },
    { label: 'Under ₹499', min: 0, max: 499, color: 'from-blue-50 to-blue-100' },
];

const ShopByPrice = () => {
    return (
        <section className="py-2 mb-2">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-5xl font-serif text-veda-dark">Wholesale Deals by Price</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pricePoints.map((point) => (
                        <Link
                            key={point.label}
                            href={`/search?maxPrice=${point.max}`}
                            className={`group h-32 flex items-center justify-center rounded-2xl bg-gradient-to-br ${point.color} border border-white/20 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-veda-dark group-hover:text-veda-gold transition-colors duration-300">{point.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByPrice;
