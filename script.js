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
    const quantityInput = document.querySelector("#product-quantity");
    const quantity = quantityInput ? Math.max(1, Number(quantityInput.value) || 1) : 1;
    for (let item = 0; item < quantity; item += 1) {
      cartItems.push({
        name: button.dataset.product,
        price: Number(button.dataset.price),
      });
    }
    cartCount.textContent = String(cartItems.length);
    cartButton.setAttribute("aria-label", `Košík, ${cartItems.length} položiek`);
    showToast(`${button.dataset.product}${quantity > 1 ? ` (${quantity} ks)` : ""} bol pridaný do košíka.`);
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

const productDetails = {
  rider: {
    name: 'Rider 26" DJ Frame',
    price: 999,
    image: "docs/Rider 26 DJ Frame.png",
    description: "Agilný rám pre dirt jump a každodenné jazdenie. Ľahký, pevný a pripravený na veľké skoky aj každodenné tréningy.",
    type: "Dirt jump",
    wheels: '26"',
    availability: "in-stock",
  },
  urban: {
    name: 'Urban 24" Street Frame',
    price: 1099,
    image: "docs/urban.png",
    description: "Kompaktný streetový rám pre hravú jazdu v meste. Nízke ťažisko a pevná konštrukcia pre technické triky.",
    type: "Street",
    wheels: '24"',
    availability: "in-stock",
  },
  custom: {
    name: "Custom DJ Frame",
    price: 1500,
    image: "docs/custom.png",
    description: "Vlastná geometria navrhnutá presne pre váš štýl jazdy. Vyberte si základné parametre alebo si zostavu upravte v konfigurátore.",
    type: "Dirt jump na mieru",
    wheels: "Podľa výberu",
    availability: "made-to-order",
  },
  pro: {
    name: 'Pro 26" Slopestyle Frame',
    price: 1250,
    image: "docs/pro.png",
    description: "Pevná a vyvážená platforma na veľké skoky. Navrhnutá pre jazdcov, ktorí chcú istotu pri slopestyle jazde.",
    type: "Slopestyle",
    wheels: '26"',
    availability: "in-stock",
  },
};

