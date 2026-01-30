const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAccessories() {
    const names = [
        'Vanity Bag',
        'Makeup Pouch',
        'Makeup Mirror',
        'Pizza Puffs (Pack of 2)',
        'Boring Cleaner Pad'
    ];

    const { data, error } = await supabase
        .from('products')
        .select('name, image_url')
        .in('name', names);

    if (error) console.error(error);
    else {
        console.log('Accessory Products Check:');
        data.forEach(p => console.log(`${p.name} => ${p.image_url}`));
    }
}

checkAccessories();
