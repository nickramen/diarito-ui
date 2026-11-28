(() => {
  const root = document.documentElement;
  root.classList.add("has-js");

  const translations = {
    es: {
      navCommunity: "Comunidad",
      navMembership: "Membresía",
      announcementLink: "Conocé el enfoque",
      communityKicker: "Una comunidad que aprende junta",
      communityTitle: "Aprendé de otros. Ayudá a otros a aprender.",
      communityBody: "Tu idioma también es el que alguien más está aprendiendo. En Diarito, compartí lo que sabés, descubrí otras formas de ver el mundo y aprendé junto a personas que también tienen algo que contar.",
      communityShareTitle: "Compartí tu idioma",
      communityShareBody: "Ayudá a alguien a encontrar una expresión más natural y explicale por qué funciona en ese contexto.",
      communityDiscoverTitle: "Descubrí otros mundos",
      communityDiscoverBody: "Conocé otras experiencias y culturas a través de los diarios de la comunidad.",
      communityGrowTitle: "Crecé junto a otros",
      communityGrowBody: "Aprender y aportar son dos partes de la misma experiencia.",
      mistakesKicker: "No necesitás hablar perfecto",
      mistakesTitle: "Equivocarte también es aprender.",
      mistakesBody: "No tenés que esperar a dominar un idioma para empezar a usarlo. Escribí a tu ritmo, recibí retroalimentación con respeto y volvé a intentarlo con más confianza.",
      mistakesChoiceTitle: "Vos decidís qué compartís.",
      mistakesChoiceBody: "Tu diario es tuyo. Elegí qué historias querés compartir con la comunidad y cuáles preferís guardar para vos.",
      mistakesRespectTitle: "El error es parte del proceso.",
      mistakesRespectBody: "Acá, una corrección es una oportunidad para aprender, no un motivo para juzgar a alguien.",
      membershipKicker: "Formá parte de Diarito",
      membershipTitle: "Una comunidad. Una membresía.",
      membershipBody: "Aprendé desde tu vida, conectá con otras personas y convertí la retroalimentación en expresiones que podés usar en el mundo real.",
      membershipPlan: "Membresía Diarito",
      membershipPriceLabel: "Precio de membresía",
      membershipLanguages: "Coreano ↔ Español",
      membershipLevel: "Nivel inicial de la beta: A2",
      membershipJoin: "Unite por $7",
      membershipPreview: "Inscripción y pago aún no habilitados.",
      membershipPendingTitle: "La membresía aún no está disponible.",
      membershipPendingBody: "Esta versión muestra la propuesta de acceso a Diarito. Todavía no es posible registrarse ni realizar un pago desde esta página.",
      membershipIncludes: "¿Qué incluye tu membresía?",
      benefitDiaryTitle: "Tu diario personal",
      benefitDiaryBody: "Escribí sobre tu día, tus experiencias y emociones.",
      benefitCommunityTitle: "Comunidad e intercambio",
      benefitCommunityBody: "Leé diarios, compartí los tuyos y conectá con otros miembros.",
      benefitReceiveTitle: "Retroalimentación humana",
      benefitReceiveBody: "Recibí correcciones y explicaciones sobre contexto y naturalidad.",
      benefitGiveTitle: "Ayudá a otros a aprender",
      benefitGiveBody: "Corregí diarios y compartí lo que sabés de tu idioma.",
      benefitSaveTitle: "Expresiones guardadas",
      benefitSaveBody: "Conservá las expresiones útiles para volver a consultarlas.",
      benefitPracticeTitle: "Práctica y reescritura",
      benefitPracticeBody: "Usá las correcciones para producir nuevas oraciones con tus propias palabras.",
      benefitProgressTitle: "Seguimiento de tu aprendizaje",
      benefitProgressBody: "Revisá tu actividad y el progreso de tus ciclos de escritura, retroalimentación y práctica.",
      benefitPrivacyTitle: "Control de lo que compartís",
      benefitPrivacyBody: "Elegí qué entradas mantenés privadas y cuáles publicás.",
      ctaKicker: "Todo empieza con tu historia",
      ctaTitle: "Compartí tu mundo. Conectá con el de otros.",
      ctaBody: "Escribí tu primer diario en el idioma que estás aprendiendo y descubrí todo lo que podés aprender y compartir con otras personas.",
      ctaPrimary: "Unite a Diarito por $7",
      ctaSecondary: "Ver cómo funciona Diarito",
      announcementEyebrow: "Diarito · versión beta",
      announcement: "Empezamos con Coreano ↔ Español y nivel A2 para validar una experiencia de aprendizaje basada en la vida real.",
      navWhy: "Por qué Diarito",
      navHow: "Cómo funciona",
      navFeedback: "Retroalimentación humana",
      login: "Iniciar sesión",
      heroBadge: "Tu vida primero",
      heroTitleStart: "Tu vida ya tiene historias.",
      heroTitleEnd: "Empezá a contarlas en otro idioma.",
      heroLead: "El estudio de un idioma empieza por hablar, en el idioma que estás aprendiendo, de lo que tenés enfrente, de lo que pasó hoy y de lo que querés hacer mañana. El material de estudio no está solo en libros o listas de palabras: está a tu alrededor.",
      heroTagline: "Tu mundo, expresado. Nuestros mundos, conectados.",
      heroPrimary: "Ver cómo funciona Diarito",
      heroSecondary: "Por qué empezar desde tu vida",
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
      loop1Body: "Sofía quiso pedir comida en un restaurante coreano, pero no logró hacerse entender. En Diarito escribió en coreano lo que pasó y cómo se sintió.",
      loop2Title: "Intercambiá",
      loop2Body: "Varias personas coreanas leyeron el diario de Sofía y le ofrecieron expresiones y consejos para comunicarse de forma más natural.",
      loop3Title: "Entendé",
      loop3Body: "Sofía revisó las correcciones y anotó las expresiones que aprendió, comprendiendo su significado y cuándo utilizarlas.",
      loop4Title: "Hacelo tuyo",
      loop4Body: "Sofía guardó las expresiones, practicó con sus propias oraciones y volvió al restaurante. Esta vez pudo hacer su pedido en coreano.",
      feedbackKicker: "Retroalimentación humana en el centro",
      feedbackTitle: "No solo correcto. Natural para la situación.",
      feedbackTitleLine1: "No solo correcto.",
      feedbackTitleLine2: "Natural para la situación.",
      feedbackBody: "El significado y la naturalidad cambian según la emoción, la relación, la situación y la cultura. Por eso Diarito considera el intercambio entre personas una parte central del aprendizaje.",
      correctionHeader: "Corrección sobre un fragmento seleccionado",
      correctionOriginal: "Original",
      correctionSuggestion: "Sugerencia",
      correctionExplain: "Ambas expresiones se entienden, pero “al final sí fui” es una forma más natural de expresar que fuiste a pesar de la duda o la indecisión anterior.",
      feedbackDemoLanguage: "Español",
      feedbackDemoSentence: "Hoy pensé que no iba a salir, pero al final yo fui de todos modos.",
      feedbackDemoWhy: "Por qué suena más natural",
      feedbackFeedTitle: "Comunidad",
      feedbackFeedHint: "Diarios para intercambiar",
      feedbackTabForYou: "Para vos",
      feedbackTabFollowing: "Siguiendo",
      feedbackTabPractice: "Práctica",
      feedbackComposerPrompt: "¿Qué estás pensando hoy?",
      feedbackComposerPost: "Publicar",
      feedbackFirstMeta: "Español · A2 · hace 3 min",
      feedbackFirstPost: "Esta mañana pedí un café en español. Me puse nervioso, pero entendí la pregunta y pude responder sin usar el traductor.",
      feedbackThirdMeta: "Español · A2 · hace 24 min",
      feedbackThirdPost: "Hoy anoté tres expresiones que escuché en una conversación. Quiero usarlas mañana cuando hable con mi amiga.",
      feedbackFourthMeta: "Español · A2 · hace 41 min",
      feedbackFourthPost: "Esta tarde caminé por el parque. Intenté describir lo que veía en español y aprendí palabras nuevas.",
      feedbackPostMeta: "Español · A2 · hace 8 min",
      feedbackPostBefore: "Hoy presenté una idea en una reunión. Estaba nerviosa, pero intenté explicar todo con calma. Al final, mi jefa me dijo que ",
      feedbackPostSelected: "mi presentación fue muy comprensible",
      feedbackPostAfter: ".",
      feedbackCorrectAction: "Corregir",
      feedbackCorrectionKicker: "Retroalimentación",
      feedbackCorrectionTitle: "Corrección humana",
      feedbackSelectedLabel: "Texto seleccionado",
      feedbackSuggestionLabel: "Texto sugerido",
      feedbackExplanationLabel: "Explicación",
      feedbackCorrectionSuggestionValue: "mi presentación fue muy clara",
      feedbackCorrectionExplanationValue: "Al hablar de una presentación, «clara» suena más natural que «comprensible» porque describe que la información se entendió con facilidad.",
      feedbackSubmit: "Enviar retroalimentación",
      feedbackPublishedTitle: "Corrección de Yuna",
      feedbackPublishedPrefix: "Sugirió:",
      feedbackPublishedStatus: "Retroalimentación enviada",
      footerCopy: "Diarito · Aprende el idioma de tu vida.",
      footerBrandBody: "Un espacio para aprender el idioma que necesitás para expresar tu propia vida y conectar con la de otras personas.",
      footerBeta: "Coreano ↔ Español · versión beta · A2",
      footerDiarito: "Diarito",
      footerLearn: "Aprender",
      footerInfo: "Información",
      footerPrivacy: "Privacidad",
      footerTerms: "Términos y condiciones",
      footerContact: "Contacto",
      footerSocial: "Diarito en la web",
      footerEmail: "Correo electrónico",
      footerCopyright: "© 2026 Diarito. Todos los derechos reservados.",
      footerDeveloped: "Diseñado y desarrollado por el equipo de Diarito.",
      uiComponents: "Componentes de interfaz"
    },
    ko: {
      navCommunity: "커뮤니티",
      navMembership: "멤버십",
      announcementLink: "Diarito의 방향 알아보기",
      communityKicker: "함께 배우는 커뮤니티",
      communityTitle: "다른 사람에게 배우고, 다른 사람의 배움을 도와요.",
      communityBody: "누군가에게는 당신의 언어도 배우고 싶은 언어예요. Diarito에서 내가 아는 것을 나누고, 다른 사람들의 삶과 생각을 만나며 함께 배워요.",
      communityShareTitle: "나의 언어를 나눠요",
      communityShareBody: "더 자연스러운 표현을 제안하고 왜 그 상황에서 어울리는지 설명해 주세요.",
      communityDiscoverTitle: "다른 사람의 세계를 만나요",
      communityDiscoverBody: "커뮤니티의 일기를 통해 다양한 경험과 문화를 알아가요.",
      communityGrowTitle: "함께 성장해요",
      communityGrowBody: "배우는 것과 다른 사람의 배움을 돕는 것은 하나의 경험이에요.",
      mistakesKicker: "완벽하게 말할 필요는 없어요",
      mistakesTitle: "실수도 배움의 일부예요.",
      mistakesBody: "언어를 완벽하게 익힐 때까지 기다릴 필요는 없어요. 나만의 속도로 글을 쓰고, 서로 존중하는 피드백을 받으며 조금 더 자신 있게 다시 시도해 보세요.",
      mistakesChoiceTitle: "무엇을 공유할지는 내가 정해요.",
      mistakesChoiceBody: "일기는 나의 공간이에요. 커뮤니티에 나누고 싶은 이야기와 나만 간직하고 싶은 이야기를 선택해요.",
      mistakesRespectTitle: "실수는 자연스러운 과정이에요.",
      mistakesRespectBody: "교정은 누군가를 평가하는 것이 아니라, 함께 배우는 기회예요.",
      membershipKicker: "Diarito의 멤버가 되어 보세요",
      membershipTitle: "하나의 커뮤니티, 하나의 멤버십.",
      membershipBody: "나의 삶에서 배우고, 다른 사람과 연결되며, 받은 피드백을 실제 생활에서 쓸 수 있는 표현으로 만들어 보세요.",
      membershipPlan: "Diarito 멤버십",
      membershipPriceLabel: "멤버십 가격",
      membershipLanguages: "한국어 ↔ 스페인어",
      membershipLevel: "베타 시작 수준: A2",
      membershipJoin: "$7에 함께하기",
      membershipPreview: "가입 및 결제는 아직 준비 중이에요.",
      membershipPendingTitle: "아직 멤버십에 가입할 수 없어요.",
      membershipPendingBody: "현재 페이지는 Diarito 멤버십의 안내용 버전이에요. 아직 이 페이지에서 가입하거나 결제할 수 없어요.",
      membershipIncludes: "멤버십에 포함된 기능",
      benefitDiaryTitle: "나만의 일기",
      benefitDiaryBody: "하루의 경험과 감정을 기록해요.",
      benefitCommunityTitle: "커뮤니티와 교류",
      benefitCommunityBody: "다른 사람의 일기를 읽고 내 일기를 공유하며 교류해요.",
      benefitReceiveTitle: "사람을 통한 피드백",
      benefitReceiveBody: "표현의 자연스러움과 상황에 맞는 설명을 받아요.",
      benefitGiveTitle: "다른 사람의 배움 돕기",
      benefitGiveBody: "일기를 교정하고 내가 아는 언어를 나눠요.",
      benefitSaveTitle: "표현 저장",
      benefitSaveBody: "유용한 표현을 저장하고 필요할 때 다시 확인해요.",
      benefitPracticeTitle: "연습과 다시 쓰기",
      benefitPracticeBody: "교정을 바탕으로 나만의 문장을 다시 만들어 봐요.",
      benefitProgressTitle: "학습 과정 확인",
      benefitProgressBody: "활동 기록과 글쓰기, 피드백, 연습 과정의 진행 상황을 확인해요.",
      benefitPrivacyTitle: "공개 범위 선택",
      benefitPrivacyBody: "나만 간직할 일기와 공개할 일기를 선택해요.",
      ctaKicker: "모든 것은 나의 이야기에서 시작돼요",
      ctaTitle: "나의 세계를 나누고, 다른 사람의 세계를 만나 보세요.",
      ctaBody: "배우고 있는 언어로 첫 일기를 쓰고, 서로에게 배우고 나눌 수 있는 것들을 발견해 보세요.",
      ctaPrimary: "$7에 Diarito 함께하기",
      ctaSecondary: "Diarito 학습 과정 보기",
      announcementEyebrow: "Diarito · 베타 버전",
      announcement: "처음부터 모든 언어와 모든 학습 수준을 지원하기보다 한국어 ↔ 스페인어, A2 수준에서 학습 경험이 실제로 효과적인지 검증합니다.",
      navWhy: "왜 Diarito인가",
      navHow: "어떻게 배우나요",
      navFeedback: "사람을 통한 피드백",
      login: "로그인",
      heroBadge: "내 삶에서 시작하기",
      heroTitleStart: "당신의 삶에는 이미 이야기가 있어요.",
      heroTitleEnd: "이제 다른 언어로 들려주세요.",
      heroLead: "당장 내 앞에 있는 것들, 오늘 일어난 일들, 내일 할 일들을 지금 배우고 있는 언어로 말하는 것에서 언어 공부는 시작된다. 공부 자료는 책, 교과서, 단어장에 있는 것이 아니라 내 주변에 있다.",
      heroTagline: "나의 세계를 표현하고, 우리의 세계를 연결합니다.",
      heroPrimary: "Diarito가 어떻게 작동하는지 보기",
      heroSecondary: "왜 내 삶에서 시작하나요",
      whyKicker: "Diarito가 존재하는 이유",
      whyTitle: "언어는 단어를 많이 아는 것이 아니다.",
      whyBody: "언어는 단어를 많이 아는 것이 아니라, 나에게 중요한 것을 표현할 수 있게 되는 것이다. 배움은 오늘 겪은 일, 지금의 감정, 실제로 표현하고 싶은 것처럼 자신의 삶에서 시작한다.",
      principle1Label: "01 · 나와 관련 있는 언어",
      principle1Title: "내 삶에서 시작한다.",
      principle1Body: "오늘 겪은 일, 내일 하고 싶은 말, 지금 느끼는 감정처럼 실제로 표현하고 싶은 것에서 배움을 시작한다.",
      principle2Label: "02 · 사람을 통한 이해",
      principle2Title: "언어는 사람을 통해 이해한다.",
      principle2Body: "단순히 문법적으로 맞는 문장이 아니라, 상황과 감정, 관계와 문화에 어울리는 자연스러운 표현을 배운다.",
      principle3Label: "03 · 내 것으로 만드는 학습",
      principle3Title: "배운 표현을 내 것으로 만든다.",
      principle3Body: "피드백을 받는 데서 끝나지 않고, 왜 고쳤는지 이해하고 배운 표현을 반복해서 사용하며 결국 스스로 표현할 수 있게 된다.",
      loopKicker: "학습 루프",
      loopTitle: "쓰고. 교환하고. 이해하고. 내 것으로 만든다.",
      loopIntro: "한 번 교정받고 끝나는 플랫폼이 아니라, 배운 표현이 실제 사용으로 이어지는 구조를 만든다.",
      loop1Title: "쓰기",
      loop1Body: "민준은 멕시코 식당에서 타코를 주문하려 했지만 말이 잘 통하지 않았어요. 그날의 경험과 감정을 Diarito에 스페인어로 기록했어요.",
      loop2Title: "교환하기",
      loop2Body: "여러 중남미 사람들이 민준의 일기를 읽고 더 자연스럽게 말할 수 있는 표현과 조언을 전해 줬어요.",
      loop3Title: "이해하기",
      loop3Body: "민준은 받은 피드백을 살펴보고 새로운 표현을 노트에 정리하며 그 의미와 어떤 상황에서 자연스럽게 쓸 수 있는지 이해했어요.",
      loop4Title: "내 것으로 만들기",
      loop4Body: "민준은 배운 표현을 저장하고 직접 문장을 만들어 연습한 뒤, 다시 타코를 주문했어요. 이번에는 스페인어로 주문하는 데 성공했어요.",
      feedbackKicker: "사람을 통한 피드백을 핵심 경험으로",
      feedbackTitle: "정답만이 아니라, 상황에 자연스러운 표현.",
      feedbackTitleLine1: "정답만이 아니라,",
      feedbackTitleLine2: "상황에 자연스러운 표현.",
      feedbackBody: "언어에는 문법 이상의 것이 있다. 말하는 사람의 감정, 관계, 상황, 문화에 따라 표현의 의미와 자연스러움이 달라진다. 우리는 실제 사람과의 교류를 언어 학습의 핵심으로 여긴다.",
      correctionHeader: "선택한 문장에 대한 교정",
      correctionOriginal: "원문",
      correctionSuggestion: "수정 제안",
      correctionExplain: "문법적 정확성뿐 아니라 자연스러움, 뉘앙스, 상황에 따른 표현을 이해할 수 있도록 설명합니다.",
      feedbackDemoLanguage: "스페인어",
      feedbackDemoSentence: "Hoy pensé que no iba a salir, pero al final yo fui de todos modos.",
      feedbackDemoWhy: "왜 더 자연스러운가",
      feedbackFeedTitle: "커뮤니티",
      feedbackFeedHint: "교환할 수 있는 일기",
      feedbackTabForYou: "추천",
      feedbackTabFollowing: "팔로잉",
      feedbackTabPractice: "연습",
      feedbackComposerPrompt: "오늘은 어떤 생각을 했나요?",
      feedbackComposerPost: "게시하기",
      feedbackFirstMeta: "한국어 · A2 · 3분 전",
      feedbackFirstPost: "오늘 아침에 한국어로 커피를 주문했어요. 긴장했지만 질문을 이해하고 번역기 없이 대답했어요.",
      feedbackThirdMeta: "한국어 · A2 · 24분 전",
      feedbackThirdPost: "오늘 대화에서 들은 표현 세 개를 적었어요. 내일 친구와 이야기할 때 써 보고 싶어요.",
      feedbackFourthMeta: "한국어 · A2 · 41분 전",
      feedbackFourthPost: "오늘 오후에 공원을 산책했어요. 보이는 것을 한국어로 설명해 보면서 새로운 단어를 배웠어요.",
      feedbackPostMeta: "한국어 · A2 · 8분 전",
      feedbackPostBefore: "오늘 회의에서 아이디어를 발표했어요. 많이 긴장했지만 차분하게 설명하려고 했어요. 마지막에 팀장님이 ",
      feedbackPostSelected: "제 발표가 아주 이해 가능했다고",
      feedbackPostAfter: " 말했어요.",
      feedbackCorrectAction: "교정하기",
      feedbackCorrectionKicker: "사람을 통한 피드백",
      feedbackCorrectionTitle: "사람의 교정",
      feedbackSelectedLabel: "선택한 문장",
      feedbackSuggestionLabel: "수정 문장",
      feedbackExplanationLabel: "설명",
      feedbackCorrectionSuggestionValue: "제 발표가 이해하기 쉬웠다고",
      feedbackCorrectionExplanationValue: "발표가 쉽게 이해됐다는 뜻을 말할 때는 «이해 가능하다»보다 «이해하기 쉽다»가 더 자연스러워요.",
      feedbackSubmit: "피드백 보내기",
      feedbackPublishedTitle: "Yuna의 교정",
      feedbackPublishedPrefix: "수정 제안:",
      feedbackPublishedStatus: "피드백을 보냈어요",
      footerCopy: "Diarito · 내 삶의 언어를 배우세요.",
      footerBrandBody: "내 삶을 표현하는 데 필요한 언어를 배우고, 다른 사람의 삶과 연결되는 공간입니다.",
      footerBeta: "한국어 ↔ 스페인어 · A2 · 베타 버전",
      footerDiarito: "Diarito",
      footerLearn: "배우기",
      footerInfo: "정보",
      footerPrivacy: "개인정보 보호",
      footerTerms: "이용약관",
      footerContact: "문의",
      footerSocial: "웹에서 만나는 Diarito",
      footerEmail: "이메일",
      footerCopyright: "© 2026 Diarito. 모든 권리 보유.",
      footerDeveloped: "Diarito 팀이 디자인하고 개발했습니다.",
      uiComponents: "인터페이스 구성요소"
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
        icon.className = "fi fi-rr-angle-double-right";
        node.append(" ", icon);
      }
      if (key === "login") {
        const icon = document.createElement("i");
        icon.className = "fi fi-rr-sign-in-alt";
        node.prepend(icon, " ");
      }
    });

    // The story follows the selected interface language, including on initial load.
    document.querySelectorAll("[data-cycle-photo], [data-why-photo]").forEach((photo) => {
      const source = next === "ko" ? photo.dataset.srcKo : photo.dataset.srcEs;
      const alt = next === "ko" ? photo.dataset.altKo : photo.dataset.altEs;
      if (source && photo.getAttribute("src") !== source) photo.setAttribute("src", source);
      photo.alt = alt || "";
    });

    document.querySelectorAll("[data-language-label]").forEach((node) => {
      node.textContent = next === "ko" ? "한국어" : "ESP";
    });

    document.title = meta[next].title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta[next].description);
    if (persist) localStorage.setItem("diarito-language", next);
    document.dispatchEvent(new CustomEvent("diarito:languagechange", { detail: { language: next } }));
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
        ? (language === "ko" ? "밝게" : "Claro")
        : (language === "ko" ? "어둡게" : "Oscuro");
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

  // Scroll-driven centered learning focus
  document.querySelectorAll("[data-scroll-cycle]").forEach((section) => {
    const panels = [...section.querySelectorAll("[data-cycle-step]")];
    const header = document.querySelector(".landing-header");
    let activeIndex = -1;
    let raf = 0;

    const setActive = (index) => {
      if (index === activeIndex) return;
      activeIndex = index;

      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === index;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
      });
    };

    const update = () => {
      raf = 0;
      const headerHeight = header?.offsetHeight || 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, section.offsetHeight - window.innerHeight + headerHeight);
      const current = window.scrollY - sectionTop + headerHeight;
      const progress = Math.min(1, Math.max(0, current / travel));
      const index = Math.min(panels.length - 1, Math.floor(progress * panels.length));
      setActive(index);
    };

    const requestUpdate = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  });


  // Landscape tablet: real feed scroll, geometry-based selection, correction and confetti.
  document.querySelectorAll("[data-feedback-demo]").forEach((demo) => {
    const find = (selector) => demo.querySelector(selector);
    const device = find("[data-feedback-device]");
    const viewport = find("[data-feedback-viewport]");
    const feed = find("[data-feedback-feed]");
    const tabs = find("[data-feedback-tabs]");
    const target = find("[data-feedback-target]");
    const mark = find("[data-demo-selection]");
    const selected = mark.querySelector("[data-i18n]");
    const overlay = find("[data-feedback-selection-overlay]");
    const cursor = find("[data-feedback-cursor]");
    const correct = find("[data-feedback-correct]");
    const sheet = find("[data-feedback-sheet]");
    const suggestion = find("[data-feedback-suggestion]");
    const explanation = find("[data-feedback-explanation]");
    const submit = find("[data-feedback-submit]");
    const published = find("[data-feedback-published]");
    const commentCount = find("[data-feedback-comment-count]");
    const confetti = find("[data-feedback-confetti]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phases = ["idle","scrolling","selecting","selected","action","click","modal","typing","submit","send","celebrate","published"];
    const modalPhases = ["modal","typing","submit","send"];
    let runId = 0, visible = false, resizeTimer;
    let cursorPoint = { x: 0, y: 0 };
    const dict = () => translations[root.lang === "ko" ? "ko" : "es"];
    const wait = (ms, id) => new Promise(resolve => setTimeout(() => resolve(id === runId), ms));
    const setPhase = (phase) => {
      phases.forEach(name => demo.classList.remove("is-phase-" + name));
      demo.classList.add("is-phase-" + phase);
      sheet.setAttribute("aria-hidden", String(!modalPhases.includes(phase)));
      published.setAttribute("aria-hidden", String(phase !== "published"));
    };
    const animate = (ms, id, frame) => new Promise(resolve => {
      let start;
      const step = time => {
        if (id !== runId) return resolve(false);
        if (start === undefined) start = time;
        const p = Math.min(1, (time - start) / Math.max(1, ms));
        frame(p, p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
        if (p < 1) requestAnimationFrame(step);
        else resolve(true);
      };
      requestAnimationFrame(step);
    });
    const point = (x, y) => {
      const rect = device.getBoundingClientRect();
      // Account for the border and any ancestor transform during scroll reveal.
      const sx = rect.width / device.offsetWidth || 1;
      const sy = rect.height / device.offsetHeight || 1;
      return { x: (x - rect.left) / sx - device.clientLeft, y: (y - rect.top) / sy - device.clientTop };
    };
    const setCursor = (p) => {
      cursorPoint = p;
      cursor.style.left = p.x + "px";
      cursor.style.top = p.y + "px";
    };
    const moveCursor = (p, ms, id) => {
      const from = { ...cursorPoint };
      return animate(ms, id, (_, ease) => setCursor({
        x: from.x + (p.x - from.x) * ease,
        y: from.y + (p.y - from.y) * ease
      }));
    };
    const buttonPoint = (button) => {
      const r = button.getBoundingClientRect();
      return point(r.left + r.width * .55, r.top + r.height * .52);
    };
    const scrollTo = (top, ms, id) => {
      const from = feed.scrollTop;
      const end = Math.max(0, Math.min(top, feed.scrollHeight - feed.clientHeight));
      return animate(ms, id, (_, ease) => { feed.scrollTop = from + (end - from) * ease; });
    };
    const targetScroll = () => feed.scrollTop + target.getBoundingClientRect().top - feed.getBoundingClientRect().top - tabs.offsetHeight - 4;
    const rangeRects = (count) => {
      const node = selected.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE || !node.length) return [];
      const range = document.createRange();
      range.setStart(node, 0);
      range.setEnd(node, Math.min(node.length, Math.max(1, count)));
      return [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
    };
    const drawSelection = (count, handles = false) => {
      const rects = rangeRects(count);
      const base = viewport.getBoundingClientRect();
      const sx = base.width / viewport.offsetWidth || 1;
      const sy = base.height / viewport.offsetHeight || 1;
      const clip = feed.getBoundingClientRect();
      const stickyBottom = tabs.getBoundingClientRect().bottom;
      overlay.replaceChildren();
      for (const r of rects) {
        const top = Math.max(r.top, clip.top, stickyBottom);
        const bottom = Math.min(r.bottom, clip.bottom);
        if (bottom <= top) continue;
        const piece = document.createElement("span");
        Object.assign(piece.style, { left: (r.left-base.left)/sx+"px", top: (top-base.top)/sy+"px", width: r.width/sx+"px", height: (bottom-top)/sy+"px" });
        overlay.append(piece);
      }
      if (!rects.length) return null;
      const first = rects[0], last = rects[rects.length-1];
      if (handles) for (const [x,y] of [[first.left,first.top],[last.right,last.bottom]]) {
        if (y < stickyBottom || y > clip.bottom) continue;
        const handle = document.createElement("span");
        handle.className = "is-handle";
        handle.style.left = (x-base.left)/sx+"px";
        handle.style.top = (y-base.top)/sy+"px";
        overlay.append(handle);
      }
      return point(last.right, last.top + last.height * .72);
    };
    const showInSheet = (field) => {
      const box = sheet.getBoundingClientRect(), r = field.getBoundingClientRect();
      if (r.bottom > box.bottom - 8) sheet.scrollTop += r.bottom - box.bottom + 8;
      else if (r.top < box.top + 8) sheet.scrollTop -= box.top + 8 - r.top;
    };
    const typeInto = async (field, value, id, speed) => {
      showInSheet(field);
      field.value = "";
      const chunk = Math.max(1, Math.ceil(value.length / 44));
      for (let n = chunk; n <= value.length + chunk; n += chunk) {
        if (id !== runId) return false;
        field.value = value.slice(0, Math.min(n, value.length));
        if (!await wait(speed,id)) return false;
      }
      return true;
    };
    const burst = () => {
      confetti.replaceChildren();
      const colors = ["#F4C44D","#59BFA9","#7A9DD8","#E98F8F","#A7A0D4","#E9A35A"];
      const w = device.clientWidth, h = device.clientHeight;
      for (let i = 0; i < 42; i++) {
        const piece = document.createElement("i");
        const a = i * Math.PI * 2 / 42 + Math.random() * .18;
        const radius = .16 + Math.random() * .24;
        const dx = Math.cos(a) * w * radius;
        const dy = Math.sin(a) * h * radius;
        const props = { "--dx": dx+"px", "--dy": dy+"px", "--fall": (h*.54+Math.random()*h*.15)+"px", "--spin": ((Math.random()-.5)*740)+"deg", "--size": (5+Math.random()*5)+"px", "--delay": (Math.random()*80)+"ms", "--color": colors[i%colors.length] };
        Object.entries(props).forEach(([k,v]) => piece.style.setProperty(k,v));
        confetti.append(piece);
      }
    };
    const reset = () => {
      setPhase("idle");
      feed.scrollTop = 0; sheet.scrollTop = 0;
      cursor.classList.remove("is-visible","is-clicking");
      mark.classList.remove("is-marked");
      overlay.replaceChildren(); confetti.replaceChildren();
      suggestion.value = ""; explanation.value = ""; commentCount.textContent = "3";
    };
    const revealPublished = () => {
      mark.classList.add("is-marked");
      commentCount.textContent = "4";
      setPhase("published");
    };
    const showFinal = () => {
      reset();
      suggestion.value = dict().feedbackCorrectionSuggestionValue;
      explanation.value = dict().feedbackCorrectionExplanationValue;
      revealPublished();
      feed.scrollTop = targetScroll();
      const extra = published.getBoundingClientRect().bottom - feed.getBoundingClientRect().bottom + 6;
      if (extra > 0) feed.scrollTop += extra;
    };
    const run = async () => {
      const id = ++runId;
      reset();
      if (reducedMotion.matches) { showFinal(); return; }
      if (!await wait(900,id)) return;

      // Scroll the actual feed until the second diary reaches the sticky tabs.
      setPhase("scrolling");
      if (!await scrollTo(targetScroll(),1100,id)) return;
      if (!await wait(320,id)) return;
      // In a compact tablet, bring the selected phrase above the bottom edge.
      const firstRect = rangeRects(1)[0];
      if (!firstRect) return;
      const lastRect = rangeRects(selected.textContent.length).at(-1);
      const extra = lastRect.bottom - feed.getBoundingClientRect().bottom + 12;
      if (extra > 0 && !await scrollTo(feed.scrollTop+extra,280,id)) return;
      const first = rangeRects(1)[0];
      const initial = point(first.left, first.top + first.height * .72);
      setCursor({x:Math.min(device.clientWidth-28,initial.x+44),y:Math.min(device.clientHeight-30,initial.y+25)});
      cursor.classList.add("is-visible");
      if (!await moveCursor(initial,580,id)) return;
      if (!await wait(180,id)) return;

      // Every animation frame measures the real selected text range, including line wraps.
      setPhase("selecting");
      const total = selected.textContent.length;
      if (!await animate(1000,id,(_,ease) => {
        const count = Math.max(1,Math.round(total*ease));
        const p = drawSelection(count);
        if (p) setCursor(p);
      })) return;
      const last = drawSelection(total,true);
      if (last) setCursor(last);
      setPhase("selected");
      if (!await wait(430,id)) return;

      // The button already exists in the post's action row.
      setPhase("action");
      const buttonExtra = correct.getBoundingClientRect().bottom - feed.getBoundingClientRect().bottom + 8;
      if (buttonExtra > 0) {
        overlay.replaceChildren(); mark.classList.add("is-marked");
        if (!await scrollTo(feed.scrollTop+buttonExtra,240,id)) return;
      }
      if (!await moveCursor(buttonPoint(correct),620,id)) return;
      cursor.classList.add("is-clicking");
      setPhase("click");
      if (!await wait(420,id)) return;
      cursor.classList.remove("is-visible","is-clicking");
      overlay.replaceChildren(); mark.classList.add("is-marked");

      setPhase("modal");
      if (!await wait(370,id)) return;
      setPhase("typing");
      if (!await typeInto(suggestion,dict().feedbackCorrectionSuggestionValue,id,30)) return;
      if (!await wait(200,id)) return;
      if (!await typeInto(explanation,dict().feedbackCorrectionExplanationValue,id,20)) return;
      if (!await wait(380,id)) return;

      showInSheet(submit);
      setPhase("submit");
      if (!await wait(120,id)) return;
      const end = buttonPoint(submit);
      setCursor({x:Math.min(device.clientWidth-28,end.x+40),y:Math.max(8,end.y-30)});
      cursor.classList.add("is-visible");
      if (!await moveCursor(end,540,id)) return;
      cursor.classList.add("is-clicking");
      setPhase("send");
      if (!await wait(420,id)) return;
      cursor.classList.remove("is-visible","is-clicking");

      // Close the modal, celebrate from the tablet centre, then insert the correction below @mari.
      setPhase("celebrate");
      if (!await wait(260,id)) return;
      burst();
      if (!await wait(1250,id)) return;
      confetti.replaceChildren();
      revealPublished();
      if (!await wait(380,id)) return;
      const commentExtra = published.getBoundingClientRect().bottom - feed.getBoundingClientRect().bottom + 8;
      if (commentExtra > 0 && !await scrollTo(feed.scrollTop+commentExtra,450,id)) return;
      if (!await wait(2900,id)) return;
      if (visible && id === runId) run();
    };
    const stop = () => { runId++; cursor.classList.remove("is-visible","is-clicking"); confetti.replaceChildren(); };
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.target !== demo) continue;
          const next = entry.isIntersecting && entry.intersectionRatio >= .30;
          if (next === visible) continue;
          visible = next;
          if (visible) run(); else stop();
        }
      }, { threshold: [.0,.30] });
      observer.observe(demo);
    } else { visible = true; run(); }
    document.addEventListener("diarito:languagechange", () => { if (visible) run(); else { stop(); reset(); } });
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (visible) run(); }, 150);
    });
    reducedMotion.addEventListener?.("change", () => { if (visible) run(); });
  });

})();