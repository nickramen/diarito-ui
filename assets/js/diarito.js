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

  const dropdowns = new Map();

  const positionDropdown = (entry) => {
    if (!entry.portal || entry.menu.hidden) return;
    const rect = entry.trigger.getBoundingClientRect();
    const gap = 7;
    const viewportGap = 8;
    entry.menu.style.position = 'fixed';
    entry.menu.style.top = `${rect.bottom + gap}px`;
    entry.menu.style.right = 'auto';
    const menuWidth = entry.menu.offsetWidth;
    const left = Math.min(
      window.innerWidth - menuWidth - viewportGap,
      Math.max(viewportGap, rect.right - menuWidth)
    );
    entry.menu.style.left = `${left}px`;
  };

  const closeDropdown = (root) => {
    const entry = dropdowns.get(root);
    if (!entry) return;
    root.classList.remove('is-open');
    entry.trigger.setAttribute('aria-expanded', 'false');
    entry.menu.setAttribute('hidden', '');
    if (entry.portal && entry.menu.parentElement !== root) root.append(entry.menu);
    entry.menu.removeAttribute('style');
  };

  const closeDropdowns = (except = null) => {
    dropdowns.forEach((entry, root) => {
      if (root !== except && root.classList.contains('is-open')) closeDropdown(root);
    });
  };

  document.querySelectorAll('[data-diarito-dropdown]').forEach((root) => {
    const trigger = root.querySelector('[data-diarito-dropdown-trigger]');
    const menu = root.querySelector('[data-diarito-dropdown-menu]');
    if (!trigger || !menu) return;
    const entry = { root, trigger, menu, portal: root.hasAttribute('data-diarito-dropdown-portal') };
    dropdowns.set(root, entry);

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = !root.classList.contains('is-open');
      closeDropdowns(root);
      if (!willOpen) {
        closeDropdown(root);
        return;
      }

      root.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      if (entry.portal) document.body.append(menu);
      menu.removeAttribute('hidden');
      positionDropdown(entry);
    });
  });

  const repositionOpenDropdowns = () => {
    dropdowns.forEach((entry, root) => {
      if (root.classList.contains('is-open')) positionDropdown(entry);
    });
  };

  window.addEventListener('resize', repositionOpenDropdowns);
  document.addEventListener('scroll', repositionOpenDropdowns, true);
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


  document.querySelectorAll('[data-diarito-accordion]').forEach((root) => {
    const items = [...root.querySelectorAll('.diarito-accordion__item')];
    items.forEach((item) => {
      const trigger = item.querySelector('.diarito-accordion__trigger');
      const panel = item.querySelector('.diarito-accordion__panel');
      if (!trigger || !panel) return;
      const sync = (open) => {
        item.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));
      };
      sync(item.classList.contains('is-open'));
      trigger.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');
        if (willOpen && root.hasAttribute('data-diarito-accordion-single')) {
          items.forEach((other) => {
            if (other === item) return;
            const otherTrigger = other.querySelector('.diarito-accordion__trigger');
            const otherPanel = other.querySelector('.diarito-accordion__panel');
            other.classList.remove('is-open');
            otherTrigger?.setAttribute('aria-expanded', 'false');
            otherPanel?.setAttribute('aria-hidden', 'true');
          });
        }
        sync(willOpen);
      });
    });
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