// Cart array
let cart = [];

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const subtotal = document.getElementById('subtotal');
const total = document.getElementById('total');

// IMPORTANT: Django cards ke buttons ko select karna
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Cart open/close
    if (cartIcon) cartIcon.addEventListener('click', openCart);
    if (closeCart) closeCart.addEventListener('click', closeCartModal);
    if (overlay) overlay.addEventListener('click', closeCartModal);

    // Add to cart buttons (Django generated cards)
    document.querySelectorAll('.add-to-cart').forEach((button, index) => {
        button.addEventListener('click', () => {
            const card = button.closest('.food-card');

            const name = card.querySelector('.food-title').innerText;
            const price = parseInt(card.querySelector('.food-price').innerText.replace('₹', ''));
            const image = card.querySelector('.food-img').src;

            addToCart({ id: index + 1, name, price, image });
        });
    });
}

// Open cart
function openCart() {
    if (cartModal) cartModal.classList.add('active');
    if (overlay) overlay.classList.add('active');
    renderCartItems();
}

// Close cart
function closeCartModal() {
    if (cartModal) cartModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// Add to cart
function addToCart(item) {
    const existingItem = cart.find(i => i.name === item.name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartCount();
    renderCartItems();
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = count;
    }
}

// Render cart items
function renderCartItems() {
    if (!cartItems || !subtotal || !total) return;

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center;padding:20px;">Your cart is empty</p>';
        subtotal.textContent = '₹0.00';
        total.textContent = '₹40.00';

        // checkout page ke liye total save
        localStorage.setItem('cartTotal', 40);
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';

        div.innerHTML = `
            <img src="${item.image}" class="cart-item-img" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price * item.quantity}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
        `;

        cartItems.appendChild(div);
    });

    // Quantity buttons
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.index), -1));
    });

    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.index), 1));
    });

    // Total calculation
    const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const grandTotal = sub + 40;

    subtotal.textContent = `₹${sub.toFixed(2)}`;
    total.textContent = `₹${grandTotal.toFixed(2)}`;

    // checkout page ke liye total save
    localStorage.setItem('cartTotal', grandTotal);
}

// Update quantity
function updateQuantity(index, change) {
    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCartCount();
    renderCartItems();
}