// LyraCode Client-Side API Helper

const API_BASE = '/api';

// Save token and navigate
function setToken(token) {
  localStorage.setItem('lyracode_token', token);
}

function getToken() {
  return localStorage.getItem('lyracode_token');
}

function logout() {
  localStorage.removeItem('lyracode_token');
  window.location.href = '/login';
}

// Check auth state on load
function checkAuth() {
  const token = getToken();
  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/';
  if (!token && !isAuthPage) {
    window.location.href = '/login';
  }
}

// Fetch with JWT included
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    // Session expired or invalid
    localStorage.removeItem('lyracode_token');
    window.location.href = '/login';
    return null;
  }

  return response.json();
}

// Automatically check auth on page load
document.addEventListener('DOMContentLoaded', checkAuth);
