const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'mars');

// Current files discovered via list_dir
const updates = [
    { name: 'Wonder Powder', current: 'MARS WONDER POWDER.png', target: 'wonder_powder.png' },
    { name: 'Wonder Fixer', current: 'MARS WONDER FIXER.png', target: 'wonder_fixer.png' },
    { name: 'Wonder Cover', current: 'MARS WONDER COVER.png', target: 'wonder_cover.png' },
    { name: 'Cover Rangers', current: 'MARS COVER RANGERS (1).png', target: 'cover_rangers.png' },
    { name: 'Contour Palette', current: 'MARS CONTOUR PALETTE.png', target: 'contour_palette.png' },
    { name: 'Airbrush Powder', current: '3 IN 1 AIRBRUSH POWDER.png', target: 'airbrush_powder.png' },
    { name: 'Good Wipes', current: 'GOOD WIPES WET WIPES (1).png', target: 'good_wipes.png' },
    { name: 'God’s Glow Illuminator', current: 'GOD’S  LOW ILLUMINATOR (1).png', target: 'gods_glow_illuminator.png' }, // Typo fix
    { name: 'Mist Foundation', current: 'MARS MIST FOUNDATION.png', target: 'mist_foundation.png' },
    { name: 'It’s Glow O’Clock Primer', current: 'IT’S LOW O’CLOCK PRIMER.png', target: 'its_glow_oclock_primer.png' }, // Typo fix
    { name: 'Face Primer', current: 'MARS FACE PRIMER (1).png', target: 'face_primer.png' },

    // City Paradise Kits - Mapping 1-8
    { name: 'City Paradise Makeup Kit - Delhi', current: 'THECITYPARADISE (1).png', target: 'city_paradise_delhi.png' },
    { name: 'City Paradise Makeup Kit - Ahmedabad', current: 'THECITYPARADISE (2).png', target: 'city_paradise_ahmedabad.png' },
    { name: 'City Paradise Makeup Kit - Jaipur', current: 'THECITYPARADISE (3).png', target: 'city_paradise_jaipur.png' },
    { name: 'City Paradise Makeup Kit - Kolkata', current: 'THECITYPARADISE (4).png', target: 'city_paradise_kolkata.png' },
    { name: 'City Paradise Makeup Kit - Lucknow', current: 'THECITYPARADISE (5).png', target: 'city_paradise_lucknow.png' },
    { name: 'City Paradise Makeup Kit - Mumbai', current: 'THECITYPARADISE (6).png', target: 'city_paradise_mumbai.png' },
    { name: 'City Paradise Makeup Kit - Chandigarh', current: 'THECITYPARADISE (7).png', target: 'city_paradise_chandigarh.png' },
    { name: 'City Paradise Makeup Kit - Bangalore', current: 'THECITYPARADISE (8).png', target: 'city_paradise_bangalore.png' },

    { name: '2 in 1 Super Stay Foundation', current: 'HIGH COVERAGE FOUNDATION.png', target: '2_in_1_super_stay_foundation.png' }, // Best guess map
    { name: 'Wswb Kajal', current: 'MARSWSWBKAJAL.png', target: 'wswb_kajal.png' },
    { name: 'All I Need Makeup Kit', current: 'MAKEUP KIT.png', target: 'all_i_need_makeup_kit.png' },
    { name: 'Glitter Palette', current: 'MARSGLITTERPALETTE.png', target: 'glitter_palette.png' },
    { name: '36 Color Eyeshadow Palette', current: 'MESMEREYESEYESHADOWPALETTE.png', target: '36_color_eyeshadow_palette.png' }, // Best guess
    { name: 'Fabulash Mascara', current: 'MARSFABULASHMASCARA.png', target: 'fabulash_mascara.png' },
    { name: 'Northern Liquid Eyeliner', current: 'NORTHERNLIGHTSLIQUIDEYELINER (1).png', target: 'northern_liquid_eyeliner.png' },
    { name: 'Colorbum Liquid Lipstick', current: 'marscolorbumlipstick.png', target: 'colorbum_liquid_lipstick.png' },
    { name: 'Pen Eyeliner', current: 'WSWBPENEYELINER.png', target: 'pen_eyeliner.png' },
    { name: 'Candylocious Lip Gloss', current: 'MARSCANDYLICIOUSLIPGLOSS (1).png', target: 'candylocious_lip_gloss.png' },
    { name: 'Aqua Splash Lip Balm', current: 'FULLOFWATERLIPBALM (1).png', target: 'aqua_splash_lip_balm.png' },
    { name: 'Cloud Kiss Lipstick', current: 'CLOUD KISS1 (1).png', target: 'cloud_kiss_lipstick.png' },
    { name: '3 Matte Box', current: 'TRIOTREAT (1).png', target: '3_matte_box.png' },
    { name: 'Plush Velvet Lipstick', current: 'plushvelvet.png', target: 'plush_velvet_lipstick.png' },
    { name: 'Creamy Matte Lipstick', current: 'creamymatte.png', target: 'creamy_matte_lipstick.png' },
    { name: 'Lip Crayon', current: 'poppinslipcrayon.png', target: 'lip_crayon.png' },
    { name: 'Color Changing Lip Oil', current: 'LIPPYTOPLIPGEL (1).png', target: 'color_changing_lip_oil.png' }, // Best guess
    { name: 'Lipstick Pencil', current: 'lipstick_pencil_shades.png', target: 'lipstick_pencil.png' }
];

async function fixBatch2() {
    console.log('Starting Batch 2 fix...');

    for (const item of updates) {
        const currentPath = path.join(imagesDir, item.current);
        const targetPath = path.join(imagesDir, item.target);
        const newUrl = `/images/mars/${item.target}`;

        // 1. Rename logic
        if (item.current !== item.target) {
            if (fs.existsSync(currentPath)) {
                try {
                    fs.renameSync(currentPath, targetPath);
                    console.log(`Renamed: ${item.current} -> ${item.target}`);
                } catch (err) {
                    console.error(`Failed to rename ${item.current}:`, err.message);
                }
            } else if (fs.existsSync(targetPath)) {
                console.log(`Target file already exists: ${item.target}`);
            } else {
                console.warn(`Source file missing: ${item.current}`);
            }
        }

        // 2. Update DB
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
    console.log('Batch 2 fix complete.');
}

fixBatch2();
