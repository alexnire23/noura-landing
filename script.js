// Reveal on scroll
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

// Mobile drawer menu
const navToggle = document.querySelector('.nav-toggle');
const drawer = document.querySelector('.drawer');
const drawerOverlay = document.querySelector('.drawer-overlay');
const drawerClose = document.querySelector('.drawer-close');

function openDrawer(){
  drawer.classList.add('open');
  drawerOverlay.classList.add('open');
  document.body.classList.add('drawer-open');
  navToggle.setAttribute('aria-expanded', 'true');
}
function closeDrawer(){
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  document.body.classList.remove('drawer-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && drawer && drawerOverlay) {
  navToggle.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
}
