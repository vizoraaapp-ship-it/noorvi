const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImage() {
    const targetImage = '/images/mars/marscolorbumlipstick.png';
    console.log(`Checking DB for: ${targetImage}`);

    const { data, error } = await supabase
        .from('products')
        .select('name, image_url')
        .eq('image_url', targetImage);

    if (error) console.error(error);
    else {
        console.log('Products using this image:');
        data.forEach(p => console.log(`- ${p.name}`));

        if (data.length === 0) console.log('No products are using this image URL.');
    }
}

checkImage();
