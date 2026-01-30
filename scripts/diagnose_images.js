const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function diagnoseImages() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const uniqueUrls = {};
    products.forEach(p => {
        uniqueUrls[p.image_url] = (uniqueUrls[p.image_url] || 0) + 1;
    });

    console.log('Unique Image URLs count:', Object.keys(uniqueUrls).length);
    for (const [url, count] of Object.entries(uniqueUrls)) {
        console.log(`[${count}] ${url}`);
    }
}

diagnoseImages();
