// Apni Render App ka URL yahan replace karein
const API_URL = "https://savoria-restaurant-api.onrender.com";

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchMenu();

  // Reservation Form Handling
  const resForm = document.getElementById("reservationForm");
  if (resForm) {
    resForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const reservationData = {
        name: document.getElementById("resName").value,
        phone: document.getElementById("resPhone").value,
        date: document.getElementById("resDate").value,
        time: document.getElementById("resTime").value,
        guests: document.getElementById("resGuests").value
      };

      try {
        const response = await fetch(`${API_URL}/api/reserve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservationData)
        });

        const result = await response.json();
        if (result.success) {
          alert(`Table Reserved Successfully! Your ID: #${result.reservationId}`);
          resForm.reset();
        } else {
          alert("Error: " + result.message);
        }
      } catch (err) {
        alert("Server error, please try again later.");
      }
    });
  }
});

// Backend se live menu items fetch karna
async function fetchMenu() {
  const menuContainer = document.getElementById("menuItems");
  if (!menuContainer) return;

  try {
    const response = await fetch(`${API_URL}/api/menu`);
    const result = await response.json();

    if (result.success) {
      menuContainer.innerHTML = result.data.map(item => `
        <div class="card">
          <img src="${item.image}" alt="${item.name}">
          <div class="card-body">
            <h3>${item.name}</h3>
            <p style="color: var(--primary); font-weight:bold; margin: 10px 0;">$${item.price.toFixed(2)}</p>
            <button class="btn-primary" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add to Order</button>
          </div>
        </div>
      `).join("");
    }
  } catch (err) {
    menuContainer.innerHTML = "<p>Failed to load menu from server.</p>";
  }
}

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.innerText = cart.length;
  alert(`${name} added to cart!`);
}
