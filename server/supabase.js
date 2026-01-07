const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in environment variables');
    // We don't exit process here to allow server to start even if config is missing, 
    // but DB operations will fail.
}

let supabase;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.error('Missing Supabase URL or Key. API endpoints will fail.');
    // Create a dummy object to prevent crash on import, but methods will fail
    supabase = {
        from: () => ({
            select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
    };
}

module.exports = supabase;
