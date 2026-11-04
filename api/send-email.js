// Vercel serverless function: receives the contact form and emails it via Nodemailer (Gmail SMTP).
// Credentials come only from Vercel Environment Variables: SMTP_USER, SMTP_PASS, MAIL_TO (optional).
const nodemailer = require('nodemailer');

const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (v, n) => String(v || '').trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ success: true, message: 'OK' }); // honeypot for bots

  const name = clip(b.name, 100), email = clip(b.email, 150), phone = clip(b.phone, 30),
        company = clip(b.company, 100), service = clip(b.service, 100), budget = clip(b.budget, 60),
        message = clip(b.message, 4000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 10)
    return res.status(422).json({ success: false, message: 'Invalid input' });

  const user = process.env.SMTP_USER, pass = process.env.SMTP_PASS;
  if (!user || !pass) return res.status(500).json({ success: false, message: 'SMTP_USER / SMTP_PASS not set in Vercel Environment Variables' });

  const when = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
  const rows = { Name: name, Email: email, Phone: phone || '-', Company: company || '-', Service: service || '-', Budget: budget || '-', Submitted: when };
  const html = '<h2>New YBCSOFT website inquiry</h2><table cellpadding="6" border="1" style="border-collapse:collapse">' +
    Object.entries(rows).map(([k, v]) => `<tr><th align="left">${k}</th><td>${esc(v)}</td></tr>`).join('') +
    `</table><h3>Message</h3><p>${esc(message).replace(/\n/g, '<br>')}</p>`;

  try {
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } });
    await transporter.sendMail({
      from: `"YBCSOFT Website" <${user}>`,
      to: process.env.MAIL_TO || 'ybcsoft7677@gmail.com',
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `New inquiry from ${name}`,
      html,
      text: Object.entries(rows).map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nMessage:\n${message}`
    });
    return res.status(200).json({ success: true, message: 'Sent' });
  } catch (e) {
    console.error('Mail error:', e.message);
    return res.status(500).json({ success: false, message: 'Mail failed: ' + e.message });
  }
};
