// assets/js/slider.js
(() => {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slidesWrap = slider.querySelector(".slides");

  // Fallback: si offers.json no carga, igual muestra el banner
  const FALLBACK = [
    {
      image: "assets/img/banners/hero1.jpg",
      waNumber: "59169259870",
      waMessage:
        "Hola PRIME, me interesa el combo Proteína + Creatina Dragon Pharma + Shaker que vi en su web. ¿Sigue disponible? Precio: 800bs"
    }
  ];

  function buildWaLink(number, message) {
    const clean = String(number || "").replace(/[^\d]/g, "");
    const text = encodeURIComponent(message || "");
    return `https://wa.me/${clean}?text=${text}`;
  }

  function renderOne(offer) {
    // Limpia para evitar basura duplicada
    slidesWrap.innerHTML = "";

    const link = buildWaLink(offer.waNumber, offer.waMessage);

    const a = document.createElement("a");
    a.className = "slide active";
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener";

    // Fondo = imagen
    a.style.backgroundImage = `url('${offer.image}')`;
    a.style.backgroundSize = "cover";
    a.style.backgroundPosition = "center";

    // Overlay suave para que no se vea "plano"
    const overlay = document.createElement("div");
    overlay.className = "slide-overlay";
    a.appendChild(overlay);

    slidesWrap.appendChild(a);
  }

  async function init() {
    let offers = FALLBACK;

    try {
      // ojo: ruta RELATIVA desde index.html
      const res = await fetch("data/offers.json", { cache: "no-store" });
      if (!res.ok) throw new Error("offers.json no encontrado");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) offers = data;
    } catch (_) {
      // se queda con FALLBACK
    }

    // Solo 1 slide, el primero
    renderOne(offers[0]);
  }

  init();
})();
