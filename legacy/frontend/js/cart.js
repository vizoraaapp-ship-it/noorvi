const cartItemsList = document.getElementById('cart-items-list');
const priceDetailsSection = document.getElementById('price-details-section');
const buyNowBtn = document.getElementById('buy-now-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeModal = document.querySelector('.close');
const checkoutForm = document.getElementById('checkout-form');

// State to track if we are buying a specific single item from the cart (if that was the flow) 
// OR the whole cart. The prompt implies "Buy Now" does a checkout of the cart?
// "When user clicks 'Buy Now' Open a form ... Product Name (auto-filled from cart)"
// The user input suggests singular "Product Name". 
// But a cart can have multiple items.
// If multiple items, we should list them.
// "Product Name (auto-filled from cart)" implies we might need to concatenate them or the prompt assumed single item buy flow.
// I will support multiple items by concatenating names in the message.

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            openCheckoutModal();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            checkoutModal.style.display = 'none';
        });
    }

    window.onclick = function (event) {
        if (event.target == checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleFormSubmit);
    }
});

function getCart() {
    return JSON.parse(localStorage.getItem('notification_cart')) || [];
}

function setCart(cart) {
    localStorage.setItem('notification_cart', JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();
    const stickyFooter = document.getElementById('sticky-footer');

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" style="width: 200px; margin-bottom: 1rem;">
            <p style="font-size: 1.1rem; font-weight: 500;">Your cart is empty!</p>
            <a href="index.html" style="color: #2874f0; font-weight: 500; text-decoration: none; margin-top: 1rem; display: inline-block;">Shop Now</a>
        </div>
        `;
        if (priceDetailsSection) priceDetailsSection.style.display = 'none';
        if (stickyFooter) stickyFooter.style.display = 'none';
        return;
    }

    if (priceDetailsSection) priceDetailsSection.style.display = 'block';
    if (stickyFooter) stickyFooter.style.display = 'flex';

    // Calculate Totals
    let totalItems = 0;
    let totalPrice = 0;
    let totalMrp = 0;
    const FEE_PER_ITEM = 9;

    cart.forEach(item => {
        const qty = item.quantity;
        const price = item.price;
        // Mock MRP: 40-70% higher than price to show good discount
        const mrp = item.mrp || Math.round(price * 1.6);

        totalItems += qty;
        totalPrice += price * qty;
        totalMrp += mrp * qty;
    });

    const totalFees = FEE_PER_ITEM * totalItems; // Or just one flat fee. "Fees 9" suggests flat.
    // Let's go with Flat Fee for simplicity or per item. 
    // Image shows "+ 9 Protect Promise Fee" adjacent to product.
    // I will use totalFees in summary.

    const discount = totalMrp - totalPrice;
    const finalAmount = totalPrice + totalFees;

    // Render Items
    cartItemsList.innerHTML = cart.map(item => {
        const mrp = item.mrp || Math.round(item.price * 1.6);
        const discountPercent = Math.round(((mrp - item.price) / mrp) * 100);

        return `
        <div class="cart-item-mobile">
            <div class="item-main">
                <div class="item-img-col">
                    <img src="${item.image_url || 'https://via.placeholder.com/150'}" alt="${item.name}">
                </div>
                <div class="item-info-col">
                    <div class="item-title">${item.name}</div>
                    <div class="item-variant">Standard Delivery</div>
                    <div class="item-rating-check" style="display:flex; align-items:center; gap:5px; font-size:0.8rem; color:#878787; margin-bottom: 4px;">
                         <span class="item-rating-badge">4.2 ★</span> (2,341)
                    </div>
                    <div class="price-block">
                        <span class="price-discount">↓${discountPercent}%</span>
                        <span class="price-mrp">₹${mrp}</span>
                        <span class="price-final">₹${item.price}</span>
                    </div>
                    <div class="item-fees">+ ₹${FEE_PER_ITEM} Secured Packaging Fee</div>
                </div>
            </div>
            <div class="item-actions">
                <div class="qty-btn-group">
                    <button class="qty-control-btn" onclick="updateQty('${item.id}', -1)">-</button>
                    <input type="number" class="qty-display" value="${item.quantity}" onchange="setQty('${item.id}', this.value)">
                    <button class="qty-control-btn" onclick="updateQty('${item.id}', 1)">+</button>
                </div>
                <button class="action-btn remove" onclick="removeItem('${item.id}')">
                   Remove
                </button>
            </div>
        </div>
    `;
    }).join('');

    // Render Price Details
    if (priceDetailsSection) {
        priceDetailsSection.innerHTML = `
            <div class="price-header">Price Details</div>
            <div class="price-row">
                <span>MRP (${totalItems} items)</span>
                <span>₹${totalMrp}</span>
            </div>
             <div class="price-row">
                <span>Discount</span>
                <span class="discount-text">- ₹${discount}</span>
            </div>
             <div class="price-row">
                <span>Delivery Fee</span>
                <span class="discount-text">FREE</span>
            </div>
             <div class="price-row">
                <span>Secured Packaging Fee</span>
                <span>₹${totalFees}</span>
            </div>
            <div class="price-row total">
                <span>Total Amount</span>
                <span>₹${finalAmount}</span>
            </div>
            <div class="savings-banner">
                 You will save ₹${discount} on this order
            </div>
        `;
    }

    // Update Footer
    const footerOldPrice = document.getElementById('footer-old-price');
    const footerTotalPrice = document.getElementById('footer-total-price');
    if (footerOldPrice) footerOldPrice.innerText = `₹${totalMrp + totalFees}`;
    if (footerTotalPrice) footerTotalPrice.innerText = `₹${finalAmount}`;
}

window.updateQty = function (id, change) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) {
            cart[itemIndex].quantity = 1;
        }
        setCart(cart);
        renderCart();
    }
};

// Handle direct input change
window.setQty = function (id, value) {
    let qty = parseInt(value);
    if (isNaN(qty) || qty < 1) {
        qty = 1;
    }

    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity = qty;
        setCart(cart);
        // We re-render to ensure totals update and input reflects valid state
        renderCart();
    }
};

window.removeItem = function (id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    setCart(cart);
    renderCart();
};

function openCheckoutModal() {
    const cart = getCart();
    if (cart.length === 0) return;

    const modalSummary = document.getElementById('modal-product-summary');
    const finalQuantityInput = document.getElementById('final-quantity');

    // Summarize
    const productNames = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

    modalSummary.innerText = `Ordering: ${productNames}`;
    finalQuantityInput.value = totalQty;

    checkoutModal.style.display = 'block';
}

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    const cart = getCart();
    // Prepare message
    // Product: {{product_name}}
    // Quantity: {{quantity}}

    // Concatenating multiple products into the format
    let productString = "";
    let quantityString = "";

    cart.forEach((item, index) => {
        productString += `${item.name}`;
        quantityString += `${item.quantity}`;
        if (index < cart.length - 1) {
            productString += ", ";
            quantityString += ", ";
        }
    });

    const message = `Hello Noorvi,

Name: ${name}
Phone: ${phone}
Address: ${address}

Product: ${productString}
Quantity: ${quantityString}

Please confirm availability.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917900127488?text=${encodedMessage}`;

    // Clear cart or keep it? Usually clear after order placed.
    // Spec doesn't strictly say, but clearing makes sense.
    // However, since it's just WhatsApp redirection, maybe user wants to adjust if they come back.
    // I'll clear it for a better "placed" experience.
    localStorage.removeItem('notification_cart');

    window.location.href = whatsappUrl;
}
