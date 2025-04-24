document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  const productDetailsContainer = document.querySelector(
    ".product-detail-page"
  );

  async function fetchProductDetails() {
    try {
      const response = await fetch("../data/products.json");
      const products = await response.json();
      const selectedProduct = products.find((p) => p.id === productId);

      if (selectedProduct && productDetailsContainer) {
        productDetailsContainer.innerHTML = `
            <section class="product-page-section">
              <div class="product-page-content light-gray-bg">
                <div class="product-page-view">
                  <h2 class="h2-text dark" id="product-name">${selectedProduct.name}</h2>
                  <div class="product-view-content">
                    <div class="product-view-image white-bg">
                      <img id="product-image" src="../${selectedProduct.image}" alt="${selectedProduct.name}" />
                    </div>
                    <div class="product-view-description dark-gray-bg">
                      <h3 class="h3-text accent" id="product-price">${selectedProduct.price} MDL</h3>
                      <button
                        type="button"
                        class="buy-now-btn button button-text white accent-bg"
                        data-id="${selectedProduct.id}"
                      >
                        <span>Cumpără acum</span>
                      </button>
                      <div class="cashback-content">
                        <p class="button-text white">Cashback</p>
                        <p class="button-text white" id="cashback">${selectedProduct.cashback} MDL</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="product-page-features">
                  <h2 class="h2-text dark">Specificații</h2>
                  <div class="product-page-features-content dark-gray-bg">
                    <h3 class="h3-text white">General</h3>
                    <div class="product-page-features-list">
                      <div class="product-page-feature">
                        <p class="light-text dark-green">Brand</p>
                        <p class="menu-text light-gray" id="brand">${selectedProduct.brand}</p>
                      </div>
                      <div class="product-page-feature">
                        <p class="light-text dark-green">Culoare</p>
                        <p class="menu-text light-gray" id="color">${selectedProduct.color}</p>
                      </div>
                      <div class="product-page-feature">
                        <p class="light-text dark-green">Greutate</p>
                        <p class="menu-text light-gray" id="weight">${selectedProduct.weight}</p>
                      </div>
                      <div class="product-page-feature">
                        <p class="light-text dark-green">Model</p>
                        <p class="menu-text light-gray" id="model">${selectedProduct.model}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `;

        const buyNowBtn = productDetailsContainer.querySelector(".buy-now-btn");
        if (buyNowBtn) {
          buyNowBtn.addEventListener("click", function () {
            const productIdToAdd = parseInt(this.dataset.id);
            addToCart(productIdToAdd); // Apelăm funcția globală addToCart
          });
        }
      } else if (productDetailsContainer) {
        productDetailsContainer.innerHTML =
          '<p class="menu-text dark-gray">Produsul nu a fost găsit.</p>';
      }
    } catch (error) {
      console.error("Eroare la încărcarea detaliilor produsului:", error);
      if (productDetailsContainer) {
        productDetailsContainer.innerHTML =
          '<p class="menu-text dark-gray">A apărut o eroare la încărcarea detaliilor produsului.</p>';
      }
    } finally {
      // Nu actualizăm contorul aici, lăsăm fereastra principală să facă asta la primirea mesajului
    }
  }

  fetchProductDetails();
});

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
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
      // Trimite un mesaj către fereastra principală pentru a actualiza contorul
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { action: "updateCartCounter" },
          window.location.origin
        );
      }
      // Actualizăm și contorul din fereastra curentă (poate fi util vizual)
      const cartCounterElements = document.querySelectorAll(".icon-cart span");
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCounterElements.forEach((element) => {
        element.textContent = totalItems;
      });
    });
}
