const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fetchAllProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('name, category')
        .order('name');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const output = data.map(p => `${p.name} | ${p.category}`).join('\n');
    fs.writeFileSync('all_products.txt', output);
    console.log(`Saved ${data.length} products to all_products.txt`);
}

fetchAllProducts();
