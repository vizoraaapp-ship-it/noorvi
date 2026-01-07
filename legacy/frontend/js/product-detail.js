document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.querySelector('.product-detail-page').innerHTML = '<div style="padding:2rem; text-align:center;">Product not found. <a href="index.html">Go Home</a></div>';
        return;
    }

    // 2. Fetch Product Data
    // Since we don't have a dedicated single product endpoint yet in main.js logic (it fetches all),
    // we will reuse the /api/products endpoint and filter client-side or assume an endpoint exists.
    // Ideally: /api/products/:id. For now, fetch all and find (simpler setup).
    // Or if our API supports query params... currently fetchProducts uses query params for category.
    // Let's try fetching all and finding it, as dataset is small.

    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const product = products.find(p => p.id == productId);

        if (!product) {
            throw new Error('Product not found');
        }

        renderProductDetail(product);
        renderSimilarProducts(products, product.category, product.id);

        // Update Cart Count
        updateCartCount();

    } catch (error) {
        console.error('Error loading product:', error);
        document.querySelector('.product-detail-page').innerHTML = '<div style="padding:2rem; text-align:center;">Error loading product.</div>';
    }
});

function renderProductDetail(product) {
    document.title = `${product.name} - Noorvi`;

    // Images
    const imgEl = document.getElementById('detail-img');
    imgEl.src = product.image_url || 'https://via.placeholder.com/400';
    imgEl.alt = product.name;

    // Info
    document.getElementById('detail-brand').innerText = "Brand Name"; // Placeholder or from DB if available
    document.getElementById('detail-name').innerText = product.name;
    document.getElementById('detail-price').innerText = `₹${product.price}`;

    // Mock MRP calculations
    const mrp = Math.round(product.price * 1.4);
    const discount = Math.round(((mrp - product.price) / mrp) * 100);

    document.getElementById('detail-mrp').innerText = `₹${mrp}`;
    document.getElementById('detail-discount').innerText = `${discount}% off`;

    document.getElementById('buy-btn-price').innerText = product.price;

    // Setup Buttons
    const addToCartBtn = document.getElementById('add-to-cart-sticky');

    // Check if already in cart to update button state?
    // Start fresh
    addToCartBtn.onclick = function () {
        // Use global addToCart from main.js if available, or re-implement
        if (window.addToCart) {
            window.addToCart(product.id, product.name, product.price, product.image_url, this);
        } else {
            console.error("addToCart function not found");
        }
    };

    const buyNowBtn = document.getElementById('buy-now-sticky');
    buyNowBtn.onclick = function () {
        // Add to cart and go to cart
        if (window.addToCart) {
            window.addToCart(product.id, product.name, product.price, product.image_url, null); // null btn so no feedback animation on this button
            window.location.href = 'cart.html';
        }
    };
}

function renderSimilarProducts(allProducts, category, currentId) {
    const similarContainer = document.getElementById('similar-list');

    // Filter similar: same category, exclude current
    const similar = allProducts.filter(p => p.category === category && p.id !== currentId).slice(0, 5); // Taking top 5

    if (similar.length === 0) {
        document.querySelector('.similar-products-section').style.display = 'none';
        return;
    }

    similarContainer.innerHTML = similar.map(p => `
        <div class="similar-card" onclick="window.location.href='product.html?id=${p.id}'">
            <div class="similar-img">
                <img src="${p.image_url || 'https://via.placeholder.com/150'}" alt="${p.name}">
            </div>
            <div class="similar-info">
                <div class="similar-title">${p.name}</div>
                <div class="similar-price">₹${p.price}</div>
            </div>
        </div>
    `).join('');
}
