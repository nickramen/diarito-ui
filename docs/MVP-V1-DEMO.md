# Diarito MVP V1 · Demo 2.20.0

Esta versión convierte el sitio y la UI Library en una experiencia que se puede recorrer: crear una cuenta, completar el perfil, escribir, recibir una corrección, aceptarla y volver a escribir. Todo se guarda en el navegador. La demo no usa un servidor de autenticación, una base de datos compartida ni un modelo de IA.

## Empezar

Abrí `login.html` desde la dirección HTTPS de la demo o desde el servidor local incluido. No conviene abrir los HTML con doble clic: el almacenamiento entre archivos y las funciones de contraseña dependen del navegador.

Para correr el ZIP en tu computadora:

1. Descomprimí toda la carpeta; conservá `assets/` junto a los HTML.
2. Con Python 3 instalado, ejecutá `python3 scripts/serve-demo.py` en esa carpeta. En Windows también podés abrir `run-demo.bat`.
3. El navegador abre `http://localhost:8080/login.html`.
4. Mantené la consola abierta mientras usás la demo. La misma dirección y el mismo perfil de navegador recuperan tus datos al volver.

No hay dependencias de JavaScript que instalar para usarla. Las fuentes y los íconos externos necesitan conexión; el contenido y las funciones locales no usan API remotas.

## Cuentas de demostración

| Usuario | Papel | Contraseña de prueba |
| --- | --- | --- |
| `sowon` | Autora coreana que practica español; tiene diarios, correcciones y una colección | `DiaritoDemo1!` |
| `mateo` | Miembro hispanohablante que practica coreano | `DiaritoDemo1!` |
| `lucia` | Miembro hispanohablante que puede corregir a Sowon | `DiaritoDemo1!` |
| `yuna` | Miembro coreano que practica español | `DiaritoDemo1!` |
| `moderator` | Reportes, ocultación/eliminación y suspensión/reactivación | `DiaritoDemo1!` |

Los 15 perfiles iniciales son ficticios y comparten esa contraseña de demostración. Los botones de acceso de ejemplo son explícitos. También podés crear cuentas normales de prueba con correos distintos: no se envía ningún email.

Los usuarios y correos son únicos, sin distinguir mayúsculas. Las contraseñas creadas por la interfaz se guardan como una derivación PBKDF2 con sal, no como texto sin cifrar. Eso mejora el manejo de la demo, pero **no convierte localStorage en un sistema seguro de autenticación**: quien controla el navegador controla sus datos.

## Recorrido sugerido para presentar

### 1. Una persona nueva

Desde **Registrate**, creá una cuenta. El onboarding pide nombre, lengua natal, lengua de práctica, nivel aproximado, objetivos y una preferencia de aprendizaje. El último paso ofrece subir una foto o continuar con una inicial. La preferencia expresa cómo quiere practicar; no es un diagnóstico de estilo de aprendizaje.

Para una presentación rápida, **Empezar demo desde cero** en el login crea una cuenta ficticia nueva y abre ese mismo onboarding. **Entrar como Sowon** abre una cuenta que ya tiene actividad. El acceso de moderación está en una sección desplegable del login.

La pareja de idiomas es español/coreano. El idioma de la interfaz se cambia con ESP / 한국어 y se conserva entre el sitio y la app. El texto de los diarios permanece en el idioma en el que fue escrito.

### 2. Primer desafío

El onboarding lleva a **¿Qué cosa te hizo feliz hoy?**. Escribí una respuesta en el idioma de práctica. Podés poner título y foto. Elegí visibilidad y confirmá el aviso si la compartís con Comunidad. Al guardar, la entrada se publica en la demo y abre el feed.

El botón de texto de ejemplo sirve para probar la revisión automática simulada. También podés escribir libremente; las correcciones humanas funcionan con cualquier fragmento válido.

### 3. Feed y conversación

La comunidad trae **26 entradas públicas**, además de un diario privado y uno Solo IA. Las historias tienen varios párrafos y temas distintos: familia, trabajo, cocinar, viajar, aprender a otra edad y pequeños momentos cotidianos.

El feed es cronológico y se puede filtrar por idioma. Hay conversaciones vacías, comentarios y correcciones. Los tiempos usan formatos breves como `2h`, `1d` y `3y`, con la fecha completa al consultar el elemento.

