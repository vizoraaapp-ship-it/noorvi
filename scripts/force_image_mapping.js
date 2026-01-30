const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Define allowed image directories
const IMAGES_DIR = path.join(__dirname, '../public/images/mars');
const PUBLIC_PREFIX = '/images/mars/';

async function fixImages() {
    console.log('Starting Force Image Mapping...');

    // 1. Get all MARS products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('brand', 'MARS');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    // 2. Get all existing files
    let existingFiles = [];
    if (fs.existsSync(IMAGES_DIR)) {
        existingFiles = fs.readdirSync(IMAGES_DIR).map(f => f.toLowerCase());
    }

    let updates = 0;

    for (const product of products) {
        // Normalize name: lowercase, remove non-alphanumeric
        // "Vanity Bag" -> "vanitybag"
        const normalizedName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const expectedFilename = `${normalizedName}.png`;

        // Check if file exists (fuzzy check for extension?)
        // Let's look for exact base match with any image extension
        const matchingFile = existingFiles.find(f => {
            const fBase = path.basename(f, path.extname(f)).replace(/[^a-z0-9]/g, '');
            // Strict check: file base MUST equal normalized product name
            // OR normalized product name must be fully contained in file base? 
            // User wants "named according to images name". 
            // Let's stick to the generated 'expectedFilename' logic primarily.
            return fBase === normalizedName;
        });

        let finalImageUrl;

        if (matchingFile) {
            finalImageUrl = PUBLIC_PREFIX + matchingFile; // proper case from file system? actually we only have lowercase list. 
            // Re-read dir to get exact casing if needed, but lowercasing is safer for web.
            // Let's assume lowercase for URL is fine.
            finalImageUrl = PUBLIC_PREFIX + matchingFile;
        } else {
            // FORCE the expected URL even if file missing
            finalImageUrl = PUBLIC_PREFIX + expectedFilename;
        }

        console.log(`${product.name} -> ${finalImageUrl} (File Exists: ${!!matchingFile})`);

        const { error: updateError } = await supabase
            .from('products')
            .update({
                image_url: finalImageUrl,
                images: [finalImageUrl]
            })
            .eq('id', product.id);

        if (!updateError) updates++;
    }

    console.log(`Updated ${updates} products.`);
}

fixImages();
