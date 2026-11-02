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

  // Inline text selection toolbar
  document.querySelectorAll('[data-diarito-selection-root]').forEach((root) => {
    const toolbar = root.querySelector('[data-diarito-selection-toolbar]');
    if (!toolbar) return;
    const sync = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) { toolbar.hidden = true; return; }
      const range = selection.getRangeAt(0);
      if (!root.contains(range.commonAncestorContainer)) { toolbar.hidden = true; return; }
      const text = selection.toString().trim();
      if (!text) { toolbar.hidden = true; return; }
      const rect = range.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      toolbar.style.left = `${rect.left - rootRect.left + rect.width / 2}px`;
      toolbar.style.top = `${Math.max(0, rect.top - rootRect.top - 8)}px`;
      toolbar.hidden = false;
      toolbar.dataset.diaritoSelectedText = text;
    };
    root.addEventListener('mouseup', () => window.setTimeout(sync, 0));
    root.addEventListener('keyup', sync);
    toolbar.querySelectorAll('[data-diarito-selection-action]').forEach((button) => button.addEventListener('click', () => {
      const text = toolbar.dataset.diaritoSelectedText || '';
      if (button.dataset.diaritoSelectionAction === 'copy' && text) navigator.clipboard?.writeText?.(text).catch(() => {});
      root.dispatchEvent(new CustomEvent('diarito:selectionaction', { bubbles: true, detail: { action: button.dataset.diaritoSelectionAction, text } }));
      toolbar.hidden = true;
      window.getSelection()?.removeAllRanges?.();
    }));
  });

  document.querySelectorAll('[data-diarito-correction-anchor]').forEach((button) => {
    button.addEventListener('click', () => {
      const active = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
      button.dispatchEvent(new CustomEvent('diarito:correctionanchor', { bubbles: true, detail: { active, text: button.textContent.trim() } }));
    });
  });

  // Media viewer / lightbox
  const mediaViewers = new Map();
  document.querySelectorAll('[data-diarito-media-viewer]').forEach((dialog) => {
    const items = [...dialog.querySelectorAll('[data-diarito-media-viewer-item]')];
    const image = dialog.querySelector('[data-diarito-media-viewer-image]');
    const count = dialog.querySelector('[data-diarito-media-viewer-count]');
    const caption = dialog.querySelector('[data-diarito-media-viewer-caption]');
    let index = 0;
    const render = (nextIndex) => {
      if (!items.length || !image) return;
      index = (nextIndex + items.length) % items.length;
      const item = items[index];
      image.src = item.currentSrc || item.src;
      image.alt = item.alt || '';
      if (count) count.textContent = `${index + 1} / ${items.length}`;
      if (caption) caption.textContent = item.alt || '';
    };
    dialog.querySelector('[data-diarito-media-viewer-prev]')?.addEventListener('click', () => render(index - 1));
    dialog.querySelector('[data-diarito-media-viewer-next]')?.addEventListener('click', () => render(index + 1));
    dialog.querySelector('[data-diarito-media-viewer-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') render(index - 1);
      if (event.key === 'ArrowRight') render(index + 1);
    });
    mediaViewers.set(dialog.id, { dialog, render });
  });
  document.querySelectorAll('[data-diarito-media-viewer-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const viewer = mediaViewers.get(button.dataset.diaritoMediaViewerOpen);
      if (!viewer) return;
      viewer.render(Number(button.dataset.diaritoMediaIndex || 0));
      viewer.dialog.showModal();
    });
  });

  // Media queue ordering/removal
  document.querySelectorAll('[data-diarito-media-queue]').forEach((queue) => {
    queue.addEventListener('click', (event) => {
      const button = event.target.closest('[data-diarito-media-move], [data-diarito-media-remove]');
      if (!button || !queue.contains(button)) return;
      const item = button.closest('.diarito-media-queue__item');
      if (!item) return;
      if (button.hasAttribute('data-diarito-media-remove')) item.remove();
      else if (button.dataset.diaritoMediaMove === 'up' && item.previousElementSibling) queue.insertBefore(item, item.previousElementSibling);
      else if (button.dataset.diaritoMediaMove === 'down' && item.nextElementSibling) queue.insertBefore(item.nextElementSibling, item);
      queue.dispatchEvent(new CustomEvent('diarito:mediaqueuechange', { bubbles: true, detail: { count: queue.querySelectorAll('.diarito-media-queue__item').length } }));
    });
  });

  // Stepper
  document.querySelectorAll('[data-diarito-stepper]').forEach((root) => {
    const steps = [...root.querySelectorAll('[data-diarito-step-index]')];
    const panels = [...root.querySelectorAll('[data-diarito-step-panel]')];
    let current = Number(root.dataset.diaritoStep || 1);
    const render = () => {
      current = Math.min(Math.max(current, 1), steps.length || 1);
      root.dataset.diaritoStep = String(current);
      steps.forEach((step) => {
        const index = Number(step.dataset.diaritoStepIndex);
        step.classList.toggle('is-active', index === current);
        step.classList.toggle('is-complete', index < current);
        step.setAttribute('aria-current', index === current ? 'step' : 'false');
      });
      panels.forEach((panel) => { panel.hidden = Number(panel.dataset.diaritoStepPanel) !== current; });
      root.querySelector('[data-diarito-stepper-prev]')?.toggleAttribute('disabled', current <= 1);
      const next = root.querySelector('[data-diarito-stepper-next]');
      if (next) next.textContent = current >= steps.length ? 'Finish' : 'Continue';
      root.dispatchEvent(new CustomEvent('diarito:stepchange', { bubbles: true, detail: { step: current } }));
    };
    steps.forEach((step) => step.addEventListener('click', () => { current = Number(step.dataset.diaritoStepIndex); render(); }));
    root.querySelector('[data-diarito-stepper-prev]')?.addEventListener('click', () => { current -= 1; render(); });
    root.querySelector('[data-diarito-stepper-next]')?.addEventListener('click', () => { if (current < steps.length) current += 1; render(); });
    render();
  });

  // Language pair swap
  document.querySelectorAll('[data-diarito-language-pair]').forEach((root) => {
    const native = root.querySelector('[data-diarito-language-native]');
    const learning = root.querySelector('[data-diarito-language-learning]');
    root.querySelector('[data-diarito-language-swap]')?.addEventListener('click', () => {
      if (!native || !learning) return;
      const value = native.value;
      native.value = learning.value;
      learning.value = value;
      root.dispatchEvent(new CustomEvent('diarito:languageswap', { bubbles: true, detail: { native: native.value, learning: learning.value } }));
    });
  });

  // Avatar uploader preview
  document.querySelectorAll('[data-diarito-avatar-uploader]').forEach((root) => {
    const input = root.querySelector('[data-diarito-avatar-input]');
    const preview = root.querySelector('[data-diarito-avatar-preview]');
    const avatar = preview?.closest('.diarito-avatar');
    const clear = () => {
      if (preview) { preview.removeAttribute('src'); preview.alt = ''; }
      avatar?.classList.remove('has-photo');
      avatar?.classList.add('is-fallback');
      if (input) input.value = '';
    };
    input?.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file || !preview) return;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        preview.src = String(reader.result || '');
        preview.alt = 'Profile photo preview';
        avatar?.classList.add('has-photo');
        avatar?.classList.remove('is-fallback');
      });
      reader.readAsDataURL(file);
    });
    root.querySelector('[data-diarito-avatar-remove]')?.addEventListener('click', clear);
  });

  // Date navigator
  document.querySelectorAll('[data-diarito-date-nav]').forEach((root) => {
    const output = root.querySelector('[data-diarito-date-current]');
    const parse = () => {
      const [y,m,d] = (root.dataset.diaritoDateValue || '').split('-').map(Number);
      return y && m && d ? new Date(y, m - 1, d) : new Date();
    };
    let date = parse();
    const render = () => {
      const value = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
      root.dataset.diaritoDateValue = value;
      if (output) output.innerHTML = `<span>${new Intl.DateTimeFormat(undefined,{weekday:'long'}).format(date)}</span><strong>${new Intl.DateTimeFormat(undefined,{month:'long',day:'numeric',year:'numeric'}).format(date)}</strong>`;
      root.dispatchEvent(new CustomEvent('diarito:datechange', { bubbles: true, detail: { value } }));
    };
    root.querySelectorAll('[data-diarito-date-shift]').forEach((button) => button.addEventListener('click', () => {
      date.setDate(date.getDate() + Number(button.dataset.diaritoDateShift || 0));
      render();
    }));
    root.querySelector('[data-diarito-date-today]')?.addEventListener('click', () => { date = new Date(); render(); });
    render();
  });

  // Grouped search
  document.querySelectorAll('[data-diarito-grouped-search]').forEach((root) => {
    const input = root.querySelector('[data-diarito-grouped-search-input]');
    const groups = [...root.querySelectorAll('[data-diarito-search-group]')];
    const empty = root.querySelector('[data-diarito-search-empty]');
    const filter = () => {
      const query = (input?.value || '').trim().toLowerCase();
      let visibleCount = 0;
      groups.forEach((group) => {
        let groupCount = 0;
        group.querySelectorAll('[data-diarito-search-result]').forEach((result) => {
          const haystack = (result.dataset.searchText || result.textContent || '').toLowerCase();
          const visible = !query || haystack.includes(query);
          result.hidden = !visible;
          if (visible) { groupCount += 1; visibleCount += 1; }
        });
        group.hidden = groupCount === 0;
      });
      if (empty) empty.hidden = visibleCount > 0;
    };
    input?.addEventListener('input', filter);
    filter();
  });

  // Notification center
  document.querySelectorAll('[data-diarito-notification-center]').forEach((root) => {
    const count = root.querySelector('[data-diarito-notification-count]');
    const sync = () => { if (count) count.textContent = String(root.querySelectorAll('.diarito-notification-item.is-unread').length); };
    root.querySelector('[data-diarito-notifications-read-all]')?.addEventListener('click', () => {
      root.querySelectorAll('.diarito-notification-item.is-unread').forEach((item) => {
        item.classList.remove('is-unread');
        item.querySelector('.diarito-badge')?.remove();
      });
      sync();
      root.dispatchEvent(new CustomEvent('diarito:notificationsread', { bubbles: true }));
    });
    sync();
  });

})();