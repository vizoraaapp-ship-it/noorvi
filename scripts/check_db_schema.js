
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load env vars manually since we are running with node
const loadEnv = () => {
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    } catch (e) {
        console.log('Could not load .env file, relying on process.env');
    }
};

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Checking Profiles Table ---');
    // Try to select phone from profiles to see if it errors
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profileError) {
        console.log('PROFILE_ERROR');
        console.error(profileError);
    } else {
        if (profiles.length > 0) {
            if ('phone' in profiles[0]) {
                console.log('PHONE_EXISTS');
            } else {
                console.log('PHONE_MISSING');
            }
        } else {
            console.log('NO_PROFILES_FOUND');
        }
    }

    console.log('\n--- Checking Products Table ---');
    const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error fetching product count:', countError);
    } else {
        console.log(`Total Products: ${count}`);
    }
}

checkSchema();
