const supabase = require('./supabase');

const products = [
    {
        name: 'Matte Red Lipstick',
        category: 'Lipstick',
        price: 450,
        description: 'Long-lasting matte red lipstick.',
        image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400'
    },
    {
        name: 'Liquid Foundation',
        category: 'Foundation',
        price: 899,
        description: 'Full coverage liquid foundation.',
        image_url: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400'
    },
    {
        name: 'Volumizing Mascara',
        category: 'Mascara',
        price: 350,
        description: 'Waterproof volumizing mascara.',
        image_url: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400'
    },
    {
        name: 'Compact Powder',
        category: 'Compact',
        price: 299,
        description: 'Oil-control compact powder.',
        image_url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=400'
    },
    {
        name: 'Hydrating Serum',
        category: 'Skincare',
        price: 1200,
        description: 'Vitamin C hydrating serum.',
        image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'
    },
    {
        name: 'Makeup Brush Set',
        category: 'Accessories',
        price: 1500,
        description: 'Professional 12-piece brush set.',
        image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400'
    }
];

const categories = [
    { name: 'Lipstick' },
    { name: 'Mascara' },
    { name: 'Foundation' },
    { name: 'Compact' },
    { name: 'Skincare' },
    { name: 'Accessories' }
];

async function seedProducts() {
    console.log('Seeding categories...');
    const { error: catError } = await supabase
        .from('categories')
        .upsert(categories, { onConflict: 'name' });

    if (catError) {
        console.error('Error seeding categories:', catError);
    } else {
        console.log('Categories seeded (or already existed).');
    }

    console.log('Seeding products...');

    // Using upsert or insert. Insert is fine for now.
    const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();

    if (error) {
        console.error('Error seeding products:', error);
    } else {
        console.log('Successfully added products:', data.length);
        console.log(data);
    }
}

seedProducts();
