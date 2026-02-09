console.log("SCRIPT LOADED");

const API = "http://localhost:7000/api/products";

async function loadProducts() {
  try {
    const res = await fetch(API);
    const products = await res.json();

    const container = document.getElementById("products");
    container.innerHTML = "";

    if (products.length === 0) {
      container.innerHTML = "<p>No products found</p>";
      return;
    }

    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";

      // 🔹 Determine price status
      let statusText = "➖ Stable Price";
      let statusColor = "#b0b0b0";

      if (p.currentPrice > p.basePrice) {
        statusText = "🔺 Increased (Low Stock)";
        statusColor = "#ff6b6b";
      } else if (p.currentPrice < p.basePrice) {
        statusText = "🔻 Decreased (High Stock)";
        statusColor = "#4cd964";
      }

      div.innerHTML = `
        <strong>${p.productName}</strong><br>
        Base Price: ₹${p.basePrice}<br>
        Stock: ${p.stockQuantity}<br>
        <strong style="color:${statusColor}">
          Current Price: ₹${p.currentPrice}
        </strong><br>
        <span style="color:${statusColor}; font-size: 0.9rem;">
          ${statusText}
        </span>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading products:", err);
  }
}

async function addProduct() {
  const productName = document.getElementById("name").value;
  const basePrice = document.getElementById("price").value;
  const stockQuantity = document.getElementById("stock").value;

  if (!productName || !basePrice || !stockQuantity) {
    alert("Please fill all fields");
    return;
  }

  await fetch(`${API}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productName, basePrice, stockQuantity })
  });

  // Clear inputs
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";

  loadProducts();
}
