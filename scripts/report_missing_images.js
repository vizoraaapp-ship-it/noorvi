const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const FALLBACK_IMAGE = '/images/mars/marscolorbumlipstick.png';

async function listMissingImages() {
    const { data, error } = await supabase
        .from('products')
        .select('name')
        .eq('image_url', FALLBACK_IMAGE)
        .order('name');

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Missing images for ${data.length} products:`);
    console.log('-------------------------------------------');
    data.forEach(p => console.log(p.name));
    console.log('-------------------------------------------');
    console.log(`Please upload images for these products to 'public/images/mars'`);
}

listMissingImages();
