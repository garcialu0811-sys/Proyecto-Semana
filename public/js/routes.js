// Routes page controller

async function loadRoutes() {
  const data = await apiFetch('/courses');
  if (!data) return;

  const container = document.getElementById('routes-courses-list');
  container.innerHTML = '';

  const COURSE_BLOCKS = {
    html: 'GRASS_BLOCK.png',
    css: 'BLUE_WOOL.png',
    js: 'CAMPFIRE.png',
    react: 'DIAMOND.png',
    node: 'SLIME_BLOCK.png',
    mongodb: 'EMERALD.png',
    express: 'STONE.png',
    api: 'CRAFTING_TABLE.png',
    proyecto: 'END_PORTAL_FRAME.png'
  };

  const UNLOCKED_SLUGS = ['html', 'css', 'js', 'react', 'node', 'mongodb', 'express', 'api', 'proyecto'];
  const RENDERED_SLUGS = ['html', 'css', 'js', 'react', 'node', 'mongodb', 'express', 'api', 'proyecto'];

  const DEFAULT_PROGRESS = {
    html: { percent: 38, lessonDone: 3, totalLessons: 12 },
    css: { percent: 20, lessonDone: 2, totalLessons: 10 },
    js: { percent: 12, lessonDone: 1, totalLessons: 15 },
    react: { percent: 0, lessonDone: 0, totalLessons: 14 },
    node: { percent: 0, lessonDone: 0, totalLessons: 14 },
    mongodb: { percent: 0, lessonDone: 0, totalLessons: 14 },
    express: { percent: 0, lessonDone: 0, totalLessons: 12 },
    api: { percent: 0, lessonDone: 0, totalLessons: 16 },
    proyecto: { percent: 0, lessonDone: 0, totalLessons: 20 }
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

    if (lessonsDone > 0) {
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

    // Determine lock icon or check
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

document.addEventListener('DOMContentLoaded', () => {
  loadRoutes();
});
