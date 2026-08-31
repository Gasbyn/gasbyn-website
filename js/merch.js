/**
 * Gasbyn Merch – košík, doprava, checkout (převod)
 * BANK údaje uprav níže před ostrým prodejem.
 */
(function () {
  const BANK = {
    account: "1234567890 / 0100", // ← změň na svůj účet
    name: "Gasbyn merch",
  };

  const FREE_SHIPPING_FROM = 1500;

  const SHIPPING = {
    CZ: [
      { id: "cz-box", label: "📦 Výdejní místo / box (CZ)", price: 79 },
      { id: "cz-home", label: "🏠 Doručení na adresu (CZ)", price: 129 },
    ],
    SK: [
      { id: "sk-box", label: "📦 Výdejní místo / box (SK)", price: 99 },
      { id: "sk-home", label: "🏠 Doručení na adresu (SK)", price: 149 },
    ],
  };

  const PRODUCTS = [
    {
      id: "tee",
      name: "Gasbyn Tričko",
      description: "Oficiální tričko s logem Gasbyn. 100% bavlna, pohodlný střih.",
      price: 499,
      emoji: "👕",
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: "hoodie",
      name: "Gasbyn Mikina",
      description: "Teplá mikina s kapucí a brandingem Gasbyn.",
      price: 899,
      emoji: "🧥",
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: "stickers1",
      name: "Gasbyn Samolepky #1",
      description: "Samolepkový pack – logo a motivy ze streamů.",
      price: 99,
      emoji: "🏷️",
      sizes: null,
    },
    {
      id: "stickers2",
      name: "Gasbyn Samolepky #2",
      description: "Druhý pack samolepek pro sběratele.",
      price: 99,
      emoji: "✨",
      sizes: null,
    },
    {
      id: "cap",
      name: "Gasbyn Kšiltovka",
      description: "Jednoduchá kšiltovka s Gasbyn brandingem.",
      price: 399,
      emoji: "🧢",
      sizes: null,
    },
  ];

  const STORAGE_KEY = "gasbyn_merch_cart_v1";
  let cart = loadCart();
  let lastOrder = null;

  const els = {
    grid: document.getElementById("merchGrid"),
    cartOverlay: document.getElementById("cartOverlay"),
    checkoutOverlay: document.getElementById("checkoutOverlay"),
    paymentOverlay: document.getElementById("paymentOverlay"),
    cartItems: document.getElementById("cartItems"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    cartCount: document.getElementById("cartCount"),
    checkoutSubtotal: document.getElementById("checkoutSubtotal"),
    checkoutShipping: document.getElementById("checkoutShipping"),
    checkoutTotal: document.getElementById("checkoutTotal"),
    country: document.getElementById("country"),
    shipping: document.getElementById("shipping"),
    form: document.getElementById("checkoutForm"),
    toast: document.getElementById("merchToast"),
  };

  function formatCZK(n) {
    return Number(n).toLocaleString("cs-CZ") + " Kč";
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function showToast(msg) {
    if (!els.toast) return;
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(window.__merchToast);
    window.__merchToast = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  function cartKey(productId, size) {
    return productId + "::" + (size || "-");
  }

  function cartQty() {
    return cart.reduce((s, i) => s + i.qty, 0);
  }

  function cartSubtotal() {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  function selectedShippingPrice() {
    const country = els.country.value;
    const shipId = els.shipping.value;
    if (!country || !shipId || !SHIPPING[country]) return 0;
    const opt = SHIPPING[country].find((o) => o.id === shipId);
    if (!opt) return 0;
    if (cartSubtotal() >= FREE_SHIPPING_FROM) return 0;
    return opt.price;
  }

  function renderProducts() {
    els.grid.innerHTML = "";
    PRODUCTS.forEach((p, idx) => {
      const article = document.createElement("article");
      article.className = "merch-product reveal delay-" + ((idx % 4) + 1);
      const sizeHtml = p.sizes
        ? `<select class="merch-size" data-size aria-label="Velikost ${p.name}">
            <option value="">Vyber velikost</option>
            ${p.sizes.map((s) => `<option value="${s}">${s}</option>`).join("")}
           </select>`
        : "";
      article.innerHTML = `
        <div class="merch-product-visual">${p.emoji}</div>
        <div class="merch-product-info">
          <h2>${p.name}</h2>
          <p>${p.description}</p>
          <div class="merch-price">${formatCZK(p.price)}</div>
          ${sizeHtml}
          <button type="button" class="merch-add"
            data-id="${p.id}"
            data-name="${p.name}"
            data-price="${p.price}"
            data-size-required="${p.sizes ? "true" : "false"}">
            Přidat do košíku
          </button>
        </div>`;
      els.grid.appendChild(article);
    });
    initReveals();
  }

  function initReveals() {
    const nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("show"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    nodes.forEach((n) => io.observe(n));
  }

  function renderCart() {
    els.cartItems.innerHTML = "";
    if (!cart.length) {
      els.cartItems.innerHTML =
        '<p style="color:var(--gray);line-height:1.7">Košík je prázdný. Vyber si něco z nabídky. 👕</p>';
    }
    cart.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "merch-cart-item";
      row.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.size ? "Velikost: " + item.size + " · " : ""}${formatCZK(item.price)} × ${item.qty}</small>
        </div>
        <div class="merch-cart-item-actions">
          <button type="button" class="merch-qty-btn" data-dec="${index}" aria-label="Méně">−</button>
          <span style="color:white;min-width:1.2em;text-align:center">${item.qty}</span>
          <button type="button" class="merch-qty-btn" data-inc="${index}" aria-label="Více">+</button>
          <button type="button" class="merch-remove" data-remove="${index}">Odebrat</button>
        </div>`;
      els.cartItems.appendChild(row);
    });
    const sub = cartSubtotal();
    els.cartSubtotal.textContent = formatCZK(sub);
    els.cartCount.textContent = String(cartQty());
    updateCheckoutTotals();
  }

  function updateCheckoutTotals() {
    const sub = cartSubtotal();
    const ship = selectedShippingPrice();
    els.checkoutSubtotal.textContent = formatCZK(sub);
    els.checkoutShipping.textContent =
      sub >= FREE_SHIPPING_FROM && els.country.value
        ? "Zdarma"
        : formatCZK(ship);
    els.checkoutTotal.textContent = formatCZK(sub + ship);
  }

  function fillShippingOptions() {
    const country = els.country.value;
    const select = els.shipping;
    if (!SHIPPING[country]) {
      select.innerHTML = '<option value="">Nejdřív vyber stát</option>';
      updateCheckoutTotals();
      return;
    }
    select.innerHTML = SHIPPING[country]
      .map((o) => {
        const free = cartSubtotal() >= FREE_SHIPPING_FROM;
        const priceLabel = free ? "zdarma" : formatCZK(o.price);
        return `<option value="${o.id}">${o.label} – ${priceLabel}</option>`;
      })
      .join("");
    updateCheckoutTotals();
  }

  function openOverlay(el) {
    el.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeOverlay(el) {
    el.classList.remove("open");
    if (
      !els.cartOverlay.classList.contains("open") &&
      !els.checkoutOverlay.classList.contains("open") &&
      !els.paymentOverlay.classList.contains("open")
    ) {
      document.body.style.overflow = "";
    }
  }

  function addToCart(btn) {
    const product = btn.closest(".merch-product");
    const sizeSelect = product.querySelector("[data-size]");
    const size = sizeSelect ? sizeSelect.value : "";
    if (btn.dataset.sizeRequired === "true" && !size) {
      showToast("Nejdřív vyber velikost");
      return;
    }
    const id = btn.dataset.id;
    const key = cartKey(id, size);
    const existing = cart.find((i) => i.key === key);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        key,
        id,
        name: btn.dataset.name,
        price: Number(btn.dataset.price),
        size,
        qty: 1,
      });
    }
    saveCart();
    renderCart();
    openOverlay(els.cartOverlay);
    showToast("Přidáno do košíku");
  }

  function generateOrderId() {
    const t = Date.now().toString().slice(-8);
    return "G" + t;
  }

  function paymentText(order) {
    return [
      "Gasbyn merch – platba převodem",
      "Objednávka: " + order.id,
      "Částka: " + formatCZK(order.total),
      "Účet: " + BANK.account,
      "VS: " + order.vs,
      "Zpráva: " + order.msg,
      "",
      "Odběratel: " + order.name,
      "E-mail: " + order.email,
      "Telefon: " + order.phone,
      "Adresa: " + order.address + ", " + order.zip + " " + order.city + " (" + order.country + ")",
      "Doprava: " + order.shippingLabel,
      "Položky:",
      ...order.items.map(
        (i) =>
          "- " +
          i.name +
          (i.size ? " " + i.size : "") +
          " ×" +
          i.qty +
          " = " +
          formatCZK(i.price * i.qty)
      ),
    ].join("\n");
  }

  document.getElementById("openCart").addEventListener("click", () => {
    renderCart();
    openOverlay(els.cartOverlay);
  });
  document.getElementById("closeCart").addEventListener("click", () => closeOverlay(els.cartOverlay));
  document.getElementById("closeCheckout").addEventListener("click", () => closeOverlay(els.checkoutOverlay));
  document.getElementById("closePayment").addEventListener("click", () => closeOverlay(els.paymentOverlay));
  document.getElementById("closePaymentDone").addEventListener("click", () => {
    closeOverlay(els.paymentOverlay);
    cart = [];
    saveCart();
    renderCart();
  });

  document.getElementById("checkoutButton").addEventListener("click", () => {
    if (!cart.length) {
      showToast("Košík je prázdný");
      return;
    }
    closeOverlay(els.cartOverlay);
    openOverlay(els.checkoutOverlay);
    fillShippingOptions();
    updateCheckoutTotals();
  });

  els.country.addEventListener("change", fillShippingOptions);
  els.shipping.addEventListener("change", updateCheckoutTotals);

  els.cartItems.addEventListener("click", (e) => {
    const dec = e.target.closest("[data-dec]");
    const inc = e.target.closest("[data-inc]");
    const rem = e.target.closest("[data-remove]");
    if (dec) {
      const i = Number(dec.dataset.dec);
      cart[i].qty -= 1;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      saveCart();
      renderCart();
    }
    if (inc) {
      const i = Number(inc.dataset.inc);
      cart[i].qty += 1;
      saveCart();
      renderCart();
    }
    if (rem) {
      cart.splice(Number(rem.dataset.remove), 1);
      saveCart();
      renderCart();
    }
  });

  els.grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".merch-add");
    if (btn) addToCart(btn);
  });

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cart.length) {
      showToast("Košík je prázdný");
      return;
    }
    const fd = new FormData(els.form);
    const country = fd.get("country");
    const shipId = fd.get("shipping");
    const shipOpt = (SHIPPING[country] || []).find((o) => o.id === shipId);
    if (!shipOpt) {
      showToast("Vyber způsob dopravy");
      return;
    }
    const sub = cartSubtotal();
    const ship = selectedShippingPrice();
    const orderId = generateOrderId();
    const order = {
      id: orderId,
      vs: orderId.replace(/\D/g, "").slice(-10) || orderId,
      msg: "Gasbyn merch " + orderId,
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      address: String(fd.get("address") || ""),
      city: String(fd.get("city") || ""),
      zip: String(fd.get("zip") || ""),
      country,
      shippingLabel: shipOpt.label,
      shippingPrice: ship,
      subtotal: sub,
      total: sub + ship,
      items: cart.map((i) => ({ ...i })),
      note: String(fd.get("note") || ""),
      createdAt: new Date().toISOString(),
    };
    lastOrder = order;
    try {
      const prev = JSON.parse(localStorage.getItem("gasbyn_merch_orders") || "[]");
      prev.push(order);
      localStorage.setItem("gasbyn_merch_orders", JSON.stringify(prev.slice(-20)));
    } catch (_) {}

    document.getElementById("orderId").textContent = order.id;
    document.getElementById("payAmount").textContent = formatCZK(order.total);
    document.getElementById("payAccount").textContent = BANK.account;
    document.getElementById("payVS").textContent = order.vs;
    document.getElementById("payMsg").textContent = order.msg;

    closeOverlay(els.checkoutOverlay);
    openOverlay(els.paymentOverlay);
    showToast("Objednávka vytvořena");
  });

  document.getElementById("copyPayment").addEventListener("click", async () => {
    if (!lastOrder) return;
    try {
      await navigator.clipboard.writeText(paymentText(lastOrder));
      showToast("Platební údaje zkopírovány");
    } catch {
      showToast("Kopírování se nepovedlo");
    }
  });

  [els.cartOverlay, els.checkoutOverlay, els.paymentOverlay].forEach((ov) => {
    ov.addEventListener("click", (e) => {
      if (e.target === ov) closeOverlay(ov);
    });
  });

  renderProducts();
  renderCart();
})();
