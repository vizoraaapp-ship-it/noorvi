const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BROKEN_LINKS = {
    '1590156206657-b16ce724c326': 'https://images.unsplash.com/photo-1631730359585-38a4935ccbbd?w=500&q=80',
    '1596462502278-27bfdd403348': 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80'
};

async function fixUnsplashLinks() {
    console.log('Starting DB fix for Unsplash links...');

    for (const [brokenId, replacement] of Object.entries(BROKEN_LINKS)) {
        console.log(`Searching for products with image ID: ${brokenId}`);

        // Find products containing the broken ID in their image_url
        const { data: products, error } = await supabase
            .from('products')
            .select('id, name, image_url')
            .filter('image_url', 'ilike', `%${brokenId}%`);

        if (error) {
            console.error('Error fetching products:', error);
            continue;
        }

        console.log(`Found ${products.length} products with broken link ${brokenId}.`);

        for (const prod of products) {
            console.log(`Updating product: ${prod.name} (${prod.id})`);
            const { error: upErr } = await supabase
                .from('products')
                .update({
                    image_url: replacement,
                    images: [replacement] // Also update the images array if it exists
                })
                .eq('id', prod.id);

            if (upErr) {
                console.error(`Failed to update ${prod.name}:`, upErr);
            } else {
                console.log(`Successfully updated ${prod.name}`);
            }
        }
    }

    console.log('DB fix complete.');
}

fixUnsplashLinks();
