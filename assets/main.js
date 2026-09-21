// STAN-BUD - interaktywność strony (menu mobilne + odsłanianie sekcji + galeria)
(function () {
  // ---- MENU mobilne ----
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var nav = document.getElementById('nav');
  var backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);
  function closeMenu(){
    if (!links) return;
    links.classList.remove('open'); toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    backdrop.classList.remove('show'); document.body.classList.remove('menu-open');
  }
  function openMenu(){
    links.classList.add('open'); toggle.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
    backdrop.classList.add('show'); document.body.classList.add('menu-open');
  }
  if (toggle && links) toggle.addEventListener('click', function(){
    links.classList.contains('open') ? closeMenu() : openMenu();
  });
  backdrop.addEventListener('click', closeMenu);
  if (links) links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });

  // ---- cień paska po przewinięciu ----
  function onScroll(){ if (!nav) return; nav.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive:true }); onScroll();

  // ---- odsłanianie sekcji przy przewijaniu ----
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
    // BEZPIECZNIK: w karcie otwartej w tle IntersectionObserver bywa uśpiony i sekcje
    // zostają niewidoczne. Dosłaniamy to, co jest w kadrze, na scroll/resize/powrót do karty.
    var odslonWidoczne = function () {
      els.forEach(function (el) {
        if (el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.15 && r.bottom > -40) { el.classList.add('in'); io.unobserve(el); }
      });
    };
    requestAnimationFrame(odslonWidoczne);
    window.addEventListener('scroll', odslonWidoczne, { passive: true });
    window.addEventListener('resize', odslonWidoczne, { passive: true });
    document.addEventListener('visibilitychange', odslonWidoczne);
    setTimeout(odslonWidoczne, 900);
  }

  // ---- galeria: powiększenie zdjęcia ----
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCap');
    var tiles = [].slice.call(document.querySelectorAll('.gallery .tile'));
    var idx = 0;
    function show(i){
      idx = (i + tiles.length) % tiles.length; var t = tiles[idx];
      lbImg.src = t.getAttribute('href'); lbImg.alt = t.getAttribute('data-cap') || '';
      lbCap.textContent = t.getAttribute('data-cap') || '';
    }
    function openLb(i){ show(i); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
    function closeLb(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }
    tiles.forEach(function(t,i){ t.addEventListener('click', function(ev){ ev.preventDefault(); openLb(i); }); });
    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.getElementById('lbPrev').addEventListener('click', function(){ show(idx-1); });
    document.getElementById('lbNext').addEventListener('click', function(){ show(idx+1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx-1);
      if (e.key === 'ArrowRight') show(idx+1);
    });
  }
})();

/* === licznik otwarć demo (buy-signal) v3 — geo po stronie serwera === */
(function(){try{if(String(location.protocol).indexOf('http')!==0)return;try{if(/[?&#]team=1/.test(location.search+location.hash)){localStorage.setItem('nb_team','1');}}catch(e){}try{if(localStorage.getItem('nb_team')==='1')return;}catch(e){}if(/crm-newbeginning|crm\.impulseo\.pl/.test(document.referrer||''))return;try{if(navigator.webdriver)return;}catch(e){}try{if(/^https?:\/\/(kris20032|impulseo-pl)\.github\.io\/?$/i.test(document.referrer||''))return;}catch(e){}if(sessionStorage.getItem('_dv'))return;sessionStorage.setItem('_dv','1');var seg=(location.pathname.split('/').filter(Boolean)[0])||'';var base=location.origin+(seg?('/'+seg):'');var ua='';try{ua=(navigator.userAgent||'').slice(0,300);}catch(e){}var EP='https://zngfubfinbojfgaxdrbf.supabase.co/functions/v1/demo-view';try{fetch(EP,{method:'POST',keepalive:true,headers:{'Content-Type':'text/plain'},body:JSON.stringify({demo_url:base,page:location.pathname,referrer:(document.referrer||null),user_agent:(ua||null)})}).catch(function(){});}catch(e){}}catch(e){}})();
