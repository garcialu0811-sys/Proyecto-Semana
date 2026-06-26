// Lesson viewer controller

let currentSlug = '';
let currentLessonNum = 1;
let courseData = null;

function getUrlParams() {
  const parts = window.location.pathname.split('/');
  currentSlug = parts[2] || 'html';
  currentLessonNum = parseInt(parts[4]) || 1;
}

function getLessonObjectives(lesson, courseSlug) {
  const courseObjectives = {
    html: {
      1: ["Entender qué es HTML y sus bloques", "Conocer las etiquetas más comunes", "Crear tu primer archivo web"],
      2: ["Dominar la estructura <!DOCTYPE>", "Configurar head, title y body", "Vincular archivos externos"],
      3: ["Uso correcto de encabezados h1-h6", "Formatear párrafos con texto", "Aprender saltos de línea y separadores"],
      4: ["Insertar imágenes con etiqueta img", "Configurar rutas relativas y absolutas", "Añadir texto alternativo alt para accesibilidad"],
      5: ["Crear hipervínculos con anclas a", "Dominar el atributo href", "Abrir enlaces en pestañas nuevas"],
      6: ["Crear listas ordenadas y desordenadas", "Estructurar tablas con tr y td", "Organizar datos jerárquicamente"],
      7: ["Construir formularios de registro", "Añadir inputs de texto, email y password", "Utilizar botones de envío tipo submit"],
      8: ["Agrupar elementos con etiquetas div", "Uso de span para textos específicos", "Preparar la estructura para aplicar CSS"],
      9: ["Uso correcto de comentarios de código", "Documentar secciones importantes", "Buenas prácticas de indentación"]
    },
    css: {
      1: ["Entender qué es CSS y para qué sirve", "Aplicar estilos básicos a una página", "Reconocer la separación entre contenido y diseño"],
      2: ["Seleccionar elementos con clases y selectores", "Aplicar colores de forma correcta", "Identificar la diferencia entre ID y clase"],
      3: ["Comprender el modelo de caja", "Controlar márgenes, bordes y relleno", "Diseñar bloques con medidas consistentes"]
    },
    js: {
      1: ["Entender variables y constantes", "Trabajar con tipos de datos básicos", "Guardar información en memoria"],
      2: ["Tomar decisiones con condicionales", "Controlar el flujo del programa", "Evaluar condiciones con lógica"],
      3: ["Declarar funciones reutilizables", "Pasar parámetros y devolver valores", "Organizar tareas de forma modular"]
    },
    react: {
      1: ["Crear componentes reutilizables", "Entender JSX y renderizado", "Separar la interfaz en piezas claras"],
      2: ["Enviar datos con props", "Configurar componentes de forma dinámica", "Componer interfaces con parámetros"],
      3: ["Gestionar estado en componentes", "Actualizar datos con useState", "Responder a cambios del usuario"]
    },
    node: {
      1: ["Entender el entorno de Node.js", "Crear un servidor básico", "Manejar peticiones del cliente"],
      2: ["Usar módulos y archivos locales", "Organizar el proyecto en partes", "Gestionar recursos del backend"],
      3: ["Construir lógica del servidor", "Implementar rutas y respuestas", "Conectar el backend con la lógica de negocio"]
    },
    mongodb: {
      1: ["Entender documentos y colecciones", "Aprender cómo se almacenan los datos", "Reconocer el modelo NoSQL"],
      2: ["Crear consultas básicas en MongoDB", "Filtrar documentos en colecciones", "Aplicar condiciones a las búsquedas"],
      3: ["Modelar datos con Mongoose", "Definir esquemas y validaciones", "Conectar MongoDB con Node.js"]
    },
    express: {
      1: ["Crear una API sencilla con Express", "Definir rutas del servidor", "Responder a peticiones HTTP"],
      2: ["Gestionar middleware", "Controlar solicitudes y respuestas", "Organizar endpoints de forma limpia"],
      3: ["Construir APIs más completas", "Implementar controladores y operaciones", "Separar la lógica en módulos"]
    },
    api: {
      1: ["Comprender el concepto de API REST", "Diferenciar endpoints y recursos", "Enviar peticiones a servicios externos"],
      2: ["Trabajar con métodos HTTP", "Gestionar parámetros y respuestas", "Diseñar recursos de forma clara"],
      3: ["Integrar APIs en proyectos reales", "Procesar respuestas y errores", "Construir flujos de datos funcionales"]
    },
    proyecto: {
      1: ["Integrar todos los conocimientos del curso", "Diseñar una solución completa", "Organizar el proyecto final paso a paso"],
      2: ["Conectar frontend y backend", "Implementar la lógica del proyecto", "Resolver problemas de integración"],
      3: ["Pulir y entregar tu proyecto final", "Corregir errores y mejorar UX", "Presentar una solución completa"]
    }
  };

  const objectivesForLesson = courseObjectives[courseSlug]?.[lesson.lessonNumber];
  if (objectivesForLesson && objectivesForLesson.length) {
    return objectivesForLesson;
  }

  if (lesson.conceptToLearn) {
    const concept = lesson.conceptToLearn
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return [
      concept,
      `Aplicar ${lesson.title.replace(/^\d+\.\s*/, '')} en ejercicios prácticos`,
      'Completar el reto del curso con lo aprendido'
    ];
  }

  return ["Aprender conceptos clave de este bloque", "Resolver ejercicios prácticos", "Desbloquear recompensas"];
}

