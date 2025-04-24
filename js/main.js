let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateGlobalCartCounter() {
  const cartCounterElements = document.querySelectorAll(".icon-cart span");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounterElements.forEach((element) => {
    element.textContent = totalItems;
  });
}

window.addEventListener("message", function (event) {
  if (
    event.origin === window.location.origin &&
    event.data &&
    event.data.action === "updateCartCounter"
  ) {
    updateGlobalCartCounter();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateGlobalCartCounter();
});

const navLinks = document.querySelector("#navLinks");
const navToggleBtn = document.querySelector("#navToggleBtn");

navToggleBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
