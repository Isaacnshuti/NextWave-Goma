/* ── SCROLL PROGRESS BAR ── */
const spb = document.getElementById('spb');
const hdr = document.getElementById('hdr');

/* ── HAMBURGER MENU ── */
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileNav').classList.toggle('open');
  document.body.style.overflow = document.getElementById('mobileNav').classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── NAV SMOOTH CLICK ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── HERO PARALLAX ── */
const heroOrb  = document.querySelector('.horb');
const heroGrid = document.querySelector('.hgrid');

/* ── SECTIONS FOR ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

function setActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv, .rv-l, .rv-r, .rv-s').forEach(el => obs.observe(el));

/* ── MAIN SCROLL HANDLER (rAF throttled) ── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      spb.style.width = (dh > 0 ? (sy / dh) * 100 : 0) + '%';
      hdr.classList.toggle('sc', sy > 50);
      if (heroOrb)  heroOrb.style.transform = `scale(${1 + sy * 0.00005}) translateY(${sy * 0.18}px)`;
      if (heroGrid) heroGrid.style.transform = `translateY(${sy * 0.06}px)`;
      setActiveNav();
      ticking = false;
    });
    ticking = true;
  }
});

/* ── COUNTER ANIMATION ── */
const counters = document.querySelectorAll('.stn');
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const raw = el.textContent.trim();
    const num = parseFloat(raw);
    if (isNaN(num)) return;
    const suffix = raw.replace(/[\d.]/g, '');
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * num) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    cntObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cntObs.observe(c));

/* ── FORM SUBMIT ── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.cf-btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Envoi en cours... <i class="fa-solid fa-spinner fa-spin"></i>';
  btn.style.pointerEvents = 'none';
  setTimeout(() => {
    btn.innerHTML = 'Message envoyé ! <i class="fa-solid fa-check"></i>';
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.pointerEvents = 'auto';
    }, 3000);
  }, 1500);
}
