(() => {
  const root = document.documentElement;
  const body = document.body;
  const themeButton = document.getElementById('themeToggle');
  const languageButton = document.getElementById('langToggle');
  const menuButton = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const metaDescription = document.querySelector('meta[name="description"]');
  const year = document.getElementById('year');

  const safeGet = (key) => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) {}
  };

  const currentLanguage = () => root.dataset.lang === 'pt' ? 'pt' : 'en';
  const currentTheme = () => root.dataset.theme === 'light' ? 'light' : 'dark';

  const updateThemeControls = () => {
    const lang = currentLanguage();
    const theme = currentTheme();
    const target = theme === 'dark' ? 'light' : 'dark';
    if (themeButton) {
      const label = lang === 'pt'
        ? `Mudar para tema ${target === 'light' ? 'claro' : 'escuro'}`
        : `Switch to ${target} theme`;
      themeButton.setAttribute('aria-label', label);
      themeButton.setAttribute('title', label);
    }
    if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#f5f8fb' : '#080b10');
  };

  const applyTheme = (theme, persist = true) => {
    root.dataset.theme = theme === 'light' ? 'light' : 'dark';
    if (persist) safeSet('gg-theme', root.dataset.theme);
    updateThemeControls();
  };

  const applyLanguage = (lang, persist = true) => {
    lang = lang === 'pt' ? 'pt' : 'en';
    root.dataset.lang = lang;
    root.lang = lang === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-en][data-pt]').forEach((el) => {
      el.textContent = lang === 'pt' ? el.dataset.pt : el.dataset.en;
    });
    document.querySelectorAll('[data-aria-en][data-aria-pt]').forEach((el) => {
      el.setAttribute('aria-label', lang === 'pt' ? el.dataset.ariaPt : el.dataset.ariaEn);
    });

    if (body) {
      const nextTitle = lang === 'pt' ? body.dataset.titlePt : body.dataset.titleEn;
      const nextDescription = lang === 'pt' ? body.dataset.descriptionPt : body.dataset.descriptionEn;
      if (nextTitle) document.title = nextTitle;
      if (metaDescription && nextDescription) metaDescription.setAttribute('content', nextDescription);
    }

    if (languageButton) {
      const label = lang === 'en' ? 'Switch to Portuguese' : 'Mudar para inglês';
      languageButton.setAttribute('aria-label', label);
      languageButton.setAttribute('title', lang === 'en' ? 'Português' : 'English');
    }

    if (menuButton && menuButton.getAttribute('aria-expanded') !== 'true') {
      menuButton.setAttribute('aria-label', lang === 'pt' ? 'Abrir menu' : 'Open menu');
    }

    if (persist) safeSet('gg-lang', lang);
    updateThemeControls();
  };

  const setMenuState = (open) => {
    if (!menuButton || !mobileNav) return;
    const lang = currentLanguage();
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? (lang === 'pt' ? 'Fechar menu' : 'Close menu') : (lang === 'pt' ? 'Abrir menu' : 'Open menu'));
    mobileNav.classList.toggle('is-open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    try { mobileNav.inert = !open; } catch (_) {}
  };

  applyTheme(safeGet('gg-theme') || 'dark', false);
  applyLanguage(safeGet('gg-lang') || 'en', false);
  setMenuState(false);

  themeButton?.addEventListener('click', () => {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  languageButton?.addEventListener('click', () => {
    applyLanguage(currentLanguage() === 'en' ? 'pt' : 'en');
  });

  menuButton?.addEventListener('click', () => {
    setMenuState(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuState(false)));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setMenuState(false);
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });

  const profileImage = document.querySelector('.portrait-wrap img');
  if (profileImage) {
    profileImage.addEventListener('error', () => {
      if (profileImage.dataset.fallback === '1') return;
      profileImage.dataset.fallback = '1';
      profileImage.src = 'https://raw.githubusercontent.com/GabrielGonzagaSilva/presentation-os/main/portfolio/gabriel-profile.jpg';
    }, { once: true });
  }

  if (year) year.textContent = new Date().getFullYear();
})();
