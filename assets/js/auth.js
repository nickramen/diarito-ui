(() => {
  "use strict";

  const SESSION_KEY = "diaritoUiLibraryAccess";
  const EXPECTED_PIN = "DIARITO2026";
  const onLoginPage = document.body?.dataset?.page === "login";

  if (!onLoginPage && sessionStorage.getItem(SESSION_KEY) !== "granted") {
    const current = encodeURIComponent(location.pathname.split("/").pop() || "typography.html");
    location.replace(`index.html?return=${current}`);
    return;
  }

  if (!onLoginPage) return;

  const form = document.querySelector("[data-pin-form]");
  const input = document.querySelector("[data-pin-input]");
  const error = document.querySelector("[data-pin-error]");

  if (sessionStorage.getItem(SESSION_KEY) === "granted") {
    location.replace("typography.html");
    return;
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = String(input?.value || "").trim();
    if (value !== EXPECTED_PIN) {
      if (error) error.textContent = "Incorrect PIN. Check the value configured in assets/js/auth.js.";
      input?.focus();
      input?.select();
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "granted");
    const params = new URLSearchParams(location.search);
    const target = params.get("return") || "typography.html";
    location.replace(target);
  });
})();
