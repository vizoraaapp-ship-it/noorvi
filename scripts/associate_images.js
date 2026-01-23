
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL or Key missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES_DIR = path.join(__dirname, '../public/images/mars');

async function associateImages() {
    console.log('Starting image association...');

    // 1. Get all files from images directory
    try {
        if (!fs.existsSync(IMAGES_DIR)) {
            console.error(`Error: Images directory not found at ${IMAGES_DIR}`);
            return;
        }
        const files = fs.readdirSync(IMAGES_DIR).filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
        console.log(`Found ${files.length} images.`);

        // 2. Fetch all MARS products
        const { data: products, error } = await supabase
            .from('products')
            .select('id, name, brand')
            .eq('brand', 'MARS');

        if (error) {
            console.error('Error fetching products:', error);
            return;
        }
        console.log(`Found ${products.length} MARS products in DB.`);

        // 3. Process images
        const updates = [];
        const unmatched = [];

        // Helper to normalize strings for comparison
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Group files by base name (removing (1), (2), etc.)
        const groups = {};
        files.forEach(file => {
            // Remove file extension
            let name = file.replace(/\.(png|jpg|jpeg|gif)$/i, '');
            // Remove (1), (2) patterns
            let base = name.replace(/\s*\(\d+\)$/, '').trim();

            let key = normalize(base);
            if (!groups[key]) groups[key] = [];
            groups[key].push({ file, original: name });
        });

        for (const product of products) {
            const pName = normalize(product.name);
            const pNameWithBrand = normalize('MARS ' + product.name);

            // Try to find matching group
            // Strategies: 
            // 1. Exact match with product name
            // 2. Match with "MARS" prefix removed from file if present
            // 3. Match with spaces removed

            let matchKey = null;

            // Check if any group key contains the product name or vice versa
            // This is a bit fuzzy, might need strict matching first

            if (groups[pName]) matchKey = pName;
            else if (groups[pNameWithBrand]) matchKey = pNameWithBrand;
            else {
                // Fuzzy search?
                // specific known mappings if any, or heuristic
                // Let's try to match if the file key contains the product name key
                const found = Object.keys(groups).find(k => k.includes(pName) || pName.includes(k));
                if (found) matchKey = found;
            }

            if (matchKey) {
                const groupImages = groups[matchKey].sort((a, b) => a.file.localeCompare(b.file));
                const distinctImages = groupImages.map(g => `/images/mars/${g.file}`);

                // First image is main image
                const mainImage = distinctImages[0];

                updates.push({
                    id: product.id,
                    image_url: mainImage,
                    images: distinctImages
                });

                console.log(`Matched "${product.name}" -> [${distinctImages.length}] ${distinctImages.join(', ')}`);
            } else {
                // console.log(`No match for "${product.name}"`);
            }
        }

        // 4. Perform Updates
        console.log(`Updating ${updates.length} products...`);
        let successCount = 0;
        for (const update of updates) {
            const { error } = await supabase
                .from('products')
                .update({
                    image_url: update.image_url,
                    images: update.images
                })
                .eq('id', update.id);

            if (error) {
                console.error(`Failed to update ${update.id}:`, error);
            } else {
                successCount++;
            }
        }

        console.log(`Successfully updated ${successCount} products.`);

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

associateImages();
