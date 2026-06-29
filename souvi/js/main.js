'use strict';

// Navbar scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 30);
});

// Scroll reveal (multiple types)
const allReveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
allReveals.forEach(el => revealObs.observe(el));

// Counter animation
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const suffix = el.dataset.suffix || '';
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor(p * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}
const counters = document.querySelectorAll('.stat-num[data-count]');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, parseInt(e.target.dataset.count));
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => countObs.observe(el));

// Parallax strip
const parallaxBg = document.querySelector('.parallax-strip-bg');
if (parallaxBg) {
  window.addEventListener('scroll', () => {
    const strip = parallaxBg.closest('.parallax-strip');
    const rect = strip.getBoundingClientRect();
    const scrolled = -rect.top * 0.35;
    parallaxBg.style.transform = `translateY(${scrolled}px)`;
  }, { passive: true });
}

// Gallery Tabs
const tabs = document.querySelectorAll('.gallery-tab');
const galleryItems = document.querySelectorAll('.gallery-item');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.92)';
        setTimeout(() => { item.style.display = 'none'; }, 350);
      }
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const label = item.querySelector('.gallery-item-label');
    lightboxImg.src = img.src.replace('w=600', 'w=1400');
    lightboxCaption.textContent = label ? label.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}
