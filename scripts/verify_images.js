
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    const { data, error } = await supabase
        .from('products')
        .select('name, images, image_url')
        .eq('brand', 'MARS');

    if (error) {
        console.error(error);
    } else {
        console.log(`Found ${data.length} MARS products total.`);
        let withImages = 0;
        data.forEach(p => {
            const hasImages = p.images && p.images.length > 0;
            if (hasImages) {
                withImages++;
                console.log(`[OK] ${p.name}:Images=${p.images.length} | URL=${p.image_url}`);
            } else {
                console.log(`[--] ${p.name}: No images`);
            }
        });
        console.log(`Total with images: ${withImages}`);
    }
}

verify();
