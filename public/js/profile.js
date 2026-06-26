// LyraCode Ajustes Dashboard Page Controller

const AVATAR_SVGS = {
  steve: `
    <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
      <rect width="8" height="8" fill="#a1724e"/>
      <rect x="1" y="1" width="6" height="3" fill="#543d2b"/>
      <rect x="1" y="4" width="1" height="1" fill="#fff"/>
      <rect x="2" y="4" width="1" height="1" fill="#0000ff"/>
      <rect x="5" y="4" width="1" height="1" fill="#fff"/>
      <rect x="6" y="4" width="1" height="1" fill="#0000ff"/>
      <rect x="2" y="5" width="4" height="1" fill="#70422d"/>
      <rect x="3" y="6" width="2" height="1" fill="#800808"/>
    </svg>
  `,
  alex: `
    <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
      <rect width="8" height="8" fill="#e0a078"/>
      <rect x="0" y="0" width="8" height="3" fill="#e06000"/>
      <rect x="0" y="3" width="1" height="4" fill="#e06000"/>
      <rect x="7" y="3" width="1" height="4" fill="#e06000"/>
      <rect x="1" y="4" width="1" height="1" fill="#fff"/>
      <rect x="2" y="4" width="1" height="1" fill="#00aa55"/>
      <rect x="5" y="4" width="1" height="1" fill="#fff"/>
      <rect x="6" y="4" width="1" height="1" fill="#00aa55"/>
      <rect x="2" y="6" width="4" height="1" fill="#d08060"/>
    </svg>
  `,
  zombie: `
    <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
      <rect width="8" height="8" fill="#508050"/>
      <rect x="1" y="1" width="6" height="2" fill="#204020"/>
      <rect x="1" y="4" width="2" height="1" fill="#90ff90"/>
      <rect x="5" y="4" width="2" height="1" fill="#90ff90"/>
      <rect x="2" y="6" width="4" height="1" fill="#305030"/>
    </svg>
  `,
  creeper: `
    <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
      <rect width="8" height="8" fill="#469e38"/>
      <rect x="1" y="2" width="2" height="2" fill="#0a0f0d"/>
      <rect x="5" y="2" width="2" height="2" fill="#0a0f0d"/>
      <rect x="3" y="4" width="2" height="2" fill="#0a0f0d"/>
      <rect x="2" y="5" width="4" height="2" fill="#0a0f0d"/>
      <rect x="2" y="7" width="1" height="1" fill="#469e38"/>
      <rect x="5" y="7" width="1" height="1" fill="#469e38"/>
    </svg>
  `,
  enderman: `
    <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
      <rect width="8" height="8" fill="#161616"/>
      <rect x="1" y="4" width="2" height="1" fill="#cc00cc"/>
      <rect x="5" y="4" width="2" height="1" fill="#cc00cc"/>
      <rect x="2" y="4" width="1" height="1" fill="#ff99ff"/>
      <rect x="6" y="4" width="1" height="1" fill="#ff99ff"/>
    </svg>
  `
};

let currentAvatarSelected = 'steve';
let userDbAvatar = 'steve';

// Initial data load
async function loadProfileSettings() {
  const user = await apiFetch('/auth/user');
  if (!user) {
    window.location.href = '/login';
    return;
  }

  // Bind values to inputs
  document.getElementById('input-username').value = user.username;
  document.getElementById('input-email').value = user.email;

  // Set avatar details
  userDbAvatar = user.avatar || 'steve';
  currentAvatarSelected = userDbAvatar;
  updateAvatarPreview(userDbAvatar);

  // Set level stats
  document.getElementById('profile-level-badge-value').innerText = user.level || 7;
  const rankNames = ['Principiante', 'Aprendiz Novato', 'Adepto del Código', 'Guerrero Lógico', 'Artesano de Variables', 'Mago del Bucle', 'Héroe de Datos', 'Maestro Creeper', 'Gran Administrador'];
  const rank = rankNames[Math.min(user.level || 7, rankNames.length - 1)];
  document.getElementById('profile-rank-name').innerText = rank;

  const xpNeeded = (user.level || 7) * 500;
  const currentXp = user.xp || 2450;
  document.getElementById('profile-xp-text').innerText = `${currentXp.toLocaleString()} / ${xpNeeded.toLocaleString()} XP`;
  const xpPercent = Math.min((currentXp / xpNeeded) * 100, 100);
  document.getElementById('profile-xp-bar-fill').style.width = `${xpPercent}%`;

  // Join Date
  if (user.createdAt) {
    const date = new Date(user.createdAt);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('profile-member-date').innerText = date.toLocaleDateString('es-ES', options);
  } else {
    document.getElementById('profile-member-date').innerText = '15 de marzo de 2025';
  }

  // Load preferences from local storage
  syncLocalStoragePreferences();
}

