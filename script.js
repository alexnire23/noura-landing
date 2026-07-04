// On an actual reload (refresh / pull-to-refresh), drop any leftover #hash
// and jump to the top, instead of honoring a hash left over from a
// previous in-page scroll. A fresh navigation from another page (e.g. a
// footer link to "index.html#faq") is not a reload, so it still lands on
// that section as expected.
(function(){
  var navEntries = window.performance && performance.getEntriesByType ? performance.getEntriesByType('navigation') : [];
  var isReload = (navEntries[0] && navEntries[0].type === 'reload') ||
    (performance.navigation && performance.navigation.type === 1);
  if (!isReload || !window.location.hash) return;
  history.replaceState(null, '', window.location.pathname + window.location.search);
  window.scrollTo(0, 0);
  // The browser may still auto-scroll to the (now removed from the URL)
  // fragment once everything finishes loading, so re-assert the top
  // position after load too.
  window.addEventListener('load', () => window.scrollTo(0, 0));
})();

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

// Scroll to same-page anchors without writing #hash to the URL, so a
// refresh (or pull-to-refresh) always lands back at the top of the page
// instead of wherever the last clicked anchor was.
document.querySelectorAll('a[href^="#"]').forEach(a => {
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  a.addEventListener('click', (e) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
  });
});

// Sticky in-page section nav: highlight the section currently in view
const sectionNavLinks = document.querySelectorAll('.section-nav a');
if (sectionNavLinks.length && 'IntersectionObserver' in window) {
  const sectionMap = new Map();
  sectionNavLinks.forEach(a => {
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (target) sectionMap.set(target, a);
  });
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const link = sectionMap.get(entry.target);
      if (!link) return;
      sectionNavLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sectionMap.forEach((link, section) => navObserver.observe(section));
}
