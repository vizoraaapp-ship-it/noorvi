const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function applyFix() {
    console.log('Fetching products...');
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name');

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
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

    let updateCount = 0;

    for (const p of products) {
        const normName = normalize(p.name);

        const matches = files.filter(f => {
            const fName = path.parse(f).name;
            const normFName = normalize(fName);

            if (normFName === normName) return true;

            if (normFName.startsWith(normName)) {
                const suffix = normFName.slice(normName.length);
                return /^\d+$/.test(suffix);
            }
            return false;
        });

        if (matches.length > 0) {
            matches.sort((a, b) => {
                const aNorm = normalize(path.parse(a).name);
                const bNorm = normalize(path.parse(b).name);
                if (aNorm.length !== bNorm.length) return aNorm.length - bNorm.length;
                return aNorm.localeCompare(bNorm);
            });

            const mainImage = `/images/mars/${matches[0]}`;
            const allImages = matches.map(f => `/images/mars/${f}`);

            console.log(`Updating "${p.name}" -> ${mainImage} (${matches.length} images)`);

            const { error: updateError } = await supabase
                .from('products')
                .update({
                    image_url: mainImage,
                    images: allImages
                })
                .eq('id', p.id);

            if (updateError) {
                console.error(`Failed to update ${p.name}:`, updateError);
            } else {
                updateCount++;
            }
        }
    }

    console.log(`Updated ${updateCount} products.`);
}

applyFix();
