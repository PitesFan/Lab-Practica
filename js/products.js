// js/products.js
const productContainer = document.querySelector(".product-cards");

async function fetchProducts() {
  const res = await fetch("../data/products.json");
  const products = await res.json();
  if (productContainer) {
    displayProducts(products);
  }
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
    card.dataset.productId = product.id;
    productContainer.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = parseInt(btn.dataset.id);
      addToCart(id); // Apelăm funcția globală addToCart
    });
  });

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const productId = parseInt(card.dataset.productId);
      fetch("../data/products.json")
        .then((response) => response.json())
        .then((products) => {
          const selectedProduct = products.find(
            (product) => product.id === productId
          );
          if (selectedProduct) {
            generateAndOpenProductPage(selectedProduct);
          }
        });
    });
  });
}

function generateAndOpenProductPage(product) {
  const productDetailsURL = `product-details.html?id=${product.id}`;
  window.open(productDetailsURL, "_blank");
}

function addToCart(id) {
  fetch("../data/products.json")
    .then((response) => response.json())
    .then((products) => {
      const productToAdd = products.find((p) => p.id === id);
      const existing = cart.find((item) => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else if (productToAdd) {
        cart.push({ ...productToAdd, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateGlobalCartCounter(); // Actualizăm contorul global
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});
