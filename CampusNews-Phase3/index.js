document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = '/api/news/index.php'
  const newsGrid = document.querySelector('#newsGrid') 
  const form = document.querySelector('#item-creation-form form')

  fetchNews()

  function fetchNews() {
    fetch(API_BASE)
      .then(response => response.json())
      .then(data => {
        newsGrid.innerHTML = ''
        data.forEach(news => {
          const card = createNewsCard(news)
          newsGrid.appendChild(card)
        })
      })
      .catch(error => console.error('Error fetching news:', error))
  }

  function createNewsCard(news) {
    const card = document.createElement('div')
    card.className = 'bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1'

    card.innerHTML = `
      <img src="${news.image || '/api/placeholder/800/450'}" class="h-48 w-full object-cover" alt="${news.title}">
      <div class="p-5 flex flex-col h-64">
        <div class="flex gap-2 mb-3">
          ${news.featured ? `<span class="px-2 py-1 bg-secondary text-xs font-semibold rounded-full">Featured</span>` : ''}
          ${news.urgent ? `<span class="px-2 py-1 bg-accent text-white text-xs font-semibold rounded-full">Urgent</span>` : ''}
          <span class="px-2 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full">${news.category}</span>
        </div>
        <h5 class="text-xl font-bold mb-2">${news.title}</h5>
        <p class="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">${news.summary}</p>
        <div class="text-gray-500 text-sm flex justify-between mt-3">
          <span>${news.date}</span>
          <span>By ${news.author || 'Admin'}</span>
        </div>
      </div>
    `
    return card
  }

  form.addEventListener('submit', e => {
    e.preventDefault()

    const title = document.getElementById('newsTitle').value
    const category = document.getElementById('newsCategory').value
    const date = document.getElementById('newsDate').value
    const summary = document.getElementById('newsSummary').value
    const content = document.getElementById('newsContent').value
    const featured = document.getElementById('featuredNews').checked
    const urgent = document.getElementById('urgentNews').checked
    const imageInput = document.getElementById('newsImage')

    const payload = {
      title,
      college: category,
      date,
      summary,
      content,
      image: imageInput.files[0] ? imageInput.files[0].name : '',
      featured,
      urgent
    }

    fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
      alert('News posted successfully!')
      form.reset()
      fetchNews()
    })
    .catch(err => {
      console.error('Submission error:', err)
      alert('Failed to post news')
    })
  })
})

