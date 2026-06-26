// Quiz Controller

let currentSlug = '';
let currentQuizNum = 1;
let courseData = null;
let activeQuiz = null;
let currentQuestionIdx = 0;
let isAnswered = false;

function getUrlParams() {
  const parts = window.location.pathname.split('/');
  currentSlug = parts[2] || 'html';
  currentQuizNum = parseInt(parts[4]) || 1;
}

async function loadQuizData() {
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

  // Find active quiz
  activeQuiz = data.quizzes.find(q => q.quizNumber === currentQuizNum);
  if (!activeQuiz) {
    window.location.href = `/curso/${currentSlug}`;
    return;
  }

  // Set rewards numbers
  document.getElementById('quiz-xp-reward').innerText = `+${activeQuiz.rewardXp} XP`;

  // Render question list navigator on left
  renderQuizNav();

  // Render current question
  renderQuestion();
}

function renderQuizNav() {
  const navList = document.getElementById('quiz-nav-list');
  if (!navList) return;

  navList.innerHTML = '';
  activeQuiz.questions.forEach((q, idx) => {
    const li = document.createElement('li');
    const isActive = idx === currentQuestionIdx;
    const isCompleted = idx < currentQuestionIdx;

    li.className = `quiz-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
    li.innerHTML = `<span>Pregunta ${idx + 1}</span>`;
    navList.appendChild(li);
  });
}

function renderQuestion() {
  isAnswered = false;
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('feedback-pane').style.display = 'none';

  const q = activeQuiz.questions[currentQuestionIdx];
  if (!q) return;

  // Set text
  document.getElementById('question-number').innerText = `Pregunta ${currentQuestionIdx + 1} de ${activeQuiz.questions.length}`;
  document.getElementById('question-text').innerText = q.questionText;

  // Set choices
  const container = document.getElementById('options-container');
  container.innerHTML = '';

  q.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = option;
    btn.onclick = () => selectOption(btn, option, q.correctAnswer, q.explanation);
    container.appendChild(btn);
  });

  // Re-highlight left nav
  renderQuizNav();
}

function selectOption(clickedBtn, selectedVal, correctVal, explanation) {
  if (isAnswered) return;
  isAnswered = true;

  const buttons = document.querySelectorAll('.option-btn');
  const feedbackPane = document.getElementById('feedback-pane');
  const feedbackStatus = document.getElementById('feedback-status');
  const feedbackExpl = document.getElementById('feedback-explanation');
  const panel = document.querySelector('.quiz-panel');

  feedbackPane.style.display = 'block';
  feedbackExpl.innerText = explanation || 'Respuesta registrada.';

  // Position for particles
  const rect = clickedBtn.getBoundingClientRect();
  const particleX = rect.left + rect.width / 2;
  const particleY = rect.top + rect.height / 2;

  const isCorrect = selectedVal === correctVal;

  if (isCorrect) {
    clickedBtn.classList.add('selected-correct');
    feedbackPane.className = 'feedback-pane correct';
    feedbackStatus.innerText = '¡Correcto!';
    // Spawn nice emerald green particles
    spawnParticles(particleX, particleY, '#10b981', 25);
  } else {
    clickedBtn.classList.add('selected-incorrect');
    feedbackPane.className = 'feedback-pane incorrect';
    feedbackStatus.innerText = '¡Incorrecto!';
    // Shake panel
    panel.classList.add('shake-anim');
    setTimeout(() => {
      panel.classList.remove('shake-anim');
    }, 500);
    // Spawn redstone particles (red)
    spawnParticles(particleX, particleY, '#ef4444', 15);

    // Highlight the correct one as reference
    buttons.forEach(btn => {
      if (btn.innerText === correctVal) {
        btn.classList.add('selected-correct');
      }
    });
  }

  // Show advance button
  document.getElementById('next-btn').style.display = 'inline-block';
}

async function advanceQuiz() {
  if (currentQuestionIdx < activeQuiz.questions.length - 1) {
    currentQuestionIdx += 1;
    renderQuestion();
  } else {
    // End of quiz! Submit progress to backend
    await apiFetch(`/progress/${currentSlug}/quiz/${currentQuizNum}`, {
      method: 'POST'
    });

    // Spawn victory golden particles
    const btn = document.getElementById('next-btn');
    const rect = btn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#fbbf24', 40);

    setTimeout(() => {
      // Redirect back to course view
      window.location.href = `/curso/${currentSlug}`;
    }, 1200);
  }
}

function goBackToCourse() {
  window.location.href = `/curso/${currentSlug}`;
}

document.addEventListener('DOMContentLoaded', loadQuizData);
