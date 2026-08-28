(() => {
  const root=document.documentElement;
  const btn=document.getElementById('langBtn');
  const en=document.getElementById('en');
  const pt=document.getElementById('pt');
  const setLang=(lang)=>{
    lang=lang==='pt'?'pt':'en';
    root.dataset.lang=lang;
    root.lang=lang==='pt'?'pt-BR':'en';
    document.querySelectorAll('[data-en][data-pt]').forEach(el=>el.textContent=lang==='pt'?el.dataset.pt:el.dataset.en);
    en.classList.toggle('active',lang==='en');
    pt.classList.toggle('active',lang==='pt');
    try{localStorage.setItem('gg-ref-lang',lang)}catch(e){}
  };
  let saved='en';try{saved=localStorage.getItem('gg-ref-lang')||'en'}catch(e){}
  setLang(saved);
  btn.addEventListener('click',()=>setLang(root.dataset.lang==='en'?'pt':'en'));

  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click',()=>{
      const item=q.parentElement;
      const open=item.classList.toggle('open');
      const panel=item.querySelector('.faq-a');
      q.setAttribute('aria-expanded', String(open));
      panel.style.maxHeight=open?panel.scrollHeight+'px':'0px';
    });
  });
  const copyright=document.querySelector('.site-footer span:last-child');
  if(copyright) copyright.textContent='© '+new Date().getFullYear();
})();
