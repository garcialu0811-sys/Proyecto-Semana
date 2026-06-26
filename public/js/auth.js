// Auth page controller

let activeTab = 'login';

function switchTab(tab) {
  activeTab = tab;
  const usernameGroup = document.getElementById('group-username');
  const submitBtn = document.getElementById('submit-btn');
  const errorBox = document.getElementById('error-box');

  if (errorBox) errorBox.style.display = 'none';

  if (tab === 'login') {
    if (usernameGroup) usernameGroup.style.display = 'none';
    const uInput = document.getElementById('username');
    if (uInput) uInput.required = false;
    if (submitBtn) submitBtn.innerHTML = '+ INICIAR SESIÓN +';
    
    const titleEl = document.getElementById('auth-title');
    if (titleEl) titleEl.innerText = '¡Bienvenido de vuelta!';
    const subtitleEl = document.getElementById('auth-subtitle');
    if (subtitleEl) subtitleEl.innerText = 'Inicia sesión para continuar tu aventura';
    
    const switchEl = document.getElementById('auth-switch-link');
    if (switchEl) {
      switchEl.innerHTML = '¿No tienes una cuenta? <a href="#" onclick="switchTab(\'register\'); return false;" style="color: var(--color-diamond); font-weight: bold;">Únete a LyraCode</a>';
    }
  } else {
    if (usernameGroup) usernameGroup.style.display = 'block';
    const uInput = document.getElementById('username');
    if (uInput) uInput.required = true;
    if (submitBtn) submitBtn.innerHTML = '+ REGISTRARSE +';

    const titleEl = document.getElementById('auth-title');
    if (titleEl) titleEl.innerText = '¡Únete a la aventura!';
    const subtitleEl = document.getElementById('auth-subtitle');
    if (subtitleEl) subtitleEl.innerText = 'Regístrate para comenzar tu viaje en LyraCode';

    const switchEl = document.getElementById('auth-switch-link');
    if (switchEl) {
      switchEl.innerHTML = '¿Ya tienes una cuenta? <a href="#" onclick="switchTab(\'login\'); return false;" style="color: var(--color-diamond); font-weight: bold;">Inicia sesión</a>';
    }
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorBox = document.getElementById('error-box');
  
  errorBox.style.display = 'none';
  
  let payload, endpoint;
  
  if (activeTab === 'login') {
    payload = { email, password };
    endpoint = '/auth/login';
  } else {
    const username = document.getElementById('username').value;
    payload = { username, email, password };
    endpoint = '/auth/register';
  }

  try {
    const res = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Ocurrió un error en el servidor');
    }

    // Save token
    setToken(data.token);
    
    // Spawn success particles
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, '#34d399', 30);
    
    // Redirect to courses catalog dashboard
    setTimeout(() => {
      window.location.href = '/courses';
    }, 800);

  } catch (err) {
    errorBox.innerText = err.message;
    errorBox.style.display = 'block';
    document.querySelector('.mc-panel').classList.add('shake-anim');
    setTimeout(() => {
      document.querySelector('.mc-panel').classList.remove('shake-anim');
    }, 500);
  }
}

// On page load check params
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');
  if (tab === 'register') {
    switchTab('register');
  } else {
    switchTab('login');
  }
});
