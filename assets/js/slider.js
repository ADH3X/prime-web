// assets/js/slider.js
(() => {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slidesWrap = slider.querySelector(".slides");

  // Fallback si offers.json no carga
  const FALLBACK = [
    {
      image: "assets/img/banners/hero1.jpg",
      waNumber: "59169259870",
      waMessage:
        "Hola PRIME, me interesa el combo Proteína + Creatina Dragon Pharma + Shaker que vi en su web. ¿Sigue disponible? Precio: 800bs"
    }
  ];

  const AUTOPLAY_MS = 6500;

  function buildWaLink(number, message) {
    const clean = String(number || "").replace(/[^\d]/g, "");
    const text = encodeURIComponent(message || "");
    return `https://wa.me/${clean}?text=${text}`;
  }

  function createSlide(offer, isActive) {
    const a = document.createElement("a");
    a.className = `slide${isActive ? " active" : ""}`;
    a.href = buildWaLink(offer.waNumber, offer.waMessage);
    a.target = "_blank";
    a.rel = "noopener";

    a.style.backgroundImage = `url('${offer.image}')`;

    const overlay = document.createElement("div");
    overlay.className = "slide-overlay";
    a.appendChild(overlay);

    return a;
  }

  function createArrow(className, label, text) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `nav-btn ${className}`;
    btn.setAttribute("aria-label", label);
    btn.textContent = text;
    return btn;
  }

  function setActive(index, slides) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
  }

  async function init() {
    let offers = FALLBACK;

    try {
      const res = await fetch("data/offers.json", { cache: "no-store" });
      if (!res.ok) throw new Error("offers.json no encontrado");
      const data = await res.json();
      if (Array.isArray(data) && data.length) offers = data;
    } catch (e) {
      // se queda con FALLBACK
    }

    // Render
    slidesWrap.innerHTML = "";
    const slides = offers.map((o, i) => createSlide(o, i === 0));
    slides.forEach(s => slidesWrap.appendChild(s));

    // Si hay 1 sola oferta: sin flechas, sin autoplay
    if (offers.length <= 1) return;

    // Flechas
    const prevBtn = createArrow("prev", "Anterior", "‹");
    const nextBtn = createArrow("next", "Siguiente", "›");
    slidesWrap.appendChild(prevBtn);
    slidesWrap.appendChild(nextBtn);

    let current = 0;
    let timer = null;

    const go = (dir) => {
      current = (current + dir + offers.length) % offers.length;
      setActive(current, slides);
    };

    const start = () => {
      stop();
      timer = setInterval(() => go(1), AUTOPLAY_MS);
    };

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    prevBtn.addEventListener("click", () => { go(-1); start(); });
    nextBtn.addEventListener("click", () => { go(1); start(); });

    // Pausa si el mouse entra
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    // Swipe móvil
    let x0 = null;
    slider.addEventListener("touchstart", (e) => {
      x0 = e.touches?.[0]?.clientX ?? null;
    }, { passive: true });

    slider.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const x1 = e.changedTouches?.[0]?.clientX ?? x0;
      const dx = x1 - x0;
      x0 = null;

      if (Math.abs(dx) < 40) return;
      go(dx > 0 ? -1 : 1);
      start();
    }, { passive: true });

    start();
  }

  init();
})();
