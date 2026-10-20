(() => {
  'use strict';

  const sections = [...document.querySelectorAll('[data-doc-section]')];
  const links = [...document.querySelectorAll('[data-doc-nav]')];

  const navGroupFor = (id) => {
    if (id === 'feed' || id === 'overview') return 'feed';
    if (['tokens', 'layout'].includes(id)) return 'tokens';
    if (['buttons', 'forms', 'labels', 'feedback', 'cards', 'navigation', 'overlays'].includes(id)) return 'buttons';
    if (['structure', 'diarito', 'rules'].includes(id)) return 'diarito';
    return id;
  };

  const setActive = (id) => {
    const grouped = navGroupFor(id);
    links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${grouped}`));
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-18% 0px -70% 0px', threshold: [0, 0.1, 0.4] });
    sections.forEach((section) => observer.observe(section));
  }

  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.querySelector(button.dataset.copyTarget);
      if (!target) return;
      const old = button.textContent;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy unavailable';
      }
      setTimeout(() => { button.textContent = old; }, 1200);
    });
  });

  document.querySelectorAll('.diarito-feed-switch').forEach((root) => {
    const buttons = [...root.querySelectorAll('button')];
    buttons.forEach((button) => button.addEventListener('click', () => {
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        if (active) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
      });
    }));
  });
})();