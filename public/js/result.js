// Project Result controller

let currentSlug = '';
let courseData = null;

const STAR_SVG = `
  <svg class="star-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <polygon points="8,1 10.5,5.5 15.5,6 11.5,9.5 13,14.5 8,12 3,14.5 4.5,9.5 0.5,6 5.5,5.5" fill="#fbbf24" stroke="#d97706" stroke-width="0.5"/>
  </svg>
`;

function getUrlParams() {
  const parts = window.location.pathname.split('/');
  currentSlug = parts[2] || 'html';
}

async function loadResultData() {
  getUrlParams();

  const data = await apiFetch(`/courses/${currentSlug}`);
  if (!data || !data.progress.projectSubmitted) {
    window.location.href = `/curso/${currentSlug}`;
    return;
  }

  courseData = data;

  // Render 5 stars rating
  const starsContainer = document.getElementById('rating-stars');
  starsContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    starsContainer.innerHTML += STAR_SVG;
  }

  // Populate checklist of requirements met
  const checklist = document.getElementById('completed-reqs');
  checklist.innerHTML = '';
  data.project.requirements.forEach(req => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="icon-check" style="margin-right: 8px;"></span>
      <span>${req.description}</span>
    `;
    checklist.appendChild(li);
  });

  // Inject user project code into preview frame
  const iframe = document.getElementById('project-preview-iframe');
  if (iframe) {
    iframe.srcdoc = data.progress.projectCode || '';
  }

  // If CSS or JS or Node, update next course button
  const nextBtn = document.getElementById('next-course-btn');
  if (currentSlug === 'html') {
    nextBtn.innerText = 'Siguiente: CSS →';
    nextBtn.onclick = () => { window.location.href = '/curso/css'; };
  } else if (currentSlug === 'css') {
    nextBtn.innerText = 'Siguiente: JavaScript →';
    nextBtn.onclick = () => { window.location.href = '/curso/js'; };
  } else {
    nextBtn.innerText = 'Volver al Mapa';
    nextBtn.onclick = () => { window.location.href = '/courses'; };
  }
}

function goToNextCourse() {
  if (currentSlug === 'html') {
    window.location.href = '/curso/css';
  } else {
    window.location.href = '/courses';
  }
}

document.addEventListener('DOMContentLoaded', loadResultData);
