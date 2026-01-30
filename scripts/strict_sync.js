const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES_DIR = path.join(__dirname, '../public/images/mars');
// Use the new SVG placeholder
const FALLBACK_IMAGE = '/images/placeholder.svg';

async function strictSync() {
    console.log('Starting Strict Sync...');

    if (!fs.existsSync(IMAGES_DIR)) {
        console.error('Images dir not found');
        return;
    }

    // 1. Get real files
    const realFiles = fs.readdirSync(IMAGES_DIR).filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
    const realFileBases = realFiles.map(f => {
        return {
            name: f,
            base: f.toLowerCase().replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/g, "") // normalized base
        };
    });

    console.log(`Found ${realFiles.length} physical files.`);

    // 2. Fetch all products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, image_url')
        .eq('brand', 'MARS');

    if (error) {
        console.error(error);
        return;
    }

    let matchedCount = 0;
    let fallbackCount = 0;

    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const prod of products) {
        const pNorm = normalize(prod.name);

        // Find ALL matches
        const matches = realFileBases.filter(f => {
            // 1. Exact base match
            if (f.base === pNorm) return true;

            // 2. Fuzzy: Filebase without "mars"
            const fBaseNoMars = f.base.replace(/^mars/, '');
            if (fBaseNoMars === pNorm) return true;

            // 3. Product contains file OR file contains suffix removed base
            const fBaseClean = fBaseNoMars.replace(/\d+$/, '');

            // Specific check for colorbum
            if (pNorm.includes('colorbum') && f.base.includes('colorbum')) return true;

            return pNorm.includes(f.base) || pNorm.includes(fBaseNoMars) || pNorm.includes(fBaseClean);
        });

        let newUrl = FALLBACK_IMAGE;

        if (matches.length > 0) {
            // Sort matches to ensure consistent order (e.g. 1 before 2)
            matches.sort((a, b) => a.name.localeCompare(b.name));

            const urls = matches.map(m => `/images/mars/${m.name}`);
            newMainUrl = urls[0];
            newImages = urls;
            matchedCount++;

            if (matches.length > 1) {
                console.log(`Grouped ${matches.length} images for "${prod.name}":`, urls);
            }
        } else {
            fallbackCount++;
        }

        // Only update if changed
        if (newUrl !== prod.image_url) {
            await supabase
                .from('products')
                .update({
                    image_url: newUrl,
                    images: [newUrl]
                })
                .eq('id', prod.id);
        }
    }

    console.log(`Sync complete.`);
    console.log(`Matched: ${matchedCount}`);
    console.log(`Unmatched (Placeholder): ${fallbackCount}`);
}

strictSync();
