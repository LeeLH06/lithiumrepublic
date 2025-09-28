// Lithium Republic Website Functionality

// Cart array to store items
let cart = [];

// DOM elements
const header = document.querySelector('header');
const body = document.querySelector('body');
const logoContainer = document.querySelector('.logo-container');
const logoText = document.querySelector('.logo-text');
const mainNav = document.querySelector('.main-nav');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cart-total-amount');
const cartNotification = document.getElementById('cartNotification');
const notificationText = document.getElementById('notification-text');
const checkoutButton = document.querySelector('.checkout-btn');
const cartSection = document.querySelector('.cart-section');
const ctaButton = document.querySelector('.cta-button');
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupEventListeners();
    setupScrollEffects();
    updateCartDisplay();
});

// Initialize cart from localStorage if available
function initializeCart() {
    const savedCart = localStorage.getItem('lithiumRepublicCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Add to cart buttons
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const product = this.getAttribute('data-product');
                const price = parseFloat(this.getAttribute('data-price'));
                
                addToCart(product, price);
                showNotification(`${product} added to cart!`);
                updateCartDisplay();
            });
        });
    }
    
    // Checkout button
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty. Please add items before checking out.');
            } else {
                // In a real application, this would redirect to the checkout page
                window.location.href = 'checkout.html';
            }
        });
    }
    
    // CTA button
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            document.querySelector('.products-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
    // Mobile navigation toggle
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Close mobile nav when clicking on a link
    if (mainNav) {
        mainNav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                this.classList.remove('active');
                if (mobileNavToggle) {
                    mobileNavToggle.classList.remove('active');
                }
            }
        });
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (mainNav && mainNav.classList.contains('active') && 
            !e.target.closest('.main-nav') && 
            !e.target.closest('.mobile-nav-toggle')) {
            mainNav.classList.remove('active');
            if (mobileNavToggle) {
                mobileNavToggle.classList.remove('active');
            }
        }
    });
}

// Setup scroll effects for header
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Add scrolled class to header when user scrolls down
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
            body.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            body.classList.remove('scrolled');
        }
    });
}

// Add item to cart
function addToCart(product, price) {
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.product === product);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            price: price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('lithiumRepublicCart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
    if (notificationText && cartNotification) {
        notificationText.textContent = message;
        cartNotification.style.display = 'block';
        
        setTimeout(() => {
            cartNotification.style.display = 'none';
        }, 3000);
    }
}

// Update cart display
function updateCartDisplay() {
    if (!cartItemsList || !cartTotalElement) return;
    
    // Clear current cart items
    cartItemsList.innerHTML = '';
    
    let total = 0;
    
    // Add each item to the cart display
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        listItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-image">[Image]</div>
                <div class="cart-item-details">
                    <h4>${item.product}</h4>
                    <div class="cart-item-price">RM${item.price.toFixed(2)}</div>
                </div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-index="${index}">+</button>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
        
        cartItemsList.appendChild(listItem);
    });
    
    // Add event listeners to quantity and remove buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            decreaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            increaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
    
    // Update total
    cartTotalElement.textContent = `RM${total.toFixed(2)}`;
    
    // Show or hide cart section based on cart contents
    if (cartSection) {
        if (cart.length === 0) {
            cartSection.style.display = 'none';
        } else {
            cartSection.style.display = 'block';
        }
    }
    
    // Update cart count in navigation if it exists
    updateCartCount();
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
    
    // If we're on the cart page, update the document title
    if (window.location.pathname.includes('cart.html') && totalItems > 0) {
        document.title = `Cart (${totalItems}) - Lithium Republic`;
    }
}

// Increase item quantity
function increaseQuantity(index) {
    if (cart[index]) {
        cart[index].quantity += 1;
        localStorage.setItem('lithiumRepublicCart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Decrease item quantity
function decreaseQuantity(index) {
    if (cart[index]) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem('lithiumRepublicCart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Remove item from cart
function removeFromCart(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('lithiumRepublicCart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('Item removed from cart');
    }
}

// Clear cart (for checkout completion)
function clearCart() {
    cart = [];
    localStorage.removeItem('lithiumRepublicCart');
    updateCartDisplay();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});