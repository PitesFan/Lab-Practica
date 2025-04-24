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

  cartItemsContainer.innerHTML = "";

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
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productIndex = cart.findIndex((item) => item.id === id);
  if (productIndex !== -1) {
    cart[productIndex].quantity += change;
    if (cart[productIndex].quantity < 1) {
      cart.splice(productIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartPage();
    updateGlobalCartCounter();
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        { action: "updateCartCounter" },
        window.location.origin
      );
    }
  }
}

function removeItemFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartPage();
  updateGlobalCartCounter();
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(
      { action: "updateCartCounter" },
      window.location.origin
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
  updateGlobalCartCounter();
});
