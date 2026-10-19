(() => {
  'use strict';

  const closeDropdown = (root) => {
    const trigger = root.querySelector('[data-diarito-dropdown-trigger]');
    const menu = root.querySelector('[data-diarito-dropdown-menu]');
    if (!trigger || !menu) return;
    trigger.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  };

  document.querySelectorAll('[data-diarito-dropdown]').forEach((root) => {
    const trigger = root.querySelector('[data-diarito-dropdown-trigger]');
    const menu = root.querySelector('[data-diarito-dropdown-menu]');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = trigger.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('[data-diarito-dropdown]').forEach((other) => {
        if (other !== root) closeDropdown(other);
      });
      trigger.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('[data-diarito-dropdown]').forEach((root) => {
      if (!root.contains(event.target)) closeDropdown(root);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('[data-diarito-dropdown]').forEach(closeDropdown);
    document.querySelectorAll('dialog.diarito-modal[open]').forEach((dialog) => dialog.close());
  });

  document.querySelectorAll('[data-diarito-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = [...root.querySelectorAll('[role="tabpanel"]')];
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const panelId = tab.getAttribute('aria-controls');
        tabs.forEach((item) => {
          const selected = item === tab;
          item.setAttribute('aria-selected', String(selected));
          item.tabIndex = selected ? 0 : -1;
        });
        panels.forEach((panel) => { panel.hidden = panel.id !== panelId; });
      });
    });
  });

  document.querySelectorAll('[data-diarito-modal-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.diaritoModalOpen);
      if (dialog?.showModal) dialog.showModal();
    });
  });

  document.querySelectorAll('[data-diarito-modal-close]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });

  document.querySelectorAll('dialog.diarito-modal').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  document.querySelectorAll('[data-diarito-dismiss]').forEach((button) => {
    button.addEventListener('click', () => button.closest('[data-diarito-dismissible]')?.remove());
  });
})();