**Leer el diario completo**, **Ver respuestas** y **Ver más** abren el detalle. En escritorio es un diálogo; en móvil ocupa la pantalla. Los filtros muestran todo, solo comentarios o solo correcciones.

### 4. Una corrección humana

Entrá como otra cuenta de la misma demo y abrí un diario de Comunidad. Seleccioná texto y usá el clic derecho, o el botón **Corregir**. La alternativa por oraciones permite trabajar con teclado y móvil, incluyendo elegir una aparición concreta cuando un fragmento se repite.

Podés reemplazar, eliminar, insertar o sugerir **Otra forma de decirlo**. Explicá el cambio. **Agregar otro cambio** permite reunir distintas partes del diario en una sola respuesta. El grupo completo lleva un borde dashed. Las eliminaciones están tachadas y los agregados resaltados; no se depende solo del color.

Los fragmentos se anclan por posiciones al texto original. Se rechazan cambios superpuestos dentro de una propuesta y aceptaciones que entrarían en conflicto con otra ya aceptada.

### 5. Revisar y volver a escribir

Volvé a la cuenta autora. La nueva corrección aparece en Notificaciones y en su diario. Aceptá o ignorá cada cambio. **Versión limpia** aplica únicamente los cambios aceptados, manteniendo el original intacto.

En **Hacelo tuyo**, reescribí una oración o el diario completo. El nuevo intento se guarda por separado con su fecha. Esto completa el ciclo Original → Corrección → Reescritura.

### 6. Privacidad, colecciones y moderación

En **Mi diario** están únicamente las entradas de tu cuenta. El menú de una entrada permite cambiar título, foto y privacidad. Si no hay correcciones ni reescrituras, también permite editar el contenido, guardando el contenido anterior en las revisiones internas. Si ya hubo correcciones, el original queda protegido y se usa la reescritura.

En **Colecciones**, creá una carpeta de expresiones. Guardá palabras, significado y contexto desde un diario o manualmente. No es un motor de flashcards ni de repetición espaciada.

Reportá un diario, comentario o corrección y luego entrá como `moderator`. El panel permite desestimar el reporte, ocultar o eliminar contenido y suspender a su autor. Un usuario suspendido no puede iniciar sesión. Bloquear a alguien oculta su contenido e impide la interacción entre ambas cuentas en esta demo.

## Funciones incluidas

| Área | Comportamiento de esta versión |
| --- | --- |
| Cuenta | Registro, usuario único, login por usuario/correo, logout y sesión persistente |
| Onboarding | Nombre, idioma natal/objetivo, nivel, objetivos, preferencia y foto opcional |
| Diario | Crear, leer, editar, eliminar, foto, idioma, fecha, privacidad y estado de corrección |
| Pregunta del día | Un prompt global ES/KO, fácil de editar en el código |
| Corrección automática | Simulación local limitada, siempre identificada como IA · demo |
| Corrección humana | Selección de fragmentos, explicación y varios cambios agrupados |
| Revisión | Aceptar/ignorar por cambio, detección de conflictos y versión limpia |
| OIO | Reescrituras separadas, persistentes, con original conservado |
| Feed | 26 entradas públicas iniciales, orden cronológico y filtro por idioma |
| Perfil | Datos básicos, diarios propios/públicos y correcciones dadas |
| Conexiones | Solicitudes y aceptación entre cuentas locales |
| Colecciones | Crear, renombrar/eliminar y guardar/eliminar expresiones |
| Leaderboard | Visible en sitio y app; número de diarios públicos, sin puntajes de corrección |
| Notificaciones | Comentarios, correcciones, aceptación y conexiones |
| Moderación | Reportar, bloquear, desestimar, ocultar/eliminar, suspender/reactivar |
| Respaldo | Exportar/importar el conjunto completo de datos de la demo |
| Interfaz | Español/coreano, claro/oscuro, controles compactos y adaptación móvil |

## Decisiones de alcance

Se tomó la lista final del MVP como criterio cuando había ideas distintas en el pedido:

