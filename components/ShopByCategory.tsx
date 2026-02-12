'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
    { name: 'Lips', icon: '💄', color: 'bg-rose-50', link: '/category/lips', image: '/images/cat_lips_custom.png' },
    { name: 'Eyes', icon: '👁️', color: 'bg-blue-50', link: '/category/eyes', image: '/images/cat_eyes_custom.jpg' },
    { name: 'Face', icon: '✨', color: 'bg-orange-50', link: '/category/face', image: '/images/cat_face_custom.png' },
    { name: 'Brushes', icon: '🖌️', color: 'bg-stone-50', link: '/category/brushes', image: '/images/cat_brushes_custom.png' },
    { name: 'Tools & Accessories', icon: '⚙️', color: 'bg-purple-50', link: '/category/tools', image: '/images/cat_tools_custom.jpg' },
    { name: 'Sponges & Blenders', icon: '🧼', color: 'bg-pink-50', link: '/category/sponges', image: '/images/cat_sponges_custom.png' },
];

const ShopByCategory = () => {
    return (
        <section id="categories" className="py-2 bg-transparent rounded-3xl mb-2">
            <div className="px-6 md:px-12 text-center mb-6">
                <h2 className="text-3xl md:text-5xl font-serif text-veda-dark mb-2">Shop by Category</h2>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-6 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-6 md:px-12 pb-6 md:pb-0">
                {categories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={cat.link}
                        className="group flex flex-col items-center gap-4 transition-all duration-300 flex-shrink-0 w-[45%] min-w-[160px] snap-center md:w-auto md:min-w-0 md:snap-align-none"
                    >
                        <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/60 transition-all duration-300 flex items-end justify-center pb-4">
                                <span className="text-white font-semibold text-base md:text-lg drop-shadow-md">{cat.name}</span>
                            </div>
                        </div>
                        <p className="font-medium text-veda-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-2 hidden md:block">Shop Now</p>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default ShopByCategory;
