(() => {
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const year = document.getElementById('year');
  const savedTheme = localStorage.getItem('gg-theme');

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

  applyTheme(savedTheme || 'dark', false);

  if (button) {
    button.addEventListener('click', () => {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  const tickerTrack = document.querySelector('.ticker-track');

  if (tickerTrack) {
    const originalItems = Array.from(tickerTrack.querySelectorAll(':scope > span'));
    const uniqueCount = originalItems.length >= 16 ? originalItems.length / 2 : originalItems.length;
    const uniqueItems = originalItems.slice(0, uniqueCount);

    const makeGroup = () => {
      const group = document.createElement('div');
      group.className = 'ticker-group';
      uniqueItems.forEach((item) => group.appendChild(item.cloneNode(true)));
      return group;
    };

    tickerTrack.replaceChildren(makeGroup(), makeGroup());

    const tickerStyle = document.createElement('style');
    tickerStyle.textContent = `
      .ticker-track{
        display:flex !important;
        align-items:center;
        width:max-content;
        padding:0 !important;
        animation:ggTickerInfinite 28s linear infinite !important;
        will-change:transform;
      }
      .ticker-group{
        display:flex;
        align-items:center;
        flex-shrink:0;
        padding:14px 0;
      }
      .ticker-group span{
        flex:0 0 auto;
        margin-right:42px;
      }
      @keyframes ggTickerInfinite{
        from{transform:translate3d(0,0,0)}
        to{transform:translate3d(-50%,0,0)}
      }
      @media (prefers-reduced-motion: reduce){
        .ticker-track{animation:none !important;}
      }
    `;
    document.head.appendChild(tickerStyle);
  }

  if (year) year.textContent = new Date().getFullYear();
})();
