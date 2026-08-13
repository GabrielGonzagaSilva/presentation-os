const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = { slides: [] };

function switchView(id) {
  $$('.view').forEach((view) => view.classList.toggle('active', view.id === id));
  $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === id));
  $('#view-title').textContent = id === 'workspace' ? 'Workspace' : id === 'design-system' ? 'Design System' : 'Pipeline';
}

function showStep(step) {
  $$('.step-panel').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === String(step)));
  $$('.step').forEach((item) => item.classList.toggle('active', item.dataset.step === String(step)));
  $('#progress-fill').style.width = step === 1 ? '33%' : step === 2 ? '66%' : '100%';
}

function beginProject() {
  $('#empty-state').classList.add('hidden');
  $('#builder').classList.remove('hidden');
  showStep(1);
}

function generateStoryline() {
  const source = $('#source-content').value.trim();
  const title = $('#project-title').value.trim() || 'Apresentação Executiva';
  if (!source) {
    window.alert('Adicione conteúdo-fonte para gerar a storyline.');
    return;
  }
  const sentences = source.replace(/\n+/g, '. ').split(/(?<=[.!?])\s+/).map((text) => text.trim()).filter(Boolean).slice(0, 5);
  state.slides = [
    { title, message: `${$('#objective').value} para ${$('#audience').value}.`, intent: 'cover' },
    ...sentences.map((message, index) => ({ title: message.split(/\s+/).slice(0, 8).join(' '), message, intent: index === 0 ? 'executive-summary' : 'process' })),
    { title: 'Recomendação e próximos passos', message: 'Consolidar decisão e próximos passos.', intent: 'recommendation' }
  ];
  $('#storyline-list').innerHTML = state.slides.map((slide, index) => `<article class="story-item"><div class="story-num">${String(index + 1).padStart(2, '0')}</div><div><h4>${slide.title}</h4><p>${slide.message}</p></div><span class="intent-tag">${slide.intent}</span></article>`).join('');
  showStep(2);
}

function buildSpecs() {
  $('#spec-list').innerHTML = state.slides.map((slide, index) => `<article class="spec-card"><div class="meta-row"><span class="meta-chip">SLIDE ${String(index + 1).padStart(2, '0')}</span><span class="intent-tag">${slide.intent}</span></div><h4>${slide.title}</h4><p>${slide.message}</p><div class="meta-row"><span class="meta-chip">layout-${slide.intent}</span><span class="meta-chip">PPTX-ready</span></div></article>`).join('');
  showStep(3);
}

function renderLayouts() {
  const items = [
    ['cover','Cover / Hero'],['executive-summary','Executive Summary'],['kpi','KPI Trio'],['comparison','Comparison'],['timeline','Timeline'],['process','Process'],['recommendation','Recommendation']
  ];
  $('#layout-library').innerHTML = items.map(([intent,name]) => `<article class="layout-card"><div class="layout-preview"></div><span class="intent-tag">${intent}</span><h3>${name}</h3><p>Layout corporativo aprovado para esta intenção.</p></article>`).join('');
}

$$('.nav-item').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.view)));
$('#start-btn').addEventListener('click', beginProject);
$('#empty-start').addEventListener('click', beginProject);
$('#new-project-top').addEventListener('click', () => { switchView('workspace'); beginProject(); });
$('#generate-storyline').addEventListener('click', generateStoryline);
$('#regen-storyline').addEventListener('click', generateStoryline);
$('#approve-storyline').addEventListener('click', buildSpecs);
$$('[data-go]').forEach((button) => button.addEventListener('click', () => showStep(Number(button.dataset.go))));
$$('.step').forEach((button) => button.addEventListener('click', () => { if (Number(button.dataset.step) === 1 || state.slides.length) showStep(Number(button.dataset.step)); }));

renderLayouts();
