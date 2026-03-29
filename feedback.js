/* ========================================
   Prodocum.cz — Feedback Page Config & Logic
   ======================================== */

/**
 * PROJECT CONFIGURATION
 * =====================
 * To add a new project, add an entry to this object.
 * The key is the feedback slug used in the URL (e.g. /feedback-fbp).
 */
const FEEDBACK_PROJECTS = {
  fbp: {
    name: 'Formátování bakalářské práce',
    domain: 'formatovani-bakalarske-prace.cz',
    url: 'https://www.formatovani-bakalarske-prace.cz',
    primaryColor: '#2b579a',
    accentColor: '#fdb63a',
    team: 'Tým Formátování-bakalářské-práce.cz',
    emailSubject: 'Zpětná vazba — Formátování bakalářské práce',
  },
  fdp: {
    name: 'Formátování diplomové práce',
    domain: 'formatovani-diplomove-prace.cz',
    url: 'https://www.formatovani-diplomove-prace.cz',
    primaryColor: '#00826b',
    accentColor: '#fdb63a',
    team: 'Tým Formátování-diplomové-práce.cz',
    emailSubject: 'Zpětná vazba — Formátování diplomové práce',
  },
  fzp: {
    name: 'Formátování závěrečných prací',
    domain: 'formatovani-zaverecnych-praci.cz',
    url: 'https://www.formatovani-zaverecnych-praci.cz',
    primaryColor: '#7ab317',
    accentColor: '#7ab317',
    team: 'Tým Formátování-závěrečných-prací.cz',
    emailSubject: 'Zpětná vazba — Formátování závěrečných prací',
  },
  kbp: {
    name: 'Korektura bakalářské práce',
    domain: 'korektura-bakalarske-prace.cz',
    url: 'https://www.korektura-bakalarske-prace.cz',
    primaryColor: '#001f3e',
    accentColor: '#c83d37',
    team: 'Tým Korektura-bakalářské-práce.cz',
    emailSubject: 'Zpětná vazba — Korektura bakalářské práce',
  },
  kdp: {
    name: 'Korektura diplomové práce',
    domain: 'korektura-diplomove-prace.cz',
    url: 'https://www.korektura-diplomove-prace.cz',
    primaryColor: '#0d1f2d',
    accentColor: '#1a7a68',
    team: 'Tým Korektura-diplomové-práce.cz',
    emailSubject: 'Zpětná vazba — Korektura diplomové práce',
  },
  pf: {
    name: 'ProfiFormátování',
    domain: 'profiformatovani.cz',
    url: 'https://www.profiformatovani.cz',
    primaryColor: '#010101',
    accentColor: '#2861ff',
    team: 'Tým ProfiFormátování.cz',
    emailSubject: 'Zpětná vazba — ProfiFormátování',
  },
  vaz: {
    name: 'Vazbičov',
    domain: 'vazbicov.cz',
    url: 'https://www.vazbicov.cz',
    primaryColor: '#1c9bd6',
    accentColor: '#ef7d46',
    team: 'Tým Vazbičov.cz',
    emailSubject: 'Zpětná vazba — Vazbičov',
  },
  ant: {
    name: 'Antonín Bouchal',
    domain: 'antoninbouchal.cz',
    url: 'https://www.antoninbouchal.cz',
    primaryColor: '#000000',
    accentColor: '#f7b174',
    team: 'Antonín Bouchal',
    emailSubject: 'Zpětná vazba — Antonín Bouchal',
  },
  pt: {
    name: 'Profitašky',
    domain: 'profitasky.cz',
    url: 'https://www.profitasky.cz',
    primaryColor: '#152349',
    accentColor: '#159298',
    team: 'Tým Profitasky.cz',
    emailSubject: 'Zpětná vazba — Profitašky',
  },
};

const RATING_LABELS = {
  1: { emoji: '😞', label: 'Špatné' },
  2: { emoji: '😕', label: 'Slabé' },
  3: { emoji: '😐', label: 'Ujde to' },
  4: { emoji: '🙂', label: 'Dobré' },
};

const CATEGORIES = [
  { value: '', label: '— Vyberte kategorii (nepovinné) —' },
  { value: 'kvalita', label: 'Kvalita práce' },
  { value: 'komunikace', label: 'Komunikace' },
  { value: 'termin', label: 'Termín dodání' },
  { value: 'cena', label: 'Cena' },
  { value: 'jine', label: 'Jiné' },
];

/* --- Parse URL --- */
function getProjectSlug() {
  const path = window.location.pathname;
  const match = path.match(/\/feedback-([a-z]+)/);
  return match ? match[1] : null;
}

function getRating() {
  const params = new URLSearchParams(window.location.search);
  const r = parseInt(params.get('rating'), 10);
  return r >= 1 && r <= 4 ? r : null;
}

/* --- Apply branding --- */
function applyBranding(project) {
  document.documentElement.style.setProperty('--fb-primary', project.primaryColor);
  document.documentElement.style.setProperty('--fb-accent', project.accentColor);

  document.getElementById('fb-project-name').textContent = project.name;
  document.getElementById('fb-project-link').href = project.url;
  document.getElementById('fb-project-link').textContent = project.domain;

  document.title = `Zpětná vazba — ${project.name}`;
}

/* --- Render rating indicator --- */
function renderRating(rating) {
  const container = document.getElementById('fb-rating-display');
  if (!rating) {
    container.style.display = 'none';
    return;
  }
  const info = RATING_LABELS[rating];
  if (!info) {
    container.style.display = 'none';
    return;
  }
  document.getElementById('fb-rating-emoji').textContent = info.emoji;
  document.getElementById('fb-rating-label').textContent = info.label;
  document.getElementById('fb-rating-value').value = rating;
}

/* --- Build category select --- */
function buildCategories() {
  const select = document.getElementById('fb-category');
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.value;
    opt.textContent = cat.label;
    select.appendChild(opt);
  });
}

/* --- Form submission --- */
function initForm(project, rating) {
  const form = document.getElementById('fb-form');
  const successEl = document.getElementById('fb-success');
  const formContent = document.getElementById('fb-form-content');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      project: project.domain,
      projectSlug: getProjectSlug(),
      rating: rating,
      category: document.getElementById('fb-category').value,
      message: document.getElementById('fb-message').value,
      name: document.getElementById('fb-name').value,
      email: document.getElementById('fb-email').value,
      timestamp: new Date().toISOString(),
    };

    /*
     * ============================================
     * BACKEND INTEGRATION POINT
     * ============================================
     * Replace the block below with your API call.
     * Example with fetch:
     *
     *   fetch('https://your-api.com/feedback', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify(data),
     *   })
     *   .then(() => showSuccess())
     *   .catch(() => showError());
     *
     * Options:
     *   - Vercel Serverless Function (/api/feedback)
     *   - Formspree / Formspark
     *   - Google Sheets via Apps Script
     *   - Email via SendGrid/Mailgun
     * ============================================
     */

    // Fallback: mailto with pre-filled data
    const subject = encodeURIComponent(project.emailSubject);
    const body = encodeURIComponent(
      `Projekt: ${project.name} (${project.domain})\n` +
      `Hodnocení: ${rating || 'neuvedeno'}\n` +
      `Kategorie: ${data.category || 'neuvedena'}\n` +
      `Jméno: ${data.name || 'neuvedeno'}\n` +
      `E-mail: ${data.email || 'neuvedeno'}\n\n` +
      `Zpráva:\n${data.message}`
    );

    // Open mailto as backup, then show success
    window.location.href = `mailto:info@prodocum.cz?subject=${subject}&body=${body}`;

    // Show success state
    setTimeout(() => {
      formContent.style.display = 'none';
      successEl.style.display = 'block';
    }, 500);
  });
}

/* --- 404 state --- */
function showNotFound() {
  document.getElementById('fb-form-content').innerHTML = `
    <div style="text-align:center;padding:3rem 1rem;">
      <p style="font-size:1.25rem;color:#374151;margin-bottom:1rem;">Stránka nenalezena</p>
      <a href="/" style="color:var(--fb-primary);text-decoration:underline;">Zpět na hlavní stránku</a>
    </div>
  `;
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
  const slug = getProjectSlug();
  const rating = getRating();
  const project = slug ? FEEDBACK_PROJECTS[slug] : null;

  if (!project) {
    showNotFound();
    return;
  }

  applyBranding(project);
  renderRating(rating);
  buildCategories();
  initForm(project, rating);
});
