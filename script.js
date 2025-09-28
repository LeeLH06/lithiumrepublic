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
const mobileNavToggle = document.createElement('button');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupEventListeners();
    setupScrollEffects();
    createMobileNavToggle();
});

// Create mobile navigation toggle for small screens
function createMobileNavToggle() {
    // Only create toggle for mobile screens
    if (window.innerWidth <= 768) {
        mobileNavToggle.innerHTML = '☰';
        mobileNavToggle.className = 'mobile-nav-toggle';
        document.querySelector('.header-container').appendChild(mobileNavToggle);
        
        mobileNavToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
}

// Initialize cart from localStorage if available
function initializeCart() {
    const savedCart = localStorage.getItem('lithiumRepublicCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Set up event listeners
function setupEventListeners() {
    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(product, price);
            showNotification(`${product} added to cart!`);
            updateCartDisplay();
        });
    });
    
    // Checkout button
    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty. Please add items before checking out.');
        } else {
            // In a real application, this would redirect to the checkout page
            showNotification('Proceeding to checkout!');
            // Save cart to localStorage before redirecting
            localStorage.setItem('lithiumRepublicCart', JSON.stringify(cart));
            // Redirect would happen here: window.location.href = 'checkout.html';
        }
    });
    
    // CTA button
    ctaButton.addEventListener('click', function() {
        document.querySelector('.products-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    // Close mobile nav when clicking on a link
    if (mainNav) {
        mainNav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && window.innerWidth <= 768) {
                mainNav.classList.remove('active');
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Remove mobile toggle if we're no longer on mobile
        if (window.innerWidth > 768 && document.querySelector('.mobile-nav-toggle')) {
            document.querySelector('.mobile-nav-toggle').remove();
        }
        // Add mobile toggle if we're now on mobile
        else if (window.innerWidth <= 768 && !document.querySelector('.mobile-nav-toggle')) {
            createMobileNavToggle();
        }
    });
}

// Setup scroll effects for header
function setupScrollEffects() {
    let lastScrollY = window.scrollY;
    
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
        
        // Hide mobile nav on scroll
        if (Math.abs(scrollPosition - lastScrollY) > 10 && window.innerWidth <= 768) {
            mainNav.classList.remove('active');
        }
        
        lastScrollY = scrollPosition;
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
    notificationText.textContent = message;
    cartNotification.style.display = 'block';
    
    setTimeout(() => {
        cartNotification.style.display = 'none';
    }, 3000);
}

// Update cart display
function updateCartDisplay() {
    // Clear current cart items
    cartItemsList.innerHTML = '';
    
    let total = 0;
    
    // Add each item to the cart display
    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        listItem.innerHTML = `
            <span>${item.product} (x${item.quantity})</span>
            <span>RM${itemTotal.toFixed(2)}</span>
        `;
        
        cartItemsList.appendChild(listItem);
    });
    
    // Update total
    cartTotalElement.textContent = `RM${total.toFixed(2)}`;
    
    // Show or hide cart section based on cart contents
    if (cart.length === 0) {
        cartSection.style.display = 'none';
    } else {
        cartSection.style.display = 'block';
    }
}

// Optional: Function to clear cart (could be used in checkout process)
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

// Close mobile nav when clicking outside
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && 
        !e.target.closest('.main-nav') && 
        !e.target.closest('.mobile-nav-toggle') &&
        mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
    }
});