async function loadLessonData() {
  getUrlParams();

  const data = await apiFetch(`/courses/${currentSlug}`);
  if (!data) return;

  courseData = data;

  // Set breadcrumbs & titles
  const breadcrumbLink = document.getElementById('breadcrumb-course-link');
  if (breadcrumbLink) {
    breadcrumbLink.innerText = data.course.name.toUpperCase();
    breadcrumbLink.href = `/curso/${currentSlug}`;
  }
  document.getElementById('course-lessons-title').innerText = `Lecciones de ${data.course.name}`;

  const lesson = data.lessons.find(l => l.lessonNumber === currentLessonNum);
  if (!lesson) {
    window.location.href = `/curso/${currentSlug}`;
    return;
  }

  // Set current lesson detail info
  document.getElementById('lesson-number-label').innerText = `LECCIÓN ${lesson.lessonNumber}`;
  document.getElementById('lesson-title').innerText = lesson.title;
  document.getElementById('lesson-explanation').innerHTML = lesson.content;

  // Set code example
  const codeSec = document.getElementById('lesson-code-example-section');
  if (lesson.exampleCode) {
    document.getElementById('lesson-code-content').innerText = lesson.exampleCode;
    codeSec.style.display = 'block';
  } else {
    codeSec.style.display = 'none';
  }

  // Set objectives
  const objectivesContainer = document.getElementById('lesson-objectives');
  objectivesContainer.innerHTML = '';
  const objectivesList = getLessonObjectives(lesson, currentSlug);
  objectivesList.forEach(obj => {
    const li = document.createElement('li');
    li.innerText = obj;
    objectivesContainer.appendChild(li);
  });

  // Calculate completed status
  const completedSet = new Set(courseData.progress.lessonsCompleted);
  const statusEl = document.getElementById('lesson-status-badge');
  if (completedSet.has(currentLessonNum)) {
    statusEl.innerText = 'Completada ✓';
    statusEl.style.color = '#38bdf8';
  } else {
    statusEl.innerText = 'Pendiente';
    statusEl.style.color = '#63ff3f';
  }

  // Render left sidebar lessons list navigation
  renderLessonsNav(completedSet);
}

function renderLessonsNav(completedSet) {
  const navList = document.getElementById('lessons-nav-list');
  if (!navList) return;

  navList.innerHTML = '';
  
  // Unlocked threshold: lessons are unlocked if completed, active, or if the previous lesson is completed.
  courseData.lessons.forEach(l => {
    const li = document.createElement('li');
    const isActive = l.lessonNumber === currentLessonNum;
    const isDone = completedSet.has(l.lessonNumber);
    const isLocked = l.lessonNumber > 1 && !completedSet.has(l.lessonNumber - 1) && !isActive && !isDone;

    li.className = `lesson-nav-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
    
    if (!isLocked) {
      li.onclick = () => {
        window.location.href = `/curso/${currentSlug}/leccion/${l.lessonNumber}`;
      };
    }

    li.innerHTML = `
      <span>${l.lessonNumber}. ${l.title.replace(/^\d+\.\s*/, '')}</span>
      <span class="lesson-nav-status-icon ${isDone ? 'check' : (isLocked ? 'lock' : '')}"></span>
    `;
    navList.appendChild(li);
  });
}

function goBackToCourse() {
  window.location.href = `/curso/${currentSlug}`;
}

async function completeAndNext() {
  // Call server to complete lesson
  await apiFetch(`/progress/${currentSlug}/lesson/${currentLessonNum}`, {
    method: 'POST'
  });

  // Spawn green particles over the continue button
  const btn = document.getElementById('btn-continue');
  const rect = btn.getBoundingClientRect();
  spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, '#63ff3f', 35);

  // Navigate to exercise if it exists
  const exercise = courseData.exercises.find(ex => ex.lessonNumber === currentLessonNum);
  
  setTimeout(() => {
    if (exercise) {
      window.location.href = `/curso/${currentSlug}/ejercicio/${exercise.exerciseNumber}`;
    } else {
      // Find next lesson
      const nextLesson = courseData.lessons.find(l => l.lessonNumber === currentLessonNum + 1);
      if (nextLesson) {
        window.location.href = `/curso/${currentSlug}/leccion/${nextLesson.lessonNumber}`;
      } else {
        // Take them to final quiz or course dashboard
        const quiz = courseData.quizzes.find(q => q.lessonNumber === currentLessonNum);
        if (quiz) {
          window.location.href = `/curso/${currentSlug}/quiz/${quiz.quizNumber}`;
        } else {
          window.location.href = `/curso/${currentSlug}`;
        }
      }
    }
  }, 1200);
}

document.addEventListener('DOMContentLoaded', loadLessonData);