const productName = document.querySelector("#product-name");
if (productName) {
  const selectedProduct = productDetails[new URLSearchParams(window.location.search).get("model")] || productDetails.rider;
  const detailImage = document.querySelector("#detail-image");
  const detailImageWrap = document.querySelector("#detail-image-wrap");
  const productPrice = document.querySelector("#product-price");
  const productDescription = document.querySelector("#product-description");
  const cartAddButton = document.querySelector(".detail-add");
  const currency = new Intl.NumberFormat("sk-SK");

  productName.textContent = selectedProduct.name;
  document.querySelector("#breadcrumb-product").textContent = selectedProduct.name;
  document.title = `${selectedProduct.name} — Tdj`;
  detailImage.src = selectedProduct.image;
  detailImage.alt = `${selectedProduct.name} — titánový rám`;
  productDescription.textContent = selectedProduct.description;
  document.querySelector("#product-specs div:nth-child(2) b").textContent = selectedProduct.type;
  document.querySelector("#product-specs div:nth-child(3) b").textContent = selectedProduct.wheels;
  cartAddButton.dataset.product = selectedProduct.name;
  if (selectedProduct.availability === "made-to-order") {
    document.querySelector("#detail-availability").innerHTML = "<i></i> NA OBJEDNÁVKU";
    document.querySelector("#detail-availability").classList.add("availability-order");
    document.querySelector("#detail-stock").innerHTML = "<i></i> Vyrobíme na mieru — termín potvrdíme pri objednávke";
    document.querySelector("#detail-stock").classList.add("stock-order");
  }

  const updateProductPrice = () => {
    const selectedFinish = document.querySelector(".finish-option.is-selected");
    const finishExtra = Number(selectedFinish.dataset.extra);
    const quantity = Math.max(1, Number(document.querySelector("#product-quantity").value) || 1);
    const total = (selectedProduct.price + finishExtra) * quantity;
    productPrice.innerHTML = `${currency.format(selectedProduct.price + finishExtra)} <small>€</small>${quantity > 1 ? `<span class="quantity-total"> · spolu ${currency.format(total)} €</span>` : ""}`;
    cartAddButton.dataset.price = String(selectedProduct.price + finishExtra);
    cartAddButton.dataset.product = `${selectedProduct.name} · ${document.querySelector(".size-options .is-selected").dataset.size} · ${selectedFinish.dataset.finish}`;
    detailImageWrap.classList.toggle("is-dark-finish", finishExtra > 0);
  };

  document.querySelectorAll(".gallery-thumb").forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      document.querySelector(".gallery-thumb.is-selected").classList.remove("is-selected");
      thumbnail.classList.add("is-selected");
      detailImage.src = thumbnail.dataset.image;
      detailImage.alt = thumbnail.dataset.alt;
    });
  });

  document.querySelectorAll(".size-options button").forEach((button) => {
    button.addEventListener("click", () => {
      const currentSize = document.querySelector(".size-options .is-selected");
      currentSize.classList.remove("is-selected");
      currentSize.setAttribute("aria-pressed", "false");
      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");
      document.querySelector("#selected-size").textContent = `— ${button.dataset.size}`;
      updateProductPrice();
    });
  });

  document.querySelectorAll(".finish-option").forEach((button) => {
    button.addEventListener("click", () => {
      const currentFinish = document.querySelector(".finish-option.is-selected");
      currentFinish.classList.remove("is-selected");
      currentFinish.setAttribute("aria-pressed", "false");
      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");
      document.querySelector("#selected-finish").textContent = `— ${button.dataset.finish}`;
      updateProductPrice();
    });
  });

  document.querySelectorAll("[data-quantity]").forEach((button) => {
    button.addEventListener("click", () => {
      const quantityInput = document.querySelector("#product-quantity");
      quantityInput.value = String(Math.min(10, Math.max(1, Number(quantityInput.value) + Number(button.dataset.quantity))));
      updateProductPrice();
    });
  });
  document.querySelector("#product-quantity").addEventListener("change", (event) => {
    event.target.value = String(Math.min(10, Math.max(1, Number(event.target.value) || 1)));
    updateProductPrice();
  });

  const thumbnails = document.querySelectorAll(".gallery-thumb");
  if (selectedProduct.name !== productDetails.rider.name) {
    thumbnails[1].hidden = true;
    thumbnails[0].querySelector("img").src = selectedProduct.image;
  }
  updateProductPrice();
}

