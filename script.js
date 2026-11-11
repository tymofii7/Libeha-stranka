const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const cartButton = document.querySelector(".cart-button");
const cartCount = document.querySelector(".cart-count");
const toast = document.querySelector(".toast");
const newsletter = document.querySelector(".newsletter");

let cartItems = [];
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Otvoriť navigáciu" : "Zavrieť navigáciu");
  mainNav.classList.toggle("is-open", !isExpanded);
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Otvoriť navigáciu");
    mainNav.classList.remove("is-open");
  }
});

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    cartItems.push({
      name: button.dataset.product,
      price: Number(button.dataset.price),
    });
    cartCount.textContent = String(cartItems.length);
    cartButton.setAttribute("aria-label", `Košík, ${cartItems.length} položiek`);
    showToast(`${button.dataset.product} bol pridaný do košíka.`);
  });
});

cartButton.addEventListener("click", () => {
  if (cartItems.length === 0) {
    showToast("Váš košík je zatiaľ prázdny.");
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const itemLabel = cartItems.length === 1 ? "rám" : "rámy";
  showToast(`V košíku: ${cartItems.length} ${itemLabel} · spolu ${new Intl.NumberFormat("sk-SK").format(total)} €`);
});

newsletter.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Prihlasovanie na odber zatiaľ nie je aktívne.");
});
