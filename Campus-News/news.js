/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {boolean} isError - Whether it's an error notification
 */
function showNotification(message, isError) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-transform duration-500 translate-x-0 ${
      isError ? 'bg-accent text-white' : 'bg-primary text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">
          ${isError 
            ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
          }
        </span>
        <p>${message}</p>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
    
    return notification;
  }/**
   * Campus Hub - Campus News Module
   * JavaScript functionality for dynamic content, data integration, 
   * search, filtering, pagination, and form validation
   */
  
  // Configuration
  const CONFIG = {
    // API endpoint for news data
    apiUrl: 'https://jsonplaceholder.typicode.com/posts',
    // Number of items per page
    itemsPerPage: 6,
    // Categories for news items
    categories: ['Academic', 'Sports', 'Events', 'Campus Life', 'Announcements']
  };
  
  // State management
  const state = {
    newsItems: [],
    filteredItems: [],
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    selectedNewsItem: null,
    sortBy: 'newest', // 'newest', 'popular', 'featured'
    currentCategory: 'All Categories'
  };
  
  // DOM Elements - using a function to ensure DOM is loaded
  const getElements = () => {
    return {
      // Main containers
      newsGrid: document.querySelector('.grid'),
      paginationContainer: document.querySelector('.flex.justify-center.mt-8.mb-12'),
      detailView: document.getElementById('item-detail-view'),
      creationForm: document.getElementById('item-creation-form'),
      addNewsButton: document.querySelector('a[href="#item-creation-form"]'),
      
      // Search and filters
      searchInput: document.querySelector('input[type="text"]'),
      searchButton: document.querySelector('.bg-primary.rounded-r-lg'),
      categorySelect: document.querySelector('select'),
      
      // Sort buttons
      sortButtons: {
        newest: document.querySelector('.inline-flex button:nth-child(1)'),
        popular: document.querySelector('.inline-flex button:nth-child(2)'),
        featured: document.querySelector('.inline-flex button:nth-child(3)')
      },
      
      // Pagination
      paginationNav: document.querySelector('.flex.justify-center.mt-8.mb-12 nav'),
      
      // Form elements
      newsForm: document.querySelector('#item-creation-form form'),
      formInputs: {
        title: document.getElementById('newsTitle'),
        category: document.getElementById('newsCategory'),
        date: document.getElementById('newsDate'),
        image: document.getElementById('newsImage'),
        summary: document.getElementById('newsSummary'),
        content: document.getElementById('newsContent'),
        featured: document.getElementById('featuredNews'),
        urgent: document.getElementById('urgentNews')
      },
      
      // Navigation links
      navLinks: document.querySelectorAll('nav a'),
      
      // Loading indicator container
      mainContent: document.querySelector('main')
    };
  };
  
  /**
   * Initialize the application
   */
  function init() {
    // Clear any existing pagination from the HTML
    clearStaticPagination();
    
    // Add event listeners once DOM is fully loaded
    addEventListeners();
    
    // Fetch news data
    fetchNewsData();
  }
  
  /**
   * Clear the static pagination from HTML so we don't have duplicates
   */
  function clearStaticPagination() {
    const elements = getElements();
    if (elements.paginationContainer) {
      // Clear the static pagination that exists in the HTML
      elements.paginationContainer.innerHTML = '<nav class="flex items-center"></nav>';
    }
  }
  
  /**
   * Add all event listeners
   */
  function addEventListeners() {
    const elements = getElements();
    
    // Search and filter events
    if (elements.searchButton) {
      elements.searchButton.addEventListener('click', handleSearch);
    }
    
    if (elements.searchInput) {
      elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }
    
    if (elements.categorySelect) {
      elements.categorySelect.addEventListener('change', handleCategoryFilter);
    }
    
    // Sorting events
    if (elements.sortButtons.newest) {
      elements.sortButtons.newest.addEventListener('click', (e) => {
        e.preventDefault();
        handleSort('newest');
      });
    }
    
    if (elements.sortButtons.popular) {
      elements.sortButtons.popular.addEventListener('click', (e) => {
        e.preventDefault();
        handleSort('popular');
      });
    }
    
    if (elements.sortButtons.featured) {
      elements.sortButtons.featured.addEventListener('click', (e) => {
        e.preventDefault();
        handleSort('featured');
      });
    }
    
    // Add News button
    if (elements.addNewsButton) {
      elements.addNewsButton.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('item-creation-form');
      });
    }
    
    // Form validation events
    if (elements.newsForm) {
      elements.newsForm.addEventListener('submit', handleFormSubmit);
      
      // Add validation listeners to required fields
      Object.entries(elements.formInputs)
        .filter(([_, input]) => input && input.required)
        .forEach(([_, input]) => {
          if (input) {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
          }
        });
    }
    
    // Navigation handling for SPA-like experience
    elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Prevent default only for in-page navigation
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          navigateTo(targetId);
        }
      });
    });
    
    // Add event listeners to read more links in the grid
    document.querySelectorAll('.news-detail-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const newsId = parseInt(link.closest('[data-news-id]').getAttribute('data-news-id'));
        showNewsDetail(newsId);
      });
    });
  }
  
  /**
   * Fetch news data from API
   */
  async function fetchNewsData() {
    const elements = getElements();
    
    try {
      showLoading();
      
      // Fetch data from API
      const response = await fetch(CONFIG.apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process and enhance the raw API data
      state.newsItems = processNewsData(data);
      state.filteredItems = [...state.newsItems];
      state.totalPages = Math.ceil(state.filteredItems.length / CONFIG.itemsPerPage);
      
      // Render the news items
      renderNewsItems();
      renderPagination();
      
    } catch (error) {
      console.error('Error fetching news data:', error);
      showErrorMessage('Failed to load news items. Please try again later.');
    } finally {
      hideLoading();
    }
  }
  
  /**
   * Process and enhance the raw API data to match our needs
   * @param {Array} data - Raw data from API
   * @returns {Array} - Processed news items
   */
  function processNewsData(data) {
    // Take only first 30 items to work with
    const limitedData = data.slice(0, 30);
    
    // Map the data to our news item structure
    return limitedData.map((item, index) => {
      // Generate a random date within the last 30 days
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - randomDaysAgo);
      
      // Format date as Month DD, YYYY
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Assign a random category
      const categoryIndex = Math.floor(Math.random() * CONFIG.categories.length);
      const category = CONFIG.categories[categoryIndex];
      
      // Determine if item is featured or urgent based on some criteria
      const isFeatured = index % 10 === 0; // Every 10th item
      const isUrgent = index % 15 === 0;   // Every 15th item
      
      // Generate author name
      const authors = [
        'Admin', 'Sports Dept', 'Events Committee', 
        'Library Staff', 'Physics Department', 'Facilities Management'
      ];
      const author = authors[index % authors.length];
      
      // Return enhanced news item
      return {
        id: item.id,
        title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
        summary: item.body.split('.')[0] + '...',
        content: item.body,
        date: formattedDate,
        author: author,
        category: category,
        isFeatured: isFeatured,
        isUrgent: isUrgent,
        imageUrl: `/api/placeholder/800/450`,
        popularity: Math.floor(Math.random() * 100) // Random popularity score
      };
    });
  }
  
  /**
   * Render news items to the grid
   */
  function renderNewsItems() {
    const elements = getElements();
    
    // Calculate slice for current page
    const startIdx = (state.currentPage - 1) * CONFIG.itemsPerPage;
    const endIdx = startIdx + CONFIG.itemsPerPage;
    const currentItems = state.filteredItems.slice(startIdx, endIdx);
    
    // Clear current items
    elements.newsGrid.innerHTML = '';
    
    if (currentItems.length === 0) {
      elements.newsGrid.innerHTML = `
        <div class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8">
          <p class="text-gray-500 text-lg">No news items found matching your criteria.</p>
        </div>
      `;
      return;
    }
    
    // Create cards for each news item
    currentItems.forEach(item => {
      const card = createNewsCard(item);
      elements.newsGrid.appendChild(card);
    });
  }
  
  /**
   * Create a news card DOM element
   * @param {Object} item - News item data
   * @returns {HTMLElement} - News card element
   */
  function createNewsCard(item) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1';
    card.setAttribute('data-news-id', item.id);
    
    // Create tags markup
    let tagsMarkup = '';
    if (item.isFeatured) {
      tagsMarkup += `<span class="px-2 py-1 bg-secondary text-xs font-semibold rounded-full">Featured</span>`;
    }
    if (item.isUrgent) {
      tagsMarkup += `<span class="px-2 py-1 bg-accent text-white text-xs font-semibold rounded-full">Urgent</span>`;
    }
    tagsMarkup += `<span class="px-2 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full">${item.category}</span>`;
  
    card.innerHTML = `
      <img src="${item.imageUrl}" class="h-48 w-full object-cover" alt="${item.title}">
      <div class="p-5 flex flex-col h-64">
        <div class="flex gap-2 mb-3">
          ${tagsMarkup}
        </div>
        <h5 class="text-xl font-bold mb-2">${item.title}</h5>
        <p class="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">${item.summary}</p>
        <div class="text-gray-500 text-sm flex justify-between mt-3">
          <span>${item.date}</span>
          <span>By ${item.author}</span>
        </div>
        <a href="#item-detail-view" class="news-detail-link mt-auto bg-white text-primary border border-primary rounded-lg px-4 py-2 text-center hover:bg-primary hover:text-white transition">Read More</a>
      </div>
    `;
    
    // Add event listener to the "Read More" button
    const readMoreButton = card.querySelector('.news-detail-link');
    readMoreButton.addEventListener('click', (e) => {
      e.preventDefault();
      showNewsDetail(item.id);
    });
    
    return card;
  }
  
  /**
   * Show news detail view for a specific item
   * @param {number} newsId - ID of the news item to display
   */
  function showNewsDetail(newsId) {
    const elements = getElements();
    const newsItem = state.newsItems.find(item => item.id === newsId);
    
    if (!newsItem) {
      console.error('News item not found');
      showNotification('News item not found', true);
      return;
    }
    
    state.selectedNewsItem = newsItem;
    
    // Show the detail view section
    if (elements.detailView) {
      elements.detailView.style.display = 'block';
      
      // If needed, hide other main sections
      if (elements.creationForm) {
        elements.creationForm.style.display = 'none';
      }
      
      // Scroll to the detail view
      elements.detailView.scrollIntoView({ behavior: 'smooth' });
      
      // Create tags markup
      let tagsMarkup = '';
      if (newsItem.isFeatured) {
        tagsMarkup += `<span class="px-3 py-1 bg-secondary text-sm font-semibold rounded-full">Featured</span>`;
      }
      if (newsItem.isUrgent) {
        tagsMarkup += `<span class="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full">Urgent</span>`;
      }
      tagsMarkup += `<span class="px-3 py-1 bg-primary-light text-primary text-sm font-semibold rounded-full">${newsItem.category}</span>`;
      
      // Update the detail view content
      elements.detailView.innerHTML = `
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="${newsItem.imageUrl}" class="w-full h-64 object-cover" alt="${newsItem.title}">
            <div class="p-6">
              <div class="border-b border-gray-200 pb-4 mb-6">
                <h2 class="text-3xl font-bold mb-4">${newsItem.title}</h2>
                <div class="flex flex-wrap items-center gap-3 mb-4">
                  ${tagsMarkup}
                  <span class="text-gray-500">${newsItem.date}</span>
                  <div class="flex items-center">
                    <img src="/api/placeholder/100/100" alt="${newsItem.author}" class="w-8 h-8 rounded-full mr-2">
                    <span>${newsItem.author}</span>
                  </div>
                </div>
              </div>
              
              <div class="prose max-w-none">
                <p>${newsItem.content}</p>
                <img src="${newsItem.imageUrl}" class="my-6 rounded-lg w-full" alt="Detail image">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, 
                   nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia.</p>
              </div>
              
              <div class="flex flex-wrap gap-3 mt-8">
                <a href="#" id="back-to-news" class="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition flex items-center gap-2">
                    Back to News
                </a>
                <a href="#" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-2">
                    Edit
                </a>
                <button class="px-4 py-2 text-accent border border-accent rounded-lg hover:bg-accent hover:text-white transition flex items-center gap-2">
                    Delete
                </button>
              </div>
              
              <div class="mt-12">
                <h4 class="text-xl font-bold mb-6">Comments (3)</h4>
                
                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center">
                      <img src="/api/placeholder/50/50" alt="Sarah Johnson" class="w-10 h-10 rounded-full mr-3">
                      <strong>Sarah Johnson</strong>
                    </div>
                    <small class="text-gray-500">March 26, 2025 at 10:14 AM</small>
                  </div>
                  <p class="text-gray-700">This is such exciting news! I can't wait to learn more about this.</p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center">
                      <img src="/api/placeholder/50/50" alt="Professor Martinez" class="w-10 h-10 rounded-full mr-3">
                      <strong>Professor Martinez</strong>
                    </div>
                    <small class="text-gray-500">March 26, 2025 at 2:30 PM</small>
                  </div>
                  <p class="text-gray-700">Great information! Thanks for sharing this with the campus community.</p>
                </div>
                
                <form class="mt-8" id="comment-form">
                  <div class="mb-4">
                    <label for="commentText" class="block text-gray-700 font-medium mb-2">Add a comment</label>
                    <textarea class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" id="commentText" rows="3" placeholder="Share your thoughts..."></textarea>
                  </div>
                  <button type="submit" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition">Post Comment</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add event listener to the back button
      const backButton = elements.detailView.querySelector('#back-to-news');
      if (backButton) {
        backButton.addEventListener('click', (e) => {
          e.preventDefault();
          hideNewsDetail();
        });
      }
      
      // Add event listener to the comment form
      const commentForm = elements.detailView.querySelector('#comment-form');
      if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          showNotification('Comment submitted successfully!', false);
        });
      }
      
      // Show notification
      showNotification(`Viewing: ${newsItem.title}`, false);
    } else {
      console.error('Detail view element not found');
    }
  }
  
  /**
   * Hide news detail view and show news listing
   */
  function hideNewsDetail() {
    const elements = getElements();
    
    // Hide the detail view
    if (elements.detailView) {
      elements.detailView.style.display = 'none';
    }
    
    // Show news grid
    if (elements.newsGrid && elements.newsGrid.parentElement) {
      elements.newsGrid.parentElement.style.display = 'block';
    }
    
    // Scroll back to the news grid
    if (elements.newsGrid) {
      elements.newsGrid.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show notification
    showNotification('Returned to news listing', false);
  }
  
  /**
   * Handle search functionality
   */
  function handleSearch() {
    const elements = getElements();
    
    if (!elements.searchInput) {
      console.error('Search input not found');
      return;
    }
    
    const searchQuery = elements.searchInput.value.trim().toLowerCase();
    
    // Reset to page 1 when searching
    state.currentPage = 1;
    
    // If search query is empty and category is "All Categories", reset to all items
    if (searchQuery === '' && state.currentCategory === 'All Categories') {
      state.filteredItems = [...state.newsItems];
      showNotification('Showing all news items', false);
    } else {
      // Filter by search query and current category
      state.filteredItems = state.newsItems.filter(item => {
        const matchesSearch = searchQuery === '' || 
          item.title.toLowerCase().includes(searchQuery) || 
          item.content.toLowerCase().includes(searchQuery);
        
        const matchesCategory = state.currentCategory === 'All Categories' || 
          item.category === state.currentCategory;
        
        return matchesSearch && matchesCategory;
      });
      
      // Show notification with search results
      if (searchQuery !== '') {
        showNotification(`Found ${state.filteredItems.length} results for "${searchQuery}"`, false);
      } else if (state.currentCategory !== 'All Categories') {
        showNotification(`Showing ${state.filteredItems.length} ${state.currentCategory} news items`, false);
      }
    }
    
    // Update total pages
    state.totalPages = Math.ceil(state.filteredItems.length / CONFIG.itemsPerPage);
    
    // Render filtered items
    renderNewsItems();
    renderPagination();
  }
  
  /**
   * Handle category filter change
   */
  function handleCategoryFilter() {
    const elements = getElements();
    state.currentCategory = elements.categorySelect.value;
    
    // Reset to page 1 when filtering
    state.currentPage = 1;
    
    // Call handleSearch to apply both search and category filters
    handleSearch();
  }
  
  /**
   * Handle sorting of news items
   * @param {string} sortType - Type of sorting ('newest', 'popular', 'featured')
   */
  function handleSort(sortType) {
    const elements = getElements();
    
    // Update active sort button styles
    Object.keys(elements.sortButtons).forEach(key => {
      const button = elements.sortButtons[key];
      if (!button) return;
      
      if (key === sortType) {
        button.classList.remove('bg-white', 'text-gray-700');
        button.classList.add('bg-primary', 'text-white');
      } else {
        button.classList.remove('bg-primary', 'text-white');
        button.classList.add('bg-white', 'text-gray-700');
      }
    });
    
    // Update state
    state.sortBy = sortType;
    
    // Sort the filtered items
    switch (sortType) {
      case 'newest':
        // Sort by date (newest first)
        state.filteredItems.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        break;
      case 'popular':
        // Sort by popularity (highest first)
        state.filteredItems.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'featured':
        // Featured items first, then by date
        state.filteredItems.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.date) - new Date(a.date);
        });
        break;
    }
    
    // Reset to page 1 when sorting
    state.currentPage = 1;
    
    // Render sorted items
    renderNewsItems();
    renderPagination();
    
    // Show a notification for sorting
    showNotification(`News sorted by ${sortType}`, false);
  }
  
  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    const elements = getElements();
    
    if (!elements.newsForm) {
      console.error('News form not found');
      return;
    }
    
    const form = elements.newsForm;
    
    // Validate all required fields
    let isValid = true;
    
    Object.entries(elements.formInputs)
      .filter(([_, input]) => input && input.required)
      .forEach(([_, input]) => {
        if (!validateField({ target: input })) {
          isValid = false;
        }
      });
    
    if (!isValid) {
      showFormMessage('Please fix the errors in the form.', true);
      return;
    }
    
    // In a real application, this would submit to a server
    console.log('Form submitted with valid data');
    
    // Create a mock news item from the form data
    const newNewsItem = {
      id: state.newsItems.length + 1,
      title: elements.formInputs.title.value,
      summary: elements.formInputs.summary.value,
      content: elements.formInputs.content.value,
      date: new Date(elements.formInputs.date.value).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      author: 'User',
      category: elements.formInputs.category.value,
      isFeatured: elements.formInputs.featured.checked,
      isUrgent: elements.formInputs.urgent.checked,
      imageUrl: `/api/placeholder/800/450`,
      popularity: 0 // New items start with zero popularity
    };
    
    // Add to news items
    state.newsItems.unshift(newNewsItem);
    state.filteredItems = [...state.newsItems];
    
    // Reset to page 1 and re-render
    state.currentPage = 1;
    renderNewsItems();
    renderPagination();
    
    // Show success message
    showFormMessage('News item published successfully!', false);
    
    // Reset form after submission
    form.reset();
    
    // Navigate back to news listing
    setTimeout(() => {
      navigateTo('News');
    }, 2000);
  }
  
  /**
   * Validate a form field
   * @param {Event} e - Blur or input event
   * @returns {boolean} - Validation result
   */
  function validateField(e) {
    const input = e.target;
    let isValid = true;
    let errorMessage = '';
    
    // Remove any existing error messages
    clearFieldError({ target: input });
    
    // Validate based on field type
    if (input.id === 'newsTitle') {
      if (!input.value.trim()) {
        isValid = false;
        errorMessage = 'Title is required';
      } else if (input.value.trim().length < 5) {
        isValid = false;
        errorMessage = 'Title must be at least 5 characters';
      }
    } else if (input.id === 'newsCategory') {
      if (!input.value) {
        isValid = false;
        errorMessage = 'Please select a category';
      }
    } else if (input.id === 'newsDate') {
      if (!input.value) {
        isValid = false;
        errorMessage = 'Date is required';
      }
    } else if (input.id === 'newsSummary') {
      if (!input.value.trim()) {
        isValid = false;
        errorMessage = 'Summary is required';
      } else if (input.value.trim().length < 10) {
        isValid = false;
        errorMessage = 'Summary must be at least 10 characters';
      }
    } else if (input.id === 'newsContent') {
      if (!input.value.trim()) {
        isValid = false;
        errorMessage = 'Content is required';
      } else if (input.value.trim().length < 50) {
        isValid = false;
        errorMessage = 'Content must be at least 50 characters';
      }
    }
    
    // If not valid, show error message
    if (!isValid) {
      const errorElement = document.createElement('p');
      errorElement.className = 'text-accent text-sm mt-1 error-message';
      errorElement.textContent = errorMessage;
      
      // Add error class to input
      input.classList.add('border-accent');
      
      // Add error message after input
      input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    return isValid;
  }
  
  /**
   * Clear error for a form field
   * @param {Event} e - Input event
   */
  function clearFieldError(e) {
    const input = e.target;
    
    // Remove error class from input
    input.classList.remove('border-accent');
    
    // Remove any error messages
    const errorElements = input.parentNode.querySelectorAll('.error-message');
    errorElements.forEach(el => el.remove());
  }
  
  /**
   * Show form message (success or error)
   * @param {string} message - Message to display
   * @param {boolean} isError - Whether it's an error message
   */
  function showFormMessage(message, isError) {
    const elements = getElements();
    
    if (!elements.newsForm) {
      // If form not found, use notification instead
      showNotification(message, isError);
      return;
    }
    
    const form = elements.newsForm;
    
    // Remove any existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `p-4 mb-4 rounded-lg form-message ${isError ? 'bg-red-100 text-accent' : 'bg-green-100 text-green-800'}`;
    messageElement.textContent = message;
    
    // Insert at top of form
    form.prepend(messageElement);
    
    // Also show notification
    showNotification(message, isError);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
  
  /**
   * Render pagination controls
   */
  function renderPagination() {
    const elements = getElements();
    
    // Ensure we have a valid pagination container
    if (!elements.paginationContainer || !elements.paginationNav) {
      console.error('Pagination container or nav not found');
      return;
    }
    
    // Clear current pagination
    elements.paginationNav.innerHTML = '';
    
    // Don't show pagination if only one page
    if (state.totalPages <= 1) {
      return;
    }
    
    // Create previous button
    const prevButton = document.createElement('a');
    prevButton.href = '#';
    prevButton.className = `px-4 py-2 mx-1 text-gray-700 bg-white rounded-lg border border-gray-300 ${state.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`;
    prevButton.textContent = 'Previous';
    
    if (state.currentPage > 1) {
      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        changePage(state.currentPage - 1);
      });
    }
    
    elements.paginationNav.appendChild(prevButton);
    
    // Create page number buttons (with ellipsis for many pages)
    const maxPageButtons = 3;
    const pageNumbers = [];
    
    if (state.totalPages <= maxPageButtons) {
      // Show all page numbers
      for (let i = 1; i <= state.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited page numbers with current page in middle if possible
      pageNumbers.push(1);
      
      if (state.currentPage > 2) {
        pageNumbers.push('...');
      }
      
      if (state.currentPage !== 1 && state.currentPage !== state.totalPages) {
        pageNumbers.push(state.currentPage);
      }
      
      if (state.currentPage < state.totalPages - 1) {
        pageNumbers.push('...');
      }
      
      pageNumbers.push(state.totalPages);
    }
    
    // Create page buttons
    pageNumbers.forEach(page => {
      if (page === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'px-4 py-2 mx-1';
        ellipsis.textContent = '...';
        elements.paginationNav.appendChild(ellipsis);
      } else {
        const pageButton = document.createElement('a');
        pageButton.href = '#';
        pageButton.className = `px-4 py-2 mx-1 rounded-lg border ${state.currentPage === page ? 'text-white bg-primary border-primary' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100'}`;
        pageButton.textContent = page;
        
        pageButton.addEventListener('click', (e) => {
          e.preventDefault();
          changePage(page);
        });
        
        elements.paginationNav.appendChild(pageButton);
      }
    });
    
    // Create next button
    const nextButton = document.createElement('a');
    nextButton.href = '#';
    nextButton.className = `px-4 py-2 mx-1 text-gray-700 bg-white rounded-lg border border-gray-300 ${state.currentPage === state.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`;
    nextButton.textContent = 'Next';
    
    if (state.currentPage < state.totalPages) {
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        changePage(state.currentPage + 1);
      });
    }
    
    elements.paginationNav.appendChild(nextButton);
  }
  
  /**
   * Change current page
   * @param {number} pageNumber - Page number to change to
   */
  function changePage(pageNumber) {
    if (pageNumber < 1 || pageNumber > state.totalPages) {
      return;
    }
    
    state.currentPage = pageNumber;
    renderNewsItems();
    renderPagination();
    
    // Scroll to top of news grid
    const elements = getElements();
    elements.newsGrid.scrollIntoView({ behavior: 'smooth' });
  }
  
  /**
   * Navigate to a specific section of the page
   * @param {string} sectionId - ID of section to navigate to
   */
  function navigateTo(sectionId) {
    const elements = getElements();
    
    // Show/hide appropriate sections
    if (sectionId === 'News' || sectionId === 'Home') {
      // Show news listing
      if (elements.detailView) {
        elements.detailView.style.display = 'none';
      }
      if (elements.creationForm) {
        elements.creationForm.style.display = 'none';
      }
      if (elements.newsGrid && elements.newsGrid.parentElement) {
        elements.newsGrid.parentElement.style.display = 'block';
      }
    } else if (sectionId === 'item-detail-view') {
      // Show detail view (handled by showNewsDetail)
      // But ensure other sections are hidden
      if (elements.creationForm) {
        elements.creationForm.style.display = 'none';
      }
    } else if (sectionId === 'item-creation-form') {
      // Show creation form
      if (elements.detailView) {
        elements.detailView.style.display = 'none';
      }
      if (elements.creationForm) {
        elements.creationForm.style.display = 'block';
        elements.creationForm.scrollIntoView({ behavior: 'smooth' });
        
        // Show a notification
        showNotification('Ready to add a new news item', false);
      } else {
        console.error('Creation form not found');
      }
    }
  }
  
  /**
   * Show loading indicator
   */
  function showLoading() {
    const elements = getElements();
    state.isLoading = true;
    
    // Check if loading element already exists
    if (document.getElementById('news-loading-indicator')) {
      return;
    }
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'news-loading-indicator';
    loadingOverlay.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
    
    // Create loading spinner
    loadingOverlay.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
        <p class="text-gray-700">Loading...</p>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(loadingOverlay);
  }
  
  /**
   * Hide loading indicator
   */
  function hideLoading() {
    state.isLoading = false;
    
    const loadingElement = document.getElementById('news-loading-indicator');
    if (loadingElement) {
      loadingElement.remove();
    }
  }
  
  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  function showErrorMessage(message) {
    const elements = getElements();
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'bg-accent bg-opacity-10 text-accent px-4 py-3 rounded-md mb-6';
    errorElement.innerHTML = `
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>${message}</p>
      </div>
    `;
    
    // Insert at top of main content
    elements.mainContent.prepend(errorElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }
  
  // Initialize the application when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);
  