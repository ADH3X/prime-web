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

  const AUTOPLAY_MS = 6000;
  let offers = [];
  let index = 0;
  let timer = null;

  function buildWaLink(number, message) {
    const clean = String(number || "").replace(/[^\d]/g, "");
    const text = encodeURIComponent(message || "");
    return `https://wa.me/${clean}?text=${text}`;
  }

  function setActive(i) {
    index = (i + offers.length) % offers.length;

    const slides = slidesWrap.querySelectorAll(".slide");
    const dots = slider.querySelectorAll(".dot");

    slides.forEach((s, idx) => s.classList.toggle("active", idx === index));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === index));
  }

  function next() {
    setActive(index + 1);
  }

  function prev() {
    setActive(index - 1);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    if (offers.length <= 1) return;
    timer = setInterval(next, AUTOPLAY_MS);
  }

  function renderUI() {
    // Limpia TODO
    slidesWrap.innerHTML = "";
    slider.querySelectorAll(".nav-btn, .dots").forEach((el) => el.remove());

    // Slides
    offers.forEach((offer) => {
      const a = document.createElement("a");
      a.className = "slide";
      a.href = buildWaLink(offer.waNumber, offer.waMessage);
      a.target = "_blank";
      a.rel = "noopener";

      // cache-bust para GitHub Pages (a veces no refresca rápido)
      const img = `${offer.image}?v=${Date.now()}`;
      a.style.backgroundImage = `url("${img}")`;

      const overlay = document.createElement("div");
      overlay.className = "slide-overlay";
      a.appendChild(overlay);

      slidesWrap.appendChild(a);
    });

    // Si solo hay 1, no ponemos controles
    if (offers.length <= 1) {
      slidesWrap.querySelector(".slide")?.classList.add("active");
      return;
    }

    // Flechas
    const btnPrev = document.createElement("button");
    btnPrev.className = "nav-btn prev";
    btnPrev.type = "button";
    btnPrev.setAttribute("aria-label", "Anterior");
    btnPrev.innerHTML = "‹";
    btnPrev.addEventListener("click", () => {
      prev();
      startAutoplay();
    });

    const btnNext = document.createElement("button");
    btnNext.className = "nav-btn next";
    btnNext.type = "button";
    btnNext.setAttribute("aria-label", "Siguiente");
    btnNext.innerHTML = "›";
    btnNext.addEventListener("click", () => {
      next();
      startAutoplay();
    });

    slider.appendChild(btnPrev);
    slider.appendChild(btnNext);

    // Dots
    const dots = document.createElement("div");
    dots.className = "dots";

    offers.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir a oferta ${i + 1}`);
      dot.addEventListener("click", () => {
        setActive(i);
        startAutoplay();
      });
      dots.appendChild(dot);
    });

    slider.appendChild(dots);

    // Activa el primero
    setActive(0);

    // Autoplay + pausa al hover
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);

    // Swipe en móvil (simple)
    let x0 = null;
    slider.addEventListener("touchstart", (e) => {
      x0 = e.touches?.[0]?.clientX ?? null;
    }, { passive: true });

    slider.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const x1 = e.changedTouches?.[0]?.clientX ?? null;
      if (x1 === null) return;

      const dx = x1 - x0;
      if (Math.abs(dx) > 40) {
        dx < 0 ? next() : prev();
        startAutoplay();
      }
      x0 = null;
    }, { passive: true });

    startAutoplay();
  }

  async function loadOffers() {
    try {
      const res = await fetch(`data/offers.json?v=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("offers.json no encontrado");
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("offers.json vacío");
      return data;
    } catch (e) {
      console.warn("[SLIDER] Usando FALLBACK:", e?.message || e);
      return FALLBACK;
    }
  }

  (async function init() {
    offers = await loadOffers();
    renderUI();
  })();
})();
