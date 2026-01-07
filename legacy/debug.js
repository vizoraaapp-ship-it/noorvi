try {
    console.log('Requiring supabase...');
    const supabase = require('./server/supabase');
    console.log('Supabase required successfully:', supabase);
    console.log('Requiring products routes...');
    const products = require('./server/routes/products');
    console.log('Products routes required successfully.');
} catch (err) {
    console.error('Error during require:', err);
}
