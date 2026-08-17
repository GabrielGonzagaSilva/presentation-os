(() => {
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const year = document.getElementById('year');

  const applyTheme = (theme, persist = true) => {
    root.dataset.theme = theme;
    if (persist) localStorage.setItem('gg-theme', theme);
    if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#f5f8fb' : '#080b10');
    if (button) {
      const target = theme === 'dark' ? 'claro' : 'escuro';
      button.setAttribute('aria-label', `Ativar tema ${target}`);
      button.setAttribute('title', `Ativar tema ${target}`);
    }
  };

  applyTheme(root.dataset.theme || 'dark', false);

  if (button) {
    button.addEventListener('click', () => {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  if (year) year.textContent = new Date().getFullYear();
})();
