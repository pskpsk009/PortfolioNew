// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

// Reveal sections on scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Highlight the nav link for the section in view
const links = [...nav.querySelectorAll('a')];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

// Cursor coordinate readout (like a CAD program)
const cx = document.getElementById('cx');
const cy = document.getElementById('cy');
window.addEventListener('mousemove', e => {
  cx.textContent = String(e.clientX).padStart(3, '0');
  cy.textContent = String(e.clientY + Math.round(window.scrollY)).padStart(4, '0');
}, { passive: true });

// Contact form: opens the visitor's email app (no backend needed)
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const to = document.querySelector('.contact-list a[href^="mailto:"]').href.replace('mailto:', '');
  const subject = encodeURIComponent('Portfolio message from ' + data.get('name'));
  const body = encodeURIComponent(data.get('message') + '\n\n— ' + data.get('name') + ' (' + data.get('email') + ')');
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});
