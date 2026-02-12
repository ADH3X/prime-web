// assets/js/slider.js
(() => {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slidesWrap = slider.querySelector(".slides");
  if (!slidesWrap) {
    console.error("[SLIDER] Falta .slides dentro de #hero-slider");
    return;
  }

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
    slidesWrap.innerHTML = "";

    const link = buildWaLink(offer.waNumber, offer.waMessage);

    const a = document.createElement("a");
    a.className = "slide active";
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener";

    // Fondo
    a.style.backgroundImage = `url("${offer.image}")`;

    // Overlay (MISMO nombre que el CSS final)
    const overlay = document.createElement("div");
    overlay.className = "hero-overlay";
    a.appendChild(overlay);

    slidesWrap.appendChild(a);

    // Debug real: si la imagen no carga, lo sabés
    const testImg = new Image();
    testImg.onload = () => console.log("[SLIDER] Imagen OK:", offer.image);
    testImg.onerror = () =>
      console.error("[SLIDER] No carga la imagen. Revisa ruta/nombre:", offer.image);
    testImg.src = offer.image;
  }

  async function init() {
    let offers = FALLBACK;

    try {
      const res = await fetch("data/offers.json", { cache: "no-store" });
      if (!res.ok) throw new Error("offers.json no encontrado");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) offers = data;
    } catch (e) {
      console.warn("[SLIDER] Usando FALLBACK:", e?.message || e);
    }

    renderOne(offers[0]);
  }

  init();
})();
