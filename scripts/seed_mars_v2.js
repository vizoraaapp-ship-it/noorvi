const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Read raw data from file
const rawDataPath = path.join(__dirname, '../data/mars_v2.txt');
let productsToInsert = [];

try {
    const rawData = fs.readFileSync(rawDataPath, 'utf8');
    productsToInsert = parseData(rawData);
    console.log(`Parsed ${productsToInsert.length} products from ${rawDataPath}.`);
} catch (err) {
    console.error('Error reading data file:', err);
    process.exit(1);
}

// Helper to parse the text data
function parseData(text) {
    const lines = text.split('\n').filter(l => l.trim());
    const products = [];
    let currentCategory = 'Uncategorized';

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('###')) {
            // Category (e.g., ### LIPS)
            currentCategory = trimmed.replace('###', '').trim();
        } else if (trimmed.startsWith('- **')) {
            // Product (e.g., - **Lipstick Pencil**: Rs. 599/- set)
            extractProduct(trimmed, currentCategory, products);
        }
    }
    return products;
}

function extractProduct(line, category, products) {
    // line format: - **Name**: Rs. Price/-
    const withoutDash = line.replace(/^- /, '').trim(); // Remove leading dash
    const parts = withoutDash.split('**:');

    if (parts.length >= 2) {
        // Name is between ** and **
        const namePart = parts[0];
        const name = namePart.replace('**', '').trim();

        // Price part: Rs. 599/- ...
        const pricePart = parts[1].trim();

        // Extract number from "Rs. 599/-"
        const priceMatch = pricePart.match(/Rs\.\s*(\d+)/);

        if (name && priceMatch) {
            const price = parseInt(priceMatch[1], 10);

            // Handle duplicates in input if any?
            // Assuming input is unique for now.

            products.push({
                name,
                category,
                price: price, // Storing as is
                brand: 'MARS',
                image_url: 'https://via.placeholder.com/300?text=' + encodeURIComponent(name), // Default placeholder
                description: `${name} by MARS.`,
            });
        }
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding Mars products v2...');

    // Delete existing MARS products
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('brand', 'MARS');

    if (deleteError) {
        console.log('Could not clear existing products. Proceeding to insert (might fail on unique constraints if any)...', deleteError.message);
    } else {
        console.log('Cleared existing MARS products.');
    }

    // Insert new - chunking if too big? 100+ items should be fine in one go or batches of 50.
    // Supabase often has a limit per request.

    const BATCH_SIZE = 50;
    for (let i = 0; i < productsToInsert.length; i += BATCH_SIZE) {
        const batch = productsToInsert.slice(i, i + BATCH_SIZE);
        const { error } = await supabase
            .from('products')
            .insert(batch);

        if (error) {
            console.error(`Error inserting batch ${i}:`, error.message);
        } else {
            console.log(`Inserted batch ${i} - ${i + batch.length}`);
        }
    }

    console.log('Seeding complete.');
}

seed();
