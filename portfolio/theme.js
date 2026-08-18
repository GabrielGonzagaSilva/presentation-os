(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const menuButton = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const year = document.getElementById('year');
  const savedTheme = localStorage.getItem('gg-theme');

  const applyTheme = (theme, persist = true) => {
    root.dataset.theme = theme;
    if (persist) localStorage.setItem('gg-theme', theme);
    if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#f5f8fb' : '#080b10');
    if (themeButton) {
      const target = theme === 'dark' ? 'claro' : 'escuro';
      themeButton.setAttribute('aria-label', `Ativar tema ${target}`);
      themeButton.setAttribute('title', `Ativar tema ${target}`);
    }
  };

  applyTheme(savedTheme || 'dark', false);

  themeButton?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    mobileNav.classList.remove('is-open');
  };

  menuButton?.addEventListener('click', () => {
    if (!mobileNav) return;
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
    mobileNav.classList.toggle('is-open', !open);
  });

  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  }, { passive: true });

  if (year) year.textContent = new Date().getFullYear();
})();
