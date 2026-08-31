(() => {
  const root = document.documentElement;
  const storageKey = 'gg-portfolio-lang';
  const btn = document.querySelector('[data-lang-toggle]');
  const en = document.querySelector('[data-lang-en]');
  const pt = document.querySelector('[data-lang-pt]');
  const main = document.querySelector('main');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let skipLink = null;

  if (main) {
    if (!main.id) main.id = 'main-content';
    skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = `#${main.id}`;
    document.body.prepend(skipLink);

    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
      main.scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  }

  function syncNavigation(lang) {
    const isPt = lang === 'pt';
    document.querySelectorAll('.nav').forEach((nav) => {
      nav.setAttribute('aria-label', isPt ? 'Navegação principal' : 'Primary navigation');
    });
    if (skipLink) skipLink.textContent = isPt ? 'Ir para o conteúdo' : 'Skip to content';
    if (btn) btn.setAttribute('aria-label', isPt ? 'Mudar idioma para inglês' : 'Change language to Portuguese');
  }

  function applyLanguage(lang) {
    const next = lang === 'pt' ? 'pt' : 'en';
    root.lang = next === 'pt' ? 'pt-BR' : 'en';
    root.dataset.lang = next;

    document.querySelectorAll('[data-en][data-pt]').forEach((node) => {
      node.textContent = next === 'pt' ? node.dataset.pt : node.dataset.en;
    });

    if (en) en.classList.toggle('active', next === 'en');
    if (pt) pt.classList.toggle('active', next === 'pt');
    syncNavigation(next);
    try { localStorage.setItem(storageKey, next); } catch (_) {}
  }

  function enhanceBrandLogos() {
    const script = document.querySelector('script[src$="figma-portfolio.js"]');
    if (!script) return;
    const sprite = new URL('assets/brand-sprite.svg', script.src).href;

    const education = {
      UNICID: { id: 'unicid', width: 24, height: 24 },
      Mergo: { id: 'mergo', width: 24, height: 24 },
      'Escola CUCA': { id: 'escola-cuca', width: 48, height: 20 },
      SAGA: { id: 'saga', width: 48, height: 24 }
    };
    const tools = {
      Figma: 'figma',
      ChatGPT: 'chatgpt',
      Claude: 'claude',
      Photoshop: 'photoshop',
      Illustrator: 'illustrator',
      Notion: 'notion'
    };

    function logoSvg(id, width, height) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      svg.setAttribute('width', String(width));
      svg.setAttribute('height', String(height));
      svg.setAttribute('viewBox', id === 'escola-cuca' ? '0 0 96 30' : id === 'saga' ? '0 0 96 48' : '0 0 48 48');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.style.display = 'block';
      svg.style.flex = '0 0 auto';
      use.setAttribute('href', `${sprite}#${id}`);
      svg.appendChild(use);
      return svg;
    }

    document.querySelectorAll('.edu-card .brand-label').forEach((label) => {
      const name = label.textContent.trim();
      const config = education[name];
      if (!config) return;
      label.replaceChildren(logoSvg(config.id, config.width, config.height));
      label.setAttribute('role', 'img');
      label.setAttribute('aria-label', name);
      label.style.justifyContent = 'center';
    });

    document.querySelectorAll('.tool-chip').forEach((chip) => {
      const name = chip.textContent.trim();
      const id = tools[name];
      if (!id) return;
      chip.replaceChildren(logoSvg(id, 24, 24));
      chip.setAttribute('role', 'img');
      chip.setAttribute('aria-label', name);
      chip.style.justifyContent = 'center';
    });
  }

  document.querySelectorAll('.project-arrow').forEach((node) => node.setAttribute('aria-hidden', 'true'));

  document.querySelectorAll('.nav a').forEach((link) => {
    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && !url.hash) {
        link.setAttribute('aria-current', 'page');
      }
    } catch (_) {}
  });

  enhanceBrandLogos();

  let initial = 'en';
  try { initial = localStorage.getItem(storageKey) || 'en'; } catch (_) {}
  applyLanguage(initial);

  btn?.addEventListener('click', () => applyLanguage(root.dataset.lang === 'en' ? 'pt' : 'en'));

  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });
      if (history.pushState) history.pushState(null, '', selector);
    });
  });
})();
