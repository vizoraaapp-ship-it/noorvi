const API_URL = '/api/products'; // Relative path as we are serving from same origin or using proxy
const productGrid = document.getElementById('product-grid');
const cartCountElement = document.getElementById('cart-count');
const categoryItems = document.querySelectorAll('.category-item');

let allProducts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();

    // Search functionality
    const searchBtn = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        filterProducts(query);
    });

    searchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
            renderProducts(allProducts);
        }
    });

    // Category click
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            categoryItems.forEach(i => i.classList.remove('active'));
            // Add to clicked
            item.classList.add('active');

            const category = item.dataset.category;
            fetchProducts(category);
        });
    });

    initSlider();

    // Mobile Sidebar Logic
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    if (menuIcon && sidebar && sidebarOverlay) {
        menuIcon.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        };

        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', closeSidebar);
        }

        sidebarOverlay.addEventListener('click', closeSidebar);
    }
});

function initSlider() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    if (!sliderWrapper || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    }, 3000); // 3 seconds delay
}

async function fetchProducts(category = '') {
    productGrid.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        let url = API_URL;
        if (category) {
            url += `?category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');

        const products = await response.json();
        allProducts = products; // Store for client-side search if needed
        renderProducts(products);

    } catch (error) {
        console.error('Error:', error);
        productGrid.innerHTML = '<div class="error">Failed to load products. Please check the backend connection.</div>';
    }
}

function renderProducts(products) {
    if (products.length === 0) {
        productGrid.innerHTML = '<div class="no-products">No products found.</div>';
        return;
    }

    productGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductDetail('${product.id}')"> <!-- Optional detail view, for now just card -->
            <img src="${product.image_url || 'https://via.placeholder.com/200'}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
            </div>
            <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image_url}', this)">
                ADD TO CART
            </button>
        </div>
    `).join('');
}

function filterProducts(query) {
    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

// Global scope for onclick
window.addToCart = function (id, name, price, imageUrl, btnElement) {
    console.log("addToCart called for:", id, name);
    try {
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('notification_cart')) || [];
        } catch (e) {
            console.error("Error parsing cart:", e);
            cart = [];
        }

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
        console.log("Cart updated:", cart);
        updateCartCount();

        // Quick feedback
        const target = btnElement || (typeof event !== 'undefined' ? event.target : null);

        if (target) {
            const buttonEl = target.tagName === 'BUTTON' ? target : target.closest('button');

            if (buttonEl) {
                const originalText = buttonEl.innerText;
                buttonEl.innerText = 'ADDED!';
                setTimeout(() => buttonEl.innerText = originalText, 1000);
            }
        }
    } catch (error) {
        console.error("addToCart failed:", error);
        alert("Failed to add to cart. Please check console.");
    }
};


window.openProductDetail = function (id) {
    window.location.href = `product.html?id=${id}`;
};

function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('notification_cart')) || [];
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);

        if (cartCountElement) {
            cartCountElement.innerText = `(${count})`;
        }

        // Also update simple badge if exists on other pages
        const badge = document.getElementById('cart-count-badge');
        if (badge) {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    } catch (e) {
        console.error("Error reading cart count", e);
    }
}
