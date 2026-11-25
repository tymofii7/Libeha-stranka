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
    secondImage: "img/26.jpg",
    secondImageAlt: "Rider 26 DJ Frame — druhý pohľad",
    description: "Agilný rám pre dirt jump a každodenné jazdenie. Ľahký, pevný a pripravený na veľké skoky aj každodenné tréningy.",
    type: "Dirt jump",
    wheels: '26"',
    availability: "in-stock",
  },
  urban: {
    name: 'Urban 24" Street Frame',
    price: 1099,
    image: "docs/urban.png",
    secondImage: "img/24right.png",
    secondImageAlt: "Urban 24 Street Frame — druhý pohľad",
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
    secondImage: "img/proright.png",
    secondImageAlt: "Pro 26 Slopestyle Frame — druhý pohľad",
    description: "Pevná a vyvážená platforma na veľké skoky. Navrhnutá pre jazdcov, ktorí chcú istotu pri slopestyle jazde.",
    type: "Slopestyle",
    wheels: '26"',
    availability: "in-stock",
  },
};

const productName = document.querySelector("#product-name");
if (productName) {
  const model = new URLSearchParams(window.location.search).get("model");
  const selectedProduct = productDetails[model] || productDetails.rider;
  const detailImage = document.querySelector("#detail-image");
  const detailImageWrap = document.querySelector("#detail-image-wrap");
  const galleryThumbnails = document.querySelector("#gallery-thumbnails");
  const productPrice = document.querySelector("#product-price");
  const productDescription = document.querySelector("#product-description");
  const cartAddButton = document.querySelector(".detail-add");
  const currency = new Intl.NumberFormat("sk-SK");

  detailImageWrap.classList.toggle("is-pro", model === "pro");
  detailImageWrap.classList.toggle("is-urban", model === "urban");
  detailImageWrap.classList.toggle("is-custom", model === "custom");
  productName.textContent = selectedProduct.name;
  document.querySelector("#breadcrumb-product").textContent = selectedProduct.name;
  document.title = `${selectedProduct.name} — Tdj`;
  detailImage.src = selectedProduct.image;
  detailImage.alt = `${selectedProduct.name} — titánový rám`;
  const productImages = [
    { src: selectedProduct.image, alt: detailImage.alt },
    ...(selectedProduct.secondImage
      ? [{ src: selectedProduct.secondImage, alt: selectedProduct.secondImageAlt }]
      : []),
  ];
  galleryThumbnails.hidden = productImages.length < 2;
  productImages.forEach((image, index) => {
    const thumbnail = document.createElement("button");
    thumbnail.className = `gallery-thumb${index === 0 ? " is-selected" : ""}`;
    thumbnail.type = "button";
    thumbnail.setAttribute("aria-label", `Zobraziť fotografiu ${index + 1}: ${image.alt}`);
    thumbnail.setAttribute("aria-pressed", String(index === 0));

    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = image.src;
    thumbnailImage.alt = "";
    thumbnail.append(thumbnailImage);
    thumbnail.addEventListener("click", () => {
      const currentThumbnail = galleryThumbnails.querySelector(".gallery-thumb.is-selected");
      currentThumbnail?.classList.remove("is-selected");
      currentThumbnail?.setAttribute("aria-pressed", "false");
      thumbnail.classList.add("is-selected");
      thumbnail.setAttribute("aria-pressed", "true");
      detailImage.src = image.src;
      detailImage.alt = image.alt;
      detailImageWrap.classList.toggle("is-zoomed", model === "urban" && index === 1);
      detailImageWrap.classList.toggle("is-pro-second", model === "pro" && index === 1);
    });
    galleryThumbnails.append(thumbnail);
  });
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

  updateProductPrice();
}

