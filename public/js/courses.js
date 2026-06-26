// Courses page controller

const PET_SPRITES = {
  wolf: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23d1d1d1'/%3E%3Crect x='1' y='1' width='2' height='1' fill='%23808080'/%3E%3Crect x='5' y='1' width='2' height='1' fill='%23808080'/%3E%3Crect x='1' y='4' width='1' height='1' fill='%23000'/%3E%3Crect x='6' y='4' width='1' height='1' fill='%23000'/%3E%3Crect x='3' y='5' width='2' height='2' fill='%239e2a2b'/%3E%3C/svg%3E",
  slime_pet: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%2370c070'/%3E%3Crect x='1' y='3' width='2' height='2' fill='%23104010'/%3E%3Crect x='5' y='3' width='2' height='2' fill='%23104010'/%3E%3Crect x='2' y='6' width='4' height='1' fill='%23104010'/%3E%3C/svg%3E"
};

async function loadCourses() {
  const data = await apiFetch('/courses');
  if (!data) return;

  const container = document.getElementById('courses-list');
  container.innerHTML = '';

  // Determine if it is a new user by checking if there is any course progress
  let totalLessonsDone = 0;
  data.forEach(course => {
    totalLessonsDone += course.progress.lessonsCompleted.length;
  });
  const isNewUser = (totalLessonsDone === 0);

  // Dynamic DOM updates based on user type (New User vs Active User)
  const welcomeTitle = document.getElementById('welcome-title-text');
  const welcomeSubtitle = document.getElementById('welcome-subtitle-text');
  const welcomeHeroActions = document.getElementById('welcome-hero-actions');
  const activeUserElements = document.querySelectorAll('.active-user-only');
  const recIcon = document.getElementById('rec-card1-icon');

  if (isNewUser) {
    if (welcomeTitle) {
      welcomeTitle.innerHTML = '¡Bienvenido a <span class="highlight">LyraCode!</span>';
    }
    if (welcomeSubtitle) {
      welcomeSubtitle.innerHTML = 'Estamos felices de tenerte aquí.<br>Explora rutas y completa misiones para mejorar tus habilidades de programación.';
    }
    if (welcomeHeroActions) {
      welcomeHeroActions.style.display = 'none';
    }
    activeUserElements.forEach(el => el.style.display = 'none');
    if (recIcon) {
      recIcon.src = 'https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/NETHERITE_AXE.png'; // Purple enchanted hammer/axe
    }
  } else {
    if (welcomeTitle) {
      welcomeTitle.innerHTML = '¡Bienvenido de vuelta, <span class="highlight">LyraCoder!</span>';
    }
    if (welcomeSubtitle) {
      welcomeSubtitle.innerHTML = 'Hoy es un gran día para aprender algo nuevo y construir tu futuro en código.';
    }
    if (welcomeHeroActions) {
      welcomeHeroActions.style.display = 'flex';
    }
    activeUserElements.forEach(el => el.style.display = 'flex');
    if (recIcon) {
      recIcon.src = 'https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/ENCHANTED_BOOK.png';
    }
  }

  const COURSE_BLOCKS = {
    html: 'GRASS_BLOCK.png',
    css: 'BLUE_WOOL.png',
    js: 'CAMPFIRE.png',
    node: 'SLIME_BLOCK.png',
    mongodb: 'EMERALD.png'
  };

  const UNLOCKED_SLUGS = ['html', 'css', 'js', 'node', 'mongodb'];
  const RENDERED_SLUGS = ['html', 'css', 'js', 'node', 'mongodb'];

  const DEFAULT_PROGRESS = {
    html: { percent: 38, lessonDone: 3, totalLessons: 12 },
    css: { percent: 20, lessonDone: 2, totalLessons: 10 },
    js: { percent: 12, lessonDone: 1, totalLessons: 15 },
    node: { percent: 8, lessonDone: 1, totalLessons: 14 },
    mongodb: { percent: 0, lessonDone: 0, totalLessons: 14 }
  };

  const sortedCourses = [];
  RENDERED_SLUGS.forEach(slug => {
    const found = data.find(c => c.slug === slug);
    if (found) sortedCourses.push(found);
  });

  sortedCourses.forEach(course => {
    // Calculate progress percentage
    const lessonsDone = course.progress.lessonsCompleted.length;
    const exercisesDone = course.progress.exercisesCompleted.length;
    const quizzesDone = course.progress.quizzesCompleted.length;
    const projectDone = course.progress.projectSubmitted ? 1 : 0;

    let percent, displayLessonsDone, displayTotalLessons;
    const ref = DEFAULT_PROGRESS[course.slug];

    if (isNewUser) {
      percent = 0;
      displayLessonsDone = 0;
      displayTotalLessons = ref ? ref.totalLessons : 10;
    } else if (lessonsDone > 0) {
      // Calculate based on actual DB progress
      let totalItems = 1; // Project
      let totalLessons = 3; // Seeded count
      if (course.slug === 'html') {
        totalItems += 9 + 3 + 1; // 9 lessons, 3 exercises, 1 quiz
        totalLessons = 9;
      } else {
        totalItems += 3 + 1 + 1; // 3 lessons, 1 exercise, 1 quiz
      }
      const itemsDone = lessonsDone + exercisesDone + quizzesDone + projectDone;
      percent = Math.min(Math.round((itemsDone / totalItems) * 100), 100);
      displayLessonsDone = lessonsDone;
      displayTotalLessons = totalLessons;
    } else if (ref) {
      percent = ref.percent;
      displayLessonsDone = ref.lessonDone;
      displayTotalLessons = ref.totalLessons;
    } else {
      percent = 0;
      displayLessonsDone = 0;
      displayTotalLessons = 10;
    }

    const blockName = COURSE_BLOCKS[course.slug] || 'CRAFTING_TABLE.png';
    const isLocked = !UNLOCKED_SLUGS.includes(course.slug);

    const card = document.createElement('div');
    card.className = `course-route-card ${isLocked ? 'locked' : ''}`;
    if (!isLocked) {
      card.onclick = () => {
        window.location.href = `/curso/${course.slug}`;
      };
    }

    if (isLocked) {
      card.innerHTML = `
        <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/${blockName}" alt="${course.name}" class="course-block-icon" style="filter: grayscale(1);">
        <div class="course-route-name">${course.name}</div>
        <div class="course-route-progress">
          <div style="display: flex; justify-content: center; align-items: center; gap: 6px; color: #b5bcc7; font-size: 11px; margin-top: 10px;">
            <span class="icon-lock" style="width: 14px; height: 14px; display: inline-block; filter: invert(0.85); background-size: contain; background-repeat: no-repeat;"></span>
            <span>Bloqueado</span>
          </div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/${blockName}" alt="${course.name}" class="course-block-icon">
        <div class="course-route-name">${course.name}</div>
        <div class="course-route-progress">
          <div class="course-route-progress-bar">
            <div class="course-route-progress-fill" style="width: ${percent}%;"></div>
          </div>
          <div class="course-route-progress-text">
            <span>Lección ${displayLessonsDone} de ${displayTotalLessons}</span>
            <span>${percent}%</span>
          </div>
        </div>
      `;
    }
    container.appendChild(card);
  });
}

