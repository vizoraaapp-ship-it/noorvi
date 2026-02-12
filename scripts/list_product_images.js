const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listProductImages() {
    const { data, error } = await supabase
        .from('products')
        .select('name, category, image_url, images')
        .limit(50);

    if (error) {
        console.error('Error:', error);
        return;
    }

    const byCategory = {};
    data.forEach(p => {
        if (!byCategory[p.category]) byCategory[p.category] = [];
        byCategory[p.category].push({ name: p.name, url: p.image_url, all_images: p.images });
    });

    console.log(JSON.stringify(byCategory, null, 2));
}

listProductImages();
