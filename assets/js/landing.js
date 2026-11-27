(() => {
  const root = document.documentElement;
  root.classList.add("has-js");

  const translations = {
    es: {
      announcement: "Empezamos con Coreano ↔ Español y nivel A2 para validar una experiencia de aprendizaje basada en la vida real.",
      announcementLink: "Conocé el enfoque",
      navWhy: "Por qué Diarito",
      navHow: "Cómo funciona",
      navFeedback: "Retroalimentación humana",
      navTrust: "Confianza",
      login: "Iniciar sesión",
      heroBadge: "Tu vida primero",
      heroTitle: "Aprende el idioma de tu vida.",
      heroLead: "El estudio de un idioma empieza por hablar, en el idioma que estás aprendiendo, de lo que tenés enfrente, de lo que pasó hoy y de lo que querés hacer mañana. El material de estudio no está solo en libros o listas de palabras: está a tu alrededor.",
      heroTagline: "Tu mundo, expresado. Nuestros mundos, conectados.",
      heroPrimary: "Ver cómo funciona Diarito",
      heroSecondary: "Por qué empezar desde tu vida",
      replaceImage: "Reemplazar imagen",
      miniFeedbackKicker: "Retroalimentación humana",
      miniFeedbackTitle: "Más natural en contexto",
      miniFeedbackBody: "“Al final sí fui” expresa mejor la idea sin traducir palabra por palabra.",
      miniSaved: "Expresiones guardadas",
      miniExchange: "Intercambio",
      miniExchangeBody: "Coreano ↔ Español",
      whyKicker: "Por qué existe Diarito",
      whyTitle: "Aprender un idioma no es saber más palabras.",
      whyBody: "Es poder expresar lo que es importante para vos. El aprendizaje empieza en tu propia vida: lo que te pasó hoy, lo que sentís ahora y aquello que realmente querés decir.",
      principle1Label: "01 · Relevancia",
      principle1Title: "Empezá desde tu vida.",
      principle1Body: "Aprendé a partir de lo que viviste hoy, lo que querés decir mañana y lo que sentís en este momento.",
      principle2Label: "02 · Conexión humana",
      principle2Title: "El lenguaje es humano.",
      principle2Body: "No se trata solo de una oración gramaticalmente correcta, sino de una expresión natural para la situación, la relación, la emoción y la cultura.",
      principle3Label: "03 · Apropiación activa",
      principle3Title: "Hacé tuya la retroalimentación.",
      principle3Body: "No alcanza con recibir una corrección. Entendela, repetí la expresión y volvé a usarla hasta que forme parte de tu propio lenguaje.",
      loopKicker: "El ciclo de aprendizaje",
      loopTitle: "Escribí. Intercambiá. Entendé. Hacelo tuyo.",
      loopIntro: "Diarito no termina cuando alguien corrige una oración. Lo aprendido debe volver al uso real para convertirse en algo propio.",
      loop1Title: "Escribí",
      loop1Body: "Registrá tu día y tus emociones en el idioma que estás aprendiendo.",
      loop2Title: "Intercambiá",
      loop2Body: "Intercambiá diarios con otras personas y conocé sus mundos mientras compartís el tuyo.",
      loop3Title: "Entendé",
      loop3Body: "Recibí retroalimentación que explique contexto, naturalidad y matices, no solo gramática.",
      loop4Title: "Hacelo tuyo",
      loop4Body: "Guardá expresiones y volvé a usarlas en tus propias oraciones hasta poder producirlas por tu cuenta.",
      feedbackKicker: "Retroalimentación humana en el centro",
      feedbackTitle: "No solo correcto. Natural para la situación.",
      feedbackBody: "El significado y la naturalidad cambian según la emoción, la relación, la situación y la cultura. Por eso Diarito considera el intercambio entre personas una parte central del aprendizaje.",
      feedbackNote: "Las personas no son simples herramientas de corrección. La experiencia debe tener valor tanto para quien recibe como para quien ofrece retroalimentación.",
      correctionHeader: "Corrección sobre un fragmento seleccionado",
      correctionOriginal: "Original",
      correctionSuggestion: "Sugerencia",
      correctionExplain: "Ambas expresiones se entienden, pero “al final sí fui” es una forma más natural de expresar que fuiste a pesar de la duda o la indecisión anterior.",
      trustKicker: "La conexión funciona en ambos sentidos",
      trustTitle: "Construir confianza antes de escalar.",
      trust1Title: "Intercambio mutuo",
      trust1Body: "Entender la vida de otra persona y compartir tu propio idioma y cultura debe generar aprendizaje en ambos sentidos.",
      trust2Title: "Reconocimiento por contribuir",
      trust2Body: "La contribución útil debe ser reconocida, especialmente cuando mejora la experiencia de aprendizaje de otra persona.",
      trust3Title: "Privacidad y control",
      trust3Body: "La confianza requiere reportes, bloqueos y controles claros sobre quién puede ver e interactuar con lo que escribís.",
      ctaTitle: "Tu mundo, expresado. Nuestros mundos, conectados.",
      ctaBody: "Empezá con algo que realmente quieras decir. Aprendé desde ahí.",
      ctaPrimary: "Empezar desde tu vida",
      ctaSecondary: "Ver el ciclo de aprendizaje",
      footerCopy: "Diarito · Aprende el idioma de tu vida.",
      uiComponents: "Componentes UI"
    },
    ko: {
      announcement: "처음부터 모든 언어와 모든 학습 수준을 지원하기보다 한국어 ↔ 스페인어, A2 수준에서 학습 경험이 실제로 효과적인지 검증합니다.",
      announcementLink: "접근 방식 보기",
      navWhy: "왜 Diarito인가",
      navHow: "어떻게 배우나요",
      navFeedback: "사람을 통한 피드백",
      navTrust: "신뢰",
      login: "로그인",
      heroBadge: "내 삶에서 시작하기",
      heroTitle: "내 삶의 언어를 배우세요.",
      heroLead: "당장 내 앞에 있는 것들, 오늘 일어난 일들, 내일 할 일들을 target language로 말하는 것에서 언어 공부는 시작된다. 공부 자료는 책, 교과서, 단어장에 있는 것이 아니라 내 주변에 있다.",
      heroTagline: "나의 세계를 표현하고, 우리의 세계를 연결합니다.",
      heroPrimary: "Diarito가 어떻게 작동하는지 보기",
      heroSecondary: "왜 내 삶에서 시작하나요",
      replaceImage: "이미지 교체",
      miniFeedbackKicker: "사람을 통한 피드백",
      miniFeedbackTitle: "문맥에 더 자연스럽게",
      miniFeedbackBody: "단어를 그대로 번역하기보다 상황과 감정에 어울리는 표현을 이해합니다.",
      miniSaved: "저장한 표현",
      miniExchange: "교환",
      miniExchangeBody: "한국어 ↔ 스페인어",
      whyKicker: "Diarito가 존재하는 이유",
      whyTitle: "언어는 단어를 많이 아는 것이 아니다.",
      whyBody: "언어는 단어를 많이 아는 것이 아니라, 나에게 중요한 것을 표현할 수 있게 되는 것이다. 배움은 오늘 겪은 일, 지금의 감정, 실제로 표현하고 싶은 것처럼 자신의 삶에서 시작한다.",
      principle1Label: "01 · Relevance",
      principle1Title: "내 삶에서 시작한다.",
      principle1Body: "오늘 겪은 일, 내일 하고 싶은 말, 지금 느끼는 감정처럼 실제로 표현하고 싶은 것에서 배움을 시작한다.",
      principle2Label: "02 · Human Connection",
      principle2Title: "언어는 사람을 통해 이해한다.",
      principle2Body: "단순히 문법적으로 맞는 문장이 아니라, 상황과 감정, 관계와 문화에 어울리는 자연스러운 표현을 배운다.",
      principle3Label: "03 · Active Ownership",
      principle3Title: "배운 표현을 내 것으로 만든다.",
      principle3Body: "피드백을 받는 데서 끝나지 않고, 왜 고쳤는지 이해하고 배운 표현을 반복해서 사용하며 결국 스스로 표현할 수 있게 된다.",
      loopKicker: "학습 루프",
      loopTitle: "Write. Exchange. Understand. Make it your own.",
      loopIntro: "한 번 교정받고 끝나는 플랫폼이 아니라, 배운 표현이 실제 사용으로 이어지는 구조를 만든다.",
      loop1Title: "Write",
      loop1Body: "나의 하루와 감정을 기록한다.",
      loop2Title: "Exchange",
      loop2Body: "다른 사람과 일기를 교환한다.",
      loop3Title: "Understand",
      loop3Body: "문맥과 뉘앙스를 포함한 피드백을 받는다.",
      loop4Title: "Make it your own",
      loop4Body: "표현을 저장하고 실제로 다시 사용한다.",
      feedbackKicker: "사람을 통한 피드백을 핵심 경험으로",
      feedbackTitle: "정답만이 아니라, 상황에 자연스러운 표현.",
      feedbackBody: "언어에는 문법 이상의 것이 있다. 말하는 사람의 감정, 관계, 상황, 문화에 따라 표현의 의미와 자연스러움이 달라진다. 우리는 실제 사람과의 교류를 언어 학습의 핵심으로 여긴다.",
      feedbackNote: "우리는 다른 사람을 단순한 교정 도구로 보지 않는다. 서로의 삶을 이해하고 자신의 언어와 문화를 나누며 양쪽 모두가 배우는 관계를 지향한다.",
      correctionHeader: "선택한 문장에 대한 교정",
      correctionOriginal: "원문",
      correctionSuggestion: "수정 제안",
      correctionExplain: "문법적 정확성뿐 아니라 자연스러움, 뉘앙스, 상황에 따른 표현을 이해할 수 있도록 설명합니다.",
      trustKicker: "연결은 양방향이어야 한다",
      trustTitle: "확장보다 먼저 신뢰를 만든다.",
      trust1Title: "상호 교환",
      trust1Body: "서로의 삶을 이해하고 자신의 언어와 문화를 나누며 양쪽 모두가 배울 수 있는 관계를 만든다.",
      trust2Title: "기여에 대한 인정",
      trust2Body: "다른 사람의 학습에 도움이 되는 기여가 의미 있게 인정될 수 있어야 한다.",
      trust3Title: "신뢰와 개인정보 보호",
      trust3Body: "신고, 차단, 개인정보 보호와 공개 범위를 통해 누구와 무엇을 공유할지 스스로 통제할 수 있어야 한다.",
      ctaTitle: "나의 세계를 표현하고, 우리의 세계를 연결합니다.",
      ctaBody: "정말 말하고 싶은 것에서 시작하세요. 그곳에서부터 배우면 됩니다.",
      ctaPrimary: "내 삶에서 시작하기",
      ctaSecondary: "학습 루프 보기",
      footerCopy: "Diarito · 내 삶의 언어를 배우세요.",
      uiComponents: "UI 컴포넌트"
    }
  };

  const meta = {
    es: {
      title: "Diarito — Aprende el idioma de tu vida.",
      description: "Diarito te ayuda a aprender el idioma de tu vida a través de escritura personal, retroalimentación humana y expresiones que podés hacer tuyas."
    },
    ko: {
      title: "Diarito — 내 삶의 언어를 배우세요.",
      description: "Diarito는 자신의 삶을 기록하고, 사람을 통한 피드백을 이해하고, 배운 표현을 다시 사용하며 내 것으로 만드는 언어 학습 경험입니다."
    }
  };

  const setLanguage = (language, persist = true) => {
    const next = language === "ko" ? "ko" : "es";
    const dict = translations[next];
    root.classList.add("is-language-switching");
    root.lang = next;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (!dict[key]) return;
      node.textContent = dict[key];
      if (key === "heroPrimary") {
        const icon = document.createElement("i");
        icon.className = "fi fi-rr-arrow-right";
        node.append(" ", icon);
      }
      if (key === "login") {
        const icon = document.createElement("i");
        icon.className = "fi fi-rr-sign-in-alt";
        node.prepend(icon, " ");
      }
    });

    document.querySelectorAll("[data-language-label]").forEach((node) => {
      node.textContent = next === "ko" ? "한국어" : "ESP";
    });

    document.title = meta[next].title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta[next].description);
    if (persist) localStorage.setItem("diarito-language", next);
    window.setTimeout(() => root.classList.remove("is-language-switching"), 240);
  };

  const setTheme = (theme, persist = true) => {
    const next = theme === "dark" ? "dark" : "light";
    root.dataset.theme = next;

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(next === "dark"));
    });
    document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
      icon.className = next === "dark" ? "fi fi-rr-sun" : "fi fi-rr-moon";
    });
    document.querySelectorAll("[data-theme-label]").forEach((label) => {
      const language = root.lang === "ko" ? "ko" : "es";
      label.textContent = next === "dark"
        ? (language === "ko" ? "라이트" : "Claro")
        : (language === "ko" ? "다크" : "Oscuro");
    });

    if (persist) localStorage.setItem("diarito-theme", next);
  };

  const savedLanguage = localStorage.getItem("diarito-language");
  const savedTheme = localStorage.getItem("diarito-theme");
  const preferredTheme = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";

  setLanguage(savedLanguage || "es", false);
  setTheme(savedTheme || preferredTheme, false);

  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(root.lang === "ko" ? "es" : "ko");
      setTheme(root.dataset.theme || "light", false);
    });
  });

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  });

  document.querySelector("[data-landing-announcement-close]")?.addEventListener("click", () => {
    document.querySelector("[data-landing-announcement]")?.classList.add("is-closed");
  });

  document.querySelectorAll(".landing-mobile-nav__panel a").forEach((link) => {
    link.addEventListener("click", () => {
      link.closest("details")?.removeAttribute("open");
    });
  });

  // Scroll reveal
  const revealNodes = [...document.querySelectorAll("[data-reveal]")];
  revealNodes.forEach((node) => {
    const delay = Number(node.dataset.revealDelay || 0);
    node.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  // Subtle hero parallax. Decorative only.
  const heroVisual = document.querySelector(".landing-hero-visual");
  if (heroVisual && !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 8;
      heroVisual.style.setProperty("--hero-x", `${x}px`);
      heroVisual.style.setProperty("--hero-y", `${y}px`);
    });
    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--hero-x", "0px");
      heroVisual.style.setProperty("--hero-y", "0px");
    });
  }
})();