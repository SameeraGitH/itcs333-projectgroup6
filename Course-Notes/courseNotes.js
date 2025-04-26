
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