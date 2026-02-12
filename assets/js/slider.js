// assets/js/slider.js
(() => {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slidesWrap = slider.querySelector(".slides");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  const dotsWrap = slider.querySelector(".dots");

  // Fallback si falla offers.json
  const FALLBACK_OFFERS = [
    {
      image: "assets/img/banners/hero1.jpg",
      ctaLink: "https://wa.me/59169259870?text=Hola%20PRIME%2C%20me%20interesa%20el%20combo%20Prote%C3%ADna%20%2B%20Creatina%20Dragon%20Pharma%20%2B%20Shaker%20que%20vi%20en%20su%20web.%20%C2%BFSigue%20disponible%3F%20Precio%3A%20800bs",
      alt: "Oferta PRIME"
    }
  ];

  let offers = [];
  let index = 0;
  let timer = null;

  function escapeHTML(str = "") {
    return str.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  function render() {
    // limpia siempre (evita “slides fantasma”)
    slidesWrap.innerHTML = "";
    dotsWrap.innerHTML = "";

    offers.forEach((o, i) => {
      const slide = document.createElement("a");
      slide.className = "slide" + (i === index ? " active" : "");
      slide.href = o.ctaLink || "#";
      slide.target = o.ctaLink?.startsWith("http") ? "_blank" : "_self";
      slide.rel = "noopener";
      slide.style.backgroundImage = `url('${o.image}')`;
      slide.setAttribute("aria-label", o.alt || o.headline || `Oferta ${i + 1}`);

      // Overlay suave para legibilidad (aunque no uses texto)
      const overlay = document.createElement("div");
      overlay.className = "slide-overlay";
      slide.appendChild(overlay);

      slidesWrap.appendChild(slide);

      const dot = document.createElement("button");
      dot.className = "dot" + (i === index ? " active" : "");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir a oferta ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    // Si solo hay 1 slide, ocultamos flechas y dots (porque confunde)
    const many = offers.length > 1;
    prevBtn.style.display = many ? "grid" : "none";
    nextBtn.style.display = many ? "grid" : "none";
    dotsWrap.style.display = many ? "flex" : "none";
  }

  function goTo(i) {
    index = (i + offers.length) % offers.length;
    render();
    restartAutoplay();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function restartAutoplay() {
    if (timer) clearInterval(timer);
    if (offers.length <= 1) return;
    timer = setInterval(next, 6000);
  }

  async function loadOffers() {
    try {
      const res = await fetch("data/offers.json", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar offers.json");

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("offers.json vacío");

      // Normaliza campos mínimos
      offers = data.map((o) => ({
        image: o.image,
        ctaLink: o.ctaLink,
        alt: o.headline || o.title || "Oferta PRIME"
      })).filter(o => o.image);

      if (offers.length === 0) throw new Error("Sin imágenes válidas en offers.json");
    } catch (e) {
      // fallback
      offers = FALLBACK_OFFERS;
    }

    index = 0;
    render();
    restartAutoplay();
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  // Swipe en móvil
  let startX = 0;
  slidesWrap.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  slidesWrap.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > 50) diff < 0 ? next() : prev();
  }, { passive: true });

  loadOffers();
})();
