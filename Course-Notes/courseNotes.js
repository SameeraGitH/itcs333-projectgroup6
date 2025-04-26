
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