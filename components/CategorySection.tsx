import Link from 'next/link';
import Image from 'next/image';

interface CategorySectionProps {
    categories: { id: string; name: string }[];
}

// Map categories to images using local product images for better reliability and relevance
const CATEGORY_IMAGES: Record<string, string> = {
    'LIPS': '/images/mars/creamy_matte_lipstick.png',
    'EYES': '/images/mars/36_color_eyeshadow_palette.png',
    'FACE': '/images/mars/face_primer.png',
    'FACE KITS': '/images/mars/all_i_need_makeup_kit.png',
    'REMOVERS & WIPES': '/images/mars/makeup_remover_wipes.png',
    'TOOLS & BRUSHES': '/images/mars/professional_brush_set.png',
    'SPONGES & BLENDERS': '/images/mars/BEAUTY BLENDER.png',
    'ACCESSORIES': '/images/mars/vanity_bag.png',
};

export default function CategorySection({ categories }: CategorySectionProps) {
    return (
        <div className="bg-white py-4 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max px-4 mx-auto max-w-7xl gap-4 md:gap-8 justify-start md:justify-center">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.name}`} className="flex flex-col items-center group min-w-[70px]">
                        <div className="h-16 w-16 md:h-20 md:w-20 relative mb-1 overflow-hidden rounded-full bg-gray-100 border border-gray-100 group-hover:border-blue-500 transition-all">
                            <Image
                                src={CATEGORY_IMAGES[cat.name] || 'https://via.placeholder.com/150'}
                                alt={cat.name}
                                fill
                                className="object-cover p-1 rounded-full"
                            />
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-700 text-center leading-tight">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
