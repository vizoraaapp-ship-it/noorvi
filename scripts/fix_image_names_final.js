const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'mars');

// Maps: Product Name -> { currentFile (from list_dir), targetFile (snake_case product name) }
// Note: Some might already be in target state, but we ensure consistency.
const updates = [
    { name: 'Sharpener', currentFile: 'mars_sharpener.png', targetFile: 'sharpener.png' },
    { name: 'Vanity Bag', currentFile: 'mars_vanity.png', targetFile: 'vanity_bag.png' },
    { name: 'Makeup Pouch', currentFile: 'mars_pouch.png', targetFile: 'makeup_pouch.png' },
    // These are already good, but let's confirm DB update
    { name: 'Ultra Thin Foundation Brush', currentFile: 'ultra_thin_foundation_brush.png', targetFile: 'ultra_thin_foundation_brush.png' },
    { name: 'HD Compact Powder', currentFile: 'hd_compact_powder.png', targetFile: 'hd_compact_powder.png' },
    { name: 'Makeup Remover Wipes', currentFile: 'makeup_remover_wipes.png', targetFile: 'makeup_remover_wipes.png' },
    { name: 'Wet Wipes', currentFile: 'wet_wipes.png', targetFile: 'wet_wipes.png' },
    { name: 'Professional Brush Set', currentFile: 'professional_brush_set.png', targetFile: 'professional_brush_set.png' },
    { name: 'Tools of Titan Brush Set Holder', currentFile: 'tools_of_titan_brush_set_holder.png', targetFile: 'tools_of_titan_brush_set_holder.png' }
];

async function fixNames() {
    console.log('Starting final image name fix...');

    for (const item of updates) {
        const currentPath = path.join(imagesDir, item.currentFile);
        const targetPath = path.join(imagesDir, item.targetFile);
        const newUrl = `/images/mars/${item.targetFile}`;

        let fileExists = false;

        // 1. Rename if needed
        if (item.currentFile !== item.targetFile) {
            if (fs.existsSync(currentPath)) {
                try {
                    fs.renameSync(currentPath, targetPath);
                    console.log(`Renamed: ${item.currentFile} -> ${item.targetFile}`);
                    fileExists = true;
                } catch (err) {
                    console.error(`Failed to rename ${item.currentFile}:`, err.message);
                }
            } else if (fs.existsSync(targetPath)) {
                console.log(`Target file already exists: ${item.targetFile}`);
                fileExists = true;
            } else {
                console.warn(`Source file missing: ${item.currentFile}`);
            }
        } else {
            if (fs.existsSync(targetPath)) {
                fileExists = true;
            } else {
                console.warn(`File missing: ${item.targetFile}`);
            }
        }

        // 2. Update DB
        // Always update DB to ensure it points to the targetFile
        const { error } = await supabase
            .from('products')
            .update({ image_url: newUrl })
            .eq('name', item.name);

        if (error) {
            console.error(`Failed to update DB for ${item.name}:`, error);
        } else {
            console.log(`Updated DB for ${item.name} -> ${newUrl}`);
        }
    }
    console.log('Final fix complete.');
}

fixNames();
