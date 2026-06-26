// LyraCode Missions Dashboard Controller

let cachedUser = null;
let cachedMissions = [];
let activeTab = 'diarias';
let countdownInterval = null;

async function initMissionsPage() {
  cachedUser = await apiFetch('/auth/user');
  cachedMissions = await apiFetch('/missions');
  
  if (!cachedUser || !cachedMissions) return;

  // Sincronizar estadísticas en la cabecera del top
  updateSidebarStats(cachedUser, cachedMissions);
  
  // Registrar listeners de pestañas
  setupTabs();

  // Renderizar la vista inicial
  renderActiveTab();
}

function updateSidebarStats(user, missions) {
  // Stats del sidebar izquierdo (Racha)
  const sidebarStreakDays = document.getElementById('sidebar-streak-days');
  const sidebarStreakProgress = document.getElementById('sidebar-streak-progress');

  if (sidebarStreakDays) {
    sidebarStreakDays.innerText = `${user.streak} ${user.streak === 1 ? 'día' : 'días'}`;
  }

  if (sidebarStreakProgress) {
    sidebarStreakProgress.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
      const block = document.createElement('div');
      block.className = `streak-block ${user.streak >= i ? 'active' : ''}`;
      sidebarStreakProgress.appendChild(block);
    }
    const chest = document.createElement('div');
    chest.className = 'streak-chest';
    sidebarStreakProgress.appendChild(chest);
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll('.mission-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.getAttribute('data-tab');
      renderActiveTab();
    });
  });
}

function renderActiveTab() {
  const workspace = document.getElementById('missions-workspace-content');
  const bottomBar = document.getElementById('missions-bottom-reward-bar');
  const bannerTitle = document.getElementById('banner-title-text');
  const bannerSubtitle = document.getElementById('banner-subtitle-text');
  const heroLandscape = document.getElementById('header-hero-landscape');

  if (!workspace || !bottomBar || !bannerTitle || !bannerSubtitle || !heroLandscape) return;

  // Limpiar timers anteriores
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  // Restaurar clases por defecto
  heroLandscape.className = 'header-hero-landscape';
  heroLandscape.innerHTML = `
    <div class="hero-avatar-steve"></div>
    <div class="hero-avatar-wolf"></div>
    <div class="hero-avatar-campfire"></div>
  `;

  // Extraer progreso de base de datos
  const lessonsM = cachedMissions.find(m => m.targetType === 'lessons') || { currentValue: 0 };
  const exercisesM = cachedMissions.find(m => m.targetType === 'exercises') || { currentValue: 0 };
  const quizzesM = cachedMissions.find(m => m.targetType === 'quizzes') || { currentValue: 0 };
  const projectsM = cachedMissions.find(m => m.targetType === 'projects') || { currentValue: 0 };

  const userLessons = lessonsM.currentValue;
  const userExercises = exercisesM.currentValue;
  const userQuizzes = quizzesM.currentValue;
  const userProjects = projectsM.currentValue;

  if (activeTab === 'diarias') {
    bannerTitle.innerText = 'Misiones';
    bannerSubtitle.innerText = 'Completa misiones diarias para ganar XP, monedas y recompensas épicas.';
    
    renderDiarias(workspace, bottomBar, userLessons, userExercises, userQuizzes);
    startCountdown('diarias');
  } else if (activeTab === 'semanales') {
    bannerTitle.innerText = 'Misiones';
    bannerSubtitle.innerText = 'Completa misiones semanales para ganar grandes recompensas.';
    
    renderSemanales(workspace, bottomBar, userLessons, userExercises, userQuizzes, userProjects);
    startCountdown('semanales');
  } else if (activeTab === 'desafios') {
    bannerTitle.innerText = 'Misiones';
    bannerSubtitle.innerText = 'Acepta desafíos especiales y demuestra tu habilidad.';
    
    // Cambiar a fondo del Nether Portal
    heroLandscape.classList.add('nether-portal-bg');
    heroLandscape.innerHTML = `
      <div class="portal-glowing-core"></div>
    `;

    renderDesafios(workspace, bottomBar, userLessons, userExercises, userProjects);
  } else if (activeTab === 'logros') {
    bannerTitle.innerText = 'Misiones';
    bannerSubtitle.innerText = 'Completa logros y deja tu huella en LyraCode.';
    
    renderLogros(workspace, bottomBar, cachedUser, userLessons, userExercises, userQuizzes, userProjects);
  }
}

