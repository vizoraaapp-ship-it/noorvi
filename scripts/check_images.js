const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkImages() {
    const { data, error } = await supabase
        .from('products')
        .select('name, image_url')
        .eq('brand', 'MARS')
        .not('image_url', 'is', null);

    if (error) console.error(error);
    else {
        // Filter for local images
        const updated = data.filter(p => p.image_url.startsWith('/images/mars/'));
        console.log(`Found ${updated.length} updated products out of ${data.length} total.`);
        updated.slice(0, 10).forEach(p => console.log(`${p.name}: ${p.image_url}`));
    }
}

checkImages();
