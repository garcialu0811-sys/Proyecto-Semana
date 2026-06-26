// Lesson viewer controller

let currentSlug = '';
let currentLessonNum = 1;
let courseData = null;

function getUrlParams() {
  const parts = window.location.pathname.split('/');
  currentSlug = parts[2] || 'html';
  currentLessonNum = parseInt(parts[4]) || 1;
}

// Custom objectives map for HTML lessons to look premium and authentic
const LESSON_OBJECTIVES = {
  1: ["Entender qué es HTML y sus bloques", "Conocer las etiquetas más comunes", "Crear tu primer archivo web"],
  2: ["Dominar la estructura <!DOCTYPE>", "Configurar head, title y body", "Vincular archivos externos"],
  3: ["Uso correcto de encabezados h1-h6", "Formatear párrafos con texto", "Aprender saltos de línea y separadores"],
  4: ["Insertar imágenes con etiqueta img", "Configurar rutas relativas y absolutas", "Añadir texto alternativo alt para accesibilidad"],
  5: ["Crear hipervínculos con anclas a", "Dominar el atributo href", "Abrir enlaces en pestañas nuevas"],
  6: ["Crear listas ordenadas y desordenadas", "Estructurar tablas con tr y td", "Organizar datos jerárquicamente"],
  7: ["Construir formularios de registro", "Añadir inputs de texto, email y password", "Utilizar botones de envío tipo submit"],
  8: ["Agrupar elementos con etiquetas div", "Uso de span para textos específicos", "Preparar la estructura para aplicar CSS"],
  9: ["Uso correcto de comentarios de código", "Documentar secciones importantes", "Buenas prácticas de indentación"]
};

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
  const objectivesList = LESSON_OBJECTIVES[lesson.lessonNumber] || ["Aprender conceptos de este bloque", "Resolver ejercicios prácticos", "Desbloquear recompensas"];
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
