(() => {
  'use strict';
  const sections = [...document.querySelectorAll('[data-doc-section]')];
  const links = [...document.querySelectorAll('[data-doc-nav]')];
  if (!('IntersectionObserver' in window) || !sections.length) return;
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-20% 0px -70% 0px', threshold: [0,.15,.5] });
  sections.forEach((section) => observer.observe(section));
})();