const configForm = document.querySelector("#config-form");
if (configForm) {
  const wheelSize = document.querySelector("#wheel-size");
  const reach = document.querySelector("#reach");
  const chainstay = document.querySelector("#chainstay");
  const headAngle = document.querySelector("#head-angle");
  const currency = new Intl.NumberFormat("sk-SK");
  const configAddButton = document.querySelector(".config-add");
  const frameStroke = document.querySelectorAll(".preview-frame line");

  try {
    const storedConfiguration = window.sessionStorage.getItem("tdj-frame-config");
    if (storedConfiguration) {
      const saved = JSON.parse(storedConfiguration);
      const savedReach = Number(saved?.reach);
      const savedChainstay = Number(saved?.chainstay);
      const savedHeadAngle = Number(saved?.headAngle);
      const validConfiguration = saved
        && ["24", "26"].includes(String(saved.wheelSize))
        && Number.isInteger(savedReach) && savedReach >= 400 && savedReach <= 430
        && Number.isInteger(savedChainstay) && savedChainstay >= 380 && savedChainstay <= 410
        && Number.isInteger(savedHeadAngle) && savedHeadAngle >= 68 && savedHeadAngle <= 71
        && ["natural", "dark"].includes(saved.finish);
      if (validConfiguration) {
        wheelSize.value = String(saved.wheelSize);
        reach.value = String(savedReach);
        chainstay.value = String(savedChainstay);
        headAngle.value = String(savedHeadAngle);
        document.querySelector(`input[name="config-finish"][value="${saved.finish}"]`).checked = true;
      } else {
        showToast("Uložená zostava nemá platné nastavenia.");
      }
    }
  } catch {
    showToast("Uloženú zostavu sa nepodarilo načítať.");
  }

  const updateConfiguration = () => {
    const reachValue = Number(reach.value);
    const chainstayValue = Number(chainstay.value);
    const angleValue = Number(headAngle.value);
    const finishExtra = Number(document.querySelector('input[name="config-finish"]:checked').dataset.price);
    const basePrice = 1500 + (wheelSize.value === "24" ? 50 : 0);
    const price = basePrice + finishExtra;

    document.querySelector("#reach-value").textContent = `${reachValue} mm`;
    document.querySelector("#chainstay-value").textContent = `${chainstayValue} mm`;
    document.querySelector("#head-angle-value").textContent = `${angleValue}°`;
    document.querySelector("#preview-size").textContent = `${wheelSize.value}" ${wheelSize.value === "24" ? "Street" : "DJ"}`;
    document.querySelector("#config-price").innerHTML = `${currency.format(price)} <small>€</small>`;
    configAddButton.dataset.price = String(price);
    configAddButton.dataset.product = `Custom ${wheelSize.value}" ${wheelSize.value === "24" ? "Street" : "DJ"} Frame`;

    const rearX = 56 + (chainstayValue - 380) * 1.25;
    const headX = 280 + (reachValue - 400) * 2;
    const headBottomX = headX + Math.tan((90 - angleValue) * Math.PI / 180) * 75;
    const frontX = headBottomX + 30;
    const wheelRadius = wheelSize.value === "24" ? 45 : 53;
    const framePoints = {
      "rear-wheel": [rearX, 210],
      "rear-hub": [rearX, 210],
      "front-wheel": [frontX, 210],
      "front-hub": [frontX, 210],
      "seat-tube": [190, 70, 170, 205],
      "top-tube": [190, 70, headX, 70],
      "down-tube": [170, 205, headBottomX, 145],
      "head-tube": [headX, 70, headBottomX, 145],
      "chainstay": [rearX, 210, 170, 205],
      "seatstay": [rearX, 210, 190, 70],
      "fork": [headBottomX, 145, frontX, 210],
    };
    Object.entries(framePoints).forEach(([id, values]) => {
      const element = document.querySelector(`#${id}`);
      if (id.includes("wheel") || id.includes("hub")) {
        element.setAttribute("cx", String(values[0]));
        if (id.includes("wheel")) {
          element.setAttribute("r", String(wheelRadius));
        }
      } else {
        element.setAttribute("x1", String(values[0]));
        element.setAttribute("y1", String(values[1]));
        element.setAttribute("x2", String(values[2]));
        element.setAttribute("y2", String(values[3]));
      }
    });
    document.querySelector("#svg-reach-label").setAttribute("x", String((190 + headX) / 2 - 25));
    document.querySelector("#svg-reach-label").textContent = `${reachValue} mm reach`;
    document.querySelector("#svg-chain-label").setAttribute("x", String(rearX + 5));
    document.querySelector("#svg-chain-label").textContent = `${chainstayValue} mm zadná stavba`;
    frameStroke.forEach((line) => line.setAttribute("stroke", document.querySelector('input[name="config-finish"]:checked').value === "dark" ? "#77746c" : "#b9a879"));
  };

  configForm.addEventListener("input", updateConfiguration);
  configForm.addEventListener("change", updateConfiguration);
  document.querySelector(".config-save").addEventListener("click", () => {
    const savedConfiguration = {
      wheelSize: wheelSize.value,
      reach: reach.value,
      chainstay: chainstay.value,
      headAngle: headAngle.value,
      finish: document.querySelector('input[name="config-finish"]:checked').value,
    };
    try {
      window.sessionStorage.setItem("tdj-frame-config", JSON.stringify(savedConfiguration));
      showToast("Zostava bola uložená v tomto prehliadači.");
    } catch {
      showToast("Zostavu sa nepodarilo uložiť. Skúste to znova.");
    }
  });
  updateConfiguration();
}
