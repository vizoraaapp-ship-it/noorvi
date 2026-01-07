const supabase = require('./supabase');

async function verify() {
    console.log('Checking for MARS products...');
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('brand', 'MARS')
        .limit(5);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`Found ${data.length} MARS products.`);
        if (data.length > 0) {
            console.log('Sample:', data[0]);
        } else {
            // Check if any products exist and if they have brand column
            const { data: all, error: allErr } = await supabase.from('products').select('*').limit(1);
            console.log('Checking generic product structure:', all ? all[0] : allErr);
        }
    }
}

verify();
