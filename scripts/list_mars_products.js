const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('name')
        .eq('brand', 'MARS');

    if (error) console.error(error);
    else console.log(data.map(p => p.name).join('\n'));
}

listProducts();