const configForm = document.querySelector("#config-form");
if (configForm) {
  const wheelSize = document.querySelector("#wheel-size");
  const reach = document.querySelector("#reach");
  const wheelbase = document.querySelector("#wheelbase");
  const headAngle = document.querySelector("#head-angle");
  const standardTab = document.querySelector("#config-tab-standard");
  const customTab = document.querySelector("#config-tab-custom");
  const standardPanel = document.querySelector("#config-panel-standard");
  const customPanel = document.querySelector("#config-panel-custom");
  const geometryPreview = document.querySelector(".geometry-preview");
  const previewColumn = document.querySelector(".config-preview-column");
  const customPanelIntro = customPanel.querySelector(".config-panel-intro");
  const mobileLayout = window.matchMedia("(max-width: 800px)");
  const currency = new Intl.NumberFormat("sk-SK");
  const configAddButton = document.querySelector(".config-add");
  const frameStroke = document.querySelectorAll(".preview-frame line");
  const standardGeometry = {
    "26": { reach: 415, wheelbase: 1040, headAngle: 69 },
    "24": { reach: 400, wheelbase: 990, headAngle: 70 },
  };
  const positionGeometryPreview = () => {
    if (mobileLayout.matches) {
      customPanelIntro.before(geometryPreview);
    } else {
      previewColumn.prepend(geometryPreview);
    }
  };
  positionGeometryPreview();
  mobileLayout.addEventListener("change", positionGeometryPreview);
  let configurationMode = "standard";
  let customGeometry = {
    reach: reach.value,
    wheelbase: wheelbase.value,
    headAngle: headAngle.value,
  };

  const setConfigurationMode = (mode) => {
    if (configurationMode === "custom" && mode === "standard") {
      customGeometry = {
        reach: reach.value,
        wheelbase: wheelbase.value,
        headAngle: headAngle.value,
      };
    } else if (configurationMode === "standard" && mode === "custom") {
      reach.value = customGeometry.reach;
      wheelbase.value = customGeometry.wheelbase;
      headAngle.value = customGeometry.headAngle;
    }

    configurationMode = mode;
    const isCustom = mode === "custom";
    standardTab.classList.toggle("is-active", !isCustom);
    customTab.classList.toggle("is-active", isCustom);
    standardTab.setAttribute("aria-selected", String(!isCustom));
    customTab.setAttribute("aria-selected", String(isCustom));
    standardPanel.hidden = isCustom;
    customPanel.hidden = !isCustom;
    reach.disabled = !isCustom;
    wheelbase.disabled = !isCustom;
    headAngle.disabled = !isCustom;
  };
  setConfigurationMode(configurationMode);

  try {
    const storedConfiguration = window.localStorage.getItem("tdj-frame-config");
    if (storedConfiguration) {
      const saved = JSON.parse(storedConfiguration);
      const savedReach = Number(saved?.reach);
      const savedWheelbase = Number(saved?.wheelbase ?? standardGeometry[String(saved?.wheelSize)]?.wheelbase);
      const savedHeadAngle = Number(saved?.headAngle);
      const savedMode = saved?.mode ?? "standard";
      const validConfiguration = saved
        && ["24", "26"].includes(String(saved.wheelSize))
        && Number.isInteger(savedReach) && savedReach >= 400 && savedReach <= 430
        && Number.isInteger(savedWheelbase) && savedWheelbase >= 960 && savedWheelbase <= 1080
        && Number.isInteger(savedHeadAngle) && savedHeadAngle >= 68 && savedHeadAngle <= 71
        && ["standard", "custom"].includes(savedMode)
        && ["natural", "dark"].includes(saved.finish);
      if (validConfiguration) {
        wheelSize.value = String(saved.wheelSize);
        reach.value = String(savedReach);
        wheelbase.value = String(savedWheelbase);
        headAngle.value = String(savedHeadAngle);
        customGeometry = {
          reach: reach.value,
          wheelbase: wheelbase.value,
          headAngle: headAngle.value,
        };
        document.querySelector(`input[name="config-finish"][value="${saved.finish}"]`).checked = true;
        setConfigurationMode(savedMode);
      } else {
        showToast("Uložená zostava nemá platné nastavenia.");
      }
    }
  } catch {
    showToast("Uloženú zostavu sa nepodarilo načítať.");
  }

  const updateConfiguration = () => {
    const preset = standardGeometry[wheelSize.value];
    if (configurationMode === "standard") {
      reach.value = String(preset.reach);
      wheelbase.value = String(preset.wheelbase);
      headAngle.value = String(preset.headAngle);
    }

    const reachValue = Number(reach.value);
    const wheelbaseValue = Number(wheelbase.value);
    const angleValue = Number(headAngle.value);
    const selectedFinish = document.querySelector('input[name="config-finish"]:checked');
    const finishExtra = Number(selectedFinish.dataset.price);
    const finishName = selectedFinish.value === "dark" ? "tmavý titán" : "prírodný titán";
    const basePrice = 1500 + (wheelSize.value === "24" ? 50 : 0);
    const price = basePrice + finishExtra;
    const sizeName = wheelSize.value === "24" ? "24\" Street" : "26\" Dirt Jump";

    document.querySelector("#reach-value").textContent = `${reachValue} mm`;
    document.querySelector("#wheelbase-value").textContent = `${currency.format(wheelbaseValue)} mm`;
    document.querySelector("#head-angle-value").textContent = `${angleValue}°`;
    document.querySelector("#preset-name").textContent = `Štandardná geometria ${sizeName}`;
    document.querySelector("#preset-reach").textContent = `${preset.reach} mm`;
    document.querySelector("#preset-wheelbase").textContent = `${currency.format(preset.wheelbase)} mm`;
    document.querySelector("#preset-head-angle").textContent = `${preset.headAngle}°`;
    document.querySelector("#preview-size").textContent = sizeName;
    document.querySelector("#config-price-note").textContent = `vrátane DPH · ${sizeName} · ${finishName}`;
    document.querySelector("#config-price").innerHTML = `${currency.format(price)} <small>€</small>`;
    configAddButton.dataset.price = String(price);
    configAddButton.dataset.product = `Custom ${sizeName} Frame · ${configurationMode === "custom" ? "vlastná geometria" : "štandardná geometria"} · ${finishName}`;

    const rearX = 70;
    const frontX = rearX + wheelbaseValue * 0.28;
    const headX = 285 + (reachValue - 415) * 0.8;
    const headBottomX = headX + Math.tan((90 - angleValue) * Math.PI / 180) * 75;
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
    const wheelbaseLabelX = (rearX + frontX) / 2 - 35;
    document.querySelector("#wheelbase-measure").setAttribute("x1", String(rearX));
    document.querySelector("#wheelbase-measure").setAttribute("x2", String(frontX));
    document.querySelector("#wheelbase-start-tick").setAttribute("x1", String(rearX));
    document.querySelector("#wheelbase-start-tick").setAttribute("x2", String(rearX));
    document.querySelector("#wheelbase-end-tick").setAttribute("x1", String(frontX));
    document.querySelector("#wheelbase-end-tick").setAttribute("x2", String(frontX));
    document.querySelector("#svg-wheelbase-label").setAttribute("x", String(wheelbaseLabelX));
    document.querySelector("#svg-wheelbase-label").textContent = `${currency.format(wheelbaseValue)} mm rázvor`;
    frameStroke.forEach((line) => line.setAttribute("stroke", selectedFinish.value === "dark" ? "#77746c" : "#b9a879"));
  };

  configForm.addEventListener("input", updateConfiguration);
  configForm.addEventListener("change", updateConfiguration);
  standardTab.addEventListener("click", () => {
    setConfigurationMode("standard");
    updateConfiguration();
  });
  customTab.addEventListener("click", () => {
    setConfigurationMode("custom");
    updateConfiguration();
  });
  document.querySelector(".config-save").addEventListener("click", () => {
    const savedConfiguration = {
      mode: configurationMode,
      wheelSize: wheelSize.value,
      reach: reach.value,
      wheelbase: wheelbase.value,
      headAngle: headAngle.value,
      finish: document.querySelector('input[name="config-finish"]:checked').value,
    };
    try {
      window.localStorage.setItem("tdj-frame-config", JSON.stringify(savedConfiguration));
      showToast("Hlavná zostava bola uložená v tomto prehliadači.");
    } catch {
      showToast("Zostavu sa nepodarilo uložiť. Skúste to znova.");
    }
  });
  updateConfiguration();
}
