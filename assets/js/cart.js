let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartCount() {
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = cart.length);
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Producto agregado al carrito');
}

function buildWhatsAppMessage() {
  let msg = "Hola PRIME, quiero comprar:%0A";
  let total = 0;

  cart.forEach(p => {
    msg += `- ${p.nombre} (${p.marca}) Bs ${p.precio}%0A`;
    total += p.precio;
  });

  msg += `%0ATotal: Bs ${total}%0A%0AMi nombre:%0ADirección:%0AHorario de entrega:`;
  return msg;
}

// Botón para número 1
function checkoutWhatsApp1() {
  const msg = buildWhatsAppMessage();
  window.open(`https://wa.me/59177676446?text=${msg}`, '_blank');
}

// Botón para número 2
function checkoutWhatsApp2() {
  const msg = buildWhatsAppMessage();
  window.open(`https://wa.me/59169259870?text=${msg}`, '_blank');
}

document.addEventListener('DOMContentLoaded', updateCartCount);
