const nodemailer = require('nodemailer');

// Allowed project slugs — prevents spam to arbitrary subjects
const ALLOWED_SLUGS = ['fbp','fdp','fzp','kbp','kdp','pf','vaz','ant','pt'];

const PROJECT_NAMES = {
  fbp: 'Formátování bakalářské práce',
  fdp: 'Formátování diplomové práce',
  fzp: 'Formátování závěrečných prací',
  kbp: 'Korektura bakalářské práce',
  kdp: 'Korektura diplomové práce',
  pf:  'ProfiFormátování',
  vaz: 'Vazbičov',
  ant: 'Antonín Bouchal',
  pt:  'Profitašky',
};

const RATING_LABELS = {
  1: '1 hvězda — Špatné',
  2: '2 hvězdy — Slabé',
  3: '3 hvězdy — Ujde to',
  4: '4 hvězdy — Dobré',
};

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://www.prodocum.cz');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { project, rating, name, email, category, message, honeypot } = req.body || {};

  // Honeypot anti-spam check
  if (honeypot) {
    return res.status(200).json({ ok: true }); // silently ignore bots
  }

  // Validation
  if (!ALLOWED_SLUGS.includes(project)) {
    return res.status(400).json({ error: 'Neplatný projekt.' });
  }
  if (![1,2,3,4].includes(Number(rating))) {
    return res.status(400).json({ error: 'Neplatné hodnocení.' });
  }
  if (!message || message.trim().length < 5) {
    return res.status(400).json({ error: 'Zpráva je příliš krátká.' });
  }

  const projectName  = PROJECT_NAMES[project];
  const ratingLabel  = RATING_LABELS[Number(rating)] || rating;
  const senderName   = name?.trim()  || 'Neuvedeno';
  const senderEmail  = email?.trim() || 'Neuvedeno';
  const categoryText = category?.trim() || 'Neuvedena';

  // Build email
  const subject = `[Zpětná vazba ${rating}★] ${projectName}`;

  const html = `
<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a2e;line-height:1.6;max-width:600px;margin:0 auto;padding:24px;">
  <div style="background:#4f46e5;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0;">
    <strong>Zpětná vazba od zákazníka</strong>
  </div>
  <div style="border:1px solid #e8e8ee;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#5a5a72;width:130px;">Projekt:</td>
          <td style="padding:6px 0;font-weight:600;">${projectName}</td></tr>
      <tr><td style="padding:6px 0;color:#5a5a72;">Hodnocení:</td>
          <td style="padding:6px 0;font-weight:600;">${ratingLabel}</td></tr>
      <tr><td style="padding:6px 0;color:#5a5a72;">Kategorie:</td>
          <td style="padding:6px 0;">${categoryText}</td></tr>
      <tr><td style="padding:6px 0;color:#5a5a72;">Jméno:</td>
          <td style="padding:6px 0;">${senderName}</td></tr>
      <tr><td style="padding:6px 0;color:#5a5a72;">E-mail:</td>
          <td style="padding:6px 0;">${senderEmail !== 'Neuvedeno'
            ? `<a href="mailto:${senderEmail}" style="color:#4f46e5;">${senderEmail}</a>`
            : 'Neuvedeno'}</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #e8e8ee;margin:20px 0;">
    <p style="color:#5a5a72;margin:0 0 8px 0;font-size:13px;">ZPRÁVA:</p>
    <p style="background:#f8f9fa;border-left:3px solid #4f46e5;padding:12px 16px;border-radius:0 6px 6px 0;margin:0;">${message.trim().replace(/\n/g, '<br>')}</p>
  </div>
  <p style="font-size:12px;color:#9ca3af;margin-top:16px;text-align:center;">
    Odesláno z prodocum.cz/feedback-${project}
  </p>
</body>
</html>`;

  // Send via Gmail SMTP
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Prodocum Feedback" <${process.env.GMAIL_USER}>`,
      to: process.env.FEEDBACK_TO || 'info@prodocum.cz',
      replyTo: senderEmail !== 'Neuvedeno' ? senderEmail : undefined,
      subject,
      html,
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Mail error:', err);
    return res.status(500).json({ error: 'Nepodařilo se odeslat zprávu. Zkuste to prosím znovu.' });
  }
};
