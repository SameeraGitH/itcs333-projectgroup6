const eventsContainer = document.getElementById('eventsContainer');
const searchInput = document.getElementById('searchInput');
const pagination = document.getElementById('pagination');
const message = document.getElementById('message');

let events = [];         // All events fetched from API
let filteredEvents = []; // Events after search
let currentPage = 1;
const eventsPerPage = 6; // Number of events per page

// Fetch Events
async function fetchEvents() {
  try {
    message.textContent = "Loading events...";

    const response = await fetch('https://mocki.io/v1/5a7299a2-0b4c-4e46-9385-5d58cc1e0aa2');
    if (!response.ok) {
      throw new Error('Failed to fetch events.');
    }

    const data = await response.json();
    events = data;
    filteredEvents = events;

    message.textContent = "";
    renderEvents();
    renderPagination();
  } catch (error) {
    console.error(error);
    message.textContent = "Error loading events. Please try again later.";
  }
}

// Render Events on Page
function renderEvents() {
  eventsContainer.innerHTML = "";

  const start = (currentPage - 1) * eventsPerPage;
  const end = start + eventsPerPage;
  const paginatedEvents = filteredEvents.slice(start, end);

  if (paginatedEvents.length === 0) {
    eventsContainer.innerHTML = `<p class="text-center col-span-3">No events found.</p>`;
    return;
  }

  paginatedEvents.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.className = 'bg-white p-4 rounded shadow hover:shadow-md transition';
    eventCard.innerHTML = `
      <h2 class="text-xl font-bold text-blue-700">${event.title}</h2>
      <p class="text-gray-600">${event.date}</p>
      <p class="mt-2 text-gray-700">${event.description.substring(0, 100)}...</p>
      <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onclick="viewEventDetails('${event.id}')">
        View Details
      </button>
    `;
    eventsContainer.appendChild(eventCard);
  });
}

// Render Pagination Buttons
function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `px-3 py-1 border rounded ${i === currentPage ? 'bg-blue-600 text-white' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderEvents();
      renderPagination();
    });
    pagination.appendChild(btn);
  }
}

// Search Events
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  filteredEvents = events.filter(event => event.title.toLowerCase().includes(searchTerm));
  currentPage = 1;
  renderEvents();
  renderPagination();
});

// View Event Details (Simple Alert)
function viewEventDetails(id) {
  const selectedEvent = events.find(event => event.id == id);
  if (selectedEvent) {
    alert(`Event: ${selectedEvent.title}\nDate: ${selectedEvent.date}\n\n${selectedEvent.description}`);
  }
}

// Initialize the page
fetchEvents();

