let allActivities = [];
let currentPage = 1;
const activitiesPerPage = 2;

document.addEventListener('DOMContentLoaded', async () => {
    if (new URLSearchParams(window.location.search).has('success')) {
        const message = document.createElement('div');
        message.textContent = "New activity added successfully!";
        message.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50";
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
      }  
    try {
    // will load from localStorage
    const savedActivities = JSON.parse(localStorage.getItem('activities')) || [];
    
    // will load from JSON file
    const response = await fetch('activities.json');
    const jsonActivities = await response.json();

    allActivities = [...savedActivities, ...jsonActivities];

    if (new URLSearchParams(window.location.search).has('success')) {
        showMessage('Activity added successfully!', 'green');
      }
      renderActivities();
    setupEventListeners();
} catch (error) {
    console.error("Error:", error);
    showMessage('Failed to load activities', 'red');
  }
});
function showMessage(text, color) {
    const message = document.createElement('div');
    message.textContent = text;
    message.className = `fixed top-4 right-4 bg-${color}-500 text-white px-4 py-2 rounded shadow-lg z-50`;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
  }
    

function renderActivities() {
  const start = (currentPage - 1) * activitiesPerPage;
  const paginatedActivities = allActivities.slice(start, start + activitiesPerPage);
  
  const container = document.querySelector('.activity-list');
  container.innerHTML = paginatedActivities.map(activity => `
    <div class="activity-card bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-xl font-semibold mb-2">${activity.title}</h3>
      <p><strong>Club:</strong> ${activity.club}</p>
      <p><strong>Date & Time:</strong> ${activity.dateTime}</p>
      <p class="desc mb-3">${activity.description}</p>
      <a href="activityDetails.html#${activity.id}" class="view-button">
        View Details
      </a>
    </div>
  `).join('');
  
  updatePagination();
}


function updatePagination() {
  const totalPages = Math.ceil(allActivities.length / activitiesPerPage);
  const pageInfo = document.getElementById('pageInfo');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}


function setupEventListeners() {
  // butttons for Pagination here
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderActivities();
    }
  });
  
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentPage < Math.ceil(allActivities.length / activitiesPerPage)) {
      currentPage++;
      renderActivities();
    }
  });
  
  // This is for the seacrh
  document.querySelector('input[type="text"]').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allActivities.filter(activity => 
      activity.title.toLowerCase().includes(term) || 
      activity.club.toLowerCase().includes(term)
    );
    allActivities = filtered;
    currentPage = 1;
    renderActivities();
  });
}


window.submitNewActivity = function(formData) {
  const newActivity = {
    id: Date.now(),
    title: formData.get('activityTitle'),
    club: formData.get('clubName'),
    dateTime: formData.get('date&time'),
    description: formData.get('shortdescr')
  };
  
  
  const savedActivities = JSON.parse(localStorage.getItem('activities')) || [];
  savedActivities.unshift(newActivity);
  localStorage.setItem('activities', JSON.stringify(savedActivities));
  
 
  window.location.href = 'index.html';
};

document.addEventListener('DOMContentLoaded', async () => {
    const activityId = window.location.hash.substring(1); // Get the ID after the #

    let savedActivities = JSON.parse(localStorage.getItem('activities')) || [];

    let jsonActivities = [];
    try {
      const response = await fetch('activities.json');
      jsonActivities = await response.json();
    } catch (error) {
      console.error('Could not load activities.json', error);
    }

    const allActivities = [...savedActivities, ...jsonActivities];
    
    const activity = allActivities.find(act => act.id == activityId);

    const container = document.getElementById('activityDetails');
    if (activity) {
        container.innerHTML = `
          <h2 class="text-2xl font-bold">${activity.title}</h2>
          <p><strong>Club:</strong> ${activity.club}</p>
          <p><strong>Date & Time:</strong> ${activity.dateTime}</p>
          <p><strong>Description:</strong> ${activity.description}</p>
        `;
    } else {
        container.innerHTML = `<p>Activity not found.</p>`;
    }
});
