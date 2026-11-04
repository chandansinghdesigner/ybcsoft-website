/* YBCSOFT portfolio.js: category filtering */
(function () {
  const btns = document.querySelectorAll('.fbtn'), cards = document.querySelectorAll('.pcard');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.toggle('on', x === b));
    const f = b.dataset.filter;
    cards.forEach(c => {
      const match = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('hide', !match);
      if (match) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
    });
  }));
})();
