const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const newCategories = [
    'LIPS',
    'EYES',
    'FACE KITS',
    'FACE',
    'REMOVERS & WIPES',
    'TOOLS & BRUSHES',
    'SPONGES & BLENDERS',
    'ACCESSORIES'
];

async function updateCategories() {
    console.log('Updating categories table...');

    // 1. Delete all existing categories
    // Note: If foreign keys exist and cascade is not set, this might fail.
    // However, products seem to use string category names, so it might be fine.
    const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .neq('name', 'PLACEHOLDER_TO_MATCH_ALL'); // Delete all rows implies match any that isn't a placeholder? 
    // Or better: .gt('id', '00000000-0000-0000-0000-000000000000') if UUIDs.
    // Let's try fetching IDs first then deleting.

    // 1b. Fetch IDs to delete
    const { data: existing, error: fetchError } = await supabase.from('categories').select('id');
    if (fetchError) {
        console.error('Error fetching categories to delete:', fetchError);
        return;
    }

    if (existing && existing.length > 0) {
        const ids = existing.map(c => c.id);
        const { error: delError } = await supabase
            .from('categories')
            .delete()
            .in('id', ids);

        if (delError) {
            console.error('Error deleting old categories:', delError);
            // If conflict, we might need to update existing rows or handle constraint?
            // Assuming loose coupling for now.
            return;
        }
        console.log(`Deleted ${ids.length} old categories.`);
    }

    // 2. Insert new categories
    const updates = newCategories.map(name => ({ name }));
    const { data: inserted, error: insertError } = await supabase
        .from('categories')
        .insert(updates)
        .select();

    if (insertError) {
        console.error('Error inserting new categories:', insertError);
    } else {
        console.log(`Inserted ${inserted.length} new categories.`);
        inserted.forEach(c => console.log(`- ${c.name}`));
    }
}

updateCategories();
