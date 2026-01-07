const API_URL = '/api/products';
const brandContent = document.getElementById('brand-content');
const brandTitle = document.getElementById('brand-title');
const cartCountElement = document.getElementById('cart-count');

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const urlParams = new URLSearchParams(window.location.search);
    const brandName = urlParams.get('name');

    if (brandName) {
        brandTitle.innerText = brandName;
        fetchBrandProducts(brandName);
    } else {
        brandContent.innerHTML = '<p>Brand not specified.</p>';
    }
});

async function fetchBrandProducts(brand) {
    try {
        // Fetch all products and filter client side, or need backend filter
        // We will fetch all and filter for now as API might not support brand filter yet
        // Wait, I didn't update API to filter by brand.
        // But /api/products returns all. I'll filter client side for MVP.
        const response = await fetch(API_URL); // Assuming returns all
        if (!response.ok) throw new Error('Failed to fetch');
        const products = await response.json();

        // 1. Filter by Brand
        // Use loose comparison or normalize
        const brandProducts = products.filter(p => p.brand && p.brand.toUpperCase() === brand.toUpperCase());

        if (brandProducts.length === 0) {
            brandContent.innerHTML = '<p>No products found for this brand.</p>';
            return;
        }

        renderHierarchical(brandProducts);

    } catch (error) {
        console.error('Error:', error);
        brandContent.innerHTML = '<p>Error loading products.</p>';
    }
}

function renderHierarchical(products) {
    // 1. Group by Main Category
    const grouped = {};

    products.forEach(p => {
        const main = p.main_category || 'Other';
        const sub = p.sub_category || 'General';

        if (!grouped[main]) grouped[main] = {};
        if (!grouped[main][sub]) grouped[main][sub] = [];

        grouped[main][sub].push(p);
    });

    // 2. Render
    // We want numbered order. The keys might not be sorted. 
    // The user input data has numbers in names "1. LIPS", "1.1 Lipstick".
    // So simple string sort should work.

    let html = '';
    const mainKeys = Object.keys(grouped).sort();

    mainKeys.forEach(main => {
        html += `<div class="brand-section-header">${main}</div>`;

        const subKeys = Object.keys(grouped[main]).sort();

        subKeys.forEach(sub => {
            html += `<div class="brand-sub-header">${sub}</div>`;
            html += `<div class="product-grid">`;

            grouped[main][sub].forEach(product => {
                html += createProductCard(product);
            });

            html += `</div>`;
        });
    });

    brandContent.innerHTML = html;
}

function createProductCard(product) {
    // Determine image
    const img = product.image_url || 'https://via.placeholder.com/200';

    // Price logic
    const price = product.price;
    const mrp = product.mrp_price || Math.round(price * 1.25); // Fallback logic if mrp missing
    const discount = product.discount_percent || 20;

    return `
        <div class="product-card">
            <img src="${img}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="mrp-price">₹${mrp}</span>
                    ₹${price}
                    <span class="discount-badge">${discount}% off</span>
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${price}, '${img}', this)">
                ADD TO CART
            </button>
        </div>
    `;
}

// Reuse Cart Logic
window.addToCart = function (id, name, price, imageUrl, btnElement) {
    let cart = JSON.parse(localStorage.getItem('notification_cart')) || []; // unique key
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price: Number(price),
            image_url: imageUrl,
            quantity: 1
        });
    }

    localStorage.setItem('notification_cart', JSON.stringify(cart));
    updateCartCount();

    // Quick feedback
    // Use the passed element if available, fallback to event if not (for other callers if any)
    const target = btnElement || (typeof event !== 'undefined' ? event.target : null);

    if (target) {
        // Handle case where icon inside button was clicked (if any)
        const buttonEl = target.tagName === 'BUTTON' ? target : target.closest('button');

        if (buttonEl) {
            const originalText = buttonEl.innerText;
            buttonEl.innerText = 'ADDED!';
            setTimeout(() => buttonEl.innerText = originalText, 1000);
        }
    }
};

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('notification_cart')) || [];
    const count = cart.length;
    if (cartCountElement) cartCountElement.innerText = `(${count})`;
}
