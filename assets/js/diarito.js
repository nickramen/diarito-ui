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

  document.querySelectorAll('[data-diarito-expandable]').forEach((root) => {
    const toggle = root.querySelector('[data-diarito-expandable-toggle]');
    if (!toggle) return;
    const collapsedLabel = toggle.dataset.diaritoCollapsedLabel || toggle.textContent.trim() || 'Read more';
    const expandedLabel = toggle.dataset.diaritoExpandedLabel || 'Show less';

    toggle.addEventListener('click', () => {
      const expanded = !root.classList.contains('is-expanded');
      root.classList.toggle('is-expanded', expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
      const label = expanded ? expandedLabel : collapsedLabel;
      const icon = expanded ? 'fi fi-rr-angle-small-up' : 'fi fi-rr-angle-small-down';
      toggle.innerHTML = `${label} <i class="${icon}"></i>`;
    });
  });

  document.querySelectorAll('[data-diarito-token-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      const token = button.closest('.diarito-mention-token');
      const label = token?.textContent.trim() || 'mention';
      token?.remove();
      button.dispatchEvent(new CustomEvent('diarito:tokenremove', {
        bubbles: true,
        detail: { label }
      }));
    });
  });

  document.querySelectorAll('[data-diarito-segmented]').forEach((root) => {
    const items = [...root.querySelectorAll('[data-diarito-segment]')];
    items.forEach((item) => item.addEventListener('click', () => {
      items.forEach((candidate) => {
        const active = candidate === item;
        candidate.classList.toggle('is-active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
      root.dispatchEvent(new CustomEvent('diarito:segmentchange', {
        bubbles: true,
        detail: { value: item.dataset.diaritoSegment || item.value || item.textContent.trim() }
      }));
    }));
  });

  document.querySelectorAll('[data-diarito-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const active = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
      button.dispatchEvent(new CustomEvent('diarito:togglechange', {
        bubbles: true,
        detail: { active, value: button.dataset.diaritoToggle || null }
      }));
    });
  });

  document.querySelectorAll('[data-diarito-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.diaritoCopy || '');
      const value = target?.value ?? target?.textContent ?? '';
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        button.dispatchEvent(new CustomEvent('diarito:copied', { bubbles: true, detail: { value } }));
        window.DiaritoToast?.show({ title: 'Copied', message: 'The link is ready to paste.', state: 'success' });
      } catch (_) {
        window.DiaritoToast?.show({ title: 'Could not copy', message: 'Select and copy the value manually.', state: 'error' });
      }
    });
  });

  const closeCombobox = (root) => {
    const input = root.querySelector('[data-diarito-combobox-input]');
    const menu = root.querySelector('[data-diarito-combobox-menu]');
    if (!input || !menu) return;
    menu.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    root.classList.remove('is-open');
  };

  const closeComboboxes = (except = null) => {
    document.querySelectorAll('[data-diarito-combobox].is-open').forEach((root) => {
      if (root !== except) closeCombobox(root);
    });
  };

  document.querySelectorAll('[data-diarito-combobox]').forEach((root) => {
    const input = root.querySelector('[data-diarito-combobox-input]');
    const menu = root.querySelector('[data-diarito-combobox-menu]');
    const options = [...root.querySelectorAll('[data-diarito-combobox-option]')];
    if (!input || !menu || !options.length) return;

    root.addEventListener('click', (event) => event.stopPropagation());

    let activeIndex = -1;
    const visibleOptions = () => options.filter((option) => !option.hidden);

    const open = () => {
      closeComboboxes(root);
      root.classList.add('is-open');
      menu.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };

    const filter = () => {
      const query = input.value.trim().toLowerCase();
      options.forEach((option) => {
        const text = (option.dataset.diaritoComboboxLabel || option.textContent).trim().toLowerCase();
        option.hidden = Boolean(query) && !text.includes(query);
        option.classList.remove('is-active');
      });
      activeIndex = -1;
      open();
    };

    const select = (option) => {
      const label = option.dataset.diaritoComboboxLabel || option.textContent.trim();
      const value = option.dataset.diaritoComboboxValue || label;
      input.value = label;
      input.dataset.value = value;
      options.forEach((candidate) => candidate.setAttribute('aria-selected', String(candidate === option)));
      closeCombobox(root);
      input.dispatchEvent(new CustomEvent('diarito:comboboxchange', { bubbles: true, detail: { value, label } }));
    };

    input.addEventListener('focus', open);
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (event) => {
      const visible = visibleOptions();
      if (!visible.length) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        open();
        activeIndex = event.key === 'ArrowDown'
          ? (activeIndex + 1) % visible.length
          : (activeIndex - 1 + visible.length) % visible.length;
        visible.forEach((option, index) => option.classList.toggle('is-active', index === activeIndex));
        visible[activeIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        select(visible[activeIndex]);
      } else if (event.key === 'Escape') {
        closeCombobox(root);
      }
    });
    options.forEach((option) => {
      option.setAttribute('aria-selected', 'false');
      option.addEventListener('click', () => select(option));
    });
    root.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!root.contains(document.activeElement)) closeCombobox(root);
      }, 0);
    });
  });

  document.querySelectorAll('[data-diarito-dropzone]').forEach((root) => {
    const input = root.querySelector('input[type="file"]');
    const output = root.querySelector('[data-diarito-dropzone-output]');
    if (!input) return;

    const update = (files) => {
      const list = [...(files || [])];
      if (output) {
        output.textContent = list.length
          ? (list.length === 1 ? list[0].name : `${list.length} files selected`)
          : 'No file selected';
      }
      root.classList.toggle('has-file', list.length > 0);
    };

    input.addEventListener('change', () => update(input.files));
    ['dragenter', 'dragover'].forEach((type) => root.addEventListener(type, (event) => {
      event.preventDefault();
      root.classList.add('is-dragover');
    }));
    ['dragleave', 'dragend'].forEach((type) => root.addEventListener(type, () => root.classList.remove('is-dragover')));
    root.addEventListener('drop', (event) => {
      event.preventDefault();
      root.classList.remove('is-dragover');
      const files = event.dataTransfer?.files;
      if (!files?.length) return;

      let assigned = false;
      try {
        const transfer = new DataTransfer();
        [...files].forEach((file) => transfer.items.add(file));
        input.files = transfer.files;
        assigned = true;
      } catch (_) {}

      update(files);
      if (assigned) input.dispatchEvent(new Event('change', { bubbles: true }));
      root.dispatchEvent(new CustomEvent('diarito:filesdrop', {
        bubbles: true,
        detail: { files: [...files] }
      }));
    });
    update(input.files);
  });

  const drawers = new Map();
  const closeDrawer = (drawer) => {
    if (!drawer?.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.removeProperty('overflow');
    drawers.get(drawer)?.focus?.();
    drawers.delete(drawer);
  };
  const closeDrawers = () => [...drawers.keys()].forEach(closeDrawer);

  document.querySelectorAll('[data-diarito-drawer-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const drawer = document.getElementById(button.dataset.diaritoDrawerOpen);
      if (!drawer) return;
      closeDrawers();
      drawers.set(drawer, button);
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      drawer.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
    });
  });
  document.querySelectorAll('[data-diarito-drawer-close]').forEach((button) => {
    button.addEventListener('click', () => closeDrawer(button.closest('[data-diarito-drawer]')));
  });
  document.querySelectorAll('[data-diarito-drawer]').forEach((drawer) => {
    drawer.querySelector('.diarito-drawer__backdrop')?.addEventListener('click', () => closeDrawer(drawer));
  });

  const closePopover = (root) => {
    const trigger = root.querySelector('[data-diarito-popover-trigger]');
    const panel = root.querySelector('[data-diarito-popover-panel]');
    if (!trigger || !panel) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    root.classList.remove('is-open');
  };
  const closePopovers = (except = null) => {
    document.querySelectorAll('[data-diarito-popover].is-open').forEach((root) => {
      if (root !== except) closePopover(root);
    });
  };
  document.querySelectorAll('[data-diarito-popover]').forEach((root) => {
    const trigger = root.querySelector('[data-diarito-popover-trigger]');
    const panel = root.querySelector('[data-diarito-popover-panel]');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = panel.hidden;
      closePopovers(root);
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      root.classList.toggle('is-open', open);
    });
    panel.addEventListener('click', (event) => event.stopPropagation());
  });

  const ensureToastRegion = () => {
    let region = document.querySelector('.diarito-toast-region');
    if (region) return region;
    region = document.createElement('div');
    region.className = 'diarito-toast-region';
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', 'Notifications');
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
    return region;
  };

  const toastIcon = (state) => ({
    success: 'fi fi-rr-check-circle',
    warning: 'fi fi-rr-triangle-warning',
    error: 'fi fi-rr-cross-circle',
    info: 'fi fi-rr-info'
  }[state] || 'fi fi-rr-info');

  const showToast = ({ title = 'Notice', message = '', state = 'info', duration = 3600 } = {}) => {
    const region = ensureToastRegion();
    const toast = document.createElement('div');
    toast.className = `diarito-toast diarito-toast--${['success','warning','error','info'].includes(state) ? state : 'info'}`;
    const icon = document.createElement('i');
    icon.className = toastIcon(state);
    const copy = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = title;
    copy.append(strong);
    if (message) {
      const paragraph = document.createElement('p');
      paragraph.textContent = message;
      copy.append(paragraph);
    }
    const close = document.createElement('button');
    close.className = 'diarito-button diarito-button--ghost diarito-button--icon';
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss notification');
    close.innerHTML = '<i class="fi fi-rr-cross-small"></i>';
    const remove = () => toast.remove();
    close.addEventListener('click', remove);
    toast.append(icon, copy, close);
    region.prepend(toast);
    if (duration > 0) window.setTimeout(remove, duration);
    return toast;
  };

  window.DiaritoToast = Object.freeze({ show: showToast });
  document.querySelectorAll('[data-diarito-toast-trigger]').forEach((button) => {
    button.addEventListener('click', () => showToast({
      title: button.dataset.diaritoToastTitle || 'Notice',
      message: button.dataset.diaritoToastMessage || '',
      state: button.dataset.diaritoToastState || 'info'
    }));
  });

  document.querySelectorAll('[data-diarito-bulk-table]').forEach((root) => {
    const selectAll = root.querySelector('[data-diarito-select-all]');
    const rowChecks = [...root.querySelectorAll('[data-diarito-row-select]')];
    const bulkbar = root.querySelector('[data-diarito-bulkbar]');
    const count = root.querySelector('[data-diarito-bulk-count]');

    const sync = () => {
      const selected = rowChecks.filter((checkbox) => checkbox.checked);
      rowChecks.forEach((checkbox) => checkbox.closest('tr')?.classList.toggle('is-selected', checkbox.checked));
      if (selectAll) {
        selectAll.checked = selected.length === rowChecks.length && rowChecks.length > 0;
        selectAll.indeterminate = selected.length > 0 && selected.length < rowChecks.length;
      }
      if (bulkbar) bulkbar.hidden = selected.length === 0;
      if (count) count.textContent = String(selected.length);
      root.dispatchEvent(new CustomEvent('diarito:bulkchange', { bubbles: true, detail: { count: selected.length } }));
    };

    selectAll?.addEventListener('change', () => {
      rowChecks.forEach((checkbox) => { checkbox.checked = selectAll.checked; });
      sync();
    });
    rowChecks.forEach((checkbox) => checkbox.addEventListener('change', sync));
    root.querySelectorAll('[data-diarito-clear-selection]').forEach((button) => button.addEventListener('click', () => {
      rowChecks.forEach((checkbox) => { checkbox.checked = false; });
      sync();
    }));
    sync();
  });

  document.addEventListener('click', () => {
    closeComboboxes();
    closePopovers();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeDropdowns();
    closeComboboxes();
    closePopovers();
    closeDrawers();
  });
})();