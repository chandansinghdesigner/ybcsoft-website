# YBCSOFT website: setup and deployment

1. Upload the whole YBCSOFT folder to PHP hosting (PHP 8.0+), e.g. cPanel `public_html`.
2. In the site root run `composer require phpmailer/phpmailer` (creates `vendor/`). No SSH? Run it on your computer and upload `vendor/`.
3. Copy `backend/config.example.php` to `backend/config.php` and fill in SMTP details. For Gmail, enable 2-step verification and create an App Password. Alternatively set the same keys as server environment variables. Never put credentials in JS.
4. Turn on HTTPS and test the form on contact.html.
5. Local test: `php -S localhost:8000` in the project folder.
6. Replace the demo portfolio, testimonials and stats with real content. Add a Google Maps embed on contact.html once you have a public address.

## Form not sending? Checklist
- Open `/backend/send-email.php` in the browser. You should see `{"success":false,"message":"Method not allowed"}`. If you see code or a download, PHP is not running (Live Server and static hosts like GitHub Pages or Netlify do not run PHP).
- The error text under the form now names the problem: missing `config.php`, missing `vendor/` (PHPMailer) or SMTP login failure.
- Set `'DEBUG' => true` in `config.php` temporarily to see the SMTP error. Gmail needs an App Password, not your normal password.

## Vercel deployment (Node.js email)
The contact form posts to `/api/send-email` (api/send-email.js, Nodemailer). In Vercel > Project > Settings > Environment Variables add `SMTP_USER` (your Gmail), `SMTP_PASS` (Gmail App Password) and optionally `MAIL_TO`, then redeploy. The PHP backend is only for PHP hosting.
