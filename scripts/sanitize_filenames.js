const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES_DIR = path.join(__dirname, '../public/images/mars');

async function fixFilenamesAndDb() {
    console.log('Starting filename fix...');

    if (!fs.existsSync(IMAGES_DIR)) {
        console.error('Images dir not found');
        return;
    }

    const files = fs.readdirSync(IMAGES_DIR);
    const updates = [];

    for (const file of files) {
        if (!/\.(png|jpg|jpeg|gif)$/i.test(file)) continue;

        // Check if file has spaces or parentheses
        if (file.includes(' ') || file.includes('(') || file.includes(')')) {
            const oldPath = path.join(IMAGES_DIR, file);

            // New name: lowercase, no spaces, no parens, only letters/numbers/underscores
            const ext = path.extname(file);
            const name = path.basename(file, ext);

            let newName = name.toLowerCase()
                .replace(/\s+/g, '_')     // spaces to underscore
                .replace(/[()]/g, '')     // remove parens
                .replace(/_+/g, '_')      // dedupe underscores
                + ext.toLowerCase();

            const newPath = path.join(IMAGES_DIR, newName);

            // Rename file
            try {
                fs.renameSync(oldPath, newPath);
                console.log(`Renamed: "${file}" -> "${newName}"`);

                // Track update for DB
                // We need to find products that might check against the OLD name logic provided in associate_images
                // Actually, associate checking relies on the file list.
                // Better approach: Just rename the files first. 
                // Then re-run the association script or update existing links.

                // If we assume the association script (associate_images.js) matches based on normalized names,
                // re-running it AFTER renaming should find the correct products and update the DB with new clean paths.

            } catch (err) {
                console.error(`Failed to rename ${file}:`, err);
            }
        } else {
            // console.log(`Skipping clean file: ${file}`);
        }
    }

    console.log('Renaming complete. Please re-run associate_images.js to update DB links.');
}

fixFilenamesAndDb();
