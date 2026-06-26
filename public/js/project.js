// Project Workspace Controller

let currentSlug = '';
let courseData = null;
let activeProject = null;
let codeEditor = null;

function getUrlParams() {
  const parts = window.location.pathname.split('/');
  currentSlug = parts[2] || 'html';
}

async function loadProjectWorkspace() {
  getUrlParams();

  const data = await apiFetch(`/courses/${currentSlug}`);
  if (!data) return;

  courseData = data;
  activeProject = data.project;

  if (!activeProject) {
    window.location.href = `/curso/${currentSlug}`;
    return;
  }

  // Set breadcrumbs & titles
  const breadcrumbLink = document.getElementById('breadcrumb-course-link');
  if (breadcrumbLink) {
    breadcrumbLink.innerText = data.course.name.toUpperCase();
    breadcrumbLink.href = `/curso/${currentSlug}`;
  }

  // Populate info
  document.getElementById('project-title').innerText = `Proyecto Final: ${activeProject.title}`;
  document.getElementById('project-instructions').innerText = activeProject.description;
  document.getElementById('reward-coins').innerText = `+${activeProject.rewardCoins} Monedas`;
  document.getElementById('reward-xp').innerText = `+${activeProject.rewardXp} XP`;

  // Initialize CodeMirror Editor
  const wrapper = document.getElementById('codemirror-wrapper');
  wrapper.innerHTML = ''; // reset

  let editorMode = 'xml';
  if (currentSlug === 'css') editorMode = 'css';
  else if (currentSlug === 'js' || currentSlug === 'node' || currentSlug === 'express') editorMode = 'javascript';

  const defaultCode = data.progress.projectCode || activeProject.templateCode || '';

  codeEditor = CodeMirror(wrapper, {
    value: defaultCode,
    mode: editorMode,
    theme: 'dracula',
    lineNumbers: true,
    lineWrapping: true
  });

  // Render Initial Preview and set up load check
  const iframe = document.getElementById('live-preview');
  if (iframe) {
    iframe.addEventListener('load', () => {
      checkRequirements();
    });
  }
  updateLivePreview();

  // Listen to changes
  codeEditor.on('change', () => {
    updateLivePreview();
  });
}

function updateLivePreview() {
  const iframe = document.getElementById('live-preview');
  if (!iframe || !codeEditor) return;

  const code = codeEditor.getValue();
  iframe.srcdoc = code;
}

function checkRequirements() {
  if (!activeProject || !codeEditor) return;

  const code = codeEditor.getValue();
  const iframe = document.getElementById('live-preview');
  let iframeDoc = null;
  try {
    iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  } catch (err) {
    console.warn('No se puede acceder al documento del iframe todavía:', err);
    return false;
  }

  if (!iframeDoc) return false;

  const listContainer = document.getElementById('req-checklist');
  listContainer.innerHTML = '';

  let allPassed = true;

  activeProject.requirements.forEach(req => {
    let passed = true;

    if (req.selector) {
      const el = iframeDoc.querySelector(req.selector);
      if (!el) {
        passed = false;
      } else {
        if (req.containsText && !el.innerText.toLowerCase().includes(req.containsText.toLowerCase())) {
          passed = false;
        }
        if (req.attribute) {
          const val = el.getAttribute(req.attribute);
          if (!val || (req.attributeValue && val !== req.attributeValue)) {
            passed = false;
          }
        }
      }
    }

    if (req.regexMatch) {
      const regex = new RegExp(req.regexMatch, 'i');
      if (!regex.test(code)) {
        passed = false;
      }
    }

    if (!passed) allPassed = false;

    // Create item DOM using class icons instead of raw emojis
    const li = document.createElement('li');
    li.className = `req-item ${passed ? 'passed' : ''}`;
    li.innerHTML = `
      <span class="req-icon ${passed ? 'icon-check' : 'icon-cross'}"></span>
      <span>${req.description}</span>
    `;
    listContainer.appendChild(li);
  });

  return allPassed;
}

async function submitProjectCode() {
  const allPassed = checkRequirements();
  const panel = document.querySelector('.workspace-panel');

  if (!allPassed) {
    // Shake panel to alert missing requirements
    panel.classList.add('shake-anim');
    setTimeout(() => {
      panel.classList.remove('shake-anim');
    }, 500);

    // Spawn red particles at button
    const btn = document.getElementById('submit-project-btn');
    const rect = btn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#ef4444', 15);
    
    alert('Por favor cumple con todos los requisitos del proyecto antes de enviarlo.');
    return;
  }

  const code = codeEditor.getValue();

  // Call API to complete project
  const res = await apiFetch(`/progress/${currentSlug}/project`, {
    method: 'POST',
    body: JSON.stringify({
      code,
      score: 100
    })
  });

  // Success gold sparkles!
  const btn = document.getElementById('submit-project-btn');
  const rect = btn.getBoundingClientRect();
  spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#fbbf24', 40);

  // Show a beautiful custom Minecraft success panel/modal in dark colors matching theme
  const successModal = document.createElement('div');
  successModal.style.position = 'fixed';
  successModal.style.top = '0';
  successModal.style.left = '0';
  successModal.style.width = '100vw';
  successModal.style.height = '100vh';
  successModal.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
  successModal.style.display = 'flex';
  successModal.style.justifyContent = 'center';
  successModal.style.alignItems = 'center';
  successModal.style.zIndex = '99999';
  
  successModal.innerHTML = `
    <div class="mc-panel" style="max-width: 420px; text-align: center; background-color: rgba(5, 10, 18, 0.95); padding: 30px; box-shadow: 0 0 20px rgba(99, 255, 63, 0.25); border-radius: 12px; border: 2px solid #63ff3f;">
      <h2 style="color: #63ff3f; font-family: var(--font-pixel); font-size: 14px; margin-bottom: 15px; text-shadow: 0 0 10px rgba(99,255,63,0.35);">¡DESAFÍO COMPLETADO!</h2>
      <p style="font-size: 13px; color: #b0b8c4; margin-bottom: 24px; line-height: 1.6;">Tu proyecto final ha sido enviado y verificado automáticamente por Redstone con éxito.</p>
      
      <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 8px; font-family: var(--font-vt); font-size: 24px; color: #ffffff;">
          <span class="icon icon-coin"></span>
          <span>+${activeProject.rewardCoins} Monedas</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; font-family: var(--font-vt); font-size: 24px; color: #ffffff;">
          <span class="icon icon-gem" style="background-color: transparent;"></span>
          <span>+${activeProject.rewardXp} XP</span>
        </div>
      </div>
      
      <div style="font-family: var(--font-pixel); font-size: 8px; color: #6b7280; animation: pulse 1s infinite alternate;">Redirigiendo a tus resultados...</div>
    </div>
  `;
  document.body.appendChild(successModal);

  setTimeout(() => {
    window.location.href = `/curso/${currentSlug}/resultado`;
  }, 2200);
}

function goBackToCourse() {
  window.location.href = `/curso/${currentSlug}`;
}

document.addEventListener('DOMContentLoaded', loadProjectWorkspace);
