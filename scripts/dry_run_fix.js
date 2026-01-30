const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function dryRunFix() {
    console.log('Fetching products...');
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, image_url, images');

    if (error) {
        console.error(error);
        return;
    }

    const imagesDir = path.join(process.cwd(), 'public', 'images', 'mars');
    if (!fs.existsSync(imagesDir)) {
        console.log('Images dir not found');
        return;
    }

    const files = fs.readdirSync(imagesDir);
    console.log(`Found ${files.length} files in ${imagesDir}`);

    // Helper to normalize strings: lowercase, remove non-alphanumeric (keep spaces for splitting?) 
    // Actually, strict normalization: remove all non-alphanumeric chars.
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

    const updates = [];
    const unmatched = [];

    products.forEach(p => {
        const normName = normalize(p.name);

        // Filter files that "match" this product
        // We look for files where the normalized filename STARTS with the normalized product name
        // AND the rest is either empty or just numbers like '1', '2' etc

        const matches = files.filter(f => {
            const fName = path.parse(f).name;
            const normFName = normalize(fName);

            // Exact match
            if (normFName === normName) return true;

            // Variant match: check if normFName starts with normName
            if (normFName.startsWith(normName)) {
                // Check if the suffix is just numbers
                const suffix = normFName.slice(normName.length);
                // "1", "2", "test" -> we only want numbered variants essentially
                // But wait, " (1)" normalizes to "1". " (2)" -> "2".
                // So suffix should be integers only
                // Also check for edge case where "Lipstick" matches "Lipstick Remover" -> suffix "remover"
                return /^\d+$/.test(suffix);
            }
            return false;
        });

        if (matches.length > 0) {
            // Sort matches to ensure order (optional, but good for consistency)
            // We want the "base" image first if possible, or (1) then (2)
            matches.sort((a, b) => {
                const aNorm = normalize(path.parse(a).name);
                const bNorm = normalize(path.parse(b).name);
                // shortest first (base name vs base name + 1)
                if (aNorm.length !== bNorm.length) return aNorm.length - bNorm.length;
                return aNorm.localeCompare(bNorm);
            });

            const mainImage = `/images/mars/${matches[0]}`;
            const allImages = matches.map(f => `/images/mars/${f}`);

            updates.push({
                product: p.name,
                current: p.image_url,
                new: mainImage,
                images: allImages,
                matchCount: matches.length
            });
        } else {
            unmatched.push(p.name);
        }
    });

    console.log(`Proposed ${updates.length} updates:`);
    updates.slice(0, 50).forEach(u => { // Show first 50
        console.log(`MATCH: "${u.product}" -> ${u.new} (${u.matchCount} images)`);
        if (u.matchCount > 1) {
            console.log(`   Variants: ${JSON.stringify(u.images)}`);
        }
    });

    console.log(`\nTotal Matched: ${updates.length}`);
    console.log(`Total Unmatched: ${unmatched.length}`);
    // console.log('Unmatched samples:', unmatched.slice(0, 10));
}

dryRunFix();
