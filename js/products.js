let productContainer = document.querySelector(".product-cards");
let cartCounter = document.querySelector(".icon-cart span");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

async function fetchProducts() {
  const res = await fetch("../data/products.json");
  const products = await res.json();
  if (productContainer) {
    displayProducts(products);
  }
  updateCartCounter();
}

function displayProducts(products) {
  productContainer.innerHTML = "";
  productContainer.style.display = "grid";
  productContainer.style.gridTemplateColumns = "repeat(5, 1fr)";
  productContainer.style.gap = "32px";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card", "dark-gray-bg");
    card.innerHTML = `
            <div class="product-card-image light-gray-bg">
                <img src="../${product.image}" alt="${product.name}" />
            </div>
            <div class="product-card-description">
                <p id="product-name" class="button-text white">${product.name}</p>
                <div class="product-cashback">
                    <p class="regular-small-text light-gray">Cashback</p>
                    <div class="green-linear cashback" id="cashback">
                        <p class="regular-small-text dark-green">${product.cashback} MDL</p>
                    </div>
                </div>
                <div class="product-price-cart">
                    <p class="button-text white" id="product-price">${product.price} MDL</p>
                    <img src="../images/basket-card.svg" alt="add-to-cart" class="add-to-cart" data-id="${product.id}" style="cursor:pointer;" />
                </div>
            </div>
        `;
    productContainer.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      addToCart(id, products);
    });
  });
}

function addToCart(id, products) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
}

function updateCartCounter() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCounter) {
    cartCounter.textContent = totalItems;
  }
}

// ---------- CART LOGIC ----------
function renderCartPage() {
  const cartData = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.querySelector(
    ".shopping-cart-container-content"
  );
  const finalTotalPriceElement = document.querySelector(
    ".shopping-cart-product-prices .button-text.dark-green:last-child"
  );

  if (!cartItemsContainer) {
    return;
  }

  cartItemsContainer.innerHTML = ""; // Clear existing content

  if (cartData.length === 0) {
    const emptyCartMessage = document.createElement("p");
    emptyCartMessage.classList.add("menu-text", "dark-gray");
    emptyCartMessage.textContent = "Coșul este gol.";
    cartItemsContainer.appendChild(emptyCartMessage);
    if (finalTotalPriceElement) {
      finalTotalPriceElement.textContent = "0 MDL";
    }
    return;
  }

  // Afișează titlurile o singură dată
  const headerRow = document.createElement("div");
  headerRow.classList.add("shopping-cart-row", "header");
  headerRow.innerHTML = `
        <div class="product-header">
            <p class="menu-text dark-gray">Produs</p>
        </div>
        <div class="quantity-header">
            <p class="menu-text dark-gray">Cantitate</p>
        </div>
        <div class="price-header">
            <p class="menu-text dark-gray">Preț total</p>
        </div>
    `;
  cartItemsContainer.appendChild(headerRow);

  let totalCartPrice = 0;

  cartData.forEach((cartItem) => {
    const productRow = document.createElement("div");
    productRow.classList.add("shopping-cart-row", "product");
    const totalPrice = cartItem.price * cartItem.quantity;
    totalCartPrice += totalPrice;

    productRow.innerHTML = `
            <div class="product-info">
                <div class="product-image-container">
                    <img id="product-image-cart" src="../${cartItem.image}" alt="${cartItem.name}" />
                </div>
                <p class="menu-text dark-green" id="product-name">${cartItem.name}</p>
            </div>
            <div class="quantity-info">
                <div class="quantity-button white-bg">
                    <p class="menu-text dark-green dec-btn" data-id="${cartItem.id}">-</p>
                    <p class="menu-text dark-green" id="product-quantity">${cartItem.quantity}</p>
                    <p class="menu-text dark-green inc-btn" data-id="${cartItem.id}">+</p>
                </div>
            </div>
            <div class="price-info">
                <p class="menu-text dark-green" id="product-price">${totalPrice} MDL</p>
            </div>
        `;
    cartItemsContainer.appendChild(productRow);
  });

  // Afișează prețul total final o singură dată
  const pricesContainer = document.createElement("div");
  pricesContainer.classList.add("shopping-cart-container-product-prices");
  pricesContainer.innerHTML = `
        <div class="shopping-cart-product-price">
            <p class="light-text dark-gray">Livrare:</p>
            <p class="menu-text dark-green">Gratis</p>
        </div>
        <div class="shopping-cart-product-price">
            <p class="button-text dark-green">Total:</p>
            <p class="button-text dark-green" id="total-price">${totalCartPrice} MDL</p>
        </div>
    `;
  cartItemsContainer.appendChild(pricesContainer);

  // Adăugăm event listenerii pentru butoanele de incrementare și decrementare DUPĂ ce le-am creat
  document.querySelectorAll(".dec-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      updateQuantity(id, -1);
    });
  });

  document.querySelectorAll(".inc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      updateQuantity(id, 1);
    });
  });
}

function updateQuantity(id, change) {
  const productIndex = cart.findIndex((item) => item.id === id);
  if (productIndex !== -1) {
    cart[productIndex].quantity += change;
    if (cart[productIndex].quantity < 1) {
      cart.splice(productIndex, 1); // Elimină produsul dacă cantitatea devine 0
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartPage(); // Re-render the cart page to reflect changes
    updateCartCounter();
  }
}

// Rulează doar când se încarcă documentul
document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
  fetchProducts();
});