// Update LocalStorage config values on UI elements
function syncLocalStoragePreferences() {
  // Theme selection
  const activeTheme = localStorage.getItem('lyracode_theme') || 'oscuro';
  setInterfaceTheme(activeTheme, false); // apply visual theme without resetting key

  // Difficulty Selector
  const difficulty = localStorage.getItem('lyracode_difficulty') || 'intermedia';
  document.getElementById('difficulty-selector').value = difficulty;

  // Language Selector
  const language = localStorage.getItem('lyracode_language') || 'javascript';
  document.getElementById('language-selector').value = language;

  // Notifications Toggles
  const notifyMissions = localStorage.getItem('lyracode_notify_missions') !== 'false';
  document.getElementById('notify-missions').checked = notifyMissions;

  const notifyPractice = localStorage.getItem('lyracode_notify_practice') !== 'false';
  document.getElementById('notify-practice').checked = notifyPractice;

  const notifyAchievements = localStorage.getItem('lyracode_notify_achievements') !== 'false';
  document.getElementById('notify-achievements').checked = notifyAchievements;

  const notifyCommunity = localStorage.getItem('lyracode_notify_community') === 'true';
  document.getElementById('notify-community').checked = notifyCommunity;

  const notifyEmails = localStorage.getItem('lyracode_notify_emails') !== 'false';
  document.getElementById('notify-emails').checked = notifyEmails;

  // Editor Toggles & selectors
  const editorTheme = localStorage.getItem('lyracode_editor_theme') || 'dracula';
  document.getElementById('editor-theme-selector').value = editorTheme;

  const editorFontSize = localStorage.getItem('lyracode_editor_fontsize') || '14px';
  document.getElementById('editor-fontsize-selector').value = editorFontSize;

  const spacesIndent = localStorage.getItem('lyracode_editor_spacesIndent') !== 'false';
  document.getElementById('editor-spaces-indent').checked = spacesIndent;

  const autocomplete = localStorage.getItem('lyracode_editor_autocomplete') !== 'false';
  document.getElementById('editor-autocomplete').checked = autocomplete;

  const lineNumbers = localStorage.getItem('lyracode_editor_lineNumbers') !== 'false';
  document.getElementById('editor-linenumbers').checked = lineNumbers;
}

// -------------------------------------------------------------------------
// Theme management
// -------------------------------------------------------------------------
function setInterfaceTheme(themeName, persist = true) {
  // Clear classes
  document.body.classList.remove('theme-claro', 'theme-oscuro', 'theme-sistema');
  
  // Apply selected theme class
  document.body.classList.add(`theme-${themeName}`);

  // Save to storage
  if (persist) {
    localStorage.setItem('lyracode_theme', themeName);
  }

  // Update theme option card visual select state
  const clearBtn = document.getElementById('theme-btn-claro');
  const darkBtn = document.getElementById('theme-btn-oscuro');
  const sysBtn = document.getElementById('theme-btn-sistema');

  clearBtn.classList.remove('active');
  darkBtn.classList.remove('active');
  sysBtn.classList.remove('active');

  if (themeName === 'claro') {
    clearBtn.classList.add('active');
    document.documentElement.setAttribute('data-theme', 'light');
  } else if (themeName === 'oscuro') {
    darkBtn.classList.add('active');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    sysBtn.classList.add('active');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }
}

// -------------------------------------------------------------------------
// Save Preferences In Storage
// -------------------------------------------------------------------------
function saveLearningPreference(key, value) {
  localStorage.setItem(`lyracode_${key}`, value);
  showToast(`Preferencia guardada: ${key} -> ${value}`, 'info');
}

function saveNotificationToggle(key, checked) {
  localStorage.setItem(`lyracode_notify_${key}`, checked);
  showToast('Ajuste de notificación guardado', 'info');
}

function saveEditorPreference(key, value) {
  localStorage.setItem(`lyracode_editor_${key}`, value);
  showToast('Editor actualizado', 'info');
}

// -------------------------------------------------------------------------
// Save Profile Details
// -------------------------------------------------------------------------
async function saveProfileChanges(event) {
  event.preventDefault();
  const username = document.getElementById('input-username').value;
  const email = document.getElementById('input-email').value;

  const response = await apiFetch('/auth/user/update', {
    method: 'POST',
    body: JSON.stringify({ username, email, avatar: currentAvatarSelected })
  });

  if (response && !response.error) {
    showToast('¡Perfil guardado con éxito!', 'success');
    userDbAvatar = currentAvatarSelected;
    // Reload navbar stats to update avatar instantly
    if (typeof loadUserStats === 'function') {
      loadUserStats();
    }
  } else {
    showToast(response.error || 'Error al guardar los cambios', 'danger');
  }
}

