(() => {
  'use strict';


  const themeRoot = document.documentElement;
  const allowedThemes = new Set(['light', 'dark']);
  const normalizeTheme = (theme) => allowedThemes.has(theme) ? theme : 'light';

  const updateThemeControls = () => {
    const theme = normalizeTheme(themeRoot.dataset.theme);
    document.querySelectorAll('[data-diarito-theme-toggle]').forEach((button) => {
      const next = theme === 'dark' ? 'light' : 'dark';
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', `Switch to ${next} theme`);
      const label = button.querySelector('[data-diarito-theme-label]');
      if (label) label.textContent = next === 'dark' ? 'Dark' : 'Light';
      const icon = button.querySelector('.fi');
      if (icon) icon.className = theme === 'dark' ? 'fi fi-rr-sun' : 'fi fi-rr-moon';
    });
  };

  const setTheme = (theme) => {
    themeRoot.dataset.theme = normalizeTheme(theme);
    updateThemeControls();
    document.dispatchEvent(new CustomEvent('diarito:themechange', { detail: { theme: themeRoot.dataset.theme } }));
    return themeRoot.dataset.theme;
  };

  if (!allowedThemes.has(themeRoot.dataset.theme)) themeRoot.dataset.theme = 'light';
  window.DiaritoTheme = Object.freeze({
    get: () => normalizeTheme(themeRoot.dataset.theme),
    set: setTheme,
    toggle: () => setTheme(themeRoot.dataset.theme === 'dark' ? 'light' : 'dark')
  });

  document.querySelectorAll('[data-diarito-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => window.DiaritoTheme.toggle());
  });
  document.querySelectorAll('[data-diarito-theme-set]').forEach((button) => {
    button.addEventListener('click', () => setTheme(button.dataset.diaritoThemeSet));
  });
  updateThemeControls();

  const closeDropdowns = (except = null) => {
    document.querySelectorAll('[data-diarito-dropdown].is-open').forEach((root) => {
      if (root === except) return;
      root.classList.remove('is-open');
      root.querySelector('[data-diarito-dropdown-menu]')?.setAttribute('hidden', '');
      root.querySelector('[data-diarito-dropdown-trigger]')?.setAttribute('aria-expanded', 'false');
    });
  };

  document.querySelectorAll('[data-diarito-dropdown]').forEach((root) => {
    const trigger = root.querySelector('[data-diarito-dropdown-trigger]');
    const menu = root.querySelector('[data-diarito-dropdown-menu]');
    if (!trigger || !menu) return;
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = !root.classList.contains('is-open');
      closeDropdowns(root);
      root.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
      menu.toggleAttribute('hidden', !willOpen);
    });
  });

  document.addEventListener('click', () => closeDropdowns());

  document.querySelectorAll('[data-diarito-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = [...root.querySelectorAll('[role="tabpanel"]')];
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
    }));
  });

  document.querySelectorAll('[data-diarito-modal-open]').forEach((button) => {
    button.addEventListener('click', () => document.getElementById(button.dataset.diaritoModalOpen)?.showModal?.());
  });
  document.querySelectorAll('[data-diarito-modal-close]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });
  document.querySelectorAll('dialog.diarito-modal').forEach((dialog) => {
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  });

  document.querySelectorAll('[data-diarito-dismiss]').forEach((button) => {
    button.addEventListener('click', () => button.closest('[data-diarito-dismissible]')?.remove());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDropdowns();
  });
})();