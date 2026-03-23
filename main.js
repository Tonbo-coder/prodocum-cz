/* ========================================
   Prodocum.cz — Main Script
   ======================================== */

/**
 * PROJECT DATA
 * ============
 * To add a new project, add an object to this array.
 * Cards are generated automatically.
 *
 * Fields:
 *   name        — Display name
 *   url         — Full URL
 *   domain      — Domain shown on card
 *   category    — Short category label
 *   desc        — One-line description
 *   img         — Hero image URL from the project's website
 *   imgPos      — CSS object-position (e.g. "right center", "left top")
 *   variant     — CSS color variant (format | review | print | multi)
 */
const PROJECTS = [
  {
    name: 'Formátování bakalářské práce',
    url: 'https://www.formatovani-bakalarske-prace.cz',
    domain: 'formatovani-bakalarske-prace.cz',
    category: 'Formátování',
    desc: 'Profesionální formátování bakalářských prací podle norem vaší univerzity.',
    img: '/images/formatovani-bakalarske-prace.png',
    imgPos: 'right center',
    variant: 'format',
  },
  {
    name: 'Formátování diplomové práce',
    url: 'https://www.formatovani-diplomove-prace.cz',
    domain: 'formatovani-diplomove-prace.cz',
    category: 'Formátování',
    desc: 'Přesné formátování diplomových prací s důrazem na detail a soulad s předpisy.',
    img: '/images/formatovani-diplomove-prace-new.png',
    imgPos: 'right center',
    variant: 'format',
  },
  {
    name: 'Formátování závěrečných prací',
    url: 'https://www.formatovani-zaverecnych-praci.cz',
    domain: 'formatovani-zaverecnych-praci.cz',
    category: 'Formátování',
    desc: 'Kompletní formátování všech typů závěrečných prací — od struktury po citace.',
    img: '/images/formatovani-zaverecne-prace.webp',
    imgPos: 'center center',
    variant: 'format',
  },
  {
    name: 'Korektura bakalářské práce',
    url: 'https://www.korektura-bakalarske-prace.cz',
    domain: 'korektura-bakalarske-prace.cz',
    category: 'Korektury',
    desc: 'Jazyková korektura a stylistická úprava bakalářských prací.',
    img: '/images/korektura-bakalarske-prace.png',
    imgPos: 'right center',
    variant: 'review',
  },
  {
    name: 'Korektura diplomové práce',
    url: 'https://www.korektura-diplomove-prace.cz',
    domain: 'korektura-diplomove-prace.cz',
    category: 'Korektury',
    desc: 'Důkladná korektura diplomových prací včetně kontroly odborné terminologie.',
    img: '/images/KorekturaDP.png',
    imgPos: 'right center',
    variant: 'review',
  },
  {
    name: 'ProfiFormátování',
    url: 'https://www.profiformatovani.cz',
    domain: 'profiformatovani.cz',
    category: 'Formátování',
    desc: 'Profesionální formátování dokumentů pro firmy i jednotlivce.',
    img: '/images/Profiformatovani_cz_uvodni_foto1.webp',
    imgPos: 'center top',
    variant: 'multi',
  },
  {
    name: 'Vazbičov',
    url: 'https://www.vazbicov.cz',
    domain: 'vazbicov.cz',
    category: 'Vazby a tisk',
    desc: 'Kvalitní vazby a tisk závěrečných prací s expresním zpracováním.',
    img: '/images/banner-top.png',
    imgPos: 'center center',
    variant: 'print',
  },
];

/* --- Fallback SVG placeholder (used when img is null) --- */
const PLACEHOLDER_SVG = `<svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="card__img card__img--svg" aria-hidden="true">
  <rect width="160" height="100" fill="#f5f5f8"/>
  <rect x="50" y="22" width="60" height="56" rx="4" fill="#e8e8f0" stroke="#d0d0de" stroke-width="1.5"/>
  <rect x="60" y="32" width="40" height="2.5" rx="1.25" fill="#c7c7d8"/>
  <rect x="60" y="39" width="34" height="2" rx="1" fill="#dcdce8"/>
  <rect x="60" y="45" width="38" height="2" rx="1" fill="#dcdce8"/>
  <rect x="60" y="55" width="40" height="2.5" rx="1.25" fill="#c7c7d8"/>
  <rect x="60" y="62" width="30" height="2" rx="1" fill="#dcdce8"/>
</svg>`;

/* --- Render project cards --- */
function renderCards() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  const arrowSVG = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  grid.innerHTML = PROJECTS.map((project, index) => {
    const visual = project.img
      ? `<img
           class="card__img"
           src="${project.img}"
           alt="${project.name}"
           style="object-position: ${project.imgPos};"
           loading="lazy"
           decoding="async"
         >`
      : PLACEHOLDER_SVG;

    return `
    <a href="${project.url}"
       target="_blank"
       rel="noopener noreferrer"
       class="card card--${project.variant} animate-on-scroll"
       style="transition-delay: ${index * 0.07}s"
       aria-label="${project.name} — přejít na ${project.domain}">
      <div class="card__visual">
        ${visual}
      </div>
      <div class="card__content">
        <div class="card__category">${project.category}</div>
        <h3 class="card__name">${project.name}</h3>
        <p class="card__desc">${project.desc}</p>
        <div class="card__link-row">
          <span>${project.domain}</span>
          ${arrowSVG}
        </div>
      </div>
    </a>
  `;
  }).join('');
}

/* --- Scroll-triggered reveal --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach((el) => observer.observe(el));
  } else {
    elements.forEach((el) => el.classList.add('is-visible'));
  }
}

/* --- Header scroll effect --- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('header--scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* --- Smooth scroll for anchor links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* --- Footer year --- */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  setFooterYear();
  initHeaderScroll();
  initSmoothScroll();

  requestAnimationFrame(() => {
    initScrollAnimations();
  });
});
