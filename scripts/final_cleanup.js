const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES_DIR = path.join(__dirname, '../public/images/mars');
const PLACEHOLDER = '/images/placeholder.svg';

async function finalCleanup() {
    console.log('Final Cleanup...');

    // 1. Get real files
    const realFiles = fs.readdirSync(IMAGES_DIR).filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
    const realFileBases = realFiles.map(f => {
        return {
            name: f,
            base: f.toLowerCase().replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/g, "")
        };
    });

    // 2. Fetch products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('brand', 'MARS');

    if (error) { console.error(error); return; }

    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const prod of products) {
        const pNorm = normalize(prod.name);

        let match = realFileBases.find(f => {
            // Strict exact match logic again + strict inclusion
            const fSimple = f.base.replace(/^mars/, '').replace(/\d+$/, '');
            return f.base === pNorm || pNorm.includes(f.base) || pNorm.includes(fSimple);
        });

        // Special: Colorbum
        if (!match && pNorm.includes('colorbum')) {
            match = realFileBases.find(f => f.base.includes('colorbum'));
        }

        let newUrl = PLACEHOLDER;
        if (match) {
            // Rename file to match product name exactly for clarity?
            // "Colorbum Liquid Lipstick" -> "colorbumliquidlipstick.png"
            // This ensures future confusion is minimized.

            // Check if we should rename
            // Only if name is significantly different? 
            // Let's just keep the file name but ensure the link is 100% correct.
            newUrl = `/images/mars/${match.name}`;
            console.log(`Linked: ${prod.name} -> ${match.name}`);
        }

        await supabase.from('products').update({ image_url: newUrl, images: [newUrl] }).eq('id', prod.id);
    }
    console.log('Cleanup done.');
}

finalCleanup();
