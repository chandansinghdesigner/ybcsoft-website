<?php
// Receives the contact form and emails it via PHPMailer + SMTP. Credentials come from config.php or env vars only.
header('Content-Type: application/json');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function out($ok, $msg, $code = 200) { http_response_code($code); echo json_encode(['success' => $ok, 'message' => $msg]); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 'Method not allowed', 405);
if (!empty($_POST['website'])) out(true, 'OK'); // honeypot: bots fill this field

session_start();
if (isset($_SESSION['last_sent']) && time() - $_SESSION['last_sent'] < 60) out(false, 'Please wait a minute before sending again.', 429);

$cfg = is_file(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
$env = fn($k, $d = '') => $cfg[$k] ?? getenv($k) ?: $d;
$clean = fn($k, $max = 200) => trim(mb_substr(strip_tags($_POST[$k] ?? ''), 0, $max));

$name = $clean('name', 100); $email = trim($_POST['email'] ?? ''); $phone = $clean('phone', 30);
$company = $clean('company', 100); $service = $clean('service', 100); $budget = $clean('budget', 60);
$message = $clean('message', 4000);
if (strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($message) < 10) out(false, 'Invalid input', 422);

if (!$env('SMTP_USER') || !$env('SMTP_PASS')) out(false, 'SMTP not configured: create backend/config.php', 500);
$auto = __DIR__ . '/../vendor/autoload.php';
if (!is_file($auto)) out(false, 'PHPMailer missing: run composer require phpmailer/phpmailer', 500);
require_once $auto;
$h = fn($s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
$when = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('d M Y, h:i A') . ' IST';
$rows = ['Name' => $name, 'Email' => $email, 'Phone' => $phone ?: '-', 'Company' => $company ?: '-', 'Service' => $service ?: '-', 'Budget' => $budget ?: '-', 'Submitted' => $when];
$html = '<h2>New YBCSOFT website inquiry</h2><table cellpadding="6" border="1" style="border-collapse:collapse">';
foreach ($rows as $k => $v) $html .= "<tr><th align='left'>$k</th><td>" . $h($v) . '</td></tr>';
$html .= '</table><h3>Message</h3><p>' . nl2br($h($message)) . '</p>';

try {
  $m = new PHPMailer(true);
  $m->isSMTP(); $m->Host = $env('SMTP_HOST'); $m->SMTPAuth = true;
  $m->Username = $env('SMTP_USER'); $m->Password = $env('SMTP_PASS');
  $m->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; $m->Port = (int) $env('SMTP_PORT', 587);
  $m->setFrom($env('MAIL_FROM'), 'YBCSOFT Website');
  $m->addAddress($env('MAIL_TO', 'ybcsoft7677@gmail.com'));
  $m->addReplyTo($email, $name);
  $m->isHTML(true); $m->Subject = "New inquiry from $name"; $m->Body = $html;
  $m->AltBody = strip_tags(str_replace(['</tr>', '<br>'], "\n", $html));
  $m->send();
  $_SESSION['last_sent'] = time();
  out(true, 'Sent');
} catch (\Throwable $e) {
  error_log('YBCSOFT mail error: ' . $e->getMessage());
  out(false, $env('DEBUG') ? $e->getMessage() : 'Mail could not be sent', 500);
}