// ------------------------------------------------
// RENDERERS
// ------------------------------------------------

function renderDiarias(workspace, bottomBar, lessons, exercises, quizzes) {
  workspace.innerHTML = '';
  
  const data = [
    {
      title: 'Completa 3 lecciones',
      description: 'Aprende nuevos conceptos cada día.',
      icon: 'GRASS_BLOCK.png',
      target: 3,
      current: lessons,
      xp: 150,
      coins: 50,
      gems: 4
    },
    {
      title: 'Resuelve 5 ejercicios',
      description: 'Pon a prueba tus habilidades.',
      icon: 'IRON_SWORD.png',
      target: 5,
      current: exercises,
      xp: 100,
      coins: 40,
      gems: 3
    },
    {
      title: 'Practica 20 minutos',
      description: 'La práctica hace al maestro.',
      icon: 'CLOCK.png',
      target: 20,
      current: Math.min(lessons * 5 + exercises * 3, 20),
      xp: 50,
      coins: 20,
      gems: 2
    },
    {
      title: 'Aprobar 2 quizzes',
      description: 'Demuestra lo que has aprendido.',
      icon: 'CRAFTING_TABLE.png',
      target: 2,
      current: quizzes,
      xp: 200,
      coins: 80,
      gems: 5
    }
  ];

  const listContainer = document.createElement('div');
  listContainer.className = 'missions-horizontal-list';

  let completedCnt = 0;

  data.forEach(m => {
    const isDone = m.current >= m.target;
    if (isDone) completedCnt++;

    const percent = Math.min((m.current / m.target) * 100, 100);

    const card = document.createElement('div');
    card.className = `mission-h-card ${isDone ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="mission-h-left">
        <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/${m.icon}" alt="${m.title}" class="mission-h-icon">
        <div class="mission-h-info">
          <h3 class="mission-h-title">${m.title}</h3>
          <p class="mission-h-desc">${m.description}</p>
          <div class="progress-h-row">
            <div class="progress-bar-mc">
              <div class="progress-fill-mc" style="width: ${percent}%;"></div>
            </div>
            <span class="progress-text-mc">${m.current}/${m.target}</span>
          </div>
        </div>
      </div>

      <div class="mission-h-rewards">
        <span class="rewards-caps-header">Recompensa</span>
        <div class="rewards-row-mini">
          <div class="reward-pill-mc xp-pill" title="XP">
            <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/EXPERIENCE_BOTTLE.png" alt="XP" class="reward-item-mc-icon">
            <span>+${m.xp} XP</span>
          </div>
          <div class="reward-pill-mc gold-pill" title="Monedas">
            <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/GOLD_NUGGET.png" alt="Monedas" class="reward-item-mc-icon">
            <span>+${m.coins}</span>
          </div>
          <div class="reward-pill-mc emerald-pill" title="Esmeraldas">
            <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/EMERALD.png" alt="Esmeraldas" class="reward-item-mc-icon">
            <span>+${m.gems}</span>
          </div>
        </div>
      </div>

      <div class="mission-h-action">
        ${isDone ? `
          <span style="color: #63FF3F; font-family: var(--font-pixel); font-size: 8px;">✔ Hecho</span>
        ` : `
          <button class="mc-btn dark-flat" onclick="window.location.href='/courses'">Ir ahora ➔</button>
        `}
      </div>
    `;
    listContainer.appendChild(card);
  });

  workspace.appendChild(listContainer);

  // Bottom Reward Bar configuration
  const bottomBarPercent = (completedCnt / 4) * 100;
  bottomBar.innerHTML = `
    <div class="bottom-bar-left">
      <span class="bottom-bar-text">Todas las misiones diarias completadas:</span>
      <div class="bottom-bar-progress">
        <div class="progress-bar-mc" style="height: 10px;">
          <div class="progress-fill-mc" style="width: ${bottomBarPercent}%;"></div>
        </div>
        <span class="progress-text-mc">${completedCnt}/4</span>
      </div>
    </div>
    <div class="bottom-chest-wrapper">
      <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/CHEST.png" alt="Cofre" class="bottom-epic-chest-img float-anim" style="filter: drop-shadow(0 0 8px rgba(168,85,255,0.4));">
    </div>
  `;
}

