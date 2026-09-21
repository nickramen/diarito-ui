/*
 * DIARITO_UI - comportamiento compartido de interfaz
 * Native browser JavaScript only. No jQuery and no UI framework.
 */

(() => {
  "use strict";

  const iconNames = {
    menu: "fi-rr-menu-burger",
    search: "fi-rr-search",
    bell: "fi-rr-bell",
    chevronRight: "fi-rs-angle-double-right",
    chevronDown: "fi-rr-angle-small-down",
    plus: "fi-rr-plus",
    edit: "fi-rr-pencil",
    eye: "fi-rr-eye",
    eyeOff: "fi-rr-eye-crossed",
    trash: "fi-rr-trash",
    delete: "fi-rr-trash",
    download: "fi-rr-download",
    upload: "fi-rr-upload",
    filter: "fi-rr-filter",
    close: "fi-rr-cross-small",
    dashboard: "fi-rr-dashboard",
    users: "fi-rr-users-alt",
    user: "fi-rr-user",
    userPlus: "fi-rr-user-add",
    shield: "fi-rr-shield-check",
    book: "fi-rr-book-alt",
    layers: "fi-rr-layers",
    certificate: "fi-rr-diploma",
    cart: "fi-rr-shopping-cart",
    card: "fi-rr-credit-card",
    settings: "fi-rr-settings",
    palette: "fi-rr-palette",
    map: "fi-rr-map",
    calendar: "fi-rr-calendar",
    clock: "fi-rr-clock",
    check: "fi-rr-check",
    alert: "fi-rr-triangle-warning",
    warning: "fi-rr-triangle-warning",
    info: "fi-rr-info",
    lock: "fi-rr-lock",
    logout: "fi-rr-sign-out-alt",
    building: "fi-rr-building",
    mail: "fi-rr-envelope",
    phone: "fi-rr-phone-call",
    globe: "fi-rr-globe",
    link: "fi-rr-link",
    copy: "fi-rr-copy",
    refresh: "fi-rr-refresh",
    external: "fi-rr-arrow-up-right-from-square",
    externalLink: "fi-rr-arrow-up-right-from-square",
    dollar: "fi-rr-dollar",
    activity: "fi-rr-pulse",
    file: "fi-rr-document",
    qr: "fi-rr-qr-code",
    save: "fi-rr-disk",
    arrowLeft: "fi-rs-angle-double-left",
    arrowRight: "fi-rs-angle-double-right",
    arrowUp: "fi-rr-angle-small-up",
    arrowDown: "fi-rr-angle-small-down",
    circle: "fi-rr-circle",
    question: "fi-rr-interrogation",
    list: "fi-rr-list",
    archive: "fi-rr-archive",
    home: "fi-rr-home",
    course: "fi-rr-graduation-cap",
    play: "fi-rr-play",
    pause: "fi-rr-pause-circle",
    progress: "fi-rr-chart-histogram",
    money: "fi-rr-wallet",
    receipt: "fi-rr-receipt",
    notification: "fi-rr-bell-ring",
    classroom: "fi-rr-chalkboard-user",
    evaluation: "fi-rr-quiz",
    invitation: "fi-rr-envelope-open-text",
    institution: "fi-rr-city",
    key: "fi-rr-key",
    language: "fi-rr-language",
    store: "fi-rr-store-alt",
    verified: "fi-rr-badge-check",
    history: "fi-rr-time-past",
    video: "fi-rr-video-camera-alt",
    comments: "fi-rr-comments",
    star: "fi-rr-star",
    fileCsv: "fi-rr-file-csv",
    filePdf: "fi-rr-file-pdf",
    emailAdd: "fi-rr-envelope-plus",
    checkCircle: "fi-rr-check-circle",
    forbidden: "fi-rr-ban",
    unlock: "fi-rr-unlock",
    folder: "fi-rr-folder",
    folderOpen: "fi-rr-folder-open",
    window: "fi-rr-window-alt",
    apps: "fi-rr-apps"
  };

  function iconMarkup(name, extraClass = "") {
    const iconClass = iconNames[name] || iconNames.info;
    return `<i class="diarito-icon fi ${iconClass}${extraClass ? ` ${extraClass}` : ""}" aria-hidden="true"></i>`;
  }

  function renderIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach((node) => {
      const name = node.dataset.icon;
      const iconClass = iconNames[name] || iconNames.info;
      node.classList.add("fi", iconClass);
      node.setAttribute("aria-hidden", "true");
      node.removeAttribute("data-icon");
      if (node.tagName !== "I") {
        const icon = document.createElement("i");
        icon.className = node.className;
        icon.setAttribute("aria-hidden", "true");
        node.replaceWith(icon);
      }
    });
  }


  function getStoredValue(key) {
    try { return window.localStorage.getItem(key); }
    catch (error) { return null; }
  }

  function setStoredValue(key, value) {
    try { window.localStorage.setItem(key, value); }
    catch (error) { /* Storage may be unavailable when opened from a restricted file context. */ }
  }

  function isMobileSidebar() {
    return window.matchMedia("(max-width: 64rem)").matches;
  }

  function initSidebar() {
    const app = document.querySelector(".diarito-app");
    const sidebar = document.querySelector("[data-diarito-sidebar]");
    const backdrop = document.querySelector("[data-diarito-sidebar-backdrop]");
    const toggles = [...document.querySelectorAll("[data-diarito-sidebar-toggle]")];
    if (!app || !sidebar || toggles.length === 0) return;

    const setExpanded = (expanded) => {
      toggles.forEach((button) => button.setAttribute("aria-expanded", String(expanded)));
    };

    const closeMobile = () => {
      sidebar.classList.remove("is-open");
      backdrop?.classList.remove("is-visible");
      document.body.style.overflow = "";
      setExpanded(false);
    };

    const applyDesktopPreference = () => {
      if (isMobileSidebar()) {
        app.classList.remove("is-sidebar-collapsed");
        closeMobile();
        return;
      }
      const collapsed = getStoredValue("diaritoSidebarCollapsed") === "true";
      app.classList.toggle("is-sidebar-collapsed", collapsed);
      sidebar.classList.remove("is-open");
      backdrop?.classList.remove("is-visible");
      document.body.style.overflow = "";
      setExpanded(!collapsed);
    };

    toggles.forEach((button) => {
      button.addEventListener("click", () => {
        if (isMobileSidebar()) {
          const open = !sidebar.classList.contains("is-open");
          sidebar.classList.toggle("is-open", open);
          backdrop?.classList.toggle("is-visible", open);
          document.body.style.overflow = open ? "hidden" : "";
          setExpanded(open);
          if (open) sidebar.querySelector("a, button")?.focus();
          return;
        }

        const collapsed = !app.classList.contains("is-sidebar-collapsed");
        app.classList.toggle("is-sidebar-collapsed", collapsed);
        setStoredValue("diaritoSidebarCollapsed", String(collapsed));
        setExpanded(!collapsed);
      });
    });

    backdrop?.addEventListener("click", closeMobile);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar.classList.contains("is-open")) closeMobile();
    });
    window.addEventListener("resize", applyDesktopPreference);
    applyDesktopPreference();
  }

  function initNavGroups() {
    const app = document.querySelector(".diarito-app");
    const sidebar = document.querySelector("[data-diarito-sidebar]");
    const root = document.querySelector("[data-diarito-nav-root]");
    const groups = [...document.querySelectorAll("[data-diarito-nav-group]")];
    if (!root || groups.length === 0) return;

    const isCollapsedDesktop = () => !isMobileSidebar() && app?.classList.contains("is-sidebar-collapsed");
    let hideFlyoutTimer = null;
    let flyoutSource = null;

    const flyout = document.createElement("div");
    flyout.className = "diarito-nav-flyout";
    flyout.setAttribute("data-diarito-nav-flyout", "");
    flyout.setAttribute("aria-hidden", "true");
    document.body.appendChild(flyout);

    const hideFlyout = (delay = 0) => {
      window.clearTimeout(hideFlyoutTimer);
      hideFlyoutTimer = window.setTimeout(() => {
        flyout.classList.remove("is-open");
        flyout.setAttribute("aria-hidden", "true");
        flyout.innerHTML = "";
        flyoutSource = null;
      }, delay);
    };

    const keepFlyout = () => window.clearTimeout(hideFlyoutTimer);

    const showFlyout = (group) => {
      if (!isCollapsedDesktop()) return;
      const button = group.querySelector("[data-diarito-nav-toggle]");
      const children = group.querySelector("[data-diarito-nav-children]");
      if (!(button instanceof HTMLElement) || !(children instanceof HTMLElement)) return;

      keepFlyout();
      const label = button.querySelector(".diarito-nav__label")?.textContent?.trim() || button.title || "Navigation";
      flyout.innerHTML = `<div class="diarito-nav-flyout__header">${label}</div><ul class="diarito-nav-flyout__list">${children.innerHTML}</ul>`;
      flyout.querySelectorAll("[data-icon]").forEach((node) => renderIcons(node.parentElement || flyout));

      const rect = button.getBoundingClientRect();
      const sidebarRect = sidebar?.getBoundingClientRect();
      flyout.style.left = `${Math.round((sidebarRect?.right || rect.right) + 8)}px`;
      flyout.style.top = `${Math.max(8, Math.round(rect.top))}px`;
      flyout.classList.add("is-open");
      flyout.setAttribute("aria-hidden", "false");
      flyoutSource = group;

      requestAnimationFrame(() => {
        const flyoutRect = flyout.getBoundingClientRect();
        if (flyoutRect.bottom > window.innerHeight - 8) {
          flyout.style.top = `${Math.max(8, Math.round(window.innerHeight - flyoutRect.height - 8))}px`;
        }
      });
    };

    const setOpenGroup = (group, open) => {
      const button = group.querySelector("[data-diarito-nav-toggle]");
      const children = group.querySelector("[data-diarito-nav-children]");
      if (!(button instanceof HTMLElement) || !(children instanceof HTMLElement)) return;
      button.setAttribute("aria-expanded", String(open));
      children.classList.toggle("is-open", open);
    };

    groups.forEach((group) => {
      const button = group.querySelector("[data-diarito-nav-toggle]");
      if (!(button instanceof HTMLButtonElement)) return;

      button.addEventListener("click", (event) => {
        if (isCollapsedDesktop()) {
          event.preventDefault();
          if (flyoutSource === group && flyout.classList.contains("is-open")) hideFlyout();
          else showFlyout(group);
          return;
        }

        const expanded = button.getAttribute("aria-expanded") === "true";
        groups.forEach((other) => {
          if (other !== group) setOpenGroup(other, false);
        });
        setOpenGroup(group, !expanded);
      });

      group.addEventListener("mouseenter", () => {
        if (isCollapsedDesktop()) showFlyout(group);
      });
      group.addEventListener("mouseleave", () => {
        if (isCollapsedDesktop()) hideFlyout(140);
      });
      button.addEventListener("focus", () => {
        if (isCollapsedDesktop()) showFlyout(group);
      });
    });

    flyout.addEventListener("mouseenter", keepFlyout);
    flyout.addEventListener("mouseleave", () => hideFlyout(140));
    document.addEventListener("click", (event) => {
      if (!flyout.classList.contains("is-open")) return;
      if (flyout.contains(event.target)) return;
      if (flyoutSource?.contains(event.target)) return;
      hideFlyout();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hideFlyout();
    });
    window.addEventListener("resize", () => hideFlyout());
  }

  function closeAllDropdowns(except = null) {
    document.querySelectorAll("[data-diarito-dropdown-menu].is-open").forEach((menu) => {
      if (menu !== except) {
        menu.classList.remove("is-open");
        const triggerId = menu.dataset.triggerId;
        if (triggerId) document.getElementById(triggerId)?.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initDropdowns() {
    document.querySelectorAll("[data-diarito-dropdown-trigger]").forEach((trigger, index) => {
      const menu = trigger.closest(".diarito-dropdown")?.querySelector("[data-diarito-dropdown-menu]");
      if (!menu) return;
      if (!trigger.id) trigger.id = `diarito-dropdown-trigger-${index + 1}`;
      menu.dataset.triggerId = trigger.id;
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = !menu.classList.contains("is-open");
        closeAllDropdowns(menu);
        menu.classList.toggle("is-open", open);
        trigger.setAttribute("aria-expanded", String(open));
      });
    });
    document.addEventListener("click", () => closeAllDropdowns());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAllDropdowns();
    });
  }

  function initModals() {
    document.querySelectorAll('[data-diarito-modal-portal="body"]').forEach((modal) => {
      if (modal.parentElement !== document.body) document.body.appendChild(modal);
    });

    let lastFocused = null;
    const closeModal = (modal) => {
      if (!modal) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lastFocused?.focus();
    };

    document.querySelectorAll("[data-diarito-modal-open]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const modal = document.querySelector(`[data-diarito-modal="${trigger.dataset.diaritoModalOpen}"]`);
        if (!modal) return;
        lastFocused = document.activeElement;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        modal.querySelector("button, input, select, textarea, [tabindex]:not([tabindex='-1'])")?.focus();
      });
    });

    document.querySelectorAll("[data-diarito-modal]").forEach((modal) => {
      modal.querySelectorAll("[data-diarito-modal-close]").forEach((button) => button.addEventListener("click", () => closeModal(modal)));
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal(document.querySelector("[data-diarito-modal].is-open"));
    });
  }

  function initDrawers() {
    const closeDrawer = (drawer) => {
      if (!drawer) return;
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-diarito-drawer-open]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const drawer = document.querySelector(`[data-diarito-drawer="${trigger.dataset.diaritoDrawerOpen}"]`);
        if (!drawer) return;
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    document.querySelectorAll("[data-diarito-drawer]").forEach((drawer) => {
      drawer.querySelectorAll("[data-diarito-drawer-close]").forEach((button) => button.addEventListener("click", () => closeDrawer(drawer)));
      drawer.addEventListener("click", (event) => {
        if (event.target === drawer) closeDrawer(drawer);
      });
    });
  }

  function initTabs() {
    document.querySelectorAll("[data-diarito-tabs]").forEach((tabs) => {
      const buttons = [...tabs.querySelectorAll("[role='tab']")];
      const panels = buttons.map((button) => document.getElementById(button.getAttribute("aria-controls"))).filter(Boolean);
      const activate = (button) => {
        buttons.forEach((item) => {
          const selected = item === button;
          item.setAttribute("aria-selected", String(selected));
          item.tabIndex = selected ? 0 : -1;
        });
        panels.forEach((panel) => panel.classList.toggle("is-active", panel.id === button.getAttribute("aria-controls")));
      };
      buttons.forEach((button, index) => {
        button.addEventListener("click", () => activate(button));
        button.addEventListener("keydown", (event) => {
          if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          let nextIndex = index;
          if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
          if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
          if (event.key === "Home") nextIndex = 0;
          if (event.key === "End") nextIndex = buttons.length - 1;
          buttons[nextIndex].focus();
          activate(buttons[nextIndex]);
        });
      });
    });
  }

  function initPasswordToggles() {
    document.querySelectorAll("[data-diarito-password-toggle]").forEach((button) => {
      const input = document.getElementById(button.dataset.diaritoPasswordToggle);
      if (!input) return;
      button.addEventListener("click", () => {
        const visible = input.type === "text";
        input.type = visible ? "password" : "text";
        button.setAttribute("aria-label", visible ? "Mostrar contraseña" : "Ocultar contraseña");
        button.innerHTML = iconMarkup(visible ? "eye" : "eyeOff");
      });
    });
  }

  function initAlerts() {
    document.querySelectorAll("[data-diarito-alert-close]").forEach((button) => {
      button.addEventListener("click", () => button.closest(".diarito-alert")?.remove());
    });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast({ title = "Actualizado", message = "Los cambios se guardaron correctamente.", type = "success", duration = 5000 } = {}) {
    const normalizedType = type === "danger" ? "error" : ["success", "info", "warning", "error"].includes(type) ? type : "success";
    let region = document.querySelector(".diarito-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "diarito-toast-region";
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "false");
      region.setAttribute("aria-label", "Notificaciones");
      document.body.append(region);
    }
    const toast = document.createElement("div");
    toast.className = `diarito-toast diarito-toast--${normalizedType}`;
    toast.setAttribute("role", normalizedType === "error" ? "alert" : "status");
    const toastIcon = normalizedType === "error" || normalizedType === "warning" ? "alert" : normalizedType === "info" ? "info" : "check";
    toast.innerHTML = `${iconMarkup(toastIcon)}
      <div class="diarito-toast__content"><span class="diarito-bold">${escapeHtml(title)}</span><p>${escapeHtml(message)}</p></div>
      <button class="diarito-alert__close" type="button" aria-label="Cerrar notificación">${iconMarkup("close")}</button>`;
    region.append(toast);
    const remove = () => {
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 160);
    };
    toast.querySelector("button")?.addEventListener("click", remove);
    if (duration > 0) window.setTimeout(remove, duration);
  }

  function initServerToasts() {
    document.querySelectorAll("[data-diarito-server-toast]").forEach((payload) => {
      showToast({
        title: payload.dataset.toastTitle || "Actualizado",
        message: payload.dataset.toastMessage || "La operación se completó correctamente.",
        type: payload.dataset.toastType || "success",
        duration: Number(payload.dataset.toastDuration || 5000)
      });
      payload.remove();
    });
  }

  function initToastTriggers() {
    document.querySelectorAll("[data-diarito-toast]").forEach((button) => {
      button.addEventListener("click", () => showToast({
        title: button.dataset.toastTitle || "Acción completada",
        message: button.dataset.toastMessage || "La acción de demostración se completó correctamente.",
        type: button.dataset.toastType || "success"
      }));
    });
  }


  function initTableSelection() {
    document.querySelectorAll("[data-diarito-selectable-table]").forEach((container) => {
      const master = container.querySelector("[data-diarito-select-all]");
      const rows = [...container.querySelectorAll("[data-diarito-row-select]")];
      const bulkBar = container.querySelector("[data-diarito-bulk-bar]");
      const count = container.querySelector("[data-diarito-selected-count]");
      if (!master || !rows.length) return;
      const update = () => {
        const selected = rows.filter((checkbox) => checkbox.checked).length;
        master.checked = selected === rows.length;
        master.indeterminate = selected > 0 && selected < rows.length;
        bulkBar?.classList.toggle("is-visible", selected > 0);
        if (count) count.textContent = String(selected);
      };
      master.addEventListener("change", () => {
        rows.forEach((checkbox) => { checkbox.checked = master.checked; });
        update();
      });
      rows.forEach((checkbox) => checkbox.addEventListener("change", update));
    });
  }

  function initTableSearch() {
    document.querySelectorAll("[data-diarito-table-search]").forEach((input) => {
      const selector = input.dataset.diaritoTableSearch?.trim();
      if (!selector) return;

      let table;
      try {
        table = document.querySelector(selector);
      } catch (error) {
        console.warn("Diarito table search ignored an invalid selector.", { selector, error });
        return;
      }

      if (!table) return;
      const rows = [...table.querySelectorAll("tbody tr:not([data-diarito-search-empty])")];
      const empty = table.querySelector("[data-diarito-search-empty]");
      input.addEventListener("input", () => {
        const query = input.value.trim().toLocaleLowerCase("es");
        let visible = 0;
        rows.forEach((row) => {
          const searchableText = row.dataset.search || row.textContent || "";
          const matches = !query || searchableText.toLocaleLowerCase("es").includes(query);
          row.hidden = !matches;
          if (matches) visible += 1;
        });
        if (empty) empty.hidden = visible !== 0;
      });
    });
  }

  function initFormDemo() {
    document.querySelectorAll("form[data-diarito-demo-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        let valid = true;
        form.querySelectorAll("[required]").forEach((field) => {
          const wrapper = field.closest(".diarito-form-field");
          const error = wrapper?.querySelector(".diarito-field-error");
          const empty = field.type === "checkbox" ? !field.checked : !String(field.value).trim();
          wrapper?.classList.toggle("has-error", empty);
          if (error) error.hidden = !empty;
          if (empty) valid = false;
        });
        if (valid) showToast({ title: "Prototipo guardado", message: "El patrón de formulario y validación funciona. No se modificaron datos del servidor." });
      });
    });
  }

  function initAccordions() {
    document.querySelectorAll("[data-diarito-accordion-button]").forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".diarito-accordion__item");
        const open = !item?.classList.contains("is-open");
        item?.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function initBuilder() {
    document.querySelectorAll("[data-diarito-builder]").forEach((builder) => {
      const panels = [...builder.querySelectorAll("[data-diarito-builder-panel]")];
      const steps = [...builder.querySelectorAll("[data-diarito-builder-step]")];
      let current = Number(builder.dataset.currentStep || 1);
      const show = (step) => {
        current = Math.max(1, Math.min(step, panels.length));
        panels.forEach((panel, index) => panel.classList.toggle("is-active", index + 1 === current));
        steps.forEach((stepNode, index) => {
          stepNode.classList.toggle("is-active", index + 1 === current);
          stepNode.classList.toggle("is-complete", index + 1 < current);
          stepNode.setAttribute("aria-current", index + 1 === current ? "step" : "false");
        });
        builder.dataset.currentStep = String(current);
        builder.querySelectorAll("[data-diarito-builder-prev]").forEach((button) => { button.disabled = current === 1; });
        builder.querySelectorAll("[data-diarito-builder-next]").forEach((button) => { button.hidden = current === panels.length; });
        builder.querySelectorAll("[data-diarito-builder-finish]").forEach((button) => { button.hidden = current !== panels.length; });

        // Canonical form pattern: navigation/finish actions live in the active card footer.
        const actions = builder.querySelector(".diarito-builder-actions");
        if (actions) {
          const activePanel = panels[current - 1];
          const cards = [...activePanel.querySelectorAll(".diarito-card")];
          let targetCard = cards[cards.length - 1];
          if (!targetCard) {
            targetCard = activePanel.querySelector(":scope > .diarito-builder-actions-card");
            if (!targetCard) {
              targetCard = document.createElement("section");
              targetCard.className = "diarito-card diarito-builder-actions-card";
              activePanel.appendChild(targetCard);
            }
          }
          let footer = targetCard.querySelector(":scope > .diarito-card__footer");
          if (!footer) {
            footer = document.createElement("div");
            footer.className = "diarito-card__footer diarito-builder-card-footer";
            targetCard.appendChild(footer);
          }
          footer.classList.add("diarito-builder-card-footer");
        footer.appendChild(actions);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      };
      builder.querySelectorAll("[data-diarito-builder-next]").forEach((button) => button.addEventListener("click", () => show(current + 1)));
      builder.querySelectorAll("[data-diarito-builder-prev]").forEach((button) => button.addEventListener("click", () => show(current - 1)));
      steps.forEach((stepNode, index) => stepNode.addEventListener("click", () => show(index + 1)));
      show(current);
    });
  }

  function initCopyButtons() {
    document.querySelectorAll("[data-diarito-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        const source = document.querySelector(button.dataset.diaritoCopy);
        const text = source?.textContent?.trim() || button.dataset.copyText || "";
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          showToast({ title: "Copiado", message: "El valor se copió al portapapeles." });
        } catch {
          showToast({ title: "No se pudo copiar", message: "El navegador bloqueó el acceso al portapapeles.", type: "error" });
        }
      });
    });
  }

  function initFileUploads() {
    document.querySelectorAll("[data-diarito-file-upload]").forEach((zone) => {
      const input = zone.querySelector("input[type='file']");
      const label = zone.querySelector("[data-diarito-file-name]");
      if (!input) return;
      zone.addEventListener("click", (event) => {
        if (event.target.closest("button, input")) return;
        input.click();
      });
      input.addEventListener("change", () => {
        if (label && input.files?.[0]) label.textContent = input.files[0].name;
      });
      ["dragenter", "dragover"].forEach((name) => zone.addEventListener(name, (event) => {
        event.preventDefault();
        zone.classList.add("is-dragging");
      }));
      ["dragleave", "drop"].forEach((name) => zone.addEventListener(name, (event) => {
        event.preventDefault();
        zone.classList.remove("is-dragging");
      }));
    });
  }


  function initImagePreviews() {
    document.querySelectorAll("[data-diarito-image-upload]").forEach((container) => {
      const input = container.querySelector("input[type='file']");
      const preview = container.querySelector("[data-diarito-image-preview]");
      if (!input || !preview) return;
      input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.addEventListener("load", () => { preview.src = String(reader.result || ""); });
        reader.readAsDataURL(file);
      });
    });
  }

  function initRevealControllers() {
    document.querySelectorAll("input[data-diarito-reveal-value]").forEach((input) => {
      const update = () => {
        if (!input.checked) return;
        const value = input.dataset.diaritoRevealValue;
        const panels = [...document.querySelectorAll("[data-diarito-reveal-panel]")].filter((panel) => {
          const key = panel.dataset.diaritoRevealPanel;
          return ["complete", "user-only", "none", "single", "bulk"].includes(key);
        });
        panels.forEach((panel) => {
          const key = panel.dataset.diaritoRevealPanel;
          const sameGroup = ["complete", "user-only", "none"].includes(value)
            ? ["complete", "user-only", "none"].includes(key)
            : ["single", "bulk"].includes(key);
          if (sameGroup) panel.classList.toggle("is-active", key === value);
        });
      };
      input.addEventListener("change", update);
      update();
    });

  }

  function initAccountGates() {
    document.querySelectorAll("[data-diarito-account-gate]").forEach((gate) => {
      const builder = gate.closest("[data-diarito-gated-builder]");
      const radios = [...gate.querySelectorAll("input[name='person-user-state']")];
      const searchPanel = gate.querySelector("[data-diarito-account-search-panel]");
      const missingPanel = gate.querySelector("[data-diarito-account-missing]");
      const result = gate.querySelector("[data-diarito-account-result]");
      const lookup = gate.querySelector("[data-diarito-account-lookup]");
      const setUnlocked = (unlocked) => {
        builder?.querySelectorAll("[data-diarito-builder-step]").forEach((step, index) => { if (index > 0) step.disabled = !unlocked; });
        builder?.querySelectorAll("[data-diarito-builder-next]").forEach((button) => { button.disabled = !unlocked; });
      };
      const updateMode = () => {
        const value = radios.find((radio) => radio.checked)?.value || "existing";
        if (searchPanel) searchPanel.hidden = value !== "existing";
        if (missingPanel) missingPanel.hidden = value !== "missing";
        if (result) result.hidden = true;
        setUnlocked(false);
      };
      radios.forEach((radio) => radio.addEventListener("change", updateMode));
      lookup?.addEventListener("click", () => {
        if (result) result.hidden = false;
        setUnlocked(true);
        showToast({ title: "Usuario encontrado", message: "La cuenta está disponible y los pasos de persona fueron habilitados.", type: "success" });
      });
      updateMode();
    });
  }

  function initCourseLookups() {
    document.querySelectorAll("[data-diarito-course-lookup]").forEach((button) => {
      button.addEventListener("click", () => {
        const result = button.closest(".diarito-form-section")?.querySelector("[data-diarito-course-result]");
        if (result) result.hidden = false;
        showToast({ title: "Curso encontrado", message: "Ya puedes seleccionar dónde se ubicará la evaluación.", type: "success" });
      });
    });
  }

  function initLoginDemo() {
    const form = document.querySelector("[data-diarito-login-demo]");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const submit = form.querySelector("button[type='submit']");
      if (!submit) return;
      const original = submit.innerHTML;
      submit.disabled = true;
      submit.innerHTML = `<span class="diarito-spinner" aria-hidden="true"></span><span>Validando...</span>`;
      window.setTimeout(() => {
        submit.disabled = false;
        submit.innerHTML = original;
        showToast({ title: "Prototipo estático", message: "Esta demostración utiliza un flujo local y estático únicamente para previsualización." });
      }, 700);
    });
  }

  function initCourseAccessMode() {
    document.querySelectorAll("[data-diarito-access-controller]").forEach((controller) => {
      const radios = [...controller.querySelectorAll("input[name='accessMode']")];
      const panels = [...controller.querySelectorAll("[data-diarito-access-panel]")];
      const update = () => {
        const mode = radios.find((radio) => radio.checked)?.value || "public";
        panels.forEach((panel) => {
          const modes = (panel.dataset.diaritoAccessPanel || "").split(",");
          panel.hidden = !modes.includes(mode);
        });
        controller.dataset.accessMode = mode;
      };
      radios.forEach((radio) => radio.addEventListener("change", update));
      update();
    });
  }

  function initInvitationList() {
    document.querySelectorAll("[data-diarito-invitation-list]").forEach((container) => {
      const input = container.querySelector("[data-diarito-invitation-email]");
      const add = container.querySelector("[data-diarito-invitation-add]");
      const tableBody = container.querySelector("tbody");
      if (!input || !add || !tableBody) return;
      add.addEventListener("click", () => {
        const email = input.value.trim().toLowerCase();
        if (!email || !email.includes("@")) {
          showToast({ title: "Correo no válido", message: "Ingresa un correo electrónico válido.", type: "error" });
          return;
        }
        const row = document.createElement("tr");
        row.dataset.search = email;
        row.innerHTML = `<td>${email}</td><td><span class="diarito-badge diarito-badge--warning">Pendiente</span></td><td>Acceso institucional</td><td><div class="diarito-table__actions"><button class="diarito-action-button diarito-action-button--delete" type="button" aria-label="Quitar correo" title="Quitar correo" data-diarito-remove-row>${iconMarkup("trash")}</button></div></td>`;
        tableBody.prepend(row);
        input.value = "";
            showToast({ title: "Correo agregado", message: "El correo quedó en la lista de acceso del prototipo." });
      });
      container.addEventListener("click", (event) => {
        const button = event.target.closest("[data-diarito-remove-row]");
        if (button) button.closest("tr")?.remove();
      });
    });
  }

  function initFilterPanels() {
    document.querySelectorAll("[data-diarito-filter-toggle]").forEach((button) => {
      const target = document.querySelector(button.dataset.diaritoFilterToggle);
      if (!target) return;
      button.addEventListener("click", () => {
        const hidden = target.hidden;
        target.hidden = !hidden;
        button.setAttribute("aria-expanded", String(hidden));
      });
    });
  }


  function initFilterModals() {
    document.querySelectorAll("[data-diarito-filter-reset]").forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.closest("[data-diarito-modal]");
        modal?.querySelectorAll("input, select").forEach((field) => {
          if (field instanceof HTMLSelectElement) field.selectedIndex = 0;
          else if (field.type === "checkbox" || field.type === "radio") field.checked = false;
          else field.value = "";
        });
      });
    });

    document.querySelectorAll("[data-diarito-filter-apply]").forEach((button) => {
      button.addEventListener("click", () => showToast({
        title: "Filtros aplicados",
        message: "En una aplicación real, estos criterios se enviarían al listado correspondiente.",
        type: "success"
      }));
    });
  }

  function initDemoActions() {
    document.querySelectorAll("[data-diarito-demo-action]").forEach((button) => {
      button.addEventListener("click", () => showToast({
        title: button.dataset.demoTitle || "Acción disponible en integración",
        message: button.dataset.demoMessage || "En una aplicación real, este control se conectaría a la lógica y permisos correspondientes."
      }));
    });
  }


  function initPermissionTrees() {
    document.querySelectorAll("[data-diarito-permission-tree]").forEach((tree) => {
      const nodes = [...tree.querySelectorAll("[data-diarito-tree-node]")];
      const leaves = [...tree.querySelectorAll("[data-diarito-permission]")];
      const parents = [...tree.querySelectorAll("[data-diarito-tree-parent]")];
      const count = tree.querySelector("[data-diarito-permission-count]");
      const search = tree.querySelector("[data-diarito-tree-search]");

      const updateCount = () => {
        const selected = leaves.filter((input) => input.checked).length;
        if (count) count.textContent = `${selected} seleccionados`;
      };

      const setNodeExpanded = (node, expanded) => {
        node.classList.toggle("is-expanded", expanded);
        const toggle = node.querySelector(":scope > .diarito-tree-row [data-diarito-tree-toggle]");
        toggle?.setAttribute("aria-expanded", String(expanded));
      };

      const updateParentState = (parent) => {
        const node = parent.closest("[data-diarito-tree-node]");
        if (!node) return;
        const descendantLeaves = [...node.querySelectorAll("[data-diarito-permission]")];
        const checked = descendantLeaves.filter((input) => input.checked).length;
        parent.checked = descendantLeaves.length > 0 && checked === descendantLeaves.length;
        parent.indeterminate = checked > 0 && checked < descendantLeaves.length;
      };

      const synchronizeParents = () => {
        [...parents].reverse().forEach(updateParentState);
      };

      tree.querySelectorAll("[data-diarito-tree-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
          const node = button.closest("[data-diarito-tree-node]");
          if (!node) return;
          setNodeExpanded(node, !node.classList.contains("is-expanded"));
        });
      });

      parents.forEach((parent) => {
        parent.addEventListener("change", () => {
          const node = parent.closest("[data-diarito-tree-node]");
          node?.querySelectorAll("[data-diarito-permission]").forEach((input) => {
            if (!input.disabled) input.checked = parent.checked;
          });
          synchronizeParents();
          updateCount();
        });
      });

      leaves.forEach((leaf) => leaf.addEventListener("change", () => {
        synchronizeParents();
        updateCount();
      }));

      tree.querySelector("[data-diarito-tree-expand-all]")?.addEventListener("click", () => {
        nodes.forEach((node) => setNodeExpanded(node, true));
      });
      tree.querySelector("[data-diarito-tree-collapse-all]")?.addEventListener("click", () => {
        nodes.forEach((node) => setNodeExpanded(node, false));
      });

      search?.addEventListener("input", () => {
        const query = search.value.trim().toLowerCase();
        nodes.forEach((node) => {
          const ownText = (node.dataset.search || "").toLowerCase();
          const leafRows = [...node.querySelectorAll(".diarito-tree-leaf")];
          const categoryMatches = !query || ownText.includes(query);
          let visibleLeaves = 0;

          leafRows.forEach((row) => {
            const rowText = (row.dataset.search || row.textContent || "").toLowerCase();
            const visible = categoryMatches || rowText.includes(query);
            row.hidden = !visible;
            if (visible) visibleLeaves += 1;
          });

          const matches = !query || categoryMatches || visibleLeaves > 0;
          node.hidden = !matches;
          if (query && matches) setNodeExpanded(node, true);
        });
      });

      synchronizeParents();
      updateCount();
    });
  }

  function initDataDrivenVisuals() {
    document.querySelectorAll("[data-diarito-progress]").forEach((node) => {
      const value = Math.max(0, Math.min(100, Number(node.dataset.diaritoProgress) || 0));
      node.style.setProperty("--diarito-progress", `${value}%`);
      if (node.matches(".diarito-review-bar__track > span")) node.style.width = `${value}%`;
    });
    document.querySelectorAll("[data-diarito-height]").forEach((node) => {
      const value = Math.max(0, Math.min(100, Number(node.dataset.diaritoHeight) || 0));
      node.style.setProperty("--height", `${value}%`);
    });
    document.querySelectorAll("[data-diarito-width]").forEach((node) => {
      const value = Math.max(0, Math.min(100, Number(node.dataset.diaritoWidth) || 0));
      node.style.setProperty("--diarito-value", `${value}%`);
    });
    document.querySelectorAll("[data-diarito-value]").forEach((node) => node.style.setProperty("--value", node.dataset.diaritoValue));
    document.querySelectorAll("[data-diarito-swatch]").forEach((node) => node.style.setProperty("--swatch", node.dataset.diaritoSwatch));
  }

  function initCourseModules() {
    document.querySelectorAll(".diarito-course-module__toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const module = button.closest(".diarito-course-module");
        const open = !module?.classList.contains("is-open");
        module?.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function initCourseEvaluations() {
    document.querySelectorAll(".diarito-course-evaluation__toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const evaluation = button.closest(".diarito-course-evaluation");
        const open = !evaluation?.classList.contains("is-open");
        evaluation?.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function initGroupSessionGenerator() {
    const button = document.querySelector("[data-diarito-generate-sessions]");
    const table = document.querySelector("[data-diarito-session-table] tbody");
    if (!button || !table) return;
    button.addEventListener("click", () => {
      const start = document.getElementById("group-start-date")?.value;
      const end = document.getElementById("group-end-date")?.value;
      const startTime = document.getElementById("group-start-time")?.value || "15:00";
      const endTime = document.getElementById("group-end-time")?.value || "17:00";
      const days = [...document.querySelectorAll(".diarito-weekday-picker input:checked")].map((input) => Number(input.value));
      if (!start || !end || days.length === 0) {
        showToast({ title: "Calendario incompleto", message: "Selecciona fechas y al menos un día de clase.", type: "warning" });
        return;
      }
      const dates = [];
      const cursor = new Date(`${start}T12:00:00`);
      const limit = new Date(`${end}T12:00:00`);
      while (cursor <= limit && dates.length < 40) {
        const isoDay = cursor.getDay() === 0 ? 7 : cursor.getDay();
        if (days.includes(isoDay)) dates.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      const lessons = ["Contexto energético global","Rutas de descarbonización","Sistemas solares y eólicos","Comparación de tecnologías","Evaluación técnica","Marco regulatorio"];
      table.innerHTML = dates.map((date, index) => {
        const label = new Intl.DateTimeFormat("es-HN", { weekday: "short", day: "numeric", month: "short" }).format(date);
        const lesson = lessons[index % lessons.length];
        return `<tr><td>${index + 1}</td><td>${label} · ${startTime}–${endTime}</td><td><select class="diarito-select"><option>M${Math.floor(index/2)+1} · ${lesson}</option></select></td><td><select class="diarito-select"><option>Al iniciar la sesión</option><option>24 horas antes</option><option>Manual</option></select></td><td><span class="diarito-badge diarito-badge--neutral">Pendiente de sincronizar</span></td><td><div class="diarito-icon-actions"><button class="diarito-action-button diarito-action-button--edit" type="button" title="Editar">${iconMarkup("edit")}</button><button class="diarito-action-button diarito-action-button--delete" type="button" title="Eliminar">${iconMarkup("trash")}</button></div></td></tr>`;
      }).join("");
      showToast({ title: "Sesiones generadas", message: `Se prepararon ${dates.length} sesiones para revisión.`, type: "success" });
    });
  }

  function initCountryInputPolicies() {
    const limits = {
      AR:{identity:8,phone:10}, BO:{identity:12,phone:8}, CL:{identity:9,phone:9}, CO:{identity:10,phone:10},
      CR:{identity:9,phone:8}, CU:{identity:11,phone:8}, EC:{identity:10,phone:10}, SV:{identity:9,phone:8},
      ES:{identity:9,phone:9}, GT:{identity:13,phone:8}, HN:{identity:13,phone:8}, MX:{identity:18,phone:10},
      NI:{identity:14,phone:8}, PA:{identity:20,phone:8}, PY:{identity:10,phone:10}, PE:{identity:8,phone:9},
      PR:{identity:20,phone:10}, DO:{identity:11,phone:10}, UY:{identity:8,phone:8}, VE:{identity:9,phone:11}, GQ:{identity:20,phone:9}
    };
    const normalizePhone = value => (value || "").replace(/\D/g, "");
    const normalizeIdentity = value => (value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const selectors = document.querySelectorAll("[data-country-policy-select],[data-country-identity-policy-select],[data-country-phone-policy-select]");
    selectors.forEach(select => {
      const form = select.closest("form") || document;
      const handlesIdentity = select.hasAttribute("data-country-identity-policy-select") || select.hasAttribute("data-country-policy-select");
      const handlesPhone = select.hasAttribute("data-country-phone-policy-select") || select.hasAttribute("data-country-policy-select");
      const phone = handlesPhone ? form.querySelector("[data-country-phone-input]") : null;
      const identity = handlesIdentity ? form.querySelector("[data-country-identity-input]") : null;
      const phoneHint = handlesPhone ? form.querySelector("[data-country-phone-hint]") : null;
      const identityHint = handlesIdentity ? form.querySelector("[data-country-identity-hint]") : null;
      const identityLabel = handlesIdentity ? form.querySelector("[data-country-identity-label]") : null;
      const update = () => {
        const option = select.selectedOptions?.[0];
        if (!option) return;
        const iso2 = (option.dataset.iso2 || "").toUpperCase();
        const limit = limits[iso2] || {};
        if (phoneHint) phoneHint.textContent = option.dataset.phoneHint || "Ingresa solo el número local; el país de domicilio identifica el código internacional.";
        if (identityHint) identityHint.textContent = option.dataset.identityHint || "Ingresa la identidad nacional sin espacios ni separadores.";
        if (identityLabel) identityLabel.textContent = option.dataset.identityLabel || "Número de identidad nacional";
        if (phone) {
          if (option.dataset.phonePattern) phone.setAttribute("pattern", option.dataset.phonePattern); else phone.removeAttribute("pattern");
          phone.setAttribute("inputmode", "numeric");
          if (limit.phone) phone.setAttribute("maxlength", String(limit.phone)); else phone.removeAttribute("maxlength");
          phone.value = normalizePhone(phone.value).slice(0, limit.phone || 30);
        }
        if (identity) {
          if (option.dataset.identityPattern) identity.setAttribute("pattern", option.dataset.identityPattern); else identity.removeAttribute("pattern");
          if (limit.identity) identity.setAttribute("maxlength", String(limit.identity)); else identity.setAttribute("maxlength", "40");
          identity.value = normalizeIdentity(identity.value).slice(0, limit.identity || 40);
          identity.setAttribute("inputmode", /^\^\\d/.test(option.dataset.identityPattern || "") ? "numeric" : "text");
        }
      };
      phone?.addEventListener("input", () => {
        const iso2=(select.selectedOptions?.[0]?.dataset.iso2||"").toUpperCase(); const max=limits[iso2]?.phone||30;
        phone.value=normalizePhone(phone.value).slice(0,max);
      });
      identity?.addEventListener("input", () => {
        const iso2=(select.selectedOptions?.[0]?.dataset.iso2||"").toUpperCase(); const max=limits[iso2]?.identity||40;
        identity.value=normalizeIdentity(identity.value).slice(0,max);
      });
      phone?.addEventListener("paste", () => setTimeout(update, 0));
      identity?.addEventListener("paste", () => setTimeout(update, 0));
      select.addEventListener("change", update);
      update();
    });
  }

  function initLocationCascades() {
    document.querySelectorAll("[data-diarito-location-cascade]").forEach((cascade, cascadeIndex) => {
      const form = cascade.closest("form") || document;
      const countrySelector = cascade.dataset.countrySelector || "#CountryId";
      const country = form.querySelector(countrySelector);
      const dynamicLevels = cascade.querySelector("[data-diarito-location-levels]");
      const fixedSlots = [...cascade.querySelectorAll("[data-diarito-location-slot]")];
      const hint = cascade.querySelector("[data-diarito-location-hint]");
      const valueInput = form.querySelector("[data-diarito-location-value]");
      const regionInput = form.querySelector("[data-diarito-location-region]");
      const divisionsUrl = cascade.dataset.divisionsUrl;
      const pathUrl = cascade.dataset.pathUrl;
      const maxLevel = Math.min(2, Math.max(1, Number(cascade.dataset.maxLevel || 2)));
      if (!(country instanceof HTMLSelectElement) || !valueInput || !divisionsUrl || !pathUrl || (!dynamicLevels && fixedSlots.length === 0)) return;

      let requestVersion = 0;
      const initialDivisionId = Number(valueInput.value) || 0;

      const setHint = message => { if (hint) hint.textContent = message; };
      const getSlot = level => fixedSlots.find(slot => Number(slot.dataset.diaritoLocationSlot) === level) || null;
      const selectRoot = () => fixedSlots.length ? cascade : dynamicLevels;
      const selectedLevels = () => [...selectRoot().querySelectorAll("select[data-diarito-location-level-select]")]
        .filter(select => Number(select.dataset.level) <= maxLevel && select.value)
        .sort((a, b) => Number(a.dataset.level) - Number(b.dataset.level));

      const synchronizeHiddenValues = () => {
        const selected = selectedLevels();
        const deepest = selected.at(-1);
        valueInput.value = deepest?.value || "";
        if (regionInput) regionInput.value = selected[0]?.selectedOptions?.[0]?.dataset.divisionName || "";
      };

      const placeholderFor = level => level === 1
        ? "Selecciona primero un país"
        : "Selecciona primero la división anterior";

      const resetSlot = level => {
        const slot = getSlot(level);
        if (!slot) return;
        const label = level === 1 ? "Departamento, estado, provincia o región" : "Municipio o subdivisión";
        slot.innerHTML = `<label class="diarito-label">${label}</label><select class="diarito-select"><option value="">${placeholderFor(level)}</option></select>`;
      };

      const clearAfter = level => {
        for (let next = level + 1; next <= maxLevel; next += 1) resetSlot(next);
        if (dynamicLevels) {
          dynamicLevels.querySelectorAll("[data-diarito-location-level]").forEach(field => {
            if (Number(field.dataset.level) > level) field.remove();
          });
        }
      };

      const requestJson = async url => {
        const response = await fetch(url, {
          credentials: "same-origin",
          headers: { "X-Requested-With": "XMLHttpRequest" }
        });
        const contentType = (response.headers.get("content-type") || "").toLowerCase();
        if (response.redirected || !contentType.includes("json")) {
          throw new Error("La consulta territorial fue redirigida o devolvió una respuesta no válida.");
        }
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.message || "No se pudo cargar la estructura territorial.");
        if (!body || !Array.isArray(body.items)) {
          throw new Error("La consulta territorial devolvió una respuesta incompleta.");
        }
        return body;
      };

      const renderLevel = (payload, selectedId = 0) => {
        if (!payload || !Array.isArray(payload.items)) return null;
        const level = Number(payload.level) || 1;
        if (level > maxLevel) return null;
        clearAfter(level - 1);

        const slot = getSlot(level);
        let field = slot;
        if (!field) {
          if (!dynamicLevels) return null;
          field = document.createElement("div");
          field.className = "diarito-form-field";
          field.dataset.diaritoLocationLevel = "";
          field.dataset.level = String(level);
          dynamicLevels.appendChild(field);
        }

        const inputId = `diarito-location-${cascadeIndex}-${level}`;
        const divisionLabel = payload.label || (level === 1 ? "Departamento, estado, provincia o región" : "Municipio o subdivisión");
        const labelText = level === 1 ? "Departamento, estado, provincia o región" : divisionLabel;
        const label = document.createElement("label");
        label.className = "diarito-label";
        label.htmlFor = inputId;
        label.textContent = labelText;

        const select = document.createElement("select");
        select.className = "diarito-select";
        select.id = inputId;
        select.dataset.diaritoLocationLevelSelect = "";
        select.dataset.level = String(level);
        select.setAttribute("aria-label", labelText);

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = payload.items.length
          ? (level === 1 ? "Selecciona una opción" : `Selecciona ${divisionLabel.toLowerCase()}`)
          : (level === 1 ? "No hay divisiones territoriales configuradas" : `No hay ${divisionLabel.toLowerCase()} configurados`);
        select.appendChild(placeholder);

        payload.items.forEach(item => {
          const option = document.createElement("option");
          option.value = String(item.id);
          option.textContent = item.name;
          option.dataset.divisionName = item.name;
          option.dataset.hasChildren = item.hasChildren ? "true" : "false";
          option.dataset.level = String(item.level || level);
          if (Number(item.id) === Number(selectedId)) option.selected = true;
          select.appendChild(option);
        });

        field.replaceChildren(label, select);
        field.dataset.level = String(level);
        return select;
      };

      const loadLevel = async (parentId, selectedId = 0, version = requestVersion) => {
        const countryId = Number(country.value) || 0;
        if (!countryId) return null;
        const query = new URLSearchParams({ countryId: String(countryId) });
        if (parentId) query.set("parentId", String(parentId));
        const payload = await requestJson(`${divisionsUrl}?${query}`);
        if (version !== requestVersion) return null;
        return renderLevel(payload, selectedId);
      };

      const loadChildrenFor = async (select, version = requestVersion) => {
        const level = Number(select.dataset.level) || 1;
        clearAfter(level);
        synchronizeHiddenValues();
        const selectedId = Number(select.value) || 0;
        if (!selectedId) {
          setHint(level === 1 ? "Selecciona la primera división para habilitar la segunda." : "Selecciona la ubicación territorial correspondiente.");
          return;
        }
        if (level >= maxLevel) {
          setHint("Ubicación territorial seleccionada. La ciudad se registra por separado.");
          return;
        }

        setHint("Cargando siguiente división territorial...");
        try {
          const child = await loadLevel(selectedId, 0, version);
          if (version !== requestVersion) return;
          synchronizeHiddenValues();
          setHint(child && !child.disabled
            ? "Selecciona la segunda división administrativa. La ciudad se registra por separado."
            : "No hay una segunda división configurada; se guardará la primera división seleccionada.");
        } catch (error) {
          if (version === requestVersion) setHint(error.message || "No se pudo cargar la siguiente división territorial.");
        }
      };

      cascade.addEventListener("change", event => {
        const select = event.target.closest?.("select[data-diarito-location-level-select]");
        if (!(select instanceof HTMLSelectElement)) return;
        const version = ++requestVersion;
        void loadChildrenFor(select, version);
      });

      const initializeCountry = async ({ resetValues = false } = {}) => {
        const version = ++requestVersion;
        if (dynamicLevels) dynamicLevels.innerHTML = "";
        for (let level = 1; level <= maxLevel; level += 1) resetSlot(level);
        if (resetValues) {
          valueInput.value = "";
          if (regionInput) regionInput.value = "";
        }

        const countryId = Number(country.value) || 0;
        if (!countryId) {
          setHint("Selecciona un país para cargar su estructura territorial.");
          return;
        }

        setHint("Cargando estructura territorial...");
        try {
          let path = [];
          if (!resetValues && initialDivisionId > 0) {
            const pathQuery = new URLSearchParams({ countryId: String(countryId), divisionId: String(initialDivisionId) });
            const pathPayload = await requestJson(`${pathUrl}?${pathQuery}`);
            if (version !== requestVersion) return;
            path = (Array.isArray(pathPayload.items) ? pathPayload.items : []).filter(item => Number(item.level) <= maxLevel);
          }

          let parentId = 0;
          if (path.length > 0) {
            for (const pathItem of path) {
              const select = await loadLevel(parentId, pathItem.id, version);
              if (version !== requestVersion || !select || Number(select.value) !== Number(pathItem.id)) break;
              parentId = Number(pathItem.id);
            }
            synchronizeHiddenValues();
            if (path.length < maxLevel && parentId > 0) await loadLevel(parentId, 0, version);
            if (version !== requestVersion) return;
            setHint("Ubicación actual cargada. La ciudad se registra por separado.");
            return;
          }

          const rootSelect = await loadLevel(0, 0, version);
          if (version !== requestVersion) return;
          setHint(rootSelect && !rootSelect.disabled
            ? "Selecciona la primera división; al cambiarla se cargará la segunda automáticamente."
            : "Este país no tiene divisiones territoriales activas configuradas.");
        } catch (error) {
          if (version === requestVersion) setHint(error.message || "No se pudo cargar la estructura territorial.");
        }
      };

      country.addEventListener("change", () => void initializeCountry({ resetValues: true }));
      void initializeCountry();
    });
  }

  function initMutationSafety() {
    document.addEventListener("submit", (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.method.toLowerCase() !== "post" || form.hasAttribute("data-diarito-allow-repeat-submit")) return;
      // Forms that use the shared confirmation modal must not enter the
      // mutation-safety "submitting" state until the user has actually
      // confirmed. Otherwise the first, intentionally-cancelled submit marks
      // the form as submitted and the modal's requestSubmit() is blocked.
      if (form.hasAttribute("data-diarito-confirm") && form.dataset.diaritoConfirmApproved !== "true") return;

      if (form.matches("[data-diarito-evaluation-form]") && form.dataset.expirySubmitted !== "true") {
        const questions = [...form.querySelectorAll(".diarito-evaluation-question")];
        const unanswered = questions.filter((question) => {
          const text = question.querySelector("textarea");
          if (text instanceof HTMLTextAreaElement) return !text.value.trim();
          return !question.querySelector("input[type='radio']:checked, input[type='checkbox']:checked");
        }).length;
        if (unanswered > 0 && !window.confirm(`Tenés ${unanswered} pregunta(s) sin responder. ¿Querés enviar la evaluación de todas formas?`)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
      }
      if (form.dataset.diaritoSubmitting === "true") {
        event.preventDefault();
        return;
      }
      form.dataset.diaritoSubmitting = "true";
      form.classList.add("is-submitting");
      const submitter = event.submitter;
      if (submitter instanceof HTMLElement) {
        submitter.setAttribute("aria-disabled", "true");
        submitter.classList.add("is-loading");
      }
      // Se deshabilita después de que el navegador capture name/value del submitter.
      window.setTimeout(() => {
        if (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) submitter.disabled = true;
      }, 0);
    }, true);

    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("input", (event) => {
        const field = event.target;
        if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
        // Los errores devueltos por el servidor describen el intento anterior. Al cambiar
        // los datos ya no deben seguir pareciendo vigentes.
        form.querySelectorAll(".diarito-validation-summary").forEach((summary) => {
          summary.innerHTML = "";
          summary.classList.remove("validation-summary-errors");
          summary.classList.add("validation-summary-valid");
        });
        if (field.name) {
          const escaped = window.CSS?.escape ? CSS.escape(field.name) : field.name.replace(/([\\.\[\]])/g, "\\$1");
          form.querySelectorAll(`[data-valmsg-for="${escaped}"]`).forEach((message) => {
            message.textContent = "";
            message.classList.remove("field-validation-error");
            message.classList.add("field-validation-valid");
          });
        }
      });
    });
  }

  function initBuilderActionMenus() {
    const menus = [...document.querySelectorAll("details.diarito-builder-actions-menu")];
    if (!menus.length) return;
    menus.forEach((menu) => {
      menu.addEventListener("toggle", () => {
        if (!menu.open) return;
        menus.forEach((other) => { if (other !== menu) other.open = false; });
      });
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest?.("details.diarito-builder-actions-menu")) return;
      menus.forEach((menu) => { menu.open = false; });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") menus.forEach((menu) => { menu.open = false; });
    });
  }

  function init() {
    renderIcons();
    initDataDrivenVisuals();
    initSidebar();
    initNavGroups();
    initDropdowns();
    initModals();
    initDrawers();
    initTabs();
    initPasswordToggles();
    initAlerts();
    initServerToasts();
    initToastTriggers();
    initTableSelection();
    initTableSearch();
    initFormDemo();
    initAccordions();
    initCourseModules();
    initCourseEvaluations();
    initBuilder();
    initCopyButtons();
    initFileUploads();
    initImagePreviews();
    initRevealControllers();
    initAccountGates();
    initCourseLookups();
    initLoginDemo();
    initCourseAccessMode();
    initInvitationList();
    initFilterPanels();
    initFilterModals();
    initPermissionTrees();
    initGroupSessionGenerator();
    initDemoActions();
    initCountryInputPolicies();
    initLocationCascades();
    initMutationSafety();
    initBuilderActionMenus();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.DiaritoUI = { showToast, renderIcons, iconMarkup };
})();

// Evaluation attempt countdown. SQL remains authoritative for expiration; this improves the learner UX
// and submits the answers currently present in the form when the client-side clock reaches the deadline.
(() => {
  const countdowns = document.querySelectorAll('[data-diarito-evaluation-countdown]');
  if (!countdowns.length) return;

  countdowns.forEach((badge) => {
    const expiresAt = Date.parse(badge.dataset.expiresUtc || '');
    if (!Number.isFinite(expiresAt)) return;
    const form = badge.closest('.diarito-card')?.querySelector('[data-diarito-evaluation-form]');

    const tick = () => {
      const remainingMs = expiresAt - Date.now();
      if (remainingMs <= 0) {
        badge.textContent = 'Tiempo agotado';
        if (form && form.dataset.expirySubmitted !== 'true') {
          form.dataset.expirySubmitted = 'true';
          const submit = form.querySelector('[data-diarito-evaluation-submit]');
          if (submit) submit.disabled = true;
          form.requestSubmit();
        }
        return false;
      }

      const totalSeconds = Math.ceil(remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      badge.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
      return true;
    };

    if (!tick()) return;
    const timerId = window.setInterval(() => {
      if (!tick()) window.clearInterval(timerId);
    }, 1000);
  });
})();

