const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES_DIR = path.join(__dirname, '../public/images/mars');
const PLACEHOLDER = '/images/placeholder.svg';

async function auditMatches() {
    console.log('Starting Audit...');

    if (!fs.existsSync(IMAGES_DIR)) {
        console.error('Images dir not found');
        return;
    }

    // 1. Get real files
    const realFiles = fs.readdirSync(IMAGES_DIR).filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
    const realFileNames = realFiles.map(f => f.toLowerCase());

    // 2. Fetch products
    const { data: products, error } = await supabase
        .from('products')
        .select('name, image_url')
        .eq('brand', 'MARS');

    if (error) {
        console.error(error);
        return;
    }

    // 3. Check usage
    const usedFiles = new Set();
    const matchedProducts = [];
    const unmatchedProducts = [];

    products.forEach(p => {
        if (p.image_url && p.image_url.startsWith('/images/mars/')) {
            const fname = path.basename(p.image_url).toLowerCase();
            if (realFileNames.includes(fname)) {
                usedFiles.add(fname);
                matchedProducts.push(p.name);
            } else {
                // Pointing to non-existent file? should have been fixed by strict sync
                unmatchedProducts.push(`${p.name} (Broken Link: ${fname})`);
            }
        } else {
            unmatchedProducts.push(p.name);
        }
    });

    const orphanedFiles = realFiles.filter(f => !usedFiles.has(f.toLowerCase()));

    console.log(`\n=== MATCHED PRODUCTS (${matchedProducts.length}) ===`);
    // matchedProducts.forEach(n => console.log(n)); // Too noisy?

    console.log(`\n=== ORPHANED FILES (Exist but NOT grouped) (${orphanedFiles.length}) ===`);
    orphanedFiles.forEach(f => console.log(f));

    console.log(`\n=== UNMATCHED PRODUCTS (Sample 10) ===`);
    unmatchedProducts.slice(0, 10).forEach(n => console.log(n));
}

auditMatches();
