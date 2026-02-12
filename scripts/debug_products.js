const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Note: Some names might need fuzzy matching or exact checking.
const productNames = [
    'Wonder Powder',
    'Wonder Fixer',
    'Wonder Cover',
    'Cover Rangers',
    'Contour Palette', // Note: User said "Contour PaletteAirbrush Powder", likely two items
    'Airbrush Powder',
    'Good Wipes',
    'God’s Glow Illuminator',
    'City Paradise Makeup Kit - Delhi',
    'Mist Foundation',
    'City Paradise Makeup Kit - Ahmedabad',
    'It’s Glow O’Clock Primer',
    'Face Primer',
    'City Paradise Makeup Kit - Jaipur',
    'City Paradise Makeup Kit - Kolkata',
    'City Paradise Makeup Kit - Lucknow',
    'City Paradise Makeup Kit - Mumbai',
    'City Paradise Makeup Kit - Chandigarh',
    'City Paradise Makeup Kit - Bangalore',
    '2 in 1 Super Stay Foundation',
    'Wswb Kajal',
    'All I Need Makeup Kit',
    'Glitter Palette',
    '36 Color Eyeshadow Palette',
    'Fabulash Mascara',
    'Northern Liquid Eyeliner',
    'Colorbum Liquid Lipstick',
    'Pen Eyeliner',
    'Candylocious Lip Gloss',
    'Aqua Splash Lip Balm',
    'Cloud Kiss Lipstick',
    '3 Matte Box', // "3 Matte Box" might be "Matte Box" or similar
    'Plush Velvet Lipstick',
    'Creamy Matte Lipstick',
    'Lip Crayon',
    'Color Changing Lip Oil',
    'Lipstick Pencil'
];

async function checkProducts() {
    console.log('Checking Batch 2 products...');

    // Fetch all products to do looser matching if needed, or just `in`
    // Using `in` for now, but also logging failures
    const { data, error } = await supabase
        .from('products')
        .select('name, image_url, brand')
        .in('name', productNames);

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const foundNames = new Set(data.map(p => p.name));
    const missing = productNames.filter(name => !foundNames.has(name));

    console.log(`Found ${data.length} products:`);
    data.forEach(p => {
        console.log(`[${p.name}] -> ${p.image_url}`);
    });

    if (missing.length > 0) {
        console.log('\nMissing/Unmatched Products (names might differ in DB):');
        missing.forEach(m => console.log(m));
    }
}

checkProducts();
