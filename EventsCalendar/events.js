document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-event-form");
  const titleInput = document.getElementById("event-title");
  const dateInput = document.getElementById("event-date");
  const descInput = document.getElementById("event-description");
  const eventList = document.querySelector(".event-list");
  const searchInput = document.querySelector(".search-input");
  const filterSelect = document.querySelector(".filter-select");
  const searchButton = document.querySelector(".search-btn");

  const API_URL = "https://1a0239da-31dc-4528-97a5-d2884789c26c-00-cnuht8pxrfq2.pike.replit.dev/event.php";


  async function loadEvents() {
    try {
      const res = await fetch(API_URL);
      const events = await res.json();

      eventList.innerHTML = "";
      events.forEach(event => {
        const eventCard = createEventCard(event);
        eventList.appendChild(eventCard);
      });
    } catch (err) {
      console.error("Error loading events:", err);
    }
  }

  function createEventCard(event) {
    const card = document.createElement("div");
    card.className = "event-item bg-white p-4 border rounded-md shadow-sm";
    card.innerHTML = `
      <h2 class="text-xl font-semibold text-blue-600">${event.title}</h2>
      <p>Event Date: ${event.event_date}</p>
      <p class="text-gray-600">${event.description_text}</p>
    `;
    return card;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const newEvent = {
      title: titleInput.value,
      event_date: dateInput.value,
      description_text: descInput.value
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
      });

      const result = await res.json();

      if (result.success) {
        const newCard = createEventCard(newEvent);
        eventList.prepend(newCard);
        form.reset();
      } else {
        alert("Failed to add event: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      alert("An error occurred: " + err.message);
      console.error(err);
    }
  });

  function filterEvents() {
    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const events = document.querySelectorAll(".event-item");

    events.forEach(event => {
      const title = event.querySelector("h2").textContent.toLowerCase();
      const description = event.querySelector("p:nth-of-type(2)").textContent.toLowerCase();
      const date = event.querySelector("p:nth-of-type(1)").textContent;
      const eventDate = new Date(date.split(": ")[1]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const matchesSearch = title.includes(searchText) || description.includes(searchText);
      let matchesFilter = true;

      if (filterValue === "upcoming") {
        matchesFilter = eventDate >= today;
      } else if (filterValue === "past") {
        matchesFilter = eventDate < today;
      }

      event.style.display = matchesSearch && matchesFilter ? "block" : "none";
    });
  }

  searchButton.addEventListener("click", filterEvents);
  filterSelect.addEventListener("change", filterEvents);
  searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") filterEvents();
  });

  const paginationButtons = document.querySelectorAll(".pagination button");
  paginationButtons.forEach(button => {
    button.addEventListener("click", () => {
      alert(`You clicked: ${button.textContent}`);
    });
  });

  loadEvents();
});
