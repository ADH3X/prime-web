// assets/js/slider.js
(() => {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slidesWrap = slider.querySelector(".slides");
  if (!slidesWrap) return;

  const FALLBACK = [
    {
      image: "assets/img/banners/hero1.jpg",
      waNumber: "59169259870",
      waMessage:
        "Hola PRIME, me interesa el combo Proteína + Creatina Dragon Pharma + Shaker que vi en su web. ¿Sigue disponible? Precio: 800bs"
    }
  ];

  const AUTOPLAY_MS = 4500;
  let offers = [];
  let current = 0;
  let timer = null;

  function buildWaLink(number, message) {
    const clean = String(number || "").replace(/[^\d]/g, "");
    const text = encodeURIComponent(message || "");
    return `https://wa.me/${clean}?text=${text}`;
  }

  function clearUIExtras() {
    slider.querySelectorAll(".nav, .dots").forEach((el) => el.remove());
  }

  function render() {
    slidesWrap.innerHTML = "";
    clearUIExtras();

    // slides
    offers.forEach((o, idx) => {
      const a = document.createElement("a");
      a.className = "slide" + (idx === current ? " active" : "");
      a.href = buildWaLink(o.waNumber, o.waMessage);
      a.target = "_blank";
      a.rel = "noopener";
      a.style.backgroundImage = `url("${o.image}")`;

      const overlay = document.createElement("div");
      overlay.className = "hero-overlay";
      a.appendChild(overlay);

      slidesWrap.appendChild(a);
    });

    // Si hay 1: no flechas/dots/autoplay
    if (offers.length <= 1) return;

    // Flechas
    const prev = document.createElement("button");
    prev.className = "nav prev";
    prev.type = "button";
    prev.innerHTML = "‹";
    prev.addEventListener("click", () => goTo(current - 1, true));

    const next = document.createElement("button");
    next.className = "nav next";
    next.type = "button";
    next.innerHTML = "›";
    next.addEventListener("click", () => goTo(current + 1, true));

    slider.appendChild(prev);
    slider.appendChild(next);

    // Dots
    const dots = document.createElement("div");
    dots.className = "dots";

    offers.forEach((_, idx) => {
      const d = document.createElement("button");
      d.className = "dot" + (idx === current ? " active" : "");
      d.type = "button";
      d.addEventListener("click", () => goTo(idx, true));
      dots.appendChild(d);
    });

    slider.appendChild(dots);
  }

  function goTo(index, userAction = false) {
    if (!offers.length) return;

    current = (index + offers.length) % offers.length;
    render();

    if (userAction) restartAutoplay();
  }

  function startAutoplay() {
    if (offers.length <= 1) return;
    timer = setInterval(() => goTo(current + 1, false), AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  async function init() {
    offers = FALLBACK;

    try {
      const res = await fetch("data/offers.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) offers = data;
      }
    } catch (e) {
      console.warn("[SLIDER] offers.json no carga, usando FALLBACK", e);
    }

    current = 0;
    render();
    startAutoplay();
  }

  init();
})();
