/* Diarito MVP demo fixtures. Every profile, diary and interaction below is fictional. */
(() => {
  'use strict';
  const HOUR = 3600000;
  const DAY = HOUR * 24;
  const profiles = [
    ['sowon', '박소원', 'ko', 'es', 'intermediate', 'KR', 29, '일상의 작은 이야기를 스페인어로 쓰고 있어요. / Aprendo contando mi día.'],
    ['yuna', '김유나', 'ko', 'es', 'advanced', 'KR', 32, 'Diseño, café y conversaciones que se quedan conmigo.'],
    ['jiyeon', '이지연', 'ko', 'es', 'beginner', 'KR', 24, '배우는 중이에요. 서로 천천히 도와줘요!'],
    ['minho', '정민호', 'ko', 'es', 'intermediate', 'KR', 41, 'Me gusta cocinar para mi familia y aprender nuevas palabras.'],
    ['hana', '최하나', 'ko', 'es', 'intermediate', 'KR', 55, 'Nunca es tarde para contar una historia en otro idioma.'],
    ['daeun', '윤다은', 'ko', 'es', 'beginner', 'KR', 22, 'Estudiante, caminante y lectora de diarios.'],
    ['jun', '서준', 'ko', 'es', 'advanced', 'KR', 36, 'La música me ayuda a conocer otras culturas.'],
    ['lucia', 'Lucía Méndez', 'es', 'ko', 'intermediate', 'MX', 27, '한국어로 제 하루를 조금씩 기록해요.'],
    ['mateo', 'Mateo Rivas', 'es', 'ko', 'beginner', 'HN', 31, 'Café, gatos y palabras nuevas.'],
    ['andres', 'Andrés Rojas', 'es', 'ko', 'intermediate', 'CO', 43, '새로운 언어로 새로운 친구를 만나고 싶어요.'],
    ['ana', 'Ana Torres', 'es', 'ko', 'advanced', 'AR', 58, 'Aprendo coreano para conversar con mi familia.'],
    ['gabriela', 'Gabriela Cruz', 'es', 'ko', 'beginner', 'PE', 23, '매일 조금씩. Un paso cada día.'],
    ['carlos', 'Carlos Rivera', 'es', 'ko', 'intermediate', 'GT', 47, 'Me interesa la cocina y lo que una palabra cuenta de su cultura.'],
    ['elena', 'Elena Vargas', 'es', 'ko', 'intermediate', 'CL', 35, '책, 산책, 그리고 작은 도전.'],
    ['moderator', 'Equipo Diarito', 'es', 'ko', 'advanced', 'HN', 30, 'Cuenta de moderación para explorar las herramientas de la demo.']
  ];
  const stories = [
    ['sowon','es','Una conversación en la panadería',
      'Esta mañana entré en una panadería que queda cerca de mi oficina. Siempre pido lo mismo, pero hoy decidí preguntar cuál era el pan favorito de la señora que trabaja allí. Me recomendó uno con nueces y me contó que su padre le enseñó a prepararlo.\n\nAl principio estaba nerviosa porque no encontraba todas las palabras. Dije que el olor me recordó la casa de mi abuela. La señora sonrió y esperamos juntas a que saliera otra bandeja del horno. Me di cuenta de que no necesito hablar perfecto para tener una conversación bonita.\n\nDespués llevé dos panes a la oficina. Uno era para mí y el otro para mi compañera, que hoy tenía un presentación importante. Comimos juntas antes de empezar el día. Fue una cosa pequeña, pero cambió mi mañana.',
      'assets/images/diary-gallery-market.svg'],
    ['mateo','ko','비 오는 날 만난 고양이',
      '오늘 아침에는 비가 많이 왔어요. 우산을 가지고 나갔지만 신발이 조금 젖었어요. 회사 가는 길에 작은 카페 앞에서 고양이를 만났어요. 고양이는 의자 밑에 앉아서 비를 보고 있었어요.\n\n저는 카페에서 커피를 주문하고 창문 옆에 앉았어요. 사장님이 고양이의 이름은 두부라고 말했어요. 저는 고양이가 정말 귀엽다고 말했어요. 두부는 천천히 제 가방 옆으로 와서 잠을 잤어요.\n\n회사에 조금 늦게 도착했지만 마음은 이상하게 편했어요. 퇴근 후에 그 카페에 다시 가고 싶어요. 다음에는 사장님에게 두부가 몇 살인지 물어볼 거예요.',
      'assets/images/diary-gallery-walk.svg'],
    ['jiyeon','es','Mi primer domingo sin planes',
      'Hoy apagué la alarma y me quedé un rato mirando la luz que entraba por la ventana. Normalmente hago una lista de todo lo que necesito terminar el domingo, pero esta vez quería escuchar un poco mi cuerpo. Preparé huevos, tostadas y una taza de té.\n\nDespués salí sin decidir adónde iba. En el parque vi a dos niños intentando enseñar a su perro a traer una pelota. El perro prefería sentarse bajo un árbol. Me reí porque yo también quería hacer menos cosas hoy.\n\nVolví a casa y llamé a mi madre. Hablamos casi una hora. No pasó nada extraordinario, pero por la noche sentí que el día había sido mío. Quiero recordar esa sensación cuando vuelva a llenar mi calendario.',''],
    ['lucia','ko','시장에 다녀왔어요',
      '토요일마다 집 근처 시장에 가요. 오늘은 처음 보는 채소가 있어서 아주머니에게 이름을 물어봤어요. 아주머니는 이름뿐만 아니라 맛있게 먹는 방법도 알려 주셨어요. 저는 잊어버리지 않으려고 휴대폰에 적었어요.\n\n집에 돌아와서 그 채소로 국을 만들었어요. 생각보다 시간이 오래 걸렸지만 냄새가 정말 좋았어요. 동생이 부엌에 와서 무엇을 만드는지 물었어요. 우리는 같이 먹으면서 다음 주에 만들 음식도 이야기했어요.\n\n예전에는 시장에서 질문하는 것이 무서웠어요. 지금도 긴장하지만 새로운 이야기를 들을 수 있어서 좋아요. 다음 주에는 다른 가게에도 가 보고 싶어요.','assets/images/diary-gallery-market.svg'],
    ['minho','es','La receta de mi padre',
      'Mi padre no suele escribir las cantidades cuando cocina. Dice que hay que mirar la olla y escuchar lo que necesita. Hoy intenté hacer su sopa siguiendo una llamada de video. Puse demasiado agua al principio y tuve que esperar bastante.\n\nMientras la sopa hervía, me contó cómo cocinaba en su primer apartamento. Tenía una sola sartén y una mesa muy pequeña. Nunca había escuchado esa historia. A veces pienso que conozco a mis padres y luego descubro que todavía hay muchas versiones de ellos que no conozco.\n\nLa sopa no quedó igual, pero mi hija pidió repetir. Guardé una porción para mañana y anoté las cantidades que usé. Tal vez esta sea nuestra propia versión de la receta.',''],
    ['andres','ko','퇴근 후의 작은 산책',
      '오늘은 하루 종일 컴퓨터 앞에서 일했어요. 회의가 세 번 있었고 점심도 책상에서 먹었어요. 퇴근할 때는 머리가 너무 복잡해서 버스를 타지 않고 걸어가기로 했어요.\n\n늘 지나가던 길인데 천천히 걸으니까 새로운 것들이 보였어요. 작은 서점 앞에는 고양이 그림이 있었고 꽃집에서는 노란 꽃을 정리하고 있었어요. 저는 꽃 한 송이를 샀어요. 특별한 이유는 없었어요.\n\n집에 도착해서 꽃을 컵에 꽂았어요. 저녁을 먹으며 오늘 좋았던 일을 세 가지 적었어요. 바쁜 하루 안에도 작은 좋은 일이 숨어 있다는 생각이 들었어요.','assets/images/diary-gallery-walk.svg'],
    ['hana','es','Aprender a los cincuenta y cinco',
      'Esta semana terminé mi primer libro corto en español. No entendí cada palabra y escribí muchas preguntas en los márgenes. Hace un año habría pensado que eso significaba que el libro era demasiado difícil para mí. Ahora lo veo de otra manera.\n\nMi nieta me preguntó por qué estudio si ya no tengo exámenes. Le dije que quiero poder escuchar historias de personas que viven lejos. También quiero visitar a una amiga en México y pedir mi desayuno sin que ella traduzca todo.\n\nHoy releí una página del primer capítulo. Entendí una expresión que antes parecía imposible. Es un progreso pequeño, pero es mío. Por eso lo estoy escribiendo aquí.',''],
    ['gabriela','ko','처음 만든 김밥',
      '친구와 함께 김밥을 만들었어요. 사진에서는 아주 쉬워 보였지만 직접 해 보니까 생각보다 어려웠어요. 저는 밥을 너무 많이 넣어서 첫 번째 김밥이 터졌어요. 친구는 괜찮다고 하면서 같이 웃었어요.\n\n두 번째 김밥에는 밥을 조금 넣었어요. 모양은 아직 예쁘지 않았지만 잘 잘랐어요. 당근을 싫어하는 동생도 맛있게 먹었어요. 우리는 남은 재료로 작은 김밥을 몇 개 더 만들었어요.\n\n요리를 하면서 한국어 단어도 배웠어요. 썰다, 넣다, 말다. 책에서 본 단어를 손으로 해 보니 더 오래 기억할 것 같아요. 다음에는 엄마와 같이 만들고 싶어요.',''],
    ['yuna','es','El cuaderno que casi tiré',
      'Buscando un cargador encontré un cuaderno de hace cinco años. En la primera página había una lista de cosas que quería aprender. Algunas todavía están pendientes. Otras ya forman parte de mi vida y había olvidado lo difícil que parecían al principio.\n\nHabía dibujos torpes, frases en español y entradas sobre días que ya no recordaba. Una página decía: «Hoy hablé con una desconocida aunque tuve miedo». No explicaba nada más, pero pude recordar perfectamente esa tarde.\n\nDejé el cuaderno en la mesa. A veces medimos el progreso mirando solo lo que nos falta. Hoy pude mirar hacia atrás y encontrar pruebas de que sí he cambiado. Voy a seguir guardando estos pequeños diarios.',''],
    ['carlos','ko','딸과 함께 버스를 탔어요',
      '오늘은 딸과 함께 버스를 타고 도서관에 갔어요. 딸은 창문 밖을 보면서 계속 질문했어요. 왜 저 집은 파란색인지, 저 강은 어디로 가는지, 왜 버스는 여기에서 오래 기다리는지 물었어요.\n\n저는 모든 답을 알지 못했어요. 그래서 도서관에서 같이 찾아보기로 했어요. 딸은 강에 관한 책을 골랐고 저는 한국 여행 책을 골랐어요. 우리는 같은 테이블에 앉아서 서로 재미있는 사진을 보여 줬어요.\n\n돌아오는 버스에서 딸은 잠이 들었어요. 저는 오늘 질문을 많이 받은 것이 조금 피곤했지만 좋았어요. 모르는 것을 부끄러워하지 않는 마음을 딸에게 배우고 있어요.',''],
    ['daeun','es','La llamada que estaba posponiendo',
      'Llevaba dos semanas pensando en llamar a una amiga de la universidad. Siempre aparecía alguna razón para dejarlo para mañana: el trabajo, la ropa sin doblar, el cansancio. Hoy vi una foto de las dos y decidí llamar antes de pensarlo demasiado.\n\nAl principio hablamos de cosas prácticas. Después terminamos recordando la vez que tomamos el autobús equivocado y llegamos a una playa. Yo creía que ella había olvidado ese día. Me dijo que todavía guarda el boleto.\n\nNo necesitamos hacer grandes planes para seguir cerca. Acordamos hablar el próximo mes mientras cada una prepara su cena. Me fui a dormir con esa cita sencilla en el calendario.',''],
    ['ana','ko','손녀에게 보낸 음성 메시지',
      '손녀가 한국에 살기 시작한 지 두 달이 되었어요. 우리는 일주일에 한 번 영상 통화를 해요. 이번에는 짧은 한국어 음성 메시지를 보내고 싶어서 아침부터 연습했어요.\n\n밥은 잘 먹고 있는지, 학교에서 재미있는 일이 있었는지 물었어요. 같은 문장을 여러 번 녹음했지만 결국 가장 자연스럽게 웃었던 것을 보냈어요. 발음은 완벽하지 않았어요.\n\n손녀가 저녁에 답장을 보냈어요. 제 한국어를 듣고 정말 기뻤다고 했어요. 내일도 한 문장을 녹음하려고 해요. 언어를 배우는 이유가 아주 가까이 있다는 것을 다시 느꼈어요.',''],
    ['jun','es','Una canción en el tren',
      'En el tren de vuelta escuché una canción que había olvidado. La aprendí cuando vivía con tres amigos en un apartamento pequeño. En aquella época discutíamos por quién tenía que lavar los platos, pero siempre terminábamos cenando juntos.\n\nBusqué la letra y esta vez entendí una frase que antes cantaba sin pensar. Hablaba de los lugares a los que volvemos aunque ya no existan de la misma manera. Me pareció una forma bonita de explicar la nostalgia.\n\nEscribí a mis antiguos compañeros para preguntar cómo estaban. Uno respondió con una foto de su nueva cocina. Otro mandó un audio cantando muy mal. Durante unas horas volvimos a estar en aquella mesa.','assets/images/diary-gallery-night.svg'],
    ['elena','ko','책을 빌려 준 이웃',
      '엘리베이터에서 이웃을 만났어요. 이웃이 들고 있는 책을 예전에 읽어서 인사를 하고 책 이야기를 시작했어요. 우리는 같은 작가를 좋아한다는 것을 알게 되었어요.\n\n저녁에 문을 두드리는 소리가 났어요. 이웃이 다른 책을 가져왔어요. 급하게 읽지 않아도 된다고 말했어요. 책 안에는 작은 종이가 있었어요. 좋아하는 문장이 있는 페이지 번호가 적혀 있었어요.\n\n저는 차를 만들고 그 페이지부터 읽었어요. 같은 건물에 오래 살았지만 그날 처음으로 정말 이웃이 된 것 같았어요. 다음에 책을 돌려줄 때 제 이야기도 작은 종이에 적으려고 해요.',''],
    ['sowon','es','Lo que me hizo feliz hoy',
      'Hoy me hizo feliz almorzar con mi hermana sin mirar el teléfono. Fuimos a un restaurante sencillo y pedimos dos platos para compartir. Hablamos de cosas que parecían pequeñas: una planta nueva, una película, el vecino que siempre canta por la mañana.\n\nEn un momento nos quedamos en silencio y no sentí la necesidad de llenar ese espacio. Solo escuchamos el ruido de los platos y vimos pasar a la gente. A veces las mejores conversaciones también tienen silencios cómodos.\n\nCuando nos despedimos, ella dijo que deberíamos repetirlo. Puse una nota en mi calendario antes de volver a la oficina. Quiero que los encuentros importantes tengan un lugar, aunque no sean urgentes.',''],
    ['mateo','ko','밤에 본 우리 동네',
      '저녁을 먹은 후에 쓰레기를 버리러 나갔어요. 바람이 시원해서 조금 더 걷기로 했어요. 낮에는 시끄러운 길인데 밤에는 가게의 불빛과 사람들의 작은 목소리만 있었어요.\n\n편의점 앞에서 오래된 친구를 우연히 만났어요. 우리는 따뜻한 음료를 하나씩 사서 벤치에 앉았어요. 친구는 새로운 일을 시작했다고 했어요. 저는 요즘 한국어로 일기를 쓴다고 말했어요.\n\n집에 돌아오니 한 시간이 지나 있었어요. 잠깐 나갔다가 예상하지 못한 좋은 시간을 보냈어요. 계획에 없던 일이 하루를 바꾸기도 하네요.','assets/images/diary-gallery-night.svg'],
    ['minho','es','Un error en la reunión',
      'Ayer tuve un reunión muy larga con personas de tres países. Había preparado mis notas en español, pero cuando llegó mi turno olvidé una palabra muy sencilla. Me quedé callado y sentí que todos estaban esperando.\n\nUna compañera me dijo que podía explicarlo de otra forma. Respiré y describí lo que quería decir. No fue la frase que había ensayado, pero me entendieron. Después de la reunión ella me contó que también se pone nerviosa cuando habla coreano.\n\nMe gustaría recordar ese momento la próxima vez que cometa un error. Tener una conversación no significa demostrar que sé todas las palabras. También significa dar y recibir un poco de paciencia.',''],
    ['lucia','ko','씨앗을 심었어요',
      '오늘 작은 화분에 씨앗을 심었어요. 아파트에는 정원이 없지만 창문 옆에 햇빛이 잘 들어와요. 흙을 만지니 어릴 때 할머니 집에서 놀던 생각이 났어요.\n\n물을 얼마나 줘야 하는지 찾아보고 화분에 날짜를 적었어요. 동생은 빨리 자랐으면 좋겠다고 했어요. 저는 매일 조금씩 달라지는 모습을 보고 싶어요. 아직 아무것도 보이지 않지만 기다리는 일이 즐거워요.\n\n한국어를 배우는 것도 비슷한 것 같아요. 매일 큰 변화가 있는 것은 아니지만 꾸준히 시간을 주면 어느 날 새로운 문장이 나와요. 이 화분을 보면서 그걸 기억하려고 해요.',''],
    ['hana','es','Una visita al museo',
      'Fui al museo sola por primera vez. Siempre había esperado a que alguien pudiera acompañarme, así que terminaba posponiendo la visita. Hoy compré la entrada y elegí una sala sin mirar primero el mapa completo.\n\nMe quedé mucho tiempo frente a una fotografía de una cocina vacía. No era la obra más famosa, pero la luz sobre la mesa me recordó la casa donde crecí. Una guía se acercó y me preguntó qué veía. Le conté mi recuerdo y ella me contó algo sobre la fotógrafa.\n\nAl salir escribí tres palabras en mi teléfono para no olvidar la sensación: luz, espera, hogar. No vi todo el museo. Eso me parece una buena razón para volver.',''],
    ['andres','ko','친구에게 길을 설명했어요',
      '한국인 친구가 우리 도시를 방문했어요. 오늘은 제가 좋아하는 카페에서 만나기로 했어요. 친구가 길을 찾기 어려워해서 한국어로 설명해 봤어요.\n\n처음에는 오른쪽과 왼쪽을 바꿔 말했어요. 친구가 사진을 보내 줘서 실수를 알았어요. 우리는 같이 웃었고 저는 천천히 다시 설명했어요. 은행을 지나서 두 번째 길에서 왼쪽으로 가라고 말했어요.\n\n친구가 카페에 도착했을 때 작은 성취감을 느꼈어요. 책 속의 연습이 실제 만남으로 이어졌어요. 커피를 마시면서 서로 길을 잃었던 이야기를 했어요.',''],
    ['jiyeon','es','El perro de mi vecino',
      'Mi vecino se lastimó una pierna y me pidió ayuda para pasear a su perro. Nunca había cuidado un perro tan grande. Me explicó dónde guardaba la correa y cuáles eran sus lugares favoritos. El perro se llama Bori y tiene mucha paciencia.\n\nAl principio caminábamos a velocidades diferentes. Yo quería llegar al parque y Bori quería oler cada esquina. Después de unos minutos dejé de mirar el reloj. Encontramos un banco con sombra y descansamos un poco.\n\nCuando volvimos, mi vecino nos esperaba con agua fría. Me agradeció como si hubiera hecho algo enorme. En realidad, el paseo también me ayudó a mí. Hoy necesitaba una razón para salir y caminar despacio.',''],
    ['gabriela','ko','발표가 끝났어요',
      '이번 주 내내 준비한 발표가 오늘 끝났어요. 시작하기 전에는 손이 차갑고 목소리가 작았어요. 첫 번째 문장을 말한 후에 친구가 고개를 끄덕이는 것을 봤어요. 그때 조금 안심했어요.\n\n중간에 어려운 질문이 나왔어요. 바로 대답하지 못해서 잠시 생각할 시간을 달라고 했어요. 예전에는 모른다고 말하는 것이 무서웠는데 오늘은 솔직하게 말할 수 있었어요.\n\n집에 오는 길에 좋아하는 빵을 샀어요. 큰 축하는 아니지만 나에게 수고했다고 말하고 싶었어요. 오늘 배운 것은 준비도 중요하지만 잠깐 멈추는 용기도 중요하다는 거예요.',''],
    ['yuna','es','Volver a andar en bicicleta',
      'Hace mucho que no montaba en bicicleta. Esta mañana alquilé una en el parque y busqué un camino tranquilo. Los primeros minutos me sentí torpe. Había olvidado cómo se siente mirar hacia delante y confiar en el equilibrio.\n\nUna señora pasó a mi lado y me dijo que fuera a mi ritmo. No sabía que necesitaba escuchar exactamente eso. Di una vuelta corta, descansé y después hice otra. Al final me animé a llegar hasta el puente.\n\nVolví cansada y contenta. A veces trato cada nuevo intento como si tuviera que hacerlo bien de inmediato. Hoy practiqué algo distinto: empezar despacio y dejar que el cuerpo recuerde.','assets/images/diary-gallery-walk.svg'],
    ['carlos','ko','아버지의 오래된 사진',
      '주말에 아버지의 집을 정리하다가 오래된 사진 상자를 찾았어요. 사진 속의 아버지는 지금의 저보다 젊었어요. 처음 보는 사람들과 웃고 있었어요.\n\n아버지에게 한 장씩 보여 드리니 이야기가 시작되었어요. 처음 일했던 가게, 멀리 이사 간 친구, 비 때문에 취소된 여행 이야기를 들었어요. 저는 사진 뒤에 이름과 장소를 적었어요.\n\n정리는 별로 하지 못했지만 좋은 오후였어요. 물건을 버리기 전에 그 안에 어떤 이야기가 있는지 물어보는 것도 중요하다고 생각했어요. 다음 주에는 사진을 같이 정리하기로 했어요.',''],
    ['jun','es','Un día que todavía recuerdo',
      'Hace tiempo escribí este diario después de mi primer intercambio de idiomas. Quedamos en una cafetería y cada uno llevó una libreta. Durante media hora hablamos español y después cambiamos a coreano. Ninguno sabía cómo empezar, así que hablamos del camino que habíamos hecho para llegar.\n\nMi compañero me enseñó una expresión que su abuela usaba cuando alguien llegaba tarde. Yo le expliqué por qué una frase de su libro sonaba demasiado formal entre amigos. Nos reímos de nuestros ejemplos y dejamos de mirar tanto el reloj.\n\nAhora releo esta entrada y veo el comienzo de una amistad. Todavía guardo aquella libreta. La primera página dice solamente: volver a encontrarnos la próxima semana.',''],
    ['ana','ko','오늘의 질문: 행복했던 순간',
      '오늘 저를 행복하게 한 것은 남편이 준비한 아침이었어요. 특별한 음식은 아니었어요. 따뜻한 빵과 과일, 그리고 제가 좋아하는 차가 있었어요.\n\n우리는 창문을 열고 천천히 먹었어요. 남편은 어젯밤에 꾼 이상한 꿈을 이야기했어요. 저는 너무 웃어서 차를 조금 흘렸어요. 식탁을 닦으면서도 계속 웃었어요.\n\n매일 비슷한 아침이라고 생각했는데 일기로 쓰려고 하니 기억하고 싶은 순간이 많아요. 오늘의 작은 행복을 잊지 않으려고 여기 적어요. 내일 아침에도 서로의 이야기를 듣는 시간을 조금 남겨 두고 싶어요.',''],
    ['sowon','es','Una página solo para mí',
      'Hoy necesito escribir sin pensar en cómo se ve desde fuera. Tengo varias decisiones pendientes y me cuesta distinguir lo que quiero de lo que creo que esperan de mí.\n\nSalí a caminar y volví con una idea sencilla: no tengo que resolver todo esta noche. Puedo empezar por una conversación honesta y por dormir un poco mejor. Esta entrada se queda privada. No necesito compartir cada pensamiento para que tenga valor.','', 'private'],
    ['sowon','es','Practicar antes de compartir',
      'Ayer fui a la biblioteca y encontré una historia que quiero recomendar. Estoy muy feliz porque entendí casi todo el primer capítulo. Mi amiga tiene mucho paciencia cuando le pregunto palabras nuevas.\n\nQuiero practicar esta frase antes de publicarla. A veces un espacio privado me ayuda a intentarlo sin prisa. Mañana puedo volver, leer las sugerencias y escribir una versión que se parezca más a lo que quiero decir.','', 'ai']
  ];
  function create(now = Date.now()) {
    const date = ms => new Date(ms).toISOString();
    const users = profiles.map(([username,name,nativeLanguage,targetLanguage,level,country,age,bio], index) => ({
      id: 'user-' + username, username, email: username + '@diarito.demo', name,
      nativeLanguage,targetLanguage,level,country,age,bio,photo:'',
      goals:['daily-life','connection'],learnerType:'writing',role:username === 'moderator' ? 'admin' : 'member',
      onboardingComplete:true,firstChallengeComplete:true,createdAt:date(now - (1500-index*4)*DAY),
      suspended:false,blockedUserIds:[],fixture:true,
      auth:{salt:'6439617269746f2d64656d6f2d76312d31',hash:'83be63a88fec062a8df1f2480e2f138731f1ccf29d36528ab38932b6f151dc61',iterations:120000}
    }));
    const posts = stories.map(([username,language,title,content,photo,visibility],index) => ({
      id:'post-' + String(index+1).padStart(2,'0'),authorId:'user-'+username,title,content,originalContent:content,language,photo,
      visibility:visibility || 'community',createdAt:date(now - (index === 24 ? 1200*DAY : (index+1)*3*HOUR)),
      updatedAt:null,promptId:index===14 || index===25 ? 'daily-happy' : null,
      likes:index%4===0 ? ['user-lucia','user-hana'] : index%3===0 ? ['user-mateo'] : [],
      rewrites:[],hidden:false,fixture:true,correctionStatus:'none'
    }));
    const comments = [], corrections = [];
    function comment(postId,authorId,content,hoursAfter = .5) {
      const post = posts.find(p=>p.id===postId);
      comments.push({id:'comment-'+String(comments.length+1).padStart(2,'0'),postId,authorId:'user-'+authorId,content,
        createdAt:date(Date.parse(post.createdAt)+hoursAfter*HOUR),likes:comments.length%2?['user-yuna']:[],hidden:false,fixture:true});
    }
    function correction(postId,author,changes,hoursAfter=1) {
      const post=posts.find(p=>p.id===postId);
      corrections.push({id:'correction-'+String(corrections.length+1).padStart(2,'0'),postId,authorId:'user-'+author,source:'human',
        createdAt:date(Date.parse(post.createdAt)+hoursAfter*HOUR),likes:[],hidden:false,fixture:true,
        edits:changes.map(([original,replacement,es,ko],i)=>({id:'seed-edit-'+postId+'-'+i,start:post.originalContent.indexOf(original),end:post.originalContent.indexOf(original)+original.length,original,replacement,explanation:{es,ko},type:!replacement?'delete':!original?'insert':'replace',status:'pending'}))});
      post.correctionStatus='pending';
    }
    comment('post-01','mateo','Me encantó lo de compartir el pan. A veces una pregunta pequeña abre una conversación enorme.');
    correction('post-01','lucia', [['un presentación','una presentación','«Presentación» es femenino: una presentación importante.','presentación은 여성 명사이므로 una를 써요.']],1.2);
    comment('post-01','carlos','Mi abuela también hacía pan con nueces. Tu diario me dio ganas de llamarla.',1.4);
    comment('post-01','ana','Qué bonito que te animaste a preguntar. El idioma también se aprende en estos encuentros.',1.7);
    comment('post-02','yuna','두부라는 이름이 고양이에게 정말 잘 어울려요. 다음 이야기도 궁금해요!');
    correction('post-02','sowon',[['회사 가는 길에','회사에 가는 길에','Con «가다» podés marcar el destino con la partícula 에. La frase suena más completa así.','목적지를 나타내는 조사 에를 넣으면 문장이 더 완전해져요.']],1.4);
    comment('post-04','hana','질문하면서 배우는 것이 정말 좋아요. 어떤 채소였는지 궁금해요!');
    correction('post-05','andres',[['demasiado agua','demasiada agua','«Agua» es femenino, aunque usemos «el agua». El adjetivo concuerda en femenino.','agua는 el과 함께 쓰지만 여성 명사예요. 형용사는 여성형 demasiada를 써요.']],.8);
    comment('post-05','ana','Las recetas de familia siempre cambian un poquito con cada persona. Esa es la parte bonita.',1.4);
    comment('post-06','daeun','저도 바쁜 날에는 꽃을 사요. 작은 꽃 한 송이가 방의 분위기를 바꿔 줘요.');
    comment('post-07','carlos','Me identifico mucho. Yo empecé coreano a los cuarenta y todavía sigo descubriendo motivos nuevos.');
    comment('post-07','lucia','Terminar un libro es un gran paso. ¿Cómo se llama?');
    comment('post-08','minho','첫 김밥은 원래 조금 어려워요. 맛있게 먹었다면 성공이에요!');
    comment('post-09','ana','Yo también guardo cuadernos. Leerlos me ayuda a ser más amable con la persona que fui.');
    comment('post-10','sowon','아이들의 질문 덕분에 우리도 다시 배우게 되는 것 같아요. 따뜻한 이야기예요.');
    comment('post-12','hana','발음이 완벽하지 않아도 마음은 분명히 전해졌을 거예요.');
    comment('post-13','gabriela','Tengo una canción así. En cuanto empieza, vuelvo a mi primer apartamento.');
    comment('post-14','jun','책 안에 작은 메모를 넣는 것이 정말 좋은 생각이에요.');
    comment('post-15','elena','Esos silencios cómodos también son una forma de confianza. Gracias por ponerlo en palabras.');
    correction('post-17','andres',[['un reunión','una reunión','«Reunión» es femenino: una reunión.','reunión은 여성 명사이므로 una를 써요.'],['Tener una conversación','Conversar','La frase original es correcta. «Conversar» es una alternativa más breve y natural aquí.','원래 문장도 맞아요. 여기서는 Conversar라고 하면 더 간결하고 자연스러워요.']],.7);
    comment('post-17','lucia','Pedir un momento para pensar también es comunicarse bien. Me alegra que tu compañera te acompañara.');
    comment('post-18','yuna','저도 화분을 키우면서 기다리는 법을 배워요. 싹이 나면 알려 주세요!');
    comment('post-20','minho','실수를 같이 웃을 수 있는 친구가 있어서 다행이에요.');
    comment('post-22','sowon','잠깐 생각할 시간을 달라고 말하는 것도 중요한 능력이에요. 정말 수고했어요!');
    comment('post-23','carlos','Ir a tu ritmo es un consejo que sirve para casi todo.');
    comment('post-25','ana','Qué linda forma de guardar el inicio de una amistad.',24);
    comment('post-26','jiyeon','작은 순간을 기록하면 평범한 하루도 특별해져요.');
    return {version:1,seededAt:date(now),users,posts,comments,corrections,notifications:[],reports:[],connections:[
      {id:'connection-seed-1',fromId:'user-sowon',toId:'user-lucia',status:'accepted',createdAt:date(now-14*DAY)},
      {id:'connection-seed-2',fromId:'user-mateo',toId:'user-sowon',status:'pending',createdAt:date(now-2*HOUR)}
    ],collections:[{id:'collection-sowon-1',userId:'user-sowon',name:'Conversaciones cotidianas',createdAt:date(now-8*DAY),words:[
      {id:'word-sowon-1',term:'a tu ritmo',meaning:'자기 속도에 맞게',example:'Aprendé a tu ritmo.',language:'es',postId:'post-23',createdAt:date(now-3*DAY)},
      {id:'word-sowon-2',term:'tener paciencia',meaning:'인내심을 가지다',example:'Gracias por tener paciencia conmigo.',language:'es',postId:'post-17',createdAt:date(now-2*DAY)}
    ]}]};
  }
  window.DemoSeed = Object.freeze({create});
})();