function renderSemanales(workspace, bottomBar, lessons, exercises, quizzes, projects) {
  workspace.innerHTML = '';

  const data = [
    {
      title: 'Completa 15 lecciones',
      description: 'Sigue aprendiendo cada día.',
      icon: 'EXPERIENCE_BOTTLE.png',
      target: 15,
      current: lessons,
      xp: 500,
      gems: 15,
      progressText: `${lessons}/${15}`
    },
    {
      title: 'Resuelve 25 ejercicios',
      description: 'La práctica constante te hace mejor.',
      icon: 'EMERALD.png',
      target: 25,
      current: exercises,
      xp: 200,
      gems: 20,
      progressText: `${exercises}/${25}`
    },
    {
      title: 'Practica 2 horas',
      description: 'Dedica tiempo a perfeccionar tus skills.',
      icon: 'DIAMOND_PICKAXE.png',
      target: 120, // 120 minutos
      current: Math.min(lessons * 15 + exercises * 10, 120),
      xp: 750,
      gems: 20,
      progressText: `${Math.floor(Math.min(lessons * 15 + exercises * 10, 120) / 60)}h ${Math.min(lessons * 15 + exercises * 10, 120) % 60}m / 2h`
    },
    {
      title: 'Aprobar 5 quizzes',
      description: 'Pon a prueba tu conocimiento.',
      icon: 'SPAWNER.png', // Fallback to furnace if spawner is missing, but let's request Spawner
      target: 5,
      current: quizzes,
      xp: 400,
      gems: 15,
      progressText: `${quizzes}/${5}`
    },
    {
      title: 'Avanzar en un proyecto',
      description: 'Trabaja en tu proyecto final.',
      icon: 'END_PORTAL_FRAME.png',
      target: 1,
      current: projects,
      xp: 1000,
      gems: 25,
      progressText: `${projects}/${1}`
    }
  ];

  const grid = document.createElement('div');
  grid.className = 'missions-vertical-grid';

  let completedCnt = 0;

  data.forEach(m => {
    const isDone = m.current >= m.target;
    if (isDone) completedCnt++;

    const percent = Math.min((m.current / m.target) * 100, 100);

    // Spawner icon fallback
    let iconUrl = `https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/${m.icon}`;
    if (m.icon === 'SPAWNER.png') {
      iconUrl = 'https://raw.githubusercontent.com/Owen1212055/mc-assets/main/block-assets/SPAWNER.png'; // blocks path
    }

    const card = document.createElement('div');
    card.className = `mission-v-card ${isDone ? 'completed' : ''}`;
    card.innerHTML = `
      <img src="${iconUrl}" alt="${m.title}" class="mission-v-icon">
      <h3 class="mission-v-title">${m.title}</h3>
      <p class="mission-v-desc">${m.description}</p>
      
      <div class="progress-v-container">
        <div class="progress-bar-mc">
          <div class="progress-fill-mc" style="width: ${percent}%;"></div>
        </div>
        <span class="progress-v-text">${m.progressText}</span>
      </div>

      <div class="mission-v-rewards">
        <span class="rewards-caps-header">Recompensa</span>
        <div class="reward-pill-mc xp-pill">
          <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/EXPERIENCE_BOTTLE.png" alt="XP" class="reward-item-mc-icon">
          <span>+${m.xp} XP</span>
        </div>
        <div class="reward-pill-mc emerald-pill">
          <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/EMERALD.png" alt="Esmeralda" class="reward-item-mc-icon">
          <span>+${m.gems}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  workspace.appendChild(grid);

  // Bottom Reward Bar configuration
  const bottomBarPercent = (completedCnt / 5) * 100;
  bottomBar.innerHTML = `
    <div class="bottom-bar-left">
      <span class="bottom-bar-text" style="color: #a855ff; font-weight: bold;">Misiones semanales completadas:</span>
      <div class="bottom-bar-progress">
        <div class="progress-bar-mc" style="height: 10px;">
          <div class="progress-fill-mc" style="width: ${bottomBarPercent}%; background-color: #a855ff; box-shadow: 0 0 8px rgba(168,85,255,0.45);"></div>
        </div>
        <span class="progress-text-mc" style="color: #a855ff;">${completedCnt}/5</span>
      </div>
    </div>
    <div class="bottom-chest-wrapper">
      <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/CHEST.png" alt="Cofre Semanal" class="bottom-epic-chest-img float-anim" style="filter: hue-rotate(280deg) drop-shadow(0 0 10px rgba(168,85,255,0.6));">
    </div>
  `;
}

function renderDesafios(workspace, bottomBar, lessons, exercises, projects) {
  workspace.innerHTML = '';

  const data = [
    {
      title: 'Desafío de código',
      description: 'Completa retos de código avanzados.',
      icon: 'CREEPER',
      target: 3,
      current: exercises >= 3 ? 3 : exercises,
      xp: 800,
      coins: 250,
      special: 'Épico'
    },
    {
      title: 'Batalla de clanes',
      description: 'Compite con tu clan y sube en el ranking.',
      icon: 'DIAMOND_SWORD.png',
      target: 1,
      current: lessons >= 5 ? 1 : 0,
      xp: 1200,
      coins: 400,
      special: 'Épico'
    },
    {
      title: 'Cazador de cofres',
      description: 'Encuentra todos los cofres ocultos.',
      icon: 'CHEST.png',
      target: 10,
      current: Math.min(exercises * 2, 10),
      xp: 600,
      coins: 200,
      special: ''
    },
    {
      title: 'Ayuda a los aldeanos',
      description: 'Completa misiones especiales.',
      icon: 'VILLAGER.png',
      target: 5,
      current: Math.min(projects * 2 + lessons, 5),
      xp: 400,
      coins: 150,
      special: ''
    }
  ];

  const listContainer = document.createElement('div');
  listContainer.className = 'missions-horizontal-list mystical-theme-area';

  data.forEach(m => {
    const isDone = m.current >= m.target;
    const percent = Math.min((m.current / m.target) * 100, 100);

    let iconHtml = '';
    if (m.icon === 'CREEPER') {
      iconHtml = `<div class="creeper-logo-icon" style="width: 36px; height: 36px; background-size: contain; flex-shrink: 0; filter: drop-shadow(0 0 6px rgba(99,255,63,0.4));"></div>`;
    } else if (m.icon === 'VILLAGER.png') {
      iconHtml = `<img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/WRITTEN_BOOK.png" alt="Aldeano" class="mission-h-icon" style="filter: hue-rotate(90deg);">`;
    } else {
      iconHtml = `<img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/${m.icon}" alt="${m.title}" class="mission-h-icon">`;
    }

    const card = document.createElement('div');
    card.className = `mission-h-card ${isDone ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="mission-h-left">
        ${iconHtml}
        <div class="mission-h-info">
          <h3 class="mission-h-title">${m.title}</h3>
          <p class="mission-h-desc">${m.description}</p>
          <div class="progress-h-row">
            <div class="progress-bar-mc">
              <div class="progress-fill-mc" style="width: ${percent}%;"></div>
            </div>
            <span class="progress-text-mc">${m.current}/${m.target}</span>
          </div>
        </div>
      </div>

      <div class="mission-h-rewards">
        <span class="rewards-caps-header">Recompensa</span>
        <div class="rewards-row-mini">
          <div class="reward-pill-mc xp-pill">
            <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/EXPERIENCE_BOTTLE.png" alt="XP" class="reward-item-mc-icon">
            <span>+${m.xp} XP</span>
          </div>
          <div class="reward-pill-mc gold-pill">
            <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/GOLD_NUGGET.png" alt="Monedas" class="reward-item-mc-icon">
            <span>+${m.coins}</span>
          </div>
          ${m.special ? `
            <div class="reward-special-text">${m.special}</div>
          ` : ''}
        </div>
      </div>

      <div class="mission-h-action">
        <button class="mc-btn dark-flat" onclick="window.location.href='/courses'">Ver desafío ➔</button>
      </div>
    `;
    listContainer.appendChild(card);
  });

  workspace.appendChild(listContainer);

  // Bottom reward area for Desafíos (Creeper)
  bottomBar.innerHTML = `
    <div class="bottom-bar-left">
      <span class="bottom-bar-text" style="color: #63FF3F;">Los desafíos cambian cada semana. ¡No te los pierdas!</span>
    </div>
    <div class="creeper-asomando-wrapper"></div>
  `;
}

