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
        "Hola PRIME, me interesa el combo Proteína + Creatina Dragon Pharma + Shaker que vi en su web. ¿Sigue disponible?"
    }
  ];

  let offers = [];
  let index = 0;
  let timer = null;

  function buildWaLink(number, message) {
    const clean = String(number || "").replace(/[^\d]/g, "");
    const text = encodeURIComponent(message || "");
    return `https://wa.me/${clean}?text=${text}`;
  }

  function renderSlides() {
    slidesWrap.innerHTML = "";

    offers.forEach((offer, i) => {
      const a = document.createElement("a");
      a.className = "slide" + (i === index ? " active" : "");
      a.href = buildWaLink(offer.waNumber, offer.waMessage);
      a.target = "_blank";
      a.rel = "noopener";

      a.style.backgroundImage = `url('${offer.image}')`;

      const overlay = document.createElement("div");
      overlay.className = "slide-overlay";
      a.appendChild(overlay);

      slidesWrap.appendChild(a);
    });
  }

  function setActive(nextIndex) {
    index = (nextIndex + offers.length) % offers.length;
    const slides = slidesWrap.querySelectorAll(".slide");
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
  }

  function ensureNav() {
    // borra nav anterior si existe (por si recarga)
    slider.querySelectorAll(".nav-btn").forEach(b => b.remove());

    if (offers.length <= 1) return;

    const prev = document.createElement("button");
    prev.className = "nav-btn prev";
    prev.type = "button";
    prev.setAttribute("aria-label", "Anterior");
    prev.innerHTML = "‹";

    const next = document.createElement("button");
    next.className = "nav-btn next";
    next.type = "button";
    next.setAttribute("aria-label", "Siguiente");
    next.innerHTML = "›";

    prev.addEventListener("click", () => {
      stopAuto();
      setActive(index - 1);
      startAuto();
    });

    next.addEventListener("click", () => {
      stopAuto();
      setActive(index + 1);
      startAuto();
    });

    slider.appendChild(prev);
    slider.appendChild(next);
  }

  function startAuto() {
    if (offers.length <= 1) return;
    stopAuto();
    timer = setInterval(() => setActive(index + 1), 4500);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  async function init() {
    offers = FALLBACK;

    try {
      const res = await fetch("data/offers.json", { cache: "no-store" });
      if (!res.ok) throw new Error("offers.json no encontrado");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) offers = data;
    } catch (e) {
      // fallback silencioso
    }

    index = 0;
    renderSlides();
    ensureNav();
    startAuto();

    // pausa si el usuario pone el mouse encima
    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
  }

  init();
})();
