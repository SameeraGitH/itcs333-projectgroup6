let allActivities = [];
let filteredActivities = null;
let currentSearchTerm = '';
let currentPage = 1;
const activitiesPerPage = 2;

document.addEventListener('DOMContentLoaded', async () => {
    if (new URLSearchParams(window.location.search).has('success')) {
        showMessage("New activity added successfully!", 'green');
    }

    try {
        // Loading ONLY from API
        const response = await fetch('api.php?action=getActivities&nocache=' + Date.now());
        if (!response.ok) throw new Error('API request failed');

        
        const apiActivities = await response.json();
        if (!Array.isArray(apiActivities)) throw new Error('Invalid data format');

        
        const uniqueActivities = [];
        const ids = new Set();

        apiActivities.forEach(activity => {
            if (activity.id && !ids.has(activity.id)) {
                ids.add(activity.id);
                uniqueActivities.push(activity);
            }
        });

        allActivities = uniqueActivities;

        //  Debugging the output here
        console.log('Unique activities loaded:', allActivities);
        console.log('Duplicate check:', 
            allActivities.length !== ids.size ? 'DUPLICATES FOUND' : 'No duplicates');

        
        populateClubFilter(allActivities);
        renderActivities();
        setupEventListeners();

    } catch (error) {
        console.error("Loading failed:", error);
        showMessage('Failed to load activities', 'red');
        allActivities = []; // Ensure empty state
    }
});

function populateClubFilter(activities) {
    const clubFilter = document.getElementById('clubFilter');
    const clubs = [...new Set(activities.map(a => a.club).filter(Boolean))].sort();

    clubFilter.innerHTML = '<option value="">All Clubs</option>';
    clubs.forEach(club => {
        const option = document.createElement('option');
        option.value = club;
        option.textContent = club;
        clubFilter.appendChild(option);
    });
}

function renderActivities(activitiesToRender = null) {
    // Determine which activities to show
    let displayActivities = allActivities;

    // Apply club filter if active
    if (filteredActivities) {
        displayActivities = filteredActivities;
    }

    // Apply search filter if the term exists
    if (currentSearchTerm) {
        displayActivities = displayActivities.filter(activity => 
            (activity.title && activity.title.toLowerCase().includes(currentSearchTerm)) || 
            (activity.club && activity.club.toLowerCase().includes(currentSearchTerm))
        );
    }

    // If specific activities were passed (for search) using themm
    if (activitiesToRender) {
        displayActivities = activitiesToRender;
    }

    const start = (currentPage - 1) * activitiesPerPage;
    const paginatedActivities = displayActivities.slice(start, start + activitiesPerPage);

    const container = document.querySelector('.activity-list');
    container.innerHTML = paginatedActivities.map(activity => `
        <div class="activity-card bg-white p-6 rounded-xl shadow-md">
            <h3 class="text-xl font-semibold mb-2">${activity.title}</h3>
            <p><strong>Club:</strong> ${activity.club}</p>
            <p><strong>Date & Time:</strong> ${activity.date_time || activity.dateTime || 'Not scheduled'}</p>
            <p class="desc mb-3">${activity.description}</p>
            <div class="flex gap-2 mt-4">
                <a href="activityDetails.html#${activity.id}" class="view-button">View Details</a>
                <button onclick="editActivity(${activity.id})" class="edit-button">Edit</button>
                <button onclick="deleteActivity(${activity.id})" class="delete-button">Delete</button>
            </div>
        </div>
    `).join('');

    updatePagination(displayActivities.length);
}

function updatePagination(totalActivities) {
    const totalPages = Math.max(1, Math.ceil(totalActivities / activitiesPerPage));
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage <= 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages;
}

function setupEventListeners() {
    // Pagination
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderActivities();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        const totalActivities = filteredActivities ? filteredActivities.length : allActivities.length;
        if (currentPage < Math.ceil(totalActivities / activitiesPerPage)) {
            currentPage++;
            renderActivities();
        }
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        currentPage = 1;
        renderActivities();
    });

    // Club filter
    document.getElementById('clubFilter').addEventListener('change', (e) => {
        filteredActivities = e.target.value 
            ? allActivities.filter(a => a.club === e.target.value)
            : null;
        currentPage = 1;
        currentSearchTerm = ''; // Resetss search when changing clubs
        document.getElementById('searchInput').value = ''; // Clearing search input
        renderActivities();
    });
}
function showMessage(text, color) { //show message
    const message = document.createElement('div');
    message.textContent = text;
    message.className = `fixed top-4 right-4 bg-${color}-500 text-white px-4 py-2 rounded shadow-lg z-50`;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
}

window.submitNewActivity = async function(formData) {
    try {
        // 1. Submit to server
        const response = await fetch('create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: formData.get('activityTitle'),
                club: formData.get('clubName'),
                dateTime: formData.get('dateTime'),
                description: formData.get('description')
            })
        });

        // 2. Handle response
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Creation failed');

        // 3. full page reload t
        window.location.href = 'index.php?success=true';

    } catch (error) {
        console.error('Submission failed:', error);
        showMessage('Failed: ' + error.message, 'red');
    }
};
async function editActivity(id) { //edit activity
  try {
    const response = await fetch(`api.php?action=getActivity&id=${id}`);
    const activity = await response.json();

    
    const params = new URLSearchParams();
    params.append('edit', id);
    params.append('title', activity.title || '');
    params.append('club', activity.club || '');
    params.append('dateTime', activity.dateTime || '');
    params.append('description', activity.description || '');

    window.location.href = `activityCreationForm.html?${params.toString()}`;
  } catch (error) {
    console.error("Edit failed:", error);
    showMessage('Failed to load activity for editing', 'red');
  }
}

async function deleteActivity(id) { //delete activity
  if (!confirm("Are you sure you want to delete this activity?")) return;

  try {
    const response = await fetch(`delete.php?id=${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();

    if (result.success) {
      showMessage('Activity deleted!', 'green');
      // Refresh the list
      const freshResponse = await fetch('api.php?action=getActivities');
      allActivities = await freshResponse.json();
      renderActivities();
    } else {
      showMessage('Delete failed: ' + result.message, 'red');
    }
  } catch (error) {
    console.error("Delete error:", error);
    showMessage('Failed to delete activity', 'red');
  }
}
// Comment functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load existing comments
    loadComments();

    // Handle new comment submission
    document.getElementById('commentForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = e.target;
        const commentData = {
            name: form.commentName.value.trim(),
            text: form.commentText.value.trim(),
            date: new Date().toISOString()
        };

        if (!commentData.name || !commentData.text) return;

        try {
            // Save to localStorage
            const comments = JSON.parse(localStorage.getItem('comments') || '[]');
            comments.unshift(commentData);
            localStorage.setItem('comments', JSON.stringify(comments));

            // Refresh comments
            loadComments();

            // Clear form
            form.reset();

            // Show success message
            showMessage('Comment posted!', 'green');
        } catch (error) {
            console.error('Error saving comment:', error);
            showMessage('Failed to post comment', 'red');
        }
    });
});

function loadComments() {
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    try {
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');

        container.innerHTML = comments.map(comment => `
            <div class="comment-card bg-gray-50 p-4 rounded">
                <p class="text-gray-800">${comment.text}</p>
                <div class="comment-meta mt-2">
                    <span class="font-medium">${comment.name}</span>
                    <span> • ${new Date(comment.date).toLocaleString()}</span>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading comments:', error);
        container.innerHTML = '<p class="text-red-500">Error loading comments</p>';
    }
}