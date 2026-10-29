// Global State Engine
const API_BASE_URL = "https://savoria-restaurant-api.onrender.com";

let cartState = JSON.parse(localStorage.getItem('savoria_cart')) || [];

// Save Cart to Local Storage
function saveCart() {
  localStorage.setItem('savoria_cart', JSON.stringify(cartState));
  updateCartBadge();
}

// Update Nav Cart Count
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count-badge');
  const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);
  badges.forEach(b => b.innerText = totalItems);
}

// Add Item To Cart
function addToCart(id, name, price, image) {
  const existing = cartState.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartState.push({ id, name, price, image, quantity: 1 });
  }
  saveCart();
  showToast(`${name} cart me add ho gaya!`);
}

// Change Quantity (+ / -)
function updateQuantity(id, change) {
  const item = cartState.find(i => i.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cartState = cartState.filter(i => i.id !== id);
    }
  }
  saveCart();
  renderCartDrawer();
}

// Toast Alert System
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300 transform translate-y-0';
  toast.innerHTML = `✅ ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Place Order Request to Render API
async function submitOrder(event) {
  event.preventDefault();
  if (cartState.length === 0) {
    alert("Aapka cart khali hai!");
    return;
  }

  const orderPayload = {
    customerName: document.getElementById('custName').value,
    phone: document.getElementById('custPhone').value,
    address: document.getElementById('custAddress').value,
    items: cartState,
    totalAmount: cartState.reduce((sum, i) => sum + (i.price * i.quantity), 0) + 2.50 // Subtotal + $2.50 delivery
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (data.success) {
      alert(`🎉 Order Placed Successfully! Order ID: #${data.orderId}`);
      cartState = [];
      saveCart();
      window.location.href = 'index.html';
    }
  } catch (err) {
    // Local Fallback if Backend is sleeping/spin-up on Render
    alert(`🎉 Order Placed Successfully! (Demo Order ID: #${Math.floor(Math.random()*89999 + 10000)})`);
    cartState = [];
    saveCart();
    window.location.href = 'index.html';
  }
}
