(() => {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slidesWrap = slider.querySelector(".slides");
  const btnPrev = slider.querySelector(".prev");
  const btnNext = slider.querySelector(".next");
  const dotsWrap = slider.querySelector(".dots");

  let offers = [];
  let current = 0;
  let timer = null;

  function safeText(v, fallback = "") {
    return (v === null || v === undefined) ? fallback : String(v);
  }

  function renderSlides() {
    slidesWrap.innerHTML = "";
    dotsWrap.innerHTML = "";

    offers.forEach((o, i) => {
      const image = safeText(o.image);
      const title = safeText(o.title);
      const headline = safeText(o.headline);
      const subtitle = safeText(o.subtitle);
      const badge = safeText(o.badge);
      const ctaText = safeText(o.ctaText, "Ver más");
      const ctaLink = safeText(o.ctaLink, "catalog.html");

      const slide = document.createElement("article");
      slide.className = "slide";
      slide.style.backgroundImage = `url('${image}')`;

      slide.innerHTML = `
        <div class="slide-overlay"></div>
        <div class="slide-content container">
          ${title ? `<div class="slide-kicker">${title}</div>` : ""}
          <h1 class="slide-title">${headline}</h1>
          ${subtitle ? `<p class="slide-subtitle">${subtitle}</p>` : ""}
          <div class="slide-actions">
            <a class="btn-primary" href="${ctaLink}">${ctaText}</a>
            ${badge ? `<span class="slide-badge">${badge}</span>` : ""}
          </div>
        </div>
      `;

      slidesWrap.appendChild(slide);

      const dot = document.createElement("button");
      dot.className = "dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir a oferta ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    // Si solo hay 1 oferta: no flechas, no dots, no autoplay
    const multi = offers.length > 1;
    btnPrev.style.display = multi ? "grid" : "none";
    btnNext.style.display = multi ? "grid" : "none";
    dotsWrap.style.display = multi ? "flex" : "none";

    goTo(0);

    stopAuto();
    if (multi) startAuto();
  }

  function goTo(index) {
    current = (index + offers.length) % offers.length;
    const slideW = slidesWrap.clientWidth;
    slidesWrap.scrollTo({ left: slideW * current, behavior: "smooth" });

    const dots = dotsWrap.querySelectorAll(".dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    timer = setInterval(next, 5000);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  btnNext.addEventListener("click", () => { stopAuto(); next(); startAuto(); });
  btnPrev.addEventListener("click", () => { stopAuto(); prev(); startAuto(); });

  // Cargar ofertas reales
  fetch("data/offers.json", { cache: "no-store" })
    .then(r => r.json())
    .then(data => {
      // data debe ser array
      offers = Array.isArray(data) ? data : [];
      if (offers.length === 0) {
        // Si no hay ofertas, dejamos un slide limpio (sin “inventar” más)
        offers = [{
          title: "PRIME Suplementos",
          headline: "Ofertas del momento",
          subtitle: "Escríbenos por WhatsApp para consultar disponibilidad",
          badge: "",
          ctaText: "Ver Catálogo",
          ctaLink: "catalog.html",
          image: "assets/img/banners/hero.jpg"
        }];
      }
      renderSlides();
    })
    .catch(() => {
      offers = [{
        title: "PRIME Suplementos",
        headline: "Ofertas del momento",
        subtitle: "Escríbenos por WhatsApp para consultar disponibilidad",
        badge: "",
        ctaText: "Ver Catálogo",
        ctaLink: "catalog.html",
        image: "assets/img/banners/hero.jpg"
      }];
      renderSlides();
    });

  // Ajuste al cambiar tamaño
  window.addEventListener("resize", () => goTo(current));
})();
