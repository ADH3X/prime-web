async function loadProducts() {
  const res = await fetch('data/products.json');
  const products = await res.json();

  const grid = document.getElementById('products') || document.getElementById('featured-products');
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>${p.marca}</p>
      <p class="price">Bs ${p.precio}</p>
      <div class="btn-add" onclick='addToCart(${JSON.stringify(p)})'>Agregar</div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadProducts);
