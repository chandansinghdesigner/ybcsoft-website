<?php
// Copy to config.php (never commit it) OR set these as real server environment variables.
return [
  'SMTP_HOST' => 'smtp.gmail.com',
  'SMTP_PORT' => 587,
  'SMTP_USER' => 'ybcsoft7677@gmail.com',
  'SMTP_PASS' => 'YOUR_GMAIL_APP_PASSWORD', // Google Account > Security > App passwords
  'MAIL_TO'   => 'ybcsoft7677@gmail.com',
  'MAIL_FROM' => 'ybcsoft7677@gmail.com',
  'DEBUG'     => false, // set true temporarily to see the real SMTP error
];
