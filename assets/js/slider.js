async function initHeroSlider() {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  let offers = [];
  try {
    const res = await fetch("data/offers.json");
    offers = await res.json();
  } catch (e) {
    console.error("No se pudo cargar offers.json", e);
    return;
  }

  const slidesWrap = slider.querySelector(".slides");
  const dotsWrap = slider.querySelector(".dots");

  slidesWrap.innerHTML = offers.map((o, i) => `
    <article class="slide ${i === 0 ? "active" : ""}" style="background-image:url('${o.image}')">
      <div class="overlay"></div>
      <div class="container slide-content">
        <div class="kicker">
          <span class="pill">${o.title}</span>
          <span class="tag">${o.badge}</span>
        </div>
        <h1>${o.headline}</h1>
        <p>${o.subtitle}</p>
        <a class="btn-primary" href="${o.ctaLink}">${o.ctaText}</a>
      </div>
    </article>
  `).join("");

  dotsWrap.innerHTML = offers.map((_, i) => `
    <button class="dot ${i === 0 ? "active" : ""}" aria-label="Ir a slide ${i+1}"></button>
  `).join("");

  const slides = [...slidesWrap.querySelectorAll(".slide")];
  const dots = [...dotsWrap.querySelectorAll(".dot")];
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");

  let index = 0;
  let timer = null;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("active", n === index));
    dots.forEach((d, n) => d.classList.toggle("active", n === index));
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, 5000);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach((dot, i) => dot.addEventListener("click", () => { goTo(i); startAuto(); }));
  nextBtn.addEventListener("click", () => { next(); startAuto(); });
  prevBtn.addEventListener("click", () => { prev(); startAuto(); });

  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);

  // Swipe en móvil
  let startX = 0;
  slider.addEventListener("touchstart", (e) => startX = e.touches[0].clientX, { passive: true });
  slider.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > 50) {
      diff < 0 ? next() : prev();
      startAuto();
    }
  }, { passive: true });

  goTo(0);
  startAuto();
}

document.addEventListener("DOMContentLoaded", initHeroSlider);
