async function loadProducts() {
  const res = await fetch("data/products.json", { cache: "no-store" });
  const products = await res.json();

  const grid =
    document.getElementById("products") ||
    document.getElementById("featured-products");

  if (!grid) return;

  grid.innerHTML = products
    .map((p) => {
      // guardamos el producto en data-* para no romper el HTML con JSON.stringify
      const data = encodeURIComponent(JSON.stringify(p));

      return `
        <div class="product-card card">
          <div class="product-media">
            <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
          </div>

          <div class="product-body">
            <h3 class="product-title">${p.nombre}</h3>
            <div class="product-brand">${p.marca || ""}</div>
            <div class="product-price price">Bs ${p.precio}</div>

            <button class="add-btn btn-add" type="button" data-product="${data}">
              Agregar
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  // 1 solo listener para todos (más limpio)
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add");
    if (!btn) return;

    const p = JSON.parse(decodeURIComponent(btn.dataset.product));
    addToCart(p);
  });
}

document.addEventListener("DOMContentLoaded", loadProducts);
