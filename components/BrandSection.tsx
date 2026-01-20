'use client';

import Link from 'next/link';
import Image from 'next/image';

const BRANDS = [
    { id: 'mars', name: 'MARS', logo: '/brands/mars-logo-update.png' },
    // Add more brands here in future
];

export default function BrandSection() {
    return (
        <div className="bg-white py-4 mb-4">
            <div className="flex justify-between items-center px-4 mb-3">
                <h2 className="text-lg font-bold text-gray-800">Shop by Brand</h2>
                {/* <Link href="/brands" className="text-blue-600 text-sm font-medium">View all</Link> */}
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 px-4">
                {BRANDS.map((brand) => (
                    <Link key={brand.id} href={`/brand/${brand.name}`} className="flex flex-col items-center group p-2 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all">
                        <div className="w-full aspect-square flex items-center justify-center bg-gray-50 rounded-md mb-2 overflow-hidden relative">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="font-bold text-gray-700 tracking-wider">{brand.name}</span>
                            )}
                        </div>
                    </Link>
                ))}
                {/* Placeholder for "More" */}
                <div className="aspect-square flex flex-col items-center justify-center p-2 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 text-xs text-center">
                    Coming Soon
                </div>
                <div className="aspect-square flex flex-col items-center justify-center p-2 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 text-xs text-center">
                    Coming Soon
                </div>
            </div>
        </div>
    );
}