- **Foto opcional.** Se ofrece al cerrar el onboarding y puede cambiarse después.
- **Tres modos de privacidad:** Solo yo, Solo IA y Comunidad. No se agregó “solo amigos”; las conexiones no otorgan acceso adicional.
- **Correcciones simples.** Reemplazo, eliminación, inserción y alternativa natural. No hay marketplace, reputación, puntajes ni ranking de correctores.
- **Leaderboard de actividad básica.** Cuenta diarios públicos de esta demo; no afirma medir habilidad ni calidad.
- **Colecciones sencillas.** Son un cuaderno de expresiones, no un sistema avanzado de vocabulario.
- **Datos locales.** La participación entre cuentas se demuestra alternando usuarios en el mismo navegador y origen. Otros dispositivos tienen otra copia independiente.

## Qué significa la IA de esta demo

No hay un modelo conectado ni una petición externa. Un conjunto acotado de reglas muestra cómo se verían las correcciones y explicaciones. Por ejemplo, reconoce casos de demostración como `Ayer voy al parque`, `mucho paciencia` o `저는 커피을 마셨어요`.

Si no encuentra un ejemplo compatible, la interfaz lo dice. **No afirma que el texto esté correcto.** Solo IA mantiene el diario privado; Solo yo deshabilita ese flujo de revisión.

## Persistencia y datos personales

La clave principal es `diarito-demo-v1` y la sesión usa `diarito-demo-session`. Idioma, tema y borradores tienen sus propias claves. Recargar no reinicia las historias ni las interacciones. Los errores de cuota o datos dañados se informan; no se borran los datos en silencio.

Los archivos de foto se reducen antes de guardarse. El límite de localStorage varía según el navegador: exportá una copia antes de una presentación importante. El respaldo incluye todas las cuentas y entradas locales, incluso las privadas; no debe compartirse como material público.

Importar reemplaza la base local y cierra la sesión, después de pedir confirmación. Los archivos importados se validan antes de reemplazar datos existentes.

## Antes de abrir una beta pública real

La demo permite evaluar la experiencia del MVP. La definición de “Ready for Beta” con personas reales todavía necesita:

1. Autenticación y sesiones de servidor; usuarios únicos entre dispositivos; recuperación de cuenta y verificación de correo.
2. Base de datos y almacenamiento de imágenes compartidos, con permisos comprobados en el servidor.
3. Integración de IA real con las claves protegidas, límites de uso, consentimiento de procesamiento y evaluación de calidad en ambos idiomas.
4. Moderación compartida, roles de administrador de servidor, historial y mecanismos de atención de reportes.
5. Revisión de privacidad, condiciones, retención de datos y procedimientos para eliminar/exportar una cuenta real.

No se incluyen pagos, emails reales, notificaciones push, recomendaciones algorítmicas, flashcards, reputación ni funciones de tutor conversacional.

## Desarrollo y verificación

El proyecto sigue siendo HTML, CSS y JavaScript nativos. No se introdujo un framework.

```sh
node scripts/check.mjs
node --test tests/*.test.cjs
node scripts/build.mjs
```

- `demo-store.js`: repositorio local, validación, permisos de demo y operaciones.
- `demo-seed.js`: historias y perfiles iniciales, aislados de las cuentas creadas después.
- `demo-auth.js`: registro, login y onboarding.
- `demo-app.js`: navegación, feed, editor, perfil, colecciones y moderación.
- `demo-entry.js`: conversación, selección, correcciones y reescritura.
- `public-demo.js`: integración de navegación pública, horas y leaderboard.
- `components.css`: variante compacta reutilizable de inputs/selects, 38 px y texto de 16 px.
- `patterns.css`: bordes dashed y grupos de corrección compartidos con la UI Library.

El build copia las páginas y los assets a `dist/`. El ZIP conserva también el código fuente, las pruebas y este recorrido.

### Verificación de esta entrega

Se completaron 27 pruebas automatizadas de almacenamiento, permisos, autenticación, selección exacta, correcciones y controladores de interfaz. La comprobación de JavaScript, enlaces locales e identificadores HTML también pasó.

En navegador se recorrió una cuenta nueva, onboarding en español/coreano, primera pregunta, publicación, revisión simulada, aceptación de dos cambios, versión limpia y reescritura. Se recargó la página para verificar persistencia. La revisión visual incluyó escritorio y un marco de 390 px: el detalle ocupa el ancho móvil y no desborda horizontalmente.
