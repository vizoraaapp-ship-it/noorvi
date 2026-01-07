const supabase = require('./supabase');

const rawData = [
    // 1. LIPS
    // 1.1 Lipstick
    { name: 'Lipstick Pencil', main: 'LIPS', sub: '1.1 Lipstick', mrp: 599 },
    { name: 'Plush Velvet Lipstick', main: 'LIPS', sub: '1.1 Lipstick', mrp: 279 },
    { name: 'Creamy Matte Lipstick', main: 'LIPS', sub: '1.1 Lipstick', mrp: 199 },
    { name: '3 Matte Lipstick Box', main: 'LIPS', sub: '1.1 Lipstick', mrp: 447 },
    { name: 'Cloud Kiss Lipstick', main: 'LIPS', sub: '1.1 Lipstick', mrp: 299 },
    { name: 'Non-Transfer Butter Stick', main: 'LIPS', sub: '1.1 Lipstick', mrp: 349 },
    { name: 'Silk Matte Lipstick', main: 'LIPS', sub: '1.1 Lipstick', mrp: 249 },
    { name: 'Super Stay Lipstick', main: 'LIPS', sub: '1.1 Lipstick', mrp: 299 },

    // 1.2 Lip Crayon
    { name: 'Matte Lip Crayon', main: 'LIPS', sub: '1.2 Lip Crayon', mrp: 299 },
    { name: 'Poppins Lip Crayon', main: 'LIPS', sub: '1.2 Lip Crayon', mrp: 249 },

    // 1.3 Liquid Lipstick
    { name: 'Colorbum Liquid Lipstick', main: 'LIPS', sub: '1.3 Liquid Lipstick', mrp: 349 },
    { name: 'Matte Lip Color', main: 'LIPS', sub: '1.3 Liquid Lipstick', mrp: 299 },
    { name: 'Popstar Liquid Mousse Lipstick', main: 'LIPS', sub: '1.3 Liquid Lipstick', mrp: 349 },
    { name: 'Matte Muse Lipstick', main: 'LIPS', sub: '1.3 Liquid Lipstick', mrp: 299 },
    { name: 'Queens of Mattes Liquid Lipstick Box', main: 'LIPS', sub: '1.3 Liquid Lipstick', mrp: 599 },

    // 1.4 Lip Liner
    { name: 'Edge of Desire Lip Liner', main: 'LIPS', sub: '1.4 Lip Liner', mrp: 149 },
    { name: 'Edge of Desire Lip Liner with Holder', main: 'LIPS', sub: '1.4 Lip Liner', mrp: 199 },

    // 1.5 Lip Tint / Mist
    { name: 'Drip Lip Mist', main: 'LIPS', sub: '1.5 Lip Tint / Mist', mrp: 299 },
    { name: 'Love Track Velvet Lip Tint', main: 'LIPS', sub: '1.5 Lip Tint / Mist', mrp: 349 },

    // 1.6 Lip Palette
    { name: 'Infinity Lip Palette', main: 'LIPS', sub: '1.6 Lip Palette', mrp: 499 },

    // 1.7 Lip Balm
    { name: 'Lip Lollies Lip Balm', main: 'LIPS', sub: '1.7 Lip Balm', mrp: 199 },
    { name: 'Hydratint Balm', main: 'LIPS', sub: '1.7 Lip Balm', mrp: 249 },
    { name: 'Full of Water Lip Balm', main: 'LIPS', sub: '1.7 Lip Balm', mrp: 199 },
    { name: 'Aqua Splash Lip Balm', main: 'LIPS', sub: '1.7 Lip Balm', mrp: 199 },
    { name: 'Click-Stick Gloss Lip Balm', main: 'LIPS', sub: '1.7 Lip Balm', mrp: 249 },

    // 1.8 Lip Gloss / Oil
    { name: 'Lippy Top Lip Gel', main: 'LIPS', sub: '1.8 Lip Gloss / Oil', mrp: 199 },
    { name: 'Clear Quartz Lip Gloss', main: 'LIPS', sub: '1.8 Lip Gloss / Oil', mrp: 249 },
    { name: 'Candylicious Lip Gloss', main: 'LIPS', sub: '1.8 Lip Gloss / Oil', mrp: 249 },
    { name: 'Color Changing Lip Oil', main: 'LIPS', sub: '1.8 Lip Gloss / Oil', mrp: 299 },

    // 2. EYES
    // 2.1 Eyebrow
    { name: 'Micro Precision Brow Pencil', main: 'EYES', sub: '2.1 Eyebrow', mrp: 199 },
    { name: 'Oh Brow Eyebrow Pencil', main: 'EYES', sub: '2.1 Eyebrow', mrp: 149 },
    { name: 'Brow Better Eyebrow Pencil', main: 'EYES', sub: '2.1 Eyebrow', mrp: 199 },
    { name: 'Eyebrow Pencil', main: 'EYES', sub: '2.1 Eyebrow', mrp: 99 },
    { name: 'Eyebrow Powder Palette', main: 'EYES', sub: '2.1 Eyebrow', mrp: 299 },

    // 2.2 Eyeliner
    { name: 'Liquid Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 199 },
    { name: 'Pen Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 249 },
    { name: 'Free Flow Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 199 },
    { name: 'Hyper Smooth Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 299 },
    { name: 'Ink Black Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 199 },
    { name: 'So Black Liquid Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 199 },
    { name: 'Sky Liner Matte Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 249 },
    { name: 'City Strokes Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 299 },
    { name: 'Social Black Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 199 },
    { name: 'Twinkle Wink Glitter Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 299 },
    { name: 'Northern Lights Pencil Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 249 },
    { name: 'Northern Lights Liquid Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 299 },
    { name: 'Hue Gel Eyeliner', main: 'EYES', sub: '2.2 Eyeliner', mrp: 299 },

    // 2.3 Kajal
    { name: 'Kohl of Fame Kajal', main: 'EYES', sub: '2.3 Kajal', mrp: 199 },
    { name: 'WSWB Kajal', main: 'EYES', sub: '2.3 Kajal', mrp: 149 },
    { name: 'Ziddi Kajal', main: 'EYES', sub: '2.3 Kajal', mrp: 199 },
    { name: 'Smooth Glide Kajal', main: 'EYES', sub: '2.3 Kajal', mrp: 199 },

    // 2.4 Mascara
    { name: 'Fabulash Mascara', main: 'EYES', sub: '2.4 Mascara', mrp: 299 },
    { name: 'Forget Falsies Mascara', main: 'EYES', sub: '2.4 Mascara', mrp: 349 },
    { name: 'Silk Lengthening Mascara', main: 'EYES', sub: '2.4 Mascara', mrp: 299 },
    { name: 'Double Trouble Mascara', main: 'EYES', sub: '2.4 Mascara', mrp: 399 },

    // 3. FACE
    // 3.1 Primer
    { name: 'Pore Cure Primer', main: 'FACE', sub: '3.1 Primer', mrp: 399 },
    { name: 'Take A Glow Primer', main: 'FACE', sub: '3.1 Primer', mrp: 349 },
    { name: 'Hydra Glow Primer', main: 'FACE', sub: '3.1 Primer', mrp: 399 },
    { name: 'Face Primer', main: 'FACE', sub: '3.1 Primer', mrp: 299 },
    { name: 'Zero Pore Perfection Primer', main: 'FACE', sub: '3.1 Primer', mrp: 399 },
    { name: 'Primer + Makeup Fixer', main: 'FACE', sub: '3.1 Primer', mrp: 499 },

    // 3.2 Foundation / BB
    { name: 'Bloom BB Cream', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 299 },
    { name: 'BB Cream Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 349 },
    { name: 'Miracle BB Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 399 },
    { name: 'Matte Mousse Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 449 },
    { name: '2 in 1 Super Stay Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 499 },
    { name: 'Gold Waves Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 549 },
    { name: 'Matte Maniac Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 499 },
    { name: 'High Coverage Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 549 },
    { name: 'Mist Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 399 },
    { name: 'Zero Blend Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 499 },
    { name: 'Color Changing Foundation', main: 'FACE', sub: '3.2 Foundation / BB', mrp: 399 },

    // 4. NAILS
    { name: 'Color Bomb Nail Paint', main: 'NAILS', sub: '4. NAILS', mrp: 99 },
    { name: 'Euro Nail Paint', main: 'NAILS', sub: '4. NAILS', mrp: 99 },
    { name: 'Cosmic Hues Nail Paint', main: 'NAILS', sub: '4. NAILS', mrp: 149 },
    { name: 'Nail Polish Remover', main: 'NAILS', sub: '4. NAILS', mrp: 99 },

    // 5. TOOLS
    { name: 'Brush Sets', main: 'TOOLS', sub: '5. TOOLS', mrp: 799 }, // Range 799-1999
    { name: 'Individual Brushes', main: 'TOOLS', sub: '5. TOOLS', mrp: 149 }, // Range 149-299
    { name: 'Beauty Blender / Puff / Mirror', main: 'TOOLS', sub: '5. TOOLS', mrp: 99 } // Range 99-249
];

const marsProducts = rawData.map(p => ({
    name: p.name,
    brand: 'MARS',
    main_category: p.main,
    sub_category: p.sub,
    mrp_price: p.mrp,
    discount_percent: 20,
    price: Math.round(p.mrp * 0.8), // 20% discount
    description: `MARS ${p.name} - ${p.sub}`,
    // Using simple placeholders based on category text to vary images slightly
    image_url: p.main === 'LIPS' ? 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400' :
        p.main === 'EYES' ? 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400' :
            p.main === 'FACE' ? 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400' :
                'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400',
    category: p.main // Fallback for old schema compatibility
}));

const fs = require('fs');

async function seedMars() {
    const msg = `Seeding ${marsProducts.length} MARS products...`;
    console.log(msg);
    fs.appendFileSync('seed_log.txt', new Date().toISOString() + ' ' + msg + '\n');

    // Optional: Delete existing MARS products to avoid duplicates
    await supabase.from('products').delete().eq('brand', 'MARS');

    const { data, error } = await supabase
        .from('products')
        .insert(marsProducts)
        .select();

    if (error) {
        const errMsg = 'Error seeding MARS products: ' + JSON.stringify(error);
        console.error(errMsg);
        fs.appendFileSync('seed_log.txt', new Date().toISOString() + ' ' + errMsg + '\n');
    } else {
        const successMsg = 'Successfully seeded MARS products. Count: ' + (data ? data.length : 0);
        console.log(successMsg);
        fs.appendFileSync('seed_log.txt', new Date().toISOString() + ' ' + successMsg + '\n');
    }
}

seedMars();