function renderLogros(workspace, bottomBar, user, lessons, exercises, quizzes, projects) {
  workspace.innerHTML = '';

  const data = [
    {
      title: 'Primeros pasos',
      description: 'Completa tu primera lección.',
      icon: 'GOLDEN_CARROT.png',
      target: 1,
      current: lessons,
      type: 'gold'
    },
    {
      title: 'Estudiante dedicado',
      description: 'Completa 100 lecciones.',
      icon: 'GOLD_INGOT.png',
      target: 100,
      current: lessons,
      type: 'gold'
    },
    {
      title: 'Maestro del código',
      description: 'Resuelve 500 ejercicios.',
      icon: 'DIAMOND.png',
      target: 500,
      current: exercises,
      type: 'gold'
    },
    {
      title: 'Explorador',
      description: 'Completa 5 rutas de aprendizaje.',
      icon: 'IRON_INGOT.png',
      target: 5,
      current: Math.round(lessons / 3),
      type: 'silver'
    },
    {
      title: 'Quiz experto',
      description: 'Aprueba 50 quizzes.',
      icon: 'BOOK.png',
      target: 50,
      current: quizzes,
      type: 'silver'
    },
    {
      title: 'Programador junior',
      description: 'Completa tu primer proyecto.',
      icon: 'RAW_COPPER.png',
      target: 1,
      current: projects,
      type: 'copper'
    },
    {
      title: 'Racha imparable',
      description: 'Mantén tu racha 7 días seguidos.',
      icon: 'COOKIE.png',
      target: 7,
      current: user.streak,
      type: 'bronze'
    },
    {
      title: 'Leyenda',
      description: 'Completa todos los logros.',
      icon: 'NETHERITE_INGOT.png',
      target: 8,
      current: 0, // Calculado dinámicamente
      type: 'locked'
    }
  ];

  // Calcular logros completados
  let completedCount = 0;
  data.forEach((ach, index) => {
    if (index < 7 && ach.current >= ach.target) {
      completedCount++;
    }
  });
  data[7].current = completedCount; // 'Leyenda' progress

  const grid = document.createElement('div');
  grid.className = 'achievements-grid';

  data.forEach((ach, index) => {
    const isDone = ach.current >= ach.target;
    const isLocked = index === 7 && !isDone;
    const percent = Math.min((ach.current / ach.target) * 100, 100);

    const card = document.createElement('div');
    card.className = `achievement-card ${isDone ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
    
    card.innerHTML = `
      <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/${ach.icon}" alt="${ach.title}" class="achievement-badge">
      <h3 class="achievement-title">${ach.title}</h3>
      <p class="achievement-desc">${ach.description}</p>
      
      <div class="progress-v-container" style="margin-bottom: 10px; width: 100%;">
        <div class="progress-bar-mc">
          <div class="progress-fill-mc" style="width: ${percent}%; background-color: ${isDone ? '#63FF3F' : '#ffbe33'};"></div>
        </div>
        <span class="progress-v-text" style="color: ${isDone ? '#63FF3F' : '#b5bcc7'};">${percent.toFixed(0)}%</span>
      </div>

      <div class="achievement-status-row ${isDone ? 'unlocked' : 'locked-txt'}">
        ${isDone ? '✔ Completado' : isLocked ? '🔒 Bloqueado' : `${ach.current}/${ach.target}`}
      </div>
    `;
    grid.appendChild(card);
  });

  workspace.appendChild(grid);

  // Bottom Reward Bar configuration
  bottomBar.innerHTML = `
    <div class="bottom-bar-left">
      <span class="bottom-bar-text">Sigue completando logros para ganar recompensas exclusivas.</span>
    </div>
    <div class="bottom-chest-wrapper">
      <img src="https://raw.githubusercontent.com/Owen1212055/mc-assets/main/item-assets/CHEST.png" alt="Cofre de Oro" class="bottom-epic-chest-img float-anim" style="filter: drop-shadow(0 0 8px rgba(255,190,51,0.5));">
    </div>
  `;
}

function startCountdown(type) {
  const countdownRow = document.getElementById('timer-countdown-row');
  if (!countdownRow) return;

  function updateTimer() {
    const now = new Date();
    const nextReset = new Date();
    
    if (type === 'diarias') {
      nextReset.setHours(24, 0, 0, 0); // Siguiente medianoche
      let diff = nextReset.getTime() - now.getTime();
      if (diff < 0) diff = 0;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      countdownRow.innerHTML = `Nuevas misiones en: <span class="timer-green-highlight">${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s</span>`;
    } else if (type === 'semanales') {
      // Siguiente lunes a medianoche
      const day = now.getDay();
      const distance = (8 - day) % 7 || 7; 
      nextReset.setDate(now.getDate() + distance);
      nextReset.setHours(0, 0, 0, 0);
      
      let diff = nextReset.getTime() - now.getTime();
      if (diff < 0) diff = 0;
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      countdownRow.innerHTML = `Resta: <span class="timer-green-highlight">${days}d ${hours}h ${minutes}m</span>`;
    } else {
      countdownRow.innerHTML = '';
    }
  }

  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
}

document.addEventListener('DOMContentLoaded', initMissionsPage);
