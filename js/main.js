// js/main.js (sau inclus global în index.html)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Funcție globală pentru actualizarea contorului coșului
function updateGlobalCartCounter() {
  const cartCounterElements = document.querySelectorAll(".icon-cart span");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounterElements.forEach((element) => {
    element.textContent = totalItems;
  });
}

// Ascultă mesajele pentru a actualiza contorul
window.addEventListener("message", function (event) {
  if (
    event.origin === window.location.origin &&
    event.data &&
    event.data.action === "updateCartCounter"
  ) {
    updateGlobalCartCounter();
  }
});

// Apelăm funcția la încărcarea paginii pentru a afișa valoarea inițială
document.addEventListener("DOMContentLoaded", () => {
  updateGlobalCartCounter();
});
