const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Use a known local image as fallback to prevent 500 errors
const FALLBACK_IMAGE = '/images/mars/marscolorbumlipstick.png';

async function removePlaceholders() {
    console.log('Replacing remote placeholders with local fallback...');

    // Update products where image_url contains placeholder.com
    const { data, error } = await supabase
        .from('products')
        .update({
            image_url: FALLBACK_IMAGE,
            images: [FALLBACK_IMAGE]
        })
        .ilike('image_url', '%placeholder.com%')
        .select('id, name');

    if (error) {
        console.error('Error updating products:', error);
    } else {
        console.log(`Updated ${data.length} products to use local fallback.`);
    }
}

removePlaceholders();
