/**
 * ============================================
 * SAVORIA - Global Application JavaScript
 * Rehmat Developers | Lead: Muhammad Waleed
 * ============================================
 */

// ===== Constants =====
const API_BASE = 'https://savoria-restaurant-api.onrender.com';

// ===== Navbar Scroll Effect =====
(function() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });
})();

// ===== Mobile Navigation =====
(function() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
})();

// ===== Operating Status =====
(function() {
    const statusEl = document.getElementById('operatingStatus');
    if (!statusEl) return;
    
    function updateStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour + minute / 60;
        
        let isOpen = false;
        
        if (day >= 1 && day <= 5) {
            // Mon-Fri: 11AM - 11PM
            isOpen = currentTime >= 11 && currentTime < 23;
        } else if (day === 6) {
            // Saturday: 10AM - 12AM
            isOpen = currentTime >= 10;
        } else if (day === 0) {
            // Sunday: 12PM - 10PM
            isOpen = currentTime >= 12 && currentTime < 22;
        }
        
        const dot = statusEl.querySelector('.status-dot');
        const text = statusEl.querySelector('.status-text');
        
        if (isOpen) {
            statusEl.classList.remove('closed');
            text.textContent = 'Open Now';
        } else {
            statusEl.classList.add('closed');
            text.textContent = 'Closed';
        }
    }
    
    updateStatus();
    setInterval(updateStatus, 60000);
})();

// ===== Cart Management =====
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('savoria_cart') || '[]');
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('savoria_cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDrawer();
}

function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    saveCart(cart);
    showToast(`${item.name} added to cart!`, 'success');
    
    // Show cart drawer briefly
    openCartDrawer();
    setTimeout(closeCartDrawer, 2000);
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const countEls = document.querySelectorAll('#cartCount, .cart-count');
    countEls.forEach(el => {
        el.textContent = count;
        if (count > 0) {
            el.style.display = 'flex';
        } else {
            el.style.display = count > 0 ? 'flex' : 'flex'; // Always show
        }
    });
}

// ===== Cart Drawer =====
function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    updateCartDrawer();
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

function updateCartDrawer() {
    const body = document.getElementById('cartDrawerBody');
    const subtotalEl = document.getElementById('drawerSubtotal');
    if (!body) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        body.innerHTML = '<div class="cart-empty-msg"><span>🛒</span>Your cart is empty</div>';
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        return;
    }
    
    body.innerHTML = cart.map(item => `
        <div class="cart-drawer-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-drawer-item-info">
                <h4>${item.name}</h4>
                <span>$${item.price.toFixed(2)} × ${item.qty}</span>
            </div>
            <strong style="color: var(--accent-gold); font-size: 0.9rem;">$${(item.price * item.qty).toFixed(2)}</strong>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Cart Drawer Event Listeners
(function() {
    const closeBtn = document.getElementById('cartDrawerClose');
    const overlay = document.getElementById('cartOverlay');
    const cartBtn = document.getElementById('cartBtn');
    
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (overlay) overlay.addEventListener('click', closeCartDrawer);
    
    // Make cart button open drawer on non-checkout pages
    if (cartBtn && !window.location.pathname.includes('checkout')) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    }
})();

// ===== Toast Notification System =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// ===== Smooth Scroll for Internal Links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDrawer();
});

// Update cart count on page load
updateCartCount();