async function loadSidebarData() {
  // Load Pet companion
  const user = await apiFetch('/auth/user');
  if (user && user.activePet) {
    const petSprite = document.getElementById('pet-sprite');
    const petName = document.getElementById('pet-name');
    const petDesc = document.getElementById('pet-desc');
    
    if (petSprite) {
      petSprite.style.backgroundImage = `url("${PET_SPRITES[user.activePet] || ''}")`;
      petSprite.style.backgroundColor = 'transparent';
    }
    if (petName) {
      petName.innerText = user.activePet === 'wolf' ? 'Lobo Compañero' : 'Pequeño Slime';
    }
    if (petDesc) {
      petDesc.innerText = 'Tu fiel compañero te acompaña en cada bloque de código!';
    }
  }

  // Load active daily missions
  const missions = await apiFetch('/missions');
  if (!missions) return;

  const mList = document.getElementById('sidebar-missions-list');
  if (!mList) return;

  mList.innerHTML = '';
  // Show only up to 3 daily missions
  const dailyMissions = missions.filter(m => m.type === 'daily').slice(0, 3);

  dailyMissions.forEach(m => {
    const percent = Math.min((m.currentValue / m.targetValue) * 100, 100);
    const div = document.createElement('div');
    div.className = 'mission-item';
    div.innerHTML = `
      <div class="mission-title">${m.title}</div>
      <div class="mission-progress-bar">
        <div class="mission-progress-fill" style="width: ${percent}%;"></div>
      </div>
      <div class="mission-footer">
        <span>${m.currentValue}/${m.targetValue}</span>
        <span class="mission-rewards">+${m.xpReward} XP</span>
      </div>
    `;
    mList.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadCourses();
  loadSidebarData();
});
