const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET all products or filter by category
router.get('/', async (req, res) => {
    const { category } = req.query;

    let query = supabase.from('products').select('*');

    if (category) {
        // Case-insensitive filtering if possible, or exact match depending on DB collation.
        // For simplicity, we assume exact match or handle simple lowercasing on frontend.
        // Assuming category names in DB are stored consistently (e.g., Title Case or Lowercase).
        // Let's normalize to lowercase query vs lowercase column if we want robustness, 
        // but exact match is faster for MVP.
        query = query.ilike('category', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

module.exports = router;
