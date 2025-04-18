function afiseazaNumarProduseCosGlobal() {
  const cartCounterElements = document.querySelectorAll(".icon-cart span");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCounterElements.forEach((counter) => {
    if (counter) {
      counter.textContent = totalItems;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  afiseazaNumarProduseCosGlobal();
});

function addToCart(id, products) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  afiseazaNumarProduseCosGlobal();
}

function updateQuantity(id, change) {
  const productIndex = cart.findIndex((item) => item.id === id);
  if (productIndex !== -1) {
    cart[productIndex].quantity += change;
    if (cart[productIndex].quantity < 1) {
      cart.splice(productIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    afiseazaNumarProduseCosGlobal();
  }
}
