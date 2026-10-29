// Sample Local Menu Data (Will connect to Render Backend later)
const menuItems = [
  { id: 1, name: "Gourmet Beef Burger", price: 12.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Margherita Pizza", price: 14.50, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Creamy Alfredo Pasta", price: 11.00, image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281216?auto=format&fit=crop&w=500&q=80" }
];

let cart = [];

// Load Menu Dynamic Rendering
document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menuItems");
  if(menuContainer) {
    menuContainer.innerHTML = menuItems.map(item => `
      <div class="card">
        <img src="${item.image}" alt="${item.name}">
        <div class="card-body">
          <h3>${item.name}</h3>
          <p style="color: var(--primary); font-weight:bold; margin: 10px 0;">$${item.price.toFixed(2)}</p>
          <button class="btn-primary" onclick="addToCart(${item.id})">Add to Order</button>
        </div>
      </div>
    `).join("");
  }

  // Reservation Handler
  const resForm = document.getElementById("reservationForm");
  if(resForm) {
    resForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Table Reservation Request Submitted! Connecting with Backend...");
    });
  }
});

function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  cart.push(item);
  const cartCount = document.getElementById("cartCount");
  if(cartCount) cartCount.innerText = cart.length;
  alert(`${item.name} added to cart!`);
}
