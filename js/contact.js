/* YBCSOFT contact.js: validation + submit to backend/send-email.php */
(function () {
  const form = document.getElementById('cform'), btn = document.getElementById('sbtn'),
        msg = document.getElementById('fmsg'), thanks = document.getElementById('thanks');
  let sending = false;
  const pre = new URLSearchParams(location.search).get('service');
  if (pre) form.service.value = pre;
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email address.',
    message: v => v.trim().length >= 10 || 'Describe your project in at least 10 characters.'
  };
  const check = k => { const f = form[k], r = rules[k](f.value), ok = r === true;
    f.classList.toggle('bad', !ok); f.parentElement.querySelector('.err').textContent = ok ? '' : r; return ok; };
  Object.keys(rules).forEach(k => form[k].addEventListener('blur', () => check(k)));
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (sending) return;
    msg.textContent = ''; msg.className = '';
    if (!Object.keys(rules).map(check).every(Boolean)) return;
    sending = true; btn.disabled = true; btn.querySelector('.bt').textContent = 'Sending...'; btn.querySelector('.spin').hidden = false;
    try {
      const res = await fetch('/api/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const raw = await res.text(); let data;
      try { data = JSON.parse(raw); } catch (_) { throw new Error(res.status === 404 ? 'email service not found (/api/send-email)' : 'email service returned an invalid response'); }
      if (!res.ok || !data.success) throw new Error(data.message || 'Request failed');
      form.hidden = true; thanks.hidden = false; thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      msg.className = 'error';
      msg.textContent = 'We could not send your inquiry (' + err.message + '). ';
      const a = document.createElement('a'); a.textContent = 'Send by email instead';
      a.href = 'mailto:ybcsoft7677@gmail.com?subject=' + encodeURIComponent('Project inquiry from ' + form.name.value) + '&body=' + encodeURIComponent(form.message.value);
      a.style.textDecoration = 'underline'; msg.appendChild(a);
      sending = false; btn.disabled = false; btn.querySelector('.bt').textContent = 'Send Your Inquiry'; btn.querySelector('.spin').hidden = true;
    }
  });
})();
