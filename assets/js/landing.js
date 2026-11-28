(() => {
  const root = document.documentElement;
  const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const writePreference = (key,value) => { try { localStorage.setItem(key,value); } catch { /* Public pages remain usable without stored preferences. */ } };
  root.classList.add("has-js");

  const translations = {
    "es": {
      "timeHours": "h",
      "timeMinutes": "min",
      "diffExplanation": "Por qué",
      "diffOrder": "Cambio de orden",
      "diffAdded": "Agregado",
      "diffRemoved": "Eliminado",
      "threadCollapse": "Ocultar conversación",
      "threadExpand": "Ver conversación",
      "threadEmpty": "Todavía no hay respuestas en este ejemplo.",
      "threadFilterLabel": "Filtrar respuestas",
      "threadComment": "Comentario",
      "threadCorrection": "Corrección",
      "threadCorrections": "Correcciones",
      "threadComments": "Comentarios",
      "threadAll": "Todos",
      "learningSpanish": "Aprende español",
      "learningKorean": "Aprende coreano",
      "countryMexico": "México",
      "countryHonduras": "Honduras",
      "countryKorea": "Corea del Sur",
      "countryColombia": "Colombia",
      "navHome": "Inicio",
      "navLeaderboard": "Leaderboard",
      "navRecent": "Últimos diarios",
      "communityExplore": "Explorá los diarios de la comunidad",
      "testimonialsKicker": "Voces de la comunidad · testimonios ficticios",
      "testimonialsTitle": "Lo que queremos construir juntos.",
      "testimonialsBody": "Cada persona tiene sus propios motivos para aprender un idioma y conectar con otros.",
      "testimonial1Title": "Aprender con mi propia vida",
      "testimonial1Body": "Me gustaría practicar con las cosas que me pasan todos los días, no con frases que nunca voy a usar.",
      "testimonial2Title": "Entender, no solo corregir",
      "testimonial2Body": "Quiero que alguien me explique por qué una expresión suena más natural y en qué situación usarla.",
      "testimonial3Title": "Aprender sin miedo",
      "testimonial3Body": "Quiero poder equivocarme sin sentir que tengo que hablar perfecto desde el principio.",
      "testimonial4Title": "Compartir lo que sé",
      "testimonial4Body": "Me gustaría ayudar a alguien con mi idioma mientras descubro su cultura y aprendo el suyo.",
      "feedMetaTitle": "Últimos diarios · Diarito",
      "feedMetaDescription": "Explorá diarios de ejemplo en español y coreano y descubrí cómo funciona el intercambio de idiomas en Diarito.",
      "feedKicker": "Historias de todos los días",
      "feedTitle": "Últimos diarios",
      "feedIntro": "Un café, una conversación, un pequeño logro. Descubrí cómo otras personas cuentan su día en el idioma que están aprendiendo.",
      "feedDemoNotice": "Diarios, perfiles y cifras ilustrativos.",
      "feedFilterLabel": "Filtrar diarios por idioma",
      "feedAll": "Todos",
      "feedSpanish": "Español",
      "feedKorean": "Coreano",
      "feedCountOne": "diario",
      "feedCountMany": "diarios",
      "feedPublic": "Público",
      "feedLike": "Me gusta",
      "feedComment": "Comentarios",
      "feedSave": "Guardar",
      "feedCorrect": "Corregir",
      "feedActionHint": "Unite a la comunidad para interactuar",
      "feedJoinKicker": "Tu historia también tiene un lugar",
      "feedJoinTitle": "Conocé el mundo de otras personas. Compartí el tuyo.",
      "feedJoinBody": "Unite a la comunidad para compartir tus diarios, aprender de personas que hablan el idioma que querés aprender y ayudar a otros con el tuyo.",
      "feedJoinButton": "Unite a Diarito por $7",
      "feedBack": "Volver al inicio",
      "ariaLanguage": "Cambiar idioma",
      "ariaTheme": "Cambiar tema",
      "ariaMenu": "Abrir navegación",
      "ariaMainNav": "Navegación principal",
      "ariaMobileNav": "Navegación móvil",
      "ariaCloseAnnouncement": "Cerrar anuncio",
      "ariaHome": "Inicio de Diarito",
      "navCommunity": "Comunidad",
      "navMembership": "Membresía",
      "announcementLink": "Conocé el enfoque",
      "communityKicker": "Una comunidad que aprende junta",
      "communityTitle": "Aprendé de otros. Ayudá a otros a aprender.",
      "communityBody": "Tu idioma también es el que alguien más está aprendiendo. En Diarito, compartí lo que sabés, descubrí otras formas de ver el mundo y aprendé junto a personas que también tienen algo que contar.",
      "communityShareTitle": "Compartí tu idioma",
      "communityShareBody": "Ayudá a alguien a encontrar una expresión más natural y explicale por qué funciona en ese contexto.",
      "communityDiscoverTitle": "Descubrí otros mundos",
      "communityDiscoverBody": "Conocé otras experiencias y culturas a través de los diarios de la comunidad.",
      "communityGrowTitle": "Crecé junto a otros",
      "communityGrowBody": "Aprender y aportar son dos partes de la misma experiencia.",
      "mistakesKicker": "No necesitás hablar perfecto",
      "mistakesTitle": "Equivocarte también es aprender.",
      "mistakesBody": "No tenés que esperar a dominar un idioma para empezar a usarlo. Escribí a tu ritmo, recibí retroalimentación con respeto y volvé a intentarlo con más confianza.",
      "mistakesChoiceTitle": "Vos decidís qué compartís.",
      "mistakesChoiceBody": "Tu diario es tuyo. Elegí qué historias querés compartir con la comunidad y cuáles preferís guardar para vos.",
      "mistakesRespectTitle": "El error es parte del proceso.",
      "mistakesRespectBody": "Acá, una corrección es una oportunidad para aprender, no un motivo para juzgar a alguien.",
      "membershipKicker": "Formá parte de Diarito",
      "membershipTitle": "Una comunidad. Una membresía.",
      "membershipBody": "Aprendé desde tu vida, conectá con otras personas y convertí la retroalimentación en expresiones que podés usar en el mundo real.",
      "membershipPlan": "Membresía Diarito",
      "membershipPriceLabel": "Precio de membresía",
      "membershipLanguages": "Coreano ↔ Español",
      "membershipLevel": "Nivel inicial de la beta: A2",
      "membershipJoin": "Unite por $7",
      "membershipPreview": "Podés probar el registro de la demo. Los pagos aún no están habilitados.",
      "membershipPendingTitle": "Podés recorrer la demo de Diarito.",
      "membershipPendingBody": "Creá una cuenta local para explorar Diarito. Los pagos de la membresía aún no están habilitados.",
      "membershipIncludes": "¿Qué incluye tu membresía?",
      "benefitDiaryTitle": "Tu diario personal",
      "benefitDiaryBody": "Escribí sobre tu día, tus experiencias y emociones.",
      "benefitCommunityTitle": "Comunidad e intercambio",
      "benefitCommunityBody": "Leé diarios, compartí los tuyos y conectá con otros miembros.",
      "benefitReceiveTitle": "Retroalimentación humana",
      "benefitReceiveBody": "Recibí correcciones y explicaciones sobre contexto y naturalidad.",
      "benefitGiveTitle": "Ayudá a otros a aprender",
      "benefitGiveBody": "Corregí diarios y compartí lo que sabés de tu idioma.",
      "benefitSaveTitle": "Expresiones guardadas",
      "benefitSaveBody": "Conservá las expresiones útiles para volver a consultarlas.",
      "benefitPracticeTitle": "Práctica y reescritura",
      "benefitPracticeBody": "Usá las correcciones para producir nuevas oraciones con tus propias palabras.",
      "benefitProgressTitle": "Seguimiento de tu aprendizaje",
      "benefitProgressBody": "Revisá tu actividad y el progreso de tus ciclos de escritura, retroalimentación y práctica.",
      "benefitPrivacyTitle": "Control de lo que compartís",
      "benefitPrivacyBody": "Elegí qué entradas mantenés privadas y cuáles publicás.",
      "ctaKicker": "Todo empieza con tu historia",
      "ctaTitle": "Compartí tu mundo. Conectá con el de otros.",
      "ctaBody": "Escribí tu primer diario en el idioma que estás aprendiendo y descubrí todo lo que podés aprender y compartir con otras personas.",
      "ctaPrimary": "Unite a Diarito por $7",
      "ctaSecondary": "Ver cómo funciona Diarito",
      "announcementEyebrow": "Diarito · versión beta",
      "announcement": "Aprendé y conectá con Diarito por $7.",
      "navWhy": "Por qué Diarito",
      "navHow": "Cómo funciona",
      "navFeedback": "Retroalimentación humana",
      "login": "Iniciar sesión",
      "heroBadge": "Tu vida primero",
      "heroTitleStart": "Tu vida ya tiene historias.",
      "heroTitleEnd": "Empezá a contarlas en otro idioma.",
      "heroLead": "El estudio de un idioma empieza por hablar, en el idioma que estás aprendiendo, de lo que tenés enfrente, de lo que pasó hoy y de lo que querés hacer mañana. El material de estudio no está solo en libros o listas de palabras: está a tu alrededor.",
      "heroTagline": "Tu mundo, expresado. Nuestros mundos, conectados.",
      "heroPrimary": "Ver cómo funciona Diarito",
      "heroSecondary": "Por qué empezar desde tu vida",
      "whyKicker": "Por qué existe Diarito",
      "whyTitle": "Aprender un idioma no es saber más palabras.",
      "whyBody": "Es poder expresar lo que es importante para vos. El aprendizaje empieza en tu propia vida: lo que te pasó hoy, lo que sentís ahora y aquello que realmente querés decir.",
      "principle1Label": "01 · Relevancia",
      "principle1Title": "Empezá desde tu vida.",
      "principle1Body": "Aprendé a partir de lo que viviste hoy, lo que querés decir mañana y lo que sentís en este momento.",
      "principle2Label": "02 · Conexión humana",
      "principle2Title": "El lenguaje es humano.",
      "principle2Body": "No se trata solo de una oración gramaticalmente correcta, sino de una expresión natural para la situación, la relación, la emoción y la cultura.",
      "principle3Label": "03 · Apropiación activa",
      "principle3Title": "Hacé tuya la retroalimentación.",
      "principle3Body": "No alcanza con recibir una corrección. Entendela, repetí la expresión y volvé a usarla hasta que forme parte de tu propio lenguaje.",
      "loopKicker": "El ciclo de aprendizaje",
      "loopTitle": "Escribí. Intercambiá. Entendé. Hacelo tuyo.",
      "loopIntro": "Diarito no termina cuando alguien corrige una oración. Lo aprendido debe volver al uso real para convertirse en algo propio.",
      "loop1Title": "Escribí",
      "loop1Body": "Sofía quiso pedir comida en un restaurante coreano, pero no logró hacerse entender. En Diarito escribió en coreano lo que pasó y cómo se sintió.",
      "loop2Title": "Intercambiá",
      "loop2Body": "Varias personas coreanas leyeron el diario de Sofía y le ofrecieron expresiones y consejos para comunicarse de forma más natural.",
      "loop3Title": "Entendé",
      "loop3Body": "Sofía revisó las correcciones y anotó las expresiones que aprendió, comprendiendo su significado y cuándo utilizarlas.",
      "loop4Title": "Hacelo tuyo",
      "loop4Body": "Sofía guardó las expresiones, practicó con sus propias oraciones y volvió al restaurante. Esta vez pudo hacer su pedido en coreano.",
      "feedbackKicker": "Retroalimentación humana en el centro",
      "feedbackTitle": "No solo correcto. Natural para la situación.",
      "feedbackTitleLine1": "No solo correcto.",
      "feedbackTitleLine2": "Natural para la situación.",
      "feedbackBody": "El significado y la naturalidad cambian según la emoción, la relación, la situación y la cultura. Por eso Diarito considera el intercambio entre personas una parte central del aprendizaje.",
      "correctionHeader": "Corrección sobre un fragmento seleccionado",
      "correctionOriginal": "Original",
      "correctionSuggestion": "Sugerencia",
      "correctionExplain": "Ambas expresiones se entienden, pero “al final sí fui” es una forma más natural de expresar que fuiste a pesar de la duda o la indecisión anterior.",
      "feedbackDemoLanguage": "Español",
      "feedbackDemoSentence": "Hoy pensé que no iba a salir, pero al final yo fui de todos modos.",
      "feedbackDemoWhy": "Por qué suena más natural",
      "feedbackFeedTitle": "Comunidad",
      "feedbackFeedHint": "Diarios para intercambiar",
      "feedbackTabForYou": "Para vos",
      "feedbackTabFollowing": "Siguiendo",
      "feedbackTabPractice": "Práctica",
      "feedbackComposerPrompt": "¿Qué estás pensando hoy?",
      "feedbackComposerPost": "Publicar",
      "feedbackFirstMeta": "Español · A2 · hace 3 min",
      "feedbackFirstPost": "Esta mañana pedí un café en español. Me puse nervioso, pero entendí la pregunta y pude responder sin usar el traductor.",
      "feedbackThirdMeta": "Español · A2 · hace 24 min",
      "feedbackThirdPost": "Hoy anoté tres expresiones que escuché en una conversación. Quiero usarlas mañana cuando hable con mi amiga.",
      "feedbackFourthMeta": "Español · A2 · hace 41 min",
      "feedbackFourthPost": "Esta tarde caminé por el parque. Intenté describir lo que veía en español y aprendí palabras nuevas.",
      "feedbackPostMeta": "Español · A2 · hace 8 min",
      "feedbackPostBefore": "Hoy presenté una idea en una reunión. Estaba nerviosa, pero intenté explicar todo con calma. Al final, mi jefa me dijo que ",
      "feedbackPostSelected": "mi presentación fue muy comprensible",
      "feedbackPostAfter": ".",
      "feedbackCorrectAction": "Corregir",
      "feedbackCorrectionKicker": "Retroalimentación",
      "feedbackCorrectionTitle": "Corrección humana",
      "feedbackSelectedLabel": "Texto seleccionado",
      "feedbackSuggestionLabel": "Texto sugerido",
      "feedbackExplanationLabel": "Explicación",
      "feedbackCorrectionSuggestionValue": "mi presentación fue muy clara",
      "feedbackCorrectionExplanationValue": "Al hablar de una presentación, «clara» suena más natural que «comprensible» porque describe que la información se entendió con facilidad.",
      "feedbackSubmit": "Enviar retroalimentación",
      "feedbackPublishedTitle": "Corrección de Yuna",
      "feedbackPublishedPrefix": "Sugirió:",
      "feedbackPublishedStatus": "Retroalimentación enviada",
      "footerCopy": "Diarito · Aprende el idioma de tu vida.",
      "footerBrandBody": "Un espacio para aprender el idioma que necesitás para expresar tu propia vida y conectar con la de otras personas.",
      "footerBeta": "Coreano ↔ Español · versión beta · A2",
      "footerDiarito": "Diarito",
      "footerLearn": "Aprender",
      "footerInfo": "Información",
      "footerPrivacy": "Privacidad",
      "footerTerms": "Términos y condiciones",
      "footerContact": "Contacto",
      "footerSocial": "Diarito en la web",
      "footerEmail": "Correo electrónico",
      "footerCopyright": "© 2026 Diarito. Todos los derechos reservados.",
      "footerDeveloped": "Diseñado y desarrollado por el equipo de Diarito.",
      "uiComponents": "Componentes de interfaz",
      "navBlog": "Blog",
      "navSignup": "Registrate",
      "membershipDetails": "Conocé la membresía",
      "membershipMetaTitle": "Membresía · Diarito",
      "membershipMetaDescription": "Conocé las funciones de la membresía de Diarito, desde tu diario personal hasta la práctica de nuevas expresiones.",
      "planKicker": "Aprendé, compartí y crecé",
      "planTitle": "Tu aprendizaje, en un solo lugar.",
      "planIntro": "Una membresía para convertir tus experiencias cotidianas en práctica real, recibir ayuda de otras personas y hacer tuyo lo que aprendés.",
      "planSeeFunctions": "Explorá las funciones",
      "planFeaturesKicker": "Lo que podés hacer en Diarito",
      "planFeaturesTitle": "De tu primera oración a tu próxima conversación.",
      "planFeaturesIntro": "Conocé las ocho funciones previstas para la membresía de la beta y cómo se conectan con tu aprendizaje.",
      "planExample": "Así se usa",
      "planDiaryBody": "Escribí lo que te pasó hoy, cómo te sentiste o qué querés contar mañana. Empezá con unas pocas oraciones y construí un hábito de escritura a partir de tu propia vida.",
      "planDiaryExample": "Hoy no pude pedir mi comida en coreano. Mañana quiero volver a intentarlo.",
      "planCommunityBody": "Leé las experiencias de quienes aprenden tu idioma y compartí las tuyas. Descubrí expresiones y situaciones cotidianas que no siempre aparecen en un libro.",
      "planCommunityExample": "Una persona en Corea escribe en español sobre su viaje. Vos leés su experiencia y descubrís algo de su cultura.",
      "planReceiveBody": "Recibí sugerencias sobre fragmentos concretos de tus diarios. Identificá qué cambió y entendé por qué una expresión resulta más natural en determinada situación.",
      "planReceiveExample": "Una corrección puede explicar la diferencia entre estar nervioso y tener miedo, no solo señalar un error gramatical.",
      "planGiveBody": "Tu idioma es el que otra persona está aprendiendo. Seleccioná una oración, sugerí una alternativa y explicá su contexto. Los comentarios y las correcciones pueden recibir likes.",
      "planGiveExample": "Una persona escribe «un reunión». Podés mostrarle que corresponde «una reunión» y explicar el motivo.",
      "planSaveBody": "Guardá las expresiones que te resultan útiles para recuperarlas después. Construí una colección personal a partir de tus diarios y las sugerencias que recibís.",
      "planSaveExample": "Guardá «tener ganas de» junto con una oración que puedas usar en tu próxima conversación.",
      "planPracticeBody": "Volvé a las expresiones aprendidas, escribí nuevas oraciones y aplicalas a otras situaciones. La idea es producir el idioma por tu cuenta, no memorizar una respuesta.",
      "planPracticeExample": "Después de aprender a pedir un café, escribí una nueva oración para pedir comida o hacer una consulta.",
      "planProgressBody": "Revisá tu actividad y el avance de tus ciclos de escritura, retroalimentación y práctica. El progreso se relaciona con usar lo aprendido, no solamente con entrar todos los días.",
      "planProgressExample": "Diario escrito → retroalimentación revisada → nueva oración practicada.",
      "planPrivacyBody": "Decidí qué entradas querés mantener para vos y cuáles compartir con la comunidad. Solo los diarios que elijas hacer públicos deberían aparecer en el feed de visitantes.",
      "planPrivacyExample": "Un recuerdo personal puede quedar privado; una experiencia que querés practicar puede compartirse.",
      "planFAQTitle": "Preguntas sobre la membresía",
      "planFAQ1": "¿Qué idiomas y niveles estarán disponibles?",
      "planFAQ1Body": "La beta se enfoca en el intercambio entre coreano y español, con nivel inicial A2.",
      "planFAQ2": "¿Tengo que compartir todos mis diarios?",
      "planFAQ2Body": "No. La propuesta contempla que puedas elegir cuáles entradas mantener privadas y cuáles compartir.",
      "planFAQ3": "¿Qué significa el precio de $7?",
      "planFAQ3Body": "Es el precio de membresía que estamos preparando. La periodicidad, las condiciones definitivas y la inscripción se confirmarán antes de habilitar el pago.",
      "planFAQ4": "¿Puedo explorar antes de unirme?",
      "planFAQ4Body": "Sí. Visitá Últimos diarios para conocer la experiencia de lectura y ver ejemplos de conversaciones y correcciones.",
      "blogMetaTitle": "Blog · Diarito",
      "blogMetaDescription": "Ideas para aprender idiomas desde tu vida, entender expresiones naturales y construir hábitos de escritura.",
      "blogKicker": "Ideas para aprender mejor",
      "blogTitle": "El idioma también se vive.",
      "blogIntro": "Reflexiones y consejos prácticos para convertir tu día a día en oportunidades de aprendizaje y conectar con otras personas.",
      "blogRead": "Leer artículo",
      "blogBack": "Volver a los artículos",
      "blogCategory1": "Aprendizaje cotidiano",
      "blogCategory2": "Retroalimentación humana",
      "blogCategory3": "Práctica de idiomas",
      "blog1Title": "Tu día es tu material de estudio.",
      "blog1Summary": "Tres pequeñas preguntas para empezar un diario sin quedarte mirando una página en blanco.",
      "blog1P1": "Cuando no sabés sobre qué escribir, no hace falta inventar una historia. Pensá en tres preguntas: ¿qué hice hoy?, ¿cómo me sentí?, ¿qué quiero contarle a alguien? Un viaje en autobús, un almuerzo o una conversación pueden darte suficiente material para practicar.",
      "blog1P2": "Empezá con tres oraciones en el idioma que estás aprendiendo. Si te falta una palabra, intentá describirla con las que ya conocés. Después, anotá una expresión que te gustaría aprender a decir de forma más natural. Lo importante es tener algo propio que quieras comunicar.",
      "blog2Title": "Una buena corrección explica el porqué.",
      "blog2Summary": "Aprendé a reconocer la diferencia entre una frase correcta y una que encaja con la situación.",
      "blog2P1": "Una frase puede estar bien escrita y aun así sonar demasiado formal, distante o poco habitual. El contexto importa: no hablamos de la misma manera con un amigo, un compañero de trabajo o una persona que acabamos de conocer.",
      "blog2P2": "Cuando recibás una sugerencia, preguntate qué cambia en el significado, la relación o la situación. Si sos vos quien ayuda, explicá en qué contexto usarías la expresión. Una alternativa no tiene que convertir automáticamente la frase original en un error.",
      "blog3Title": "No guardés expresiones para olvidarlas.",
      "blog3Summary": "Cómo pasar de reconocer una expresión a poder usarla sin depender de la traducción.",
      "blog3P1": "Guardar una expresión es solo el primer paso. Elegí una que hayas recibido en una corrección y escribí una oración nueva relacionada con tu vida. En lugar de repetir el mismo ejemplo, cambiá la persona, el lugar o lo que querés decir.",
      "blog3P2": "Al día siguiente, intentá recordarla sin mirar tus notas. Si aparece una oportunidad de usarla en una conversación o un diario, aprovechala. Así empezás a transformar una expresión que reconocés en una que podés producir.",
      "loginMetaTitle": "Iniciar sesión · Diarito",
      "signupMetaTitle": "Registrate · Diarito",
      "authMetaDescription": "Creá tu cuenta de demostración y practicá español o coreano con tu propio diario.",
      "loginTitle": "Iniciar sesión",
      "loginIntro": "Iniciá sesión para continuar tu aprendizaje y tus conversaciones.",
      "signupTitle": "Crear cuenta",
      "signupIntro": "Creá tu perfil y preparate para aprender junto a otras personas.",
      "authEmail": "Correo electrónico",
      "authPassword": "Contraseña",
      "authUsername": "Nombre de usuario",
      "authLearning": "Idioma que estás aprendiendo",
      "authSelect": "Seleccioná un idioma",
      "authPending": "Demo local: tu cuenta y tus diarios se guardan en este navegador.",
      "authNoAccount": "¿Todavía no tenés cuenta?",
      "authHasAccount": "¿Ya tenés cuenta?",
      "authCreate": "Crear cuenta",
      "faqKicker": "Antes de unirte",
      "faqTitle": "Preguntas frecuentes"
    },
    "ko": {
      "timeHours": "시간",
      "timeMinutes": "분",
      "diffExplanation": "설명",
      "diffOrder": "어순 변경",
      "diffAdded": "추가",
      "diffRemoved": "삭제",
      "threadCollapse": "대화 숨기기",
      "threadExpand": "대화 보기",
      "threadEmpty": "이 예시에는 아직 답글이 없어요.",
      "threadFilterLabel": "답글 유형 필터",
      "threadComment": "댓글",
      "threadCorrection": "교정",
      "threadCorrections": "교정",
      "threadComments": "댓글",
      "threadAll": "전체",
      "learningSpanish": "스페인어 학습 중",
      "learningKorean": "한국어 학습 중",
      "countryMexico": "멕시코",
      "countryHonduras": "온두라스",
      "countryKorea": "대한민국",
      "countryColombia": "콜롬비아",
      "navHome": "홈",
      "navLeaderboard": "활동 순위",
      "navRecent": "최근 일기",
      "communityExplore": "커뮤니티 일기 둘러보기",
      "testimonialsKicker": "커뮤니티의 목소리 · 가상 후기",
      "testimonialsTitle": "함께 만들어 가고 싶은 배움.",
      "testimonialsBody": "언어를 배우고 다른 사람과 연결되고 싶은 이유는 저마다 달라요.",
      "testimonial1Title": "내 삶에서 시작하는 배움",
      "testimonial1Body": "실제로 쓰지 않을 문장보다 매일 경험하는 일들로 연습하고 싶어요.",
      "testimonial2Title": "교정보다 중요한 이해",
      "testimonial2Body": "왜 어떤 표현이 더 자연스러운지, 어떤 상황에서 쓰는지 설명을 듣고 싶어요.",
      "testimonial3Title": "실수를 두려워하지 않는 배움",
      "testimonial3Body": "처음부터 완벽하게 말해야 한다는 부담 없이 실수하며 배우고 싶어요.",
      "testimonial4Title": "내가 아는 것을 나누기",
      "testimonial4Body": "내 언어를 배우는 사람을 돕고, 그 사람의 문화와 언어도 알아가고 싶어요.",
      "feedMetaTitle": "최근 일기 · Diarito",
      "feedMetaDescription": "한국어와 스페인어로 작성된 일기 예시를 둘러보고 Diarito의 언어 교류를 알아보세요.",
      "feedKicker": "일상의 작은 이야기",
      "feedTitle": "최근 일기",
      "feedIntro": "커피 한 잔, 짧은 대화, 작은 성취. 다른 사람들이 배우고 있는 언어로 하루를 어떻게 기록하는지 만나 보세요.",
      "feedDemoNotice": "일기, 프로필 및 수치는 예시입니다.",
      "feedFilterLabel": "일기 언어별 필터",
      "feedAll": "전체",
      "feedSpanish": "스페인어",
      "feedKorean": "한국어",
      "feedCountOne": "개의 일기",
      "feedCountMany": "개의 일기",
      "feedPublic": "공개",
      "feedLike": "좋아요",
      "feedComment": "댓글",
      "feedSave": "저장",
      "feedCorrect": "교정하기",
      "feedActionHint": "커뮤니티에 가입하면 함께 소통할 수 있어요",
      "feedJoinKicker": "당신의 이야기도 함께할 수 있어요",
      "feedJoinTitle": "다른 사람의 세계를 만나고, 나의 세계를 나눠요.",
      "feedJoinBody": "커뮤니티에 가입해 일기를 공유하고, 배우고 싶은 언어를 쓰는 사람들에게 배우며, 내 언어를 배우는 사람도 도와주세요.",
      "feedJoinButton": "$7에 Diarito 함께하기",
      "feedBack": "홈으로 돌아가기",
      "ariaLanguage": "언어 변경",
      "ariaTheme": "테마 변경",
      "ariaMenu": "메뉴 열기",
      "ariaMainNav": "주 메뉴",
      "ariaMobileNav": "모바일 메뉴",
      "ariaCloseAnnouncement": "안내 닫기",
      "ariaHome": "Diarito 홈",
      "navCommunity": "커뮤니티",
      "navMembership": "멤버십",
      "announcementLink": "멤버십 알아보기",
      "communityKicker": "함께 배우는 커뮤니티",
      "communityTitle": "다른 사람에게 배우고, 다른 사람의 배움을 도와요.",
      "communityBody": "누군가에게는 당신의 언어도 배우고 싶은 언어예요. Diarito에서 내가 아는 것을 나누고, 다른 사람들의 삶과 생각을 만나며 함께 배워요.",
      "communityShareTitle": "나의 언어를 나눠요",
      "communityShareBody": "더 자연스러운 표현을 제안하고 왜 그 상황에서 어울리는지 설명해 주세요.",
      "communityDiscoverTitle": "다른 사람의 세계를 만나요",
      "communityDiscoverBody": "커뮤니티의 일기를 통해 다양한 경험과 문화를 알아가요.",
      "communityGrowTitle": "함께 성장해요",
      "communityGrowBody": "배우는 것과 다른 사람의 배움을 돕는 것은 하나의 경험이에요.",
      "mistakesKicker": "완벽하게 말할 필요는 없어요",
      "mistakesTitle": "실수도 배움의 일부예요.",
      "mistakesBody": "언어를 완벽하게 익힐 때까지 기다릴 필요는 없어요. 나만의 속도로 글을 쓰고, 서로 존중하는 피드백을 받으며 조금 더 자신 있게 다시 시도해 보세요.",
      "mistakesChoiceTitle": "무엇을 공유할지는 내가 정해요.",
      "mistakesChoiceBody": "일기는 나의 공간이에요. 커뮤니티에 나누고 싶은 이야기와 나만 간직하고 싶은 이야기를 선택해요.",
      "mistakesRespectTitle": "실수는 자연스러운 과정이에요.",
      "mistakesRespectBody": "교정은 누군가를 평가하는 것이 아니라, 함께 배우는 기회예요.",
      "membershipKicker": "Diarito의 멤버가 되어 보세요",
      "membershipTitle": "하나의 커뮤니티, 하나의 멤버십.",
      "membershipBody": "나의 삶에서 배우고, 다른 사람과 연결되며, 받은 피드백을 실제 생활에서 쓸 수 있는 표현으로 만들어 보세요.",
      "membershipPlan": "Diarito 멤버십",
      "membershipPriceLabel": "멤버십 가격",
      "membershipLanguages": "한국어 ↔ 스페인어",
      "membershipLevel": "베타 시작 수준: A2",
      "membershipJoin": "$7에 함께하기",
      "membershipPreview": "데모 회원가입을 체험할 수 있어요. 결제는 아직 지원하지 않아요.",
      "membershipPendingTitle": "Diarito 데모를 둘러보세요.",
      "membershipPendingBody": "로컬 계정을 만들고 Diarito를 체험해 보세요. 멤버십 결제는 아직 지원하지 않아요.",
      "membershipIncludes": "멤버십에 포함된 기능",
      "benefitDiaryTitle": "나만의 일기",
      "benefitDiaryBody": "하루의 경험과 감정을 기록해요.",
      "benefitCommunityTitle": "커뮤니티와 교류",
      "benefitCommunityBody": "다른 사람의 일기를 읽고 내 일기를 공유하며 교류해요.",
      "benefitReceiveTitle": "사람을 통한 피드백",
      "benefitReceiveBody": "표현의 자연스러움과 상황에 맞는 설명을 받아요.",
      "benefitGiveTitle": "다른 사람의 배움 돕기",
      "benefitGiveBody": "일기를 교정하고 내가 아는 언어를 나눠요.",
      "benefitSaveTitle": "표현 저장",
      "benefitSaveBody": "유용한 표현을 저장하고 필요할 때 다시 확인해요.",
      "benefitPracticeTitle": "연습과 다시 쓰기",
      "benefitPracticeBody": "교정을 바탕으로 나만의 문장을 다시 만들어 봐요.",
      "benefitProgressTitle": "학습 과정 확인",
      "benefitProgressBody": "활동 기록과 글쓰기, 피드백, 연습 과정의 진행 상황을 확인해요.",
      "benefitPrivacyTitle": "공개 범위 선택",
      "benefitPrivacyBody": "나만 간직할 일기와 공개할 일기를 선택해요.",
      "ctaKicker": "모든 것은 나의 이야기에서 시작돼요",
      "ctaTitle": "나의 세계를 나누고, 다른 사람의 세계를 만나 보세요.",
      "ctaBody": "배우고 있는 언어로 첫 일기를 쓰고, 서로에게 배우고 나눌 수 있는 것들을 발견해 보세요.",
      "ctaPrimary": "$7에 Diarito 함께하기",
      "ctaSecondary": "Diarito 학습 과정 보기",
      "announcementEyebrow": "Diarito · 베타 버전",
      "announcement": "$7에 Diarito에서 함께 배우고 교류해요.",
      "navWhy": "왜 Diarito인가",
      "navHow": "어떻게 배우나요",
      "navFeedback": "사람을 통한 피드백",
      "login": "로그인",
      "heroBadge": "내 삶에서 시작하기",
      "heroTitleStart": "당신의 삶에는 이미 이야기가 있어요.",
      "heroTitleEnd": "이제 다른 언어로 들려주세요.",
      "heroLead": "당장 내 앞에 있는 것들, 오늘 일어난 일들, 내일 할 일들을 지금 배우고 있는 언어로 말하는 것에서 언어 공부는 시작된다. 공부 자료는 책, 교과서, 단어장에 있는 것이 아니라 내 주변에 있다.",
      "heroTagline": "나의 세계를 표현하고, 우리의 세계를 연결합니다.",
      "heroPrimary": "Diarito가 어떻게 작동하는지 보기",
      "heroSecondary": "왜 내 삶에서 시작하나요",
      "whyKicker": "Diarito가 존재하는 이유",
      "whyTitle": "언어는 단어를 많이 아는 것이 아니다.",
      "whyBody": "언어는 단어를 많이 아는 것이 아니라, 나에게 중요한 것을 표현할 수 있게 되는 것이다. 배움은 오늘 겪은 일, 지금의 감정, 실제로 표현하고 싶은 것처럼 자신의 삶에서 시작한다.",
      "principle1Label": "01 · 나와 관련 있는 언어",
      "principle1Title": "내 삶에서 시작한다.",
      "principle1Body": "오늘 겪은 일, 내일 하고 싶은 말, 지금 느끼는 감정처럼 실제로 표현하고 싶은 것에서 배움을 시작한다.",
      "principle2Label": "02 · 사람을 통한 이해",
      "principle2Title": "언어는 사람을 통해 이해한다.",
      "principle2Body": "단순히 문법적으로 맞는 문장이 아니라, 상황과 감정, 관계와 문화에 어울리는 자연스러운 표현을 배운다.",
      "principle3Label": "03 · 내 것으로 만드는 학습",
      "principle3Title": "배운 표현을 내 것으로 만든다.",
      "principle3Body": "피드백을 받는 데서 끝나지 않고, 왜 고쳤는지 이해하고 배운 표현을 반복해서 사용하며 결국 스스로 표현할 수 있게 된다.",
      "loopKicker": "학습 루프",
      "loopTitle": "쓰고. 교환하고. 이해하고. 내 것으로 만든다.",
      "loopIntro": "한 번 교정받고 끝나는 플랫폼이 아니라, 배운 표현이 실제 사용으로 이어지는 구조를 만든다.",
      "loop1Title": "쓰기",
      "loop1Body": "민준은 멕시코 식당에서 타코를 주문하려 했지만 말이 잘 통하지 않았어요. 그날의 경험과 감정을 Diarito에 스페인어로 기록했어요.",
      "loop2Title": "교환하기",
      "loop2Body": "여러 중남미 사람들이 민준의 일기를 읽고 더 자연스럽게 말할 수 있는 표현과 조언을 전해 줬어요.",
      "loop3Title": "이해하기",
      "loop3Body": "민준은 받은 피드백을 살펴보고 새로운 표현을 노트에 정리하며 그 의미와 어떤 상황에서 자연스럽게 쓸 수 있는지 이해했어요.",
      "loop4Title": "내 것으로 만들기",
      "loop4Body": "민준은 배운 표현을 저장하고 직접 문장을 만들어 연습한 뒤, 다시 타코를 주문했어요. 이번에는 스페인어로 주문하는 데 성공했어요.",
      "feedbackKicker": "사람을 통한 피드백을 핵심 경험으로",
      "feedbackTitle": "정답만이 아니라, 상황에 자연스러운 표현.",
      "feedbackTitleLine1": "정답만이 아니라,",
      "feedbackTitleLine2": "상황에 자연스러운 표현.",
      "feedbackBody": "언어에는 문법 이상의 것이 있다. 말하는 사람의 감정, 관계, 상황, 문화에 따라 표현의 의미와 자연스러움이 달라진다. 우리는 실제 사람과의 교류를 언어 학습의 핵심으로 여긴다.",
      "correctionHeader": "선택한 문장에 대한 교정",
      "correctionOriginal": "원문",
      "correctionSuggestion": "수정 제안",
      "correctionExplain": "문법적 정확성뿐 아니라 자연스러움, 뉘앙스, 상황에 따른 표현을 이해할 수 있도록 설명합니다.",
      "feedbackDemoLanguage": "스페인어",
      "feedbackDemoSentence": "Hoy pensé que no iba a salir, pero al final yo fui de todos modos.",
      "feedbackDemoWhy": "왜 더 자연스러운가",
      "feedbackFeedTitle": "커뮤니티",
      "feedbackFeedHint": "교환할 수 있는 일기",
      "feedbackTabForYou": "추천",
      "feedbackTabFollowing": "팔로잉",
      "feedbackTabPractice": "연습",
      "feedbackComposerPrompt": "오늘은 어떤 생각을 했나요?",
      "feedbackComposerPost": "게시하기",
      "feedbackFirstMeta": "한국어 · A2 · 3분 전",
      "feedbackFirstPost": "오늘 아침에 한국어로 커피를 주문했어요. 긴장했지만 질문을 이해하고 번역기 없이 대답했어요.",
      "feedbackThirdMeta": "한국어 · A2 · 24분 전",
      "feedbackThirdPost": "오늘 대화에서 들은 표현 세 개를 적었어요. 내일 친구와 이야기할 때 써 보고 싶어요.",
      "feedbackFourthMeta": "한국어 · A2 · 41분 전",
      "feedbackFourthPost": "오늘 오후에 공원을 산책했어요. 보이는 것을 한국어로 설명해 보면서 새로운 단어를 배웠어요.",
      "feedbackPostMeta": "한국어 · A2 · 8분 전",
      "feedbackPostBefore": "오늘 회의에서 아이디어를 발표했어요. 많이 긴장했지만 차분하게 설명하려고 했어요. 마지막에 팀장님이 ",
      "feedbackPostSelected": "제 발표가 아주 이해 가능했다고",
      "feedbackPostAfter": " 말했어요.",
      "feedbackCorrectAction": "교정하기",
      "feedbackCorrectionKicker": "사람을 통한 피드백",
      "feedbackCorrectionTitle": "사람의 교정",
      "feedbackSelectedLabel": "선택한 문장",
      "feedbackSuggestionLabel": "수정 문장",
      "feedbackExplanationLabel": "설명",
      "feedbackCorrectionSuggestionValue": "제 발표가 이해하기 쉬웠다고",
      "feedbackCorrectionExplanationValue": "발표가 쉽게 이해됐다는 뜻을 말할 때는 «이해 가능하다»보다 «이해하기 쉽다»가 더 자연스러워요.",
      "feedbackSubmit": "피드백 보내기",
      "feedbackPublishedTitle": "Yuna의 교정",
      "feedbackPublishedPrefix": "수정 제안:",
      "feedbackPublishedStatus": "피드백을 보냈어요",
      "footerCopy": "Diarito · 내 삶의 언어를 배우세요.",
      "footerBrandBody": "내 삶을 표현하는 데 필요한 언어를 배우고, 다른 사람의 삶과 연결되는 공간입니다.",
      "footerBeta": "한국어 ↔ 스페인어 · A2 · 베타 버전",
      "footerDiarito": "Diarito",
      "footerLearn": "배우기",
      "footerInfo": "정보",
      "footerPrivacy": "개인정보 보호",
      "footerTerms": "이용약관",
      "footerContact": "문의",
      "footerSocial": "웹에서 만나는 Diarito",
      "footerEmail": "이메일",
      "footerCopyright": "© 2026 Diarito. 모든 권리 보유.",
      "footerDeveloped": "Diarito 팀이 디자인하고 개발했습니다.",
      "uiComponents": "인터페이스 구성요소",
      "navBlog": "블로그",
      "navSignup": "회원가입",
      "membershipDetails": "멤버십 자세히 보기",
      "membershipMetaTitle": "멤버십 · Diarito",
      "membershipMetaDescription": "나만의 일기부터 새로운 표현 연습까지 Diarito 멤버십 기능을 알아보세요.",
      "planKicker": "배우고, 나누고, 함께 성장해요",
      "planTitle": "나의 언어 학습을 한곳에서.",
      "planIntro": "일상의 경험을 언어 연습으로 바꾸고, 다른 사람의 도움을 받아 배운 표현을 내 것으로 만드는 멤버십이에요.",
      "planSeeFunctions": "기능 둘러보기",
      "planFeaturesKicker": "Diarito에서 할 수 있는 일",
      "planFeaturesTitle": "첫 문장부터 다음 대화까지.",
      "planFeaturesIntro": "베타 멤버십에서 제공할 예정인 여덟 가지 기능과 학습 과정을 알아보세요.",
      "planExample": "이렇게 활용해요",
      "planDiaryBody": "오늘 있었던 일, 지금의 감정, 내일 하고 싶은 이야기를 기록해요. 몇 문장부터 시작해 내 삶을 바탕으로 글쓰기 습관을 만들어 보세요.",
      "planDiaryExample": "오늘은 한국어로 음식을 주문하지 못했어요. 내일 다시 시도하고 싶어요.",
      "planCommunityBody": "내 언어를 배우는 사람들의 일기를 읽고 내 이야기도 나눠요. 교과서에서는 쉽게 만나기 어려운 일상 속 표현과 생각을 발견해 보세요.",
      "planCommunityExample": "한국에 사는 사람이 스페인어로 여행 일기를 써요. 그 경험을 읽으며 새로운 문화를 알아가요.",
      "planReceiveBody": "일기의 특정 문장에 대한 피드백을 받아요. 무엇이 바뀌었는지 확인하고 어떤 상황에서 더 자연스러운 표현인지 이해해요.",
      "planReceiveExample": "문법 오류를 알려 주는 데 그치지 않고 ‘긴장되다’와 ‘무섭다’의 차이도 설명할 수 있어요.",
      "planGiveBody": "누군가가 배우는 언어는 바로 내 언어일 수 있어요. 문장을 선택해 더 자연스러운 표현을 제안하고 맥락을 설명해요. 댓글과 교정에는 좋아요를 남길 수 있어요.",
      "planGiveExample": "누군가 ‘un reunión’이라고 쓰면 ‘una reunión’으로 교정하고 그 이유를 알려 줄 수 있어요.",
      "planSaveBody": "유용한 표현을 저장하고 나중에 다시 확인해요. 내 일기와 받은 피드백을 바탕으로 나만의 표현 모음을 만들어요.",
      "planSaveExample": "다음 대화에서 사용할 수 있도록 ‘tener ganas de’와 예문을 함께 저장해요.",
      "planPracticeBody": "배운 표현을 다시 확인하고 새로운 문장을 만들어 다른 상황에 적용해요. 답을 외우기보다 스스로 언어를 사용할 수 있도록 연습해요.",
      "planPracticeExample": "커피를 주문하는 표현을 배웠다면 음식을 주문하거나 질문하는 새로운 문장을 만들어 봐요.",
      "planProgressBody": "활동 기록과 글쓰기, 피드백, 연습의 진행 상황을 확인해요. 매일 접속하는 것뿐 아니라 배운 표현을 직접 사용하는 과정이 중요해요.",
      "planProgressExample": "일기 작성 → 피드백 확인 → 새로운 문장 연습.",
      "planPrivacyBody": "나만 간직할 일기와 커뮤니티에 공유할 일기를 선택해요. 공개하기로 선택한 글만 방문자용 피드에 표시되는 것이 원칙이에요.",
      "planPrivacyExample": "개인적인 기억은 비공개로 남기고 연습하고 싶은 경험은 공유할 수 있어요.",
      "planFAQTitle": "멤버십 관련 질문",
      "planFAQ1": "어떤 언어와 수준에서 시작하나요?",
      "planFAQ1Body": "베타는 A2 수준부터 한국어와 스페인어 교류에 집중해요.",
      "planFAQ2": "모든 일기를 공유해야 하나요?",
      "planFAQ2Body": "아니요. 비공개로 간직할 일기와 공유할 일기를 직접 선택할 수 있도록 준비하고 있어요.",
      "planFAQ3": "$7은 어떤 결제 방식인가요?",
      "planFAQ3Body": "준비 중인 멤버십 가격이에요. 결제 주기, 최종 이용 조건과 가입 절차는 결제를 시작하기 전에 안내할 예정이에요.",
      "planFAQ4": "가입 전에 둘러볼 수 있나요?",
      "planFAQ4Body": "네. 최근 일기에서 공개 글을 읽는 경험과 댓글 및 교정 예시를 확인할 수 있어요.",
      "blogMetaTitle": "블로그 · Diarito",
      "blogMetaDescription": "일상에서 언어를 배우고 자연스러운 표현을 이해하며 글쓰기 습관을 만드는 방법을 소개해요.",
      "blogKicker": "더 나은 언어 학습을 위한 생각",
      "blogTitle": "언어는 삶 속에 있어요.",
      "blogIntro": "일상을 배움의 기회로 바꾸고 다른 사람들과 연결되는 데 도움이 되는 생각과 실용적인 팁을 나눠요.",
      "blogRead": "글 읽기",
      "blogBack": "글 목록으로",
      "blogCategory1": "일상 속 학습",
      "blogCategory2": "사람을 통한 피드백",
      "blogCategory3": "언어 연습",
      "blog1Title": "하루가 곧 학습 자료예요.",
      "blog1Summary": "빈 화면 앞에서 막히지 않도록 일기를 시작하는 세 가지 질문.",
      "blog1P1": "무엇을 써야 할지 모를 때 새로운 이야기를 지어낼 필요는 없어요. 오늘 무엇을 했는지, 어떤 기분이었는지, 누군가에게 어떤 이야기를 하고 싶은지 생각해 보세요. 버스에서의 경험, 점심 식사, 짧은 대화만으로도 충분한 연습 자료가 돼요.",
      "blog1P2": "배우는 언어로 세 문장부터 써 보세요. 모르는 단어가 있다면 이미 알고 있는 표현으로 설명해 보세요. 그다음 더 자연스럽게 말하고 싶은 표현을 하나 기록해요. 중요한 것은 내가 전하고 싶은 이야기가 있다는 점이에요.",
      "blog2Title": "좋은 교정은 이유를 알려 줘요.",
      "blog2Summary": "문법적으로 맞는 문장과 상황에 자연스럽게 어울리는 문장의 차이를 알아봐요.",
      "blog2P1": "문법적으로 맞는 문장도 지나치게 격식 있거나 거리감 있게 들릴 수 있어요. 맥락이 중요해요. 친구, 직장 동료, 처음 만난 사람에게 같은 방식으로 말하지는 않으니까요.",
      "blog2P2": "피드백을 받으면 의미, 관계, 상황이 어떻게 달라지는지 생각해 보세요. 다른 사람을 돕는다면 어떤 상황에서 그 표현을 사용할지 설명해 주세요. 다른 표현을 제안한다고 해서 원래 문장이 반드시 틀린 것은 아니에요.",
      "blog3Title": "저장한 표현을 다시 사용해 봐요.",
      "blog3Summary": "표현을 알아보는 단계에서 번역에 의존하지 않고 직접 쓰는 단계로 넘어가는 방법.",
      "blog3P1": "표현을 저장하는 것은 첫 단계일 뿐이에요. 교정에서 배운 표현 하나를 골라 내 삶과 관련된 새로운 문장을 써 보세요. 같은 예문을 반복하기보다 사람, 장소, 전달하고 싶은 내용을 바꿔 보세요.",
      "blog3P2": "다음 날에는 기록을 보지 않고 그 표현을 떠올려 보세요. 대화나 일기에 사용할 기회가 생기면 활용해 보세요. 이렇게 알아보던 표현을 스스로 사용할 수 있는 표현으로 만들어 가요.",
      "loginMetaTitle": "로그인 · Diarito",
      "signupMetaTitle": "회원가입 · Diarito",
      "authMetaDescription": "데모 계정을 만들고 나만의 일기로 스페인어나 한국어를 연습해 보세요.",
      "loginTitle": "로그인",
      "loginIntro": "로그인하고 학습과 대화를 이어 가세요.",
      "signupTitle": "계정 만들기",
      "signupIntro": "프로필을 만들고 다른 사람들과 함께 배울 준비를 해 보세요.",
      "authEmail": "이메일",
      "authPassword": "비밀번호",
      "authUsername": "사용자 이름",
      "authLearning": "학습 중인 언어",
      "authSelect": "언어 선택",
      "authPending": "로컬 데모: 계정과 일기는 이 브라우저에 저장돼요.",
      "authNoAccount": "아직 계정이 없나요?",
      "authHasAccount": "이미 계정이 있나요?",
      "authCreate": "계정 만들기",
      "faqKicker": "가입하기 전에",
      "faqTitle": "자주 묻는 질문"
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
      if (key === "login" && node.matches("a.landing-button")) {
        const icon = document.createElement("i");
        icon.className = "fi fi-rr-sign-in-alt";
        node.prepend(icon, " ");
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      if (dict[node.dataset.i18nAria]) node.setAttribute("aria-label", dict[node.dataset.i18nAria]);
    });
    document.querySelectorAll("[data-public-photo]").forEach((node) => {
      node.alt = next === "ko" ? node.dataset.altKo : node.dataset.altEs;
    });
    document.querySelectorAll("[data-public-explanation]").forEach((node) => {
      node.textContent = next === "ko" ? node.dataset.textKo : node.dataset.textEs;
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

    const publicFeedPage = document.querySelector("[data-public-feed-page]");
    const page = document.querySelector("[data-public-page]")?.dataset.publicPage;
    const pageMeta = {"membership":["membershipMetaTitle","membershipMetaDescription"],"blog":["blogMetaTitle","blogMetaDescription"],"login":["loginMetaTitle","authMetaDescription"],"signup":["signupMetaTitle","authMetaDescription"]}[page];
    document.title = publicFeedPage ? dict.feedMetaTitle : pageMeta ? dict[pageMeta[0]] : meta[next].title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", publicFeedPage ? dict.feedMetaDescription : pageMeta ? dict[pageMeta[1]] : meta[next].description);
    if (persist) writePreference("diarito-language", next);
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

    if (persist) writePreference("diarito-theme", next);
  };

  const savedLanguage = readPreference("diarito-language");
  const savedTheme = readPreference("diarito-theme");
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

  // Filter the public diaries by entry language.
  document.querySelectorAll("[data-public-feed-page]").forEach((page) => {
    const entries = [...page.querySelectorAll("[data-public-diary]")];
    const filters = [...page.querySelectorAll("[data-public-filter]")];
    const applyFilter = (active) => {
      entries.forEach((entry) => { entry.hidden = active !== "all" && entry.dataset.language !== active; });
      filters.forEach((button) => {
        const selected = button.dataset.publicFilter === active;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    };
    filters.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.publicFilter)));
    applyFilter("all");
  });

  // Keep the comment button as an independent conversation toggle.
  document.querySelectorAll("[data-public-diary]").forEach((entry) => {
    const thread = entry.querySelector("[data-public-thread]");
    const toggle = entry.querySelector("[data-thread-toggle]");
    if (!thread || !toggle) return;
    toggle.addEventListener("click", () => {
      thread.hidden = !thread.hidden;
      toggle.setAttribute("aria-expanded", String(!thread.hidden));
    });
  });

  // Smooth FAQ: native details and keyboard behavior, with reversible height animation.
  document.querySelectorAll("[data-faq-item]").forEach((item) => {
    const summary = item.querySelector("summary");
    const answer = item.querySelector(".membership-faq__answer");
    if (!summary || !answer || typeof item.animate !== "function") return;
    let animation = null;
    let targetOpen = item.open;
    const clear = () => {
      item.style.height = "";
      item.style.overflow = "";
      item.classList.remove("is-animating");
    };
    summary.addEventListener("click", (event) => {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
        if (animation) { animation.cancel(); animation = null; }
        clear();
        item.open = !targetOpen;
        targetOpen = item.open;
        event.preventDefault();
        return;
      }
      event.preventDefault();
      const from = item.getBoundingClientRect().height;
      targetOpen = !targetOpen;
      if (animation) { animation.cancel(); animation = null; }
      item.style.height = from + "px";
      item.style.overflow = "hidden";
      item.classList.add("is-animating");
      if (targetOpen) item.open = true;
      const border = item.offsetHeight - item.clientHeight;
      const to = summary.getBoundingClientRect().height + (targetOpen ? answer.getBoundingClientRect().height : 0) + border;
      const current = item.animate([{height: from + "px"}, {height: to + "px"}], {
        duration: 250, easing: "cubic-bezier(.2,.75,.25,1)", fill: "both"
      });
      animation = current;
      current.onfinish = () => {
        if (animation !== current) return;
        item.open = targetOpen;
        current.cancel();
        animation = null;
        clear();
      };
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