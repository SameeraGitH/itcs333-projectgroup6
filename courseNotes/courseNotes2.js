const notesList = document.querySelector('.notes-list');
const searchInput = document.querySelector('.search-bar input');
const sortSelect = document.getElementById('sort');
const previousButton = document.querySelector('.sorting-controls button:nth-child(3)');
const nextButton = document.querySelector('.sorting-controls button:nth-child(4)');
const addButton = document.querySelector('.add-button');
const loadingIndicator = document.createElement('div');
loadingIndicator.textContent = 'Loading...';
loadingIndicator.style.display = 'none';
document.body.appendChild(loadingIndicator);
let notes = [];
let currentPage = 1;
const notesPerPage = 2;

async function fetchNotes() {
  loadingIndicator.style.display = 'block';
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts'); 
    if (!response.ok) throw new Error('Network response was not ok');
    
    notes = await response.json();
    renderNotes();
  } catch (error) {
    console.error('Error fetching notes:', error);
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

function renderNotes() {
  notesList.innerHTML = ''; // Clear current notes
  const filteredNotes = applyFilters(notes);
  const paginatedNotes = paginate(filteredNotes);
  paginatedNotes.forEach(note => {
    const noteItem = document.createElement('article');
    noteItem.className = 'note-item';
    noteItem.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.body.substring(0, 50)}...</p>
      <button onclick="viewDetail(${note.id})">View</button>
      <button onclick="deleteNote(${note.id})">Delete</button>
    `;
    notesList.appendChild(noteItem);
  });
}

function applyFilters(notes) {
  const searchTerm = searchInput.value.toLowerCase();
  const sortedNotes = notes.sort((a, b) => {
    const field = sortSelect.value;
    return a[field].localeCompare(b[field]);
  });
  const filteredNotes = sortedNotes.filter(note => 
    note.title.toLowerCase().includes(searchTerm) || 
    note.body.toLowerCase().includes(searchTerm)
  );

  if (filteredNotes.length === 0) {
    notesList.innerHTML = '<p>No results found</p>';
  }

  return filteredNotes;
}

function paginate(notes) {
  const startIndex = (currentPage - 1) * notesPerPage;
  return notes.slice(startIndex, startIndex + notesPerPage);
}

function debounce(func, delay) {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

searchInput.addEventListener('input', debounce(renderNotes, 300));
sortSelect.addEventListener('change', renderNotes);
previousButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderNotes();
  }
});
nextButton.addEventListener('click', () => {
  if (currentPage < Math.ceil(notes.length / notesPerPage)) {
    currentPage++;
    renderNotes();
  }
});

function viewDetail(noteId) {
  const note = notes.find(n => n.id === noteId);
  if (note) {
    document.getElementById('details').innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.body}</p>
      <button onclick="window.history.back();">Back to Listing</button>
    `;
  }
}

function deleteNote(noteId) {
  notes = notes.filter(note => note.id !== noteId);
  renderNotes();
}

fetchNotes();
