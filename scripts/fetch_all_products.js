const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fetchAllProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Fetched ${data.length} sample products.`);
    data.forEach(p => console.log(`${p.name} | Brand: ${p.brand}`));
}

fetchAllProducts();
