/* YBCSOFT animations.js: Intersection Observer reveal + animated counters */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = el => {
    const end = +el.dataset.count; if (reduce) { el.textContent = end; return; }
    const t0 = performance.now();
    (function tick(t) { const p = Math.min((t - t0) / 1500, 1); el.textContent = Math.round(end * p);
      if (p < 1) requestAnimationFrame(tick); })(t0);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(count);
    io.unobserve(e.target);
  }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }));
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
})();
