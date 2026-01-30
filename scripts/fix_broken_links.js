const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES_DIR = path.join(__dirname, '../public/images/mars');
const FALLBACK_IMAGE = '/images/mars/marscolorbumlipstick.png';

async function fixBrokenLinks() {
    console.log('Starting Link Fixer...');

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

    let updatedCount = 0;
    let fallbackCount = 0;

    // Normalizer helper
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const prod of products) {
        let bestMatch = null;
        const pNorm = normalize(prod.name);

        // A. Try to find a match in real files
        // 1. Exact base match
        // 2. Contains match/Prefix match

        // Exact
        let match = realFileBases.find(f => f.base === pNorm);

        // Fuzzy: Filebase without "mars"
        if (!match) {
            match = realFileBases.find(f => {
                const fBaseNoMars = f.base.replace(/^mars/, '');
                return fBaseNoMars === pNorm;
            });
        }

        // Fuzzy: Product includes file base (e.g. "creamymattelipstick" includes "creamymatte")
        if (!match) {
            match = realFileBases.find(f => {
                const fBaseNoMars = f.base.replace(/^mars/, '');
                return pNorm.includes(f.base) || pNorm.includes(fBaseNoMars);
            });
        }

        let newUrl = FALLBACK_IMAGE;

        if (match) {
            newUrl = `/images/mars/${match.name}`;
            // console.log(`Matched: ${prod.name} -> ${match.name}`);
        } else {
            // No match found.
            // Check if current URL is valid physical file? 
            // If prod.image_url points to a file that exists, keep it?
            // But we know many don't.
            if (prod.image_url && prod.image_url.startsWith('/images/mars/')) {
                const currentBasename = path.basename(prod.image_url);
                if (realFiles.includes(currentBasename)) {
                    newUrl = prod.image_url; // Keep valid existing
                } else {
                    // console.log(`Broken link detected: ${prod.name} (${prod.image_url}) -> Fallback`);
                    fallbackCount++;
                }
            } else {
                fallbackCount++;
            }
        }

        // Only update if changed
        if (newUrl !== prod.image_url) {
            const { error: upErr } = await supabase
                .from('products')
                .update({
                    image_url: newUrl,
                    images: [newUrl]
                })
                .eq('id', prod.id);

            if (!upErr) updatedCount++;
        }
    }

    console.log(`Fix complete.`);
    console.log(`Updated DB records: ${updatedCount}`);
    console.log(`Products using fallback (no match found): ${fallbackCount} (approx, includes previously set fallbacks)`);
}

fixBrokenLinks();
