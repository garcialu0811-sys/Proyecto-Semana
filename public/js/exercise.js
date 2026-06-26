// Exercise Workspace Controller

let currentSlug = '';
let currentExerciseNum = 1;
let courseData = null;
let activeExercise = null;
let codeEditor = null;

function getUrlParams() {
  const parts = window.location.pathname.split('/');
  currentSlug = parts[2] || 'html';
  currentExerciseNum = parseInt(parts[4]) || 1;
}

async function loadExerciseWorkspace() {
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

  // Find active exercise
  activeExercise = data.exercises.find(ex => ex.exerciseNumber === currentExerciseNum);
  if (!activeExercise) {
    window.location.href = `/curso/${currentSlug}`;
    return;
  }

  // Populate data
  document.getElementById('exercise-step-label').innerText = `Ejercicio ${activeExercise.exerciseNumber} de ${data.exercises.length}`;
  document.getElementById('exercise-title-badge').innerText = activeExercise.title;
  document.getElementById('exercise-desc').innerText = activeExercise.description || "Crea la estructura solicitada aplicando tus conocimientos del curso.";
  document.getElementById('exercise-instructions').innerText = activeExercise.instructions;

  // Initialize CodeMirror Editor
  const wrapper = document.getElementById('codemirror-wrapper');
  wrapper.innerHTML = ''; // reset

  let editorMode = 'xml'; // default HTML
  if (currentSlug === 'css') editorMode = 'css';
  else if (currentSlug === 'js' || currentSlug === 'node' || currentSlug === 'express') editorMode = 'javascript';

  codeEditor = CodeMirror(wrapper, {
    value: activeExercise.initialCode || '',
    mode: editorMode,
    theme: 'dracula',
    lineNumbers: true,
    lineWrapping: true
  });

  // Render Initial Preview
  updateLivePreview();

  // Listen to changes for live preview
  codeEditor.on('change', () => {
    updateLivePreview();
  });

  // Render left sidebar navigation list
  const completedSet = new Set(data.progress.exercisesCompleted);
  renderExercisesNav(completedSet);
}

function updateLivePreview() {
  const iframe = document.getElementById('live-preview');
  if (!iframe || !codeEditor) return;
  
  const code = codeEditor.getValue();
  iframe.srcdoc = code;
}

function renderExercisesNav(completedSet) {
  const navList = document.getElementById('exercises-nav-list');
  if (!navList) return;

  navList.innerHTML = '';
  courseData.exercises.forEach(ex => {
    const li = document.createElement('li');
    const isActive = ex.exerciseNumber === currentExerciseNum;
    const isDone = completedSet.has(ex.exerciseNumber);

    li.className = `exercise-nav-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`;
    li.onclick = () => {
      window.location.href = `/curso/${currentSlug}/ejercicio/${ex.exerciseNumber}`;
    };
    li.innerHTML = `
      <span>Ejercicio ${ex.exerciseNumber}</span>
      <span class="lesson-nav-status-icon ${isDone ? 'check' : ''}"></span>
    `;
    navList.appendChild(li);
  });
}

function goBackToCourse() {
  window.location.href = `/curso/${currentSlug}`;
}

async function verifyExerciseCode() {
  const code = codeEditor.getValue();
  const errorBox = document.getElementById('feedback-error-box');
  const successBox = document.getElementById('feedback-success-box');
  const panel = document.querySelector('.workspace-editor-panel');

  errorBox.style.display = 'none';
  successBox.style.display = 'none';

  // Get DOM elements of the live preview for rule evaluation
  const iframe = document.getElementById('live-preview');
  let iframeDoc = null;
  try {
    iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  } catch (err) {
    console.warn('No se puede acceder al documento del iframe de ejercicio:', err);
  }

  let passed = true;
  let currentError = '';

  if (!iframeDoc) {
    passed = false;
    currentError = 'La vista previa no se ha cargado correctamente. Inténtalo de nuevo.';
  } else {
    for (const rule of activeExercise.validationRules) {
      if (rule.selector) {
        const el = iframeDoc.querySelector(rule.selector);
        if (!el) {
          passed = false;
          currentError = rule.errorMsg;
          break;
        }

        if (rule.containsText) {
          if (!el.innerText.toLowerCase().includes(rule.containsText.toLowerCase())) {
            passed = false;
            currentError = rule.errorMsg;
            break;
          }
        }

        if (rule.attribute) {
          const val = el.getAttribute(rule.attribute);
          if (!val || (rule.attributeValue && val !== rule.attributeValue)) {
            passed = false;
            currentError = rule.errorMsg;
            break;
          }
        }
      }

      if (rule.regexMatch) {
        const regex = new RegExp(rule.regexMatch, 'i');
        if (!regex.test(code)) {
          passed = false;
          currentError = rule.errorMsg;
          break;
        }
      }
    }
  }

  if (!passed) {
    // Show error box
    errorBox.innerText = currentError;
    errorBox.style.display = 'block';

    // Shake animation
    panel.classList.add('shake-anim');
    setTimeout(() => {
      panel.classList.remove('shake-anim');
    }, 500);

    // Spawn redstone particles (red)
    const btn = document.getElementById('btn-verify');
    const rect = btn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ef4444', 15);
  } else {
    // Show success
    successBox.style.display = 'block';

    // Spawn green particles
    const btn = document.getElementById('btn-verify');
    const rect = btn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, '#63ff3f', 35);

    // Call API to complete exercise
    await apiFetch(`/progress/${currentSlug}/exercise/${currentExerciseNum}`, {
      method: 'POST'
    });

    // Go to next step
    setTimeout(() => {
      // Find next exercise
      const nextEx = courseData.exercises.find(ex => ex.exerciseNumber === currentExerciseNum + 1);
      if (nextEx) {
        window.location.href = `/curso/${currentSlug}/ejercicio/${nextEx.exerciseNumber}`;
      } else {
        // Go back to course dashboard or Quiz
        const quiz = courseData.quizzes.find(q => q.lessonNumber === activeExercise.lessonNumber);
        if (quiz) {
          window.location.href = `/curso/${currentSlug}/quiz/${quiz.quizNumber}`;
        } else {
          window.location.href = `/curso/${currentSlug}`;
        }
      }
    }, 1500);
  }
}

document.addEventListener('DOMContentLoaded', loadExerciseWorkspace);
