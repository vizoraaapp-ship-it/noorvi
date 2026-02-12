const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'mars');

// Correct mappings based on list_dir output
const updates = [
    { name: 'Sharpener', oldFile: 'MARS SHARPNER (1).png', newFile: 'mars_sharpener.png' },
    { name: 'Vanity Bag', oldFile: 'MARS VANITY BAG.png', newFile: 'mars_vanity.png' },
    { name: 'Makeup Pouch', oldFile: 'MARS MAKEUP POUCH (1).png', newFile: 'mars_pouch.png' },
    // Use the smart quote ’
    { name: 'Ultra Thin Foundation Brush', oldFile: 'ARTIST’S ULTRA THIN FOUNDATION BRUSH (1).png', newFile: 'ultra_thin_foundation_brush.png' },
    { name: 'HD Compact Powder', oldFile: 'HD OMPACT POWDER.png', newFile: 'hd_compact_powder.png' },
    { name: 'Makeup Remover Wipes', oldFile: 'MAKEUP REVOMER WIPES.png', newFile: 'makeup_remover_wipes.png' },
    { name: 'Wet Wipes', oldFile: 'MARSWET WIPES (1).png', newFile: 'wet_wipes.png' },
    { name: 'Professional Brush Set', oldFile: 'MARS PROFESSIONAL BRUSH SET.png', newFile: 'professional_brush_set.png' },
    // For Tools of Titan, the file might already be renamed or exist as the target
    { name: 'Tools of Titan Brush Set Holder', oldFile: 'tools_of_titan_brush_set_holder.png', newFile: 'tools_of_titan_brush_set_holder.png', checkNewOnly: true }
];

async function renameAndUpdate() {
    console.log('Starting rename and update process (Attempt 2)...');

    for (const item of updates) {
        const oldPath = path.join(imagesDir, item.oldFile);
        const newPath = path.join(imagesDir, item.newFile);
        const newUrl = `/images/mars/${item.newFile}`;
        let fileReady = false;

        // 1. Rename file logic
        if (item.checkNewOnly) {
            // Just check if new file exists
            if (fs.existsSync(newPath)) {
                console.log(`Target file already exists: ${item.newFile}`);
                fileReady = true;
            } else {
                console.warn(`Target file missing for ${item.name}: ${item.newFile}`);
            }
        } else {
            if (fs.existsSync(oldPath)) {
                try {
                    fs.renameSync(oldPath, newPath);
                    console.log(`Renamed: ${item.oldFile} -> ${item.newFile}`);
                    fileReady = true;
                } catch (err) {
                    console.error(`Failed to rename ${item.oldFile}:`, err.message);
                }
            } else if (fs.existsSync(newPath)) {
                console.log(`File already renamed/exists: ${item.newFile}`);
                fileReady = true;
            } else {
                console.warn(`File not found: ${item.oldFile}`);
            }
        }

        // 2. Update Database if file is ready (or even if not found, we might want to fix the link if we are sure? 
        // Let's only update if we are relatively sure or if we really want to enforce the new URL)
        // I'll force update the DB because the previous run set them to bad URLs like '/images/mars/MARS SHARPENER.png'

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

    console.log('Process complete.');
}

renameAndUpdate();
