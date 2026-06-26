// LyraCode Shared Navbar and Stats Tracker

const AVATAR_MAP = {
  steve: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23a1724e'/%3E%3Crect x='1' y='1' width='6' height='3' fill='%23543d2b'/%3E%3Crect x='1' y='4' width='1' height='1' fill='%23fff'/%3E%3Crect x='2' y='4' width='1' height='1' fill='%230000ff'/%3E%3Crect x='5' y='4' width='1' height='1' fill='%23fff'/%3E%3Crect x='6' y='4' width='1' height='1' fill='%230000ff'/%3E%3Crect x='2' y='5' width='4' height='1' fill='%2370422d'/%3E%3Crect x='3' y='6' width='2' height='1' fill='%23800808'/%3E%3C/svg%3E",
  alex: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23e0a078'/%3E%3Crect x='0' y='0' width='8' height='3' fill='%23e06000'/%3E%3Crect x='0' y='3' width='1' height='4' fill='%23e06000'/%3E%3Crect x='7' y='3' width='1' height='4' fill='%23e06000'/%3E%3Crect x='1' y='4' width='1' height='1' fill='%23fff'/%3E%3Crect x='2' y='4' width='1' height='1' fill='%2300aa55'/%3E%3Crect x='5' y='4' width='1' height='1' fill='%23fff'/%3E%3Crect x='6' y='4' width='1' height='1' fill='%2300aa55'/%3E%3Crect x='2' y='6' width='4' height='1' fill='%23d08060'/%3E%3C/svg%3E",
  zombie: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23508050'/%3E%3Crect x='1' y='1' width='6' height='2' fill='%23204020'/%3E%3Crect x='1' y='4' width='2' height='1' fill='%2390ff90'/%3E%3Crect x='5' y='4' width='2' height='1' fill='%2390ff90'/%3E%3Crect x='2' y='6' width='4' height='1' fill='%23305030'/%3E%3C/svg%3E",
  creeper: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23469e38'/%3E%3Crect x='1' y='2' width='2' height='2' fill='%230a0f0d'/%3E%3Crect x='5' y='2' width='2' height='2' fill='%230a0f0d'/%3E%3Crect x='3' y='4' width='2' height='2' fill='%230a0f0d'/%3E%3Crect x='2' y='5' width='4' height='2' fill='%230a0f0d'/%3E%3Crect x='2' y='7' width='1' height='1' fill='%23469e38'/%3E%3Crect x='5' y='7' width='1' height='1' fill='%23469e38'/%3E%3C/svg%3E",
  enderman: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23161616'/%3E%3Crect x='1' y='4' width='2' height='1' fill='%23cc00cc'/%3E%3Crect x='5' y='4' width='2' height='1' fill='%23cc00cc'/%3E%3Crect x='2' y='4' width='1' height='1' fill='%23ff99ff'/%3E%3Crect x='6' y='4' width='1' height='1' fill='%23ff99ff'/%3E%3C/svg%3E"
};

async function loadUserStats() {
  const token = localStorage.getItem('lyracode_token');
  if (!token) return;

  const user = await apiFetch('/auth/user');
  if (!user) return;

  // Set coins & gems
  const coinsEl = document.getElementById('stat-coins');
  const gemsEl = document.getElementById('stat-gems');
  const levelEl = document.getElementById('stat-level');
  const xpEl = document.getElementById('stat-xp');
  const xpBarEl = document.getElementById('stat-xp-bar');
  const avatarEl = document.getElementById('stat-avatar');

  if (coinsEl) coinsEl.innerText = user.coins;
  if (gemsEl) gemsEl.innerText = user.gems;
  if (levelEl) levelEl.innerText = `Nivel ${user.level}`;
  
  const xpNeeded = user.level * 500;
  if (xpEl) xpEl.innerText = `${user.xp} / ${xpNeeded} XP`;
  
  if (xpBarEl) {
    const percent = Math.min((user.xp / xpNeeded) * 100, 100);
    xpBarEl.style.width = `${percent}%`;
  }

  if (avatarEl) {
    avatarEl.src = AVATAR_MAP[user.avatar] || AVATAR_MAP.steve;
  }
}

// Highlight active menu item
function highlightActiveNav() {
  const pathname = window.location.pathname;
  const mapNav = document.getElementById('nav-courses');
  const routeNav = document.getElementById('nav-routes');
  const missionNav = document.getElementById('nav-missions');
  const inventoryNav = document.getElementById('nav-inventory');
  const profileNav = document.getElementById('nav-profile');

  // Clear active state first
  if (mapNav) mapNav.classList.remove('active');
  if (routeNav) routeNav.classList.remove('active');
  if (missionNav) missionNav.classList.remove('active');
  if (inventoryNav) inventoryNav.classList.remove('active');
  if (profileNav) profileNav.classList.remove('active');

  if (pathname.includes('/rutas') || pathname.includes('/curso')) {
    if (routeNav) routeNav.classList.add('active');
  } else if (pathname.includes('/courses')) {
    if (mapNav) mapNav.classList.add('active');
  } else if (pathname.includes('/misiones')) {
    if (missionNav) missionNav.classList.add('active');
  } else if (pathname.includes('/inventario')) {
    if (inventoryNav) inventoryNav.classList.add('active');
  } else if (pathname.includes('/perfil')) {
    if (profileNav) profileNav.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadUserStats();
  highlightActiveNav();
});
