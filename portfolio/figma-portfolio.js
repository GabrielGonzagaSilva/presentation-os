(() => {
  const root = document.documentElement;
  const storageKey = 'gg-portfolio-lang';
  const btn = document.querySelector('[data-lang-toggle]');
  const en = document.querySelector('[data-lang-en]');
  const pt = document.querySelector('[data-lang-pt]');

  function applyLanguage(lang) {
    const next = lang === 'pt' ? 'pt' : 'en';
    root.lang = next === 'pt' ? 'pt-BR' : 'en';
    root.dataset.lang = next;

    document.querySelectorAll('[data-en][data-pt]').forEach((node) => {
      node.textContent = next === 'pt' ? node.dataset.pt : node.dataset.en;
    });

    if (en) en.classList.toggle('active', next === 'en');
    if (pt) pt.classList.toggle('active', next === 'pt');
    if (btn) btn.setAttribute('aria-label', next === 'pt' ? 'Mudar idioma para inglês' : 'Change language to Portuguese');

    try { localStorage.setItem(storageKey, next); } catch (_) {}
  }

  let initial = 'en';
  try { initial = localStorage.getItem(storageKey) || 'en'; } catch (_) {}
  applyLanguage(initial);

  btn?.addEventListener('click', () => {
    applyLanguage(root.dataset.lang === 'en' ? 'pt' : 'en');
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
