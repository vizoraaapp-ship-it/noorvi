const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES_DIR = path.join(__dirname, '../public/images/mars');

// Normalizer: lowercase, remove non-alphanumeric (except underscore)
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

async function fixAndAssociate() {
    console.log('Starting Master Fix...');

    if (!fs.existsSync(IMAGES_DIR)) {
        console.error('Images dir not found');
        return;
    }

    // 1. Rename ALL files to standard format
    const files = fs.readdirSync(IMAGES_DIR);
    const validFiles = [];

    files.forEach(file => {
        if (!/\.(png|jpg|jpeg|gif)$/i.test(file)) return;

        const oldPath = path.join(IMAGES_DIR, file);
        const ext = path.extname(file);
        const base = path.basename(file, ext);

        // New name: lowercase, no special chars except underscore if needed?
        // Let's strip EVERYTHING non-alphanumeric to make matching easiest
        // But keep them distinct.
        // Actually, let's just make them lowercase and remove spaces/parens/dashes.
        const cleanBase = base.toLowerCase().replace(/[^a-z0-9]/g, '');
        const newName = cleanBase + ext.toLowerCase();

        const newPath = path.join(IMAGES_DIR, newName);

        if (oldPath !== newPath) {
            try {
                fs.renameSync(oldPath, newPath);
                console.log(`Renamed: ${file} -> ${newName}`);
            } catch (e) {
                console.error(`Rename failed: ${file}`, e);
            }
        } else {
            // console.log(`Already clean: ${file}`);
        }
        validFiles.push(newName);
    });

    // 2. Fetch Products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('brand', 'MARS');

    if (error) {
        console.error(error);
        return;
    }

    // 3. Match and Update
    let updates = 0;

    for (const product of products) {
        // Normalize product name: remove 'mars', remove spaces, lowercase
        const pNorm = normalize(product.name);
        // Also handle "Lipstick" variations?
        // e.g. "poppinslipcrayon" matches "poppinslipcrayon.png"

        // Find best matching file
        const match = validFiles.find(f => {
            const fBase = normalize(path.basename(f, path.extname(f)));
            // Direct match
            if (fBase === pNorm) return true;
            // File contains product name?
            if (fBase.includes(pNorm)) return true;
            // Product name contains file? (e.g. file: "lipcrayon", product: "poppins lip crayon" -> match? dangerously fuzzy)

            // Try matching with "mars" removed from file if present?
            // "marscolorbumlipstick" -> "colorbumlipstick" which matches "colorbumliquidlipstick" close enough?
            // Let's stick to strict inclusion for now to avoid wrong images.

            // Special case: "MARS" prefix in file
            const fBaseNoMars = fBase.replace(/^mars/, ''); // only at start

            if (fBaseNoMars === pNorm) return true;

            // Product includes File? (e.g. product "creamymattelipstick" includes file "creamymatte")
            if (pNorm.includes(fBase)) return true;
            if (pNorm.includes(fBaseNoMars)) return true;

            return false;
        });

        if (match) {
            const imageUrl = `/images/mars/${match}`;
            console.log(`Match: ${product.name} -> ${match}`);

            const { error: upErr } = await supabase
                .from('products')
                .update({
                    image_url: imageUrl,
                    images: [imageUrl] // Update gallery too
                })
                .eq('id', product.id);

            if (!upErr) updates++;
        }
    }

    console.log(`Updated ${updates} products.`);
}

fixAndAssociate();
