(() => {
  "use strict";

  const currentPage = document.body?.dataset?.page;

  document.querySelectorAll("[data-docs-nav]").forEach((link) => {
    const active = link.dataset.docsNav === currentPage;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("[data-code-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const shell = button.closest(".docs-code-shell");
      const code = shell?.querySelector("code")?.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
        const previous = button.textContent;
        button.textContent = "Copied";
        setTimeout(() => { button.textContent = previous; }, 1200);
      } catch {
        button.textContent = "Unavailable";
      }
    });
  });

  document.querySelectorAll("[data-library-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      sessionStorage.removeItem("diaritoUiLibraryAccess");
      location.replace("index.html");
    });
  });

  document.querySelectorAll("[data-demo-toast]").forEach((button) => {
    button.addEventListener("click", () => {
      const tone = button.dataset.demoToast || "success";
      const labels = {
        success: ["Changes saved", "The operation completed successfully."],
        info: ["Information", "This is an example informational message."],
        warning: ["Review this item", "There is pending information to review before continuing."],
        danger: ["Could not complete", "Review the data and try again."]
      };
      const [title, message] = labels[tone] || labels.info;
      if (window.DiaritoUI?.showToast) window.DiaritoUI.showToast({ title, message, type: tone });
    });
  });


  document.querySelectorAll("[data-demo-searchable]").forEach((root) => {
    const input = root.querySelector("[data-demo-searchable-input]");
    const panel = root.querySelector("[data-demo-searchable-panel]");
    const empty = root.querySelector("[data-demo-searchable-empty]");
    const options = [...root.querySelectorAll("[data-search-value]")];
    if (!input || !panel) return;

    const update = () => {
      const query = input.value.trim().toLocaleLowerCase("en");
      if (query.length < 2) {
        panel.hidden = true;
        return;
      }
      let count = 0;
      options.forEach((option) => {
        const value = (option.dataset.searchValue || option.textContent || "").toLocaleLowerCase("en");
        const show = value.includes(query);
        option.hidden = !show;
        if (show) count += 1;
      });
      if (empty) empty.hidden = count !== 0;
      panel.hidden = false;
    };

    input.addEventListener("input", update);
    input.addEventListener("focus", update);
    options.forEach((option) => option.addEventListener("click", () => {
      input.value = option.dataset.searchValue || option.textContent.trim();
      panel.hidden = true;
      input.focus();
    }));

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) panel.hidden = true;
    });
  });

})();
