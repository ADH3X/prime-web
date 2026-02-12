// ===============================
// PRIME - HERO SLIDER (limpio)
// - Lee data/offers.json
// - Renderiza slides (1 o más)
// - Si hay 1 slide: oculta flechas + dots
// - CTA: abre selector con 2 WhatsApp + mensaje
// ===============================

const WA_NUMBERS = [
  "59169259870", // WhatsApp #1 (tu número)
  "59170000000"  // WhatsApp #2 (cámbialo por el real)
];

const OFFERS_URL = "data/offers.json";

document.addEventListener("DOMContentLoaded", () => {
  initHeroSlider();
});

async function initHeroSlider() {
  const slider = document.querySelector("#hero-slider");
  if (!slider) return;

  const slidesWrap = slider.querySelector(".slides");
  const dotsWrap = slider.querySelector(".dots");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");

  // Limpieza total (evita duplicados)
  slidesWrap.innerHTML = "";
  dotsWrap.innerHTML = "";

  let offers = [];
  try {
    const res = await fetch(OFFERS_URL, { cache: "no-store" });
    offers = await res.json();
  } catch (e) {
    console.error("No se pudo cargar offers.json", e);
    return;
  }

  if (!Array.isArray(offers) || offers.length === 0) return;

  // Render slides
  offers.forEach((offer, idx) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.backgroundImage = `url('${offer.image}')`;

    // overlay + CTA
    const overlay = document.createElement("div");
    overlay.className = "hero-overlay";

    const cta = document.createElement("button");
    cta.className = "btn-primary hero-cta";
    cta.type = "button";
    cta.textContent = offer.ctaText || "Comprar por WhatsApp";

    const message =
      offer.waMessage ||
      "Hola PRIME, me interesa el combo Proteína + Creatina Dragon Pharma + Shaker que vi en su web. ¿Sigue disponible? Precio: 800bs";

    cta.addEventListener("click", () => openWhatsAppChooser(message));

    overlay.appendChild(cta);
    slide.appendChild(overlay);
    slidesWrap.appendChild(slide);

    // dots
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Ir al slide ${idx + 1}`);
    dot.addEventListener("click", () => goTo(idx));
    dotsWrap.appendChild(dot);
  });

  const slides = Array.from(slidesWrap.querySelectorAll(".slide"));
  const dots = Array.from(dotsWrap.querySelectorAll(".dot"));

  let index = 0;

  function render() {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = i;
    render();
  }

  function next() {
    index = (index + 1) % slides.length;
    render();
  }

  function prev() {
    index = (index - 1 + slides.length) % slides.length;
    render();
  }

  // Botones
  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  // Si hay 1 solo slide: escondemos flechas y dots
  if (slides.length === 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (dotsWrap) dotsWrap.style.display = "none";
  } else {
    if (prevBtn) prevBtn.style.display = "";
    if (nextBtn) nextBtn.style.display = "";
    if (dotsWrap) dotsWrap.style.display = "";
  }

  // Inicial
  render();
}

// ===============================
// WhatsApp chooser (2 números)
// ===============================
function openWhatsAppChooser(message) {
  const msg = encodeURIComponent(message);

  // Backdrop
  const backdrop = document.createElement("div");
  backdrop.className = "wa-modal-backdrop";

  // Modal
  const modal = document.createElement("div");
  modal.className = "wa-modal";
  modal.innerHTML = `
    <div class="wa-modal-head">
      <div class="wa-modal-title">Elegí un WhatsApp</div>
      <button class="wa-modal-close" type="button" aria-label="Cerrar">×</button>
    </div>
    <div class="wa-modal-body">
      <button class="wa-modal-btn" data-wa="0" type="button">WhatsApp 1</button>
      <button class="wa-modal-btn" data-wa="1" type="button">WhatsApp 2</button>
      <div class="wa-modal-note">Se abrirá WhatsApp con el mensaje listo.</div>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Cerrar
  const close = () => backdrop.remove();
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  modal.querySelector(".wa-modal-close").addEventListener("click", close);

  // Abrir WhatsApp
  modal.querySelectorAll(".wa-modal-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-wa"));
      const number = WA_NUMBERS[idx] || WA_NUMBERS[0];
      const url = `https://wa.me/${number}?text=${msg}`;
      window.open(url, "_blank");
      close();
    });
  });
}