// -------------------------------------------------------------------------
// Modals control
// -------------------------------------------------------------------------
function openAvatarModal() {
  document.getElementById('avatar-modal').classList.add('active');
  // Highlight selected visual card
  document.querySelectorAll('.avatar-select-card').forEach(card => card.classList.remove('selected'));
  const activeCard = document.getElementById(`avatar-opt-${currentAvatarSelected}`);
  if (activeCard) {
    activeCard.classList.add('selected');
  }
}

function closeAvatarModal() {
  document.getElementById('avatar-modal').classList.remove('active');
}

function selectAvatarOption(avatarName) {
  document.querySelectorAll('.avatar-select-card').forEach(card => card.classList.remove('selected'));
  document.getElementById(`avatar-opt-${avatarName}`).classList.add('selected');
  currentAvatarSelected = avatarName;
}

function confirmAvatarSelection() {
  updateAvatarPreview(currentAvatarSelected);
  closeAvatarModal();
  showToast('Avatar modificado temporalmente. Recuerda presionar "Guardar cambios".', 'info');
}

function updateAvatarPreview(avatarName) {
  const frame = document.getElementById('settings-avatar-preview');
  frame.innerHTML = AVATAR_SVGS[avatarName] || AVATAR_SVGS.steve;
}

// Password Modal
function openPasswordModal() {
  document.getElementById('password-modal').classList.add('active');
  document.getElementById('password-change-form').reset();
}

function closePasswordModal() {
  document.getElementById('password-modal').classList.remove('active');
}

async function savePasswordChanges(event) {
  event.preventDefault();
  const currentPassword = document.getElementById('input-current-password').value;
  const newPassword = document.getElementById('input-new-password').value;
  const confirmPassword = document.getElementById('input-confirm-password').value;

  if (newPassword !== confirmPassword) {
    showToast('Las contraseñas nuevas no coinciden', 'danger');
    return;
  }

  const response = await apiFetch('/auth/user/password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  });

  if (response && !response.error) {
    showToast('Contraseña cambiada con éxito', 'success');
    closePasswordModal();
  } else {
    showToast(response.error || 'Error al cambiar la contraseña', 'danger');
  }
}

// Sessions Modal
function openSessionsModal() {
  document.getElementById('sessions-modal').classList.add('active');
}

function closeSessionsModal() {
  document.getElementById('sessions-modal').classList.remove('active');
}

function closeRemoteSession(button) {
  const sessionItem = button.closest('.session-device-item');
  sessionItem.style.opacity = '0.4';
  button.disabled = true;
  button.innerText = 'Cerrada';
  showToast('Sesión remota finalizada con éxito', 'success');
}

// Delete Account Modal
function openDeleteAccountModal() {
  document.getElementById('delete-account-modal').classList.add('active');
  document.getElementById('input-delete-confirm').value = '';
}

function closeDeleteAccountModal() {
  document.getElementById('delete-account-modal').classList.remove('active');
}

async function confirmDeleteAccount() {
  const confirmationText = document.getElementById('input-delete-confirm').value;
  if (confirmationText !== 'ELIMINAR') {
    showToast('Escribe ELIMINAR para poder continuar', 'danger');
    return;
  }

  const response = await apiFetch('/auth/user/account', {
    method: 'DELETE'
  });

  if (response && !response.error) {
    showToast('Tu cuenta ha sido eliminada permanentemente. ¡Hasta pronto!', 'success');
    setTimeout(() => {
      localStorage.removeItem('lyracode_token');
      window.location.href = '/login';
    }, 1500);
  } else {
    showToast(response.error || 'Error al eliminar la cuenta', 'danger');
  }
}

// Toast helper
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('mc-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'mc-toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '3000';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `mc-panel fade-in`;
  toast.style.padding = '12px 20px';
  toast.style.border = '2px solid';
  toast.style.borderRadius = '6px';
  toast.style.fontSize = '12px';
  toast.style.minWidth = '240px';
  toast.style.color = '#ffffff';

  if (type === 'success') {
    toast.style.backgroundColor = 'rgba(27, 94, 32, 0.9)';
    toast.style.borderColor = '#6CFF3F';
  } else if (type === 'danger') {
    toast.style.backgroundColor = 'rgba(127, 29, 29, 0.9)';
    toast.style.borderColor = '#ef4444';
  } else {
    toast.style.backgroundColor = 'rgba(11, 23, 36, 0.9)';
    toast.style.borderColor = '#3EBEFF';
  }

  toast.innerHTML = `<span style="font-family: 'Press Start 2P', monospace; font-size: 8px;">${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

document.addEventListener('DOMContentLoaded', loadProfileSettings);
