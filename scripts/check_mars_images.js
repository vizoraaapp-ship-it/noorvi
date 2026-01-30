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
        .limit(20);

    if (error) console.error(error);
    else {
        console.log('Current Database State (First 20 MARS products):');
        data.forEach(p => console.log(`${p.name} => ${p.image_url}`));
    }
}

checkImages();
