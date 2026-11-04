/* YBCSOFT main.js: navigation, sticky header, back-to-top, counters, testimonial slider */
document.documentElement.classList.add('js');
(function () {
  const header = document.getElementById('header'), nav = document.getElementById('nav'),
        burger = document.getElementById('burger'), top = document.getElementById('top');
  document.getElementById('yr').textContent = new Date().getFullYear();
  const setNav = open => { nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => setNav(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });
  addEventListener('scroll', () => {
    header.classList.toggle('scrolled', scrollY > 20);
    top.classList.toggle('show', scrollY > 500);
  }, { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Testimonial slider
  const slides = [...document.querySelectorAll('.slide')], dots = document.getElementById('sdots');
  if (slides.length) {
    let i = 0, timer;
    const show = n => { i = n; slides.forEach((s, k) => s.classList.toggle('on', k === n));
      [...dots.children].forEach((d, k) => d.classList.toggle('on', k === n)); };
    slides.forEach((_, k) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Show testimonial ' + (k + 1));
      b.onclick = () => { show(k); start(); }; dots.appendChild(b); });
    const start = () => { clearInterval(timer); timer = setInterval(() => show((i + 1) % slides.length), 5000); };
    show(0); start();
  }
})();
