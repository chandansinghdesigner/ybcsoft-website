/* YBCSOFT fx.js: scroll progress, hero particle network, typewriter, card tilt, stagger reveal */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll progress bar
  const bar = document.createElement('div'); bar.id = 'progress'; document.body.prepend(bar);
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // stagger delays for groups of revealed items
  document.querySelectorAll('.grid, .stats, .steps, .tech, .promise, .svcs').forEach(g => {
    [...g.children].forEach((c, i) => { if (c.classList.contains('reveal')) c.style.setProperty('--d', (i % 6) * 0.08 + 's'); });
  });

  if (reduce) { const t = document.querySelector('.type'); if (t) { t.style.animation = 'none'; t.style.borderRight = '0'; } return; }

  // typewriter
  const type = document.querySelector('.type');
  if (type) {
    const words = (type.dataset.words || '').split('|').filter(Boolean);
    let w = 0, c = 0, del = false;
    (function tick() {
      const word = words[w];
      type.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; return setTimeout(tick, 350); }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 85);
    })();
  }

  // hero particle network
  const cv = document.getElementById('fx');
  if (cv) {
    const ctx = cv.getContext('2d'); let W, H, pts = [], mouse = { x: -999, y: -999 };
    const size = () => {
      const r = cv.parentElement.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.floor(W * H / 16000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: Math.random() * 1.8 + .8 }));
    };
    size(); addEventListener('resize', size);
    cv.parentElement.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    cv.parentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
    let on = true; new IntersectionObserver(es => { on = es[0].isIntersecting; if (on) draw(); }).observe(cv);
    function draw() {
      if (!on) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = 'rgba(255,240,0,.85)'; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) { ctx.strokeStyle = 'rgba(255,240,0,' + (0.22 * (1 - d / 120)) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const m = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
        if (m < 150) { ctx.strokeStyle = 'rgba(237,48,56,' + (0.6 * (1 - m / 150)) + ')'; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // 3D tilt on cards (desktop pointers only)
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.card, .pr, .stats > div').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transition = 'transform .1s';
        el.style.transform = 'perspective(700px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave', () => { el.style.transition = 'transform .4s'; el.style.transform = ''; });
    });
  }
})();
