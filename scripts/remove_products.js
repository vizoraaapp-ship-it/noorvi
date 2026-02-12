const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Explicitly listing the products to remove
const toRemove = [
    'Makeup Brush Set',
    'Liquid Foundation',
    'Hydrating Serum',
    'Compact Powder',
    'Volumizing Mascara',
    'Matte Red Lipstick'
];

async function removeProducts() {
    console.log('Starting product removal...');

    // Safety check - dry run or confirm logic
    // We will delete by name.

    const { data, error } = await supabase
        .from('products')
        .delete()
        .in('name', toRemove)
        .select();

    if (error) {
        console.error('Error removing products:', error);
    } else {
        console.log(`Successfully removed ${data.length} products:`);
        data.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
    }
}

removeProducts();
