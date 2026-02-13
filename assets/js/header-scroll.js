// assets/js/header-scroll.js
(() => {
  const header = document.querySelector(".header");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const DELTA = 8;          // sensibilidad
  const MIN_Y = 80;         // antes de 80px no ocultar (se siente mejor)
  const FORCE_SHOW_Y = 10;  // muy arriba siempre mostrar

  function onScroll() {
    const y = window.scrollY;

    // siempre visible cerca del top
    if (y <= FORCE_SHOW_Y) {
      header.classList.remove("header-hidden");
      lastY = y;
      ticking = false;
      return;
    }

    const diff = y - lastY;

    // ignorar micro movimientos
    if (Math.abs(diff) < DELTA) {
      ticking = false;
      return;
    }

    // bajar => ocultar (solo después de cierto punto)
    if (diff > 0 && y > MIN_Y) {
      header.classList.add("header-hidden");
    } else {
      // subir => mostrar
      header.classList.remove("header-hidden");
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();
