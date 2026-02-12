const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const updates = [
    { name: 'Sharpener', image: '/images/mars/MARS SHARPENER.png' },
    { name: 'Vanity Bag', image: '/images/mars/MARS VANITY.png' },
    { name: 'Makeup Pouch', image: '/images/mars/MARS POUCH.png' },
    { name: 'Ultra Thin Foundation Brush', image: '/images/mars/ULTRA THIN FOUNDATION BRUSH.png' },
    { name: 'HD Compact Powder', image: '/images/mars/HD COMPACT POWDER.png' },
    { name: 'Makeup Remover Wipes', image: '/images/mars/MAKEUP REMOVER WIPES.png' },
    { name: 'Wet Wipes', image: '/images/mars/WET WIPES.png' },
    { name: 'Professional Brush Set', image: '/images/mars/PROFESSIONAL BRUSH SET.png' },
    { name: 'Tools of Titan Brush Set Holder', image: '/images/mars/TOOLS OF ITAN BRUSH SET HOLDER.png' }
];

async function updateImages() {
    console.log('Starting image updates...');

    for (const item of updates) {
        const { error } = await supabase
            .from('products')
            .update({ image_url: item.image })
            .eq('name', item.name);

        if (error) {
            console.error(`Failed to update ${item.name}:`, error);
        } else {
            console.log(`Updated ${item.name} -> ${item.image}`);
        }
    }

    console.log('Update process complete.');
}

updateImages();
