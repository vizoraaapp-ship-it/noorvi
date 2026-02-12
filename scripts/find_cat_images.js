const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function findBestCategoryImages() {
    const { data: products, error } = await supabase
        .from('products')
        .select('name, category, image_url')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return;
    }

    const categories = [
        'LIPS', 'EYES', 'FACE', 'FACE KITS', 'REMOVERS & WIPES',
        'TOOLS & BRUSHES', 'SPONGES & BLENDERS', 'ACCESSORIES'
    ];

    const bestImages = {};

    categories.forEach(cat => {
        // Find products in this category (case insensitive)
        const matches = products.filter(p => p.category.toUpperCase() === cat);
        if (matches.length > 0) {
            // Pick the first one for now, but we can be selective
            bestImages[cat] = matches[0].image_url;
        } else {
            bestImages[cat] = null;
        }
    });

    console.log('BEST IMAGES FOUND:');
    console.log(JSON.stringify(bestImages, null, 2));
}

findBestCategoryImages();
