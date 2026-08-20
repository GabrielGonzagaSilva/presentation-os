(() => {
  const root = document.documentElement;
  const body = document.body;
  const languageButton = document.getElementById('langToggle');
  const menuButton = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const metaDescription = document.querySelector('meta[name="description"]');
  const year = document.getElementById('year');

  /* Dark-only visual system */
  root.dataset.theme = 'dark';
  root.style.colorScheme = 'dark';
  if (metaTheme) metaTheme.setAttribute('content', '#080b10');
  try { localStorage.removeItem('gg-theme'); } catch (_) {}

  const obsoleteThemeButton = document.getElementById('themeToggle');
  obsoleteThemeButton?.remove();

  const currentScriptSrc = document.currentScript?.src;

  /* Global favicon — shared by home, résumé and case-study pages. */
  if (currentScriptSrc && !document.querySelector('link[data-portfolio-favicon]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = new URL('favicon.svg', currentScriptSrc).href;
    favicon.dataset.portfolioFavicon = 'true';
    document.head.appendChild(favicon);
  }

  if (currentScriptSrc && !document.querySelector('link[data-portfolio-polish]')) {
    const polish = document.createElement('link');
    polish.rel = 'stylesheet';
    polish.href = new URL('layout-polish.css', currentScriptSrc).href;
    polish.dataset.portfolioPolish = 'true';
    document.head.appendChild(polish);
  }

  const availability = document.querySelector('.availability > span:last-child');
  if (availability) {
    availability.dataset.en = 'Available';
    availability.dataset.pt = 'Disponível';
    availability.textContent = 'Available';
  }

  /* QuantoLab is a live independent product and is surfaced as selected work. */
  const projectGrid = document.querySelector('.project-cards');
  if (projectGrid && !projectGrid.querySelector('[data-project="quantolab"]')) {
    projectGrid.insertAdjacentHTML('afterbegin', `
      <a class="project-card" data-project="quantolab" href="projects/quanto-lab.html">
        <div class="project-card-top"><span class="project-arrow" aria-hidden="true">↗</span></div>
        <div class="project-card-body">
          <p class="project-type" data-en="Independent product · Live platform · 2026" data-pt="Produto independente · Plataforma online · 2026">Independent product · Live platform · 2026</p>
          <h3>QuantoLab</h3>
          <p data-en="A live decision-support platform with 28 tools for work, career and money, designed around transparent calculations, clear UX and zero required sign-up." data-pt="Plataforma online de apoio à decisão com 28 ferramentas para trabalho, carreira e dinheiro, estruturada em cálculos transparentes, UX clara e zero cadastro obrigatório.">A live decision-support platform with 28 tools for work, career and money, designed around transparent calculations, clear UX and zero required sign-up.</p>
          <div class="project-tags"><span>Product Design</span><span>UX/UI</span><span>Information Architecture</span><span>Product Strategy</span></div>
        </div>
        <div class="project-card-cta"><span data-en="View case study" data-pt="Ver estudo de caso">View case study</span><span aria-hidden="true">→</span></div>
      </a>
    `);

    const workHeading = document.querySelector('#work .section-intro h2');
    const workDescription = document.querySelector('#work .section-intro > div > p');
    if (workHeading) {
      workHeading.dataset.en = 'Product thinking across decision tools, systems, AI and scalable interfaces.';
      workHeading.dataset.pt = 'Produto, ferramentas de decisão, sistemas e interfaces escaláveis.';
      workHeading.textContent = workHeading.dataset.en;
    }
    if (workDescription) {
      workDescription.dataset.en = 'Four projects that represent my current direction: an independent decision-support product, internal products, responsible AI practices and interface systems built for consistency and scale.';
      workDescription.dataset.pt = 'Quatro projetos que representam meu direcionamento atual: um produto independente de apoio à decisão, produto interno, IA aplicada com responsabilidade e sistemas de interface pensados para consistência e escala.';
      workDescription.textContent = workDescription.dataset.en;
    }
  }

  document.querySelectorAll('.project-number').forEach((number) => number.remove());

  const safeGet = (key) => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) {}
  };

  const currentLanguage = () => root.dataset.lang === 'pt' ? 'pt' : 'en';

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
  };

  const setMenuState = (open) => {
    if (!menuButton || !mobileNav) return;
    const lang = currentLanguage();
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute(
      'aria-label',
      open
        ? (lang === 'pt' ? 'Fechar menu' : 'Close menu')
        : (lang === 'pt' ? 'Abrir menu' : 'Open menu')
    );
    mobileNav.classList.toggle('is-open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    try { mobileNav.inert = !open; } catch (_) {}
  };

  const tickerTrack = document.querySelector('.ticker-track');
  const tickerSource = tickerTrack?.querySelector('.ticker-group');
  const tickerItems = tickerSource
    ? Array.from(tickerSource.querySelectorAll(':scope > span'))
        .map((item) => item.textContent.trim())
        .filter(Boolean)
    : [];

  const buildTicker = () => {
    if (!tickerTrack || tickerItems.length === 0) return;

    tickerTrack.classList.remove('is-ready');
    const group = document.createElement('div');
    group.className = 'ticker-group';
    tickerTrack.replaceChildren(group);

    const appendCycle = () => {
      tickerItems.forEach((text) => {
        const item = document.createElement('span');
        item.textContent = text;
        group.appendChild(item);
      });
    };

    const targetWidth = Math.max(window.innerWidth + 360, 1600);
    let cycles = 0;
    do {
      appendCycle();
      cycles += 1;
    } while (group.scrollWidth < targetWidth && cycles < 12);

    tickerTrack.appendChild(group.cloneNode(true));
    void tickerTrack.offsetWidth;
    tickerTrack.classList.add('is-ready');
  };

  applyLanguage(safeGet('gg-lang') || 'en', false);
  setMenuState(false);
  buildTicker();

  languageButton?.addEventListener('click', () => {
    applyLanguage(currentLanguage() === 'en' ? 'pt' : 'en');
  });

  menuButton?.addEventListener('click', () => {
    setMenuState(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setMenuState(false);
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildTicker, 160);
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });

  const profileImage = document.querySelector('.portrait-wrap img');
  if (profileImage) {
    if (currentScriptSrc) {
      profileImage.src = new URL('gabriel-profile-hd.svg', currentScriptSrc).href;
    }
    profileImage.style.transform = 'none';
    profileImage.style.imageRendering = 'auto';

    profileImage.addEventListener('error', () => {
      if (profileImage.dataset.fallback === '1') return;
      profileImage.dataset.fallback = '1';
      profileImage.src = 'https://raw.githubusercontent.com/GabrielGonzagaSilva/presentation-os/main/portfolio/gabriel-profile.jpg';
    }, { once: true });
  }

  if (year) year.textContent = new Date().getFullYear();
})();