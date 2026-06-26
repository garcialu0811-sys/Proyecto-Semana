// Course details controller

let courseData = null;
let currentSlug = '';

// Extract slug from URL paths: /curso/:slug
function getCourseSlug() {
  const parts = window.location.pathname.split('/');
  return parts[2] || 'html';
}

async function loadCourseDashboard() {
  currentSlug = getCourseSlug();
  const data = await apiFetch(`/courses/${currentSlug}`);
  if (!data) return;

  courseData = data;

  // Set course header details
  document.getElementById('breadcrumb-course-name').innerText = data.course.name.toUpperCase();
  document.getElementById('course-title').innerText = data.course.name;
  document.getElementById('course-desc').innerText = data.course.description;

  // Set large icon image
  const iconImg = document.getElementById('course-main-icon');
  if (iconImg) {
    const COURSE_BLOCKS = {
      html: 'GRASS_BLOCK.png',
      css: 'BLUE_ICE.png',
      js: 'CAMPFIRE.png',
      react: 'DIAMOND_BLOCK.png',
      node: 'SLIME_BLOCK.png',
      mongodb: 'EMERALD.png',
      express: 'STONE.png',
      api: 'CRAFTING_TABLE.png',
      proyecto: 'END_PORTAL_FRAME.png'
    };
    iconImg.src = `https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/${COURSE_BLOCKS[currentSlug] || 'CRAFTING_TABLE.png'}`;
  }

  // Calculate numbers
  const lessonsDone = data.progress.lessonsCompleted.length;
  const exercisesDone = data.progress.exercisesCompleted.length;
  const quizzesDone = data.progress.quizzesCompleted.length;
  const projectDone = data.progress.projectSubmitted ? 1 : 0;

  const totalLessons = data.lessons.length;
  const totalExercises = data.exercises.length;
  const totalQuizzes = data.quizzes.length;
  const totalProject = data.project ? 1 : 0;

  // Render stats counts
  document.getElementById('lessons-count').innerText = `${lessonsDone} de ${totalLessons}`;
  document.getElementById('exercises-count').innerText = `${exercisesDone} de ${totalExercises}`;
  document.getElementById('quizzes-count').innerText = `${quizzesDone} de ${totalQuizzes}`;
  document.getElementById('project-count').innerText = `${projectDone} de ${totalProject}`;

  // Card click handlers
  document.getElementById('card-lessons').onclick = () => {
    if (totalLessons > 0) {
      window.location.href = `/curso/${currentSlug}/leccion/1`;
    }
  };
  document.getElementById('card-exercises').onclick = () => {
    if (totalExercises > 0) {
      window.location.href = `/curso/${currentSlug}/ejercicio/1`;
    }
  };
  document.getElementById('card-quizzes').onclick = () => {
    if (totalQuizzes > 0) {
      window.location.href = `/curso/${currentSlug}/quiz/1`;
    }
  };
  document.getElementById('card-project').onclick = () => {
    if (totalProject > 0) {
      window.location.href = `/curso/${currentSlug}/proyecto`;
    }
  };

  // Calculate and display progress bar percent
  let totalItems = totalLessons + totalExercises + totalQuizzes + totalProject;
  if (totalItems === 0) totalItems = 1; // prevent divide by zero
  const itemsDone = lessonsDone + exercisesDone + quizzesDone + projectDone;
  const percent = Math.min(Math.round((itemsDone / totalItems) * 100), 100);

  document.getElementById('course-progress-percent').innerText = `${percent}% completado`;
  const fillEl = document.getElementById('course-progress-fill');
  if (fillEl) {
    fillEl.style.width = `${percent}%`;
  }
}

document.addEventListener('DOMContentLoaded', loadCourseDashboard);
