document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
  
    // Initialize elements
    const searchInput = document.querySelector('input[type="search"]');
    const reviewsContainer = document.querySelector('.row.g-4');
    const paginationContainer = document.querySelector('.pagination');
    const addReviewModal = document.getElementById('addReviewModal');
    const reviewForm = addReviewModal.querySelector('form');
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'container mt-3';
    document.querySelector('main').prepend(errorContainer);
  
    // State Management
    let reviews = [];
    let currentPage = 1;
    const reviewsPerPage = 6;
    let currentFilter = 'all';
    let currentSort = 'newest';
  
    // Mock data for reviews (updated to match HTML content)
    const mockReviews = [
      {
        id: 1,
        title: "Intro to Computer Science",
        professor: "Prof. Smith",
        rating: 5,
        review: "The professor was engaging and the materials were top-notch. Highly recommend for beginners.",
        author: "Alex Johnson",
        date: "2023-10-15",
        likes: 24,
        comments: []
      },
      {
        id: 2,
        title: "Calculus II",
        professor: "Prof. Johnson",
        rating: 3,
        review: "Good content but the assignments were too time-consuming compared to the credit hours offered.",
        author: "Sam Wilson",
        date: "2023-10-10",
        likes: 8,
        comments: []
      },
      {
        id: 3,
        title: "Business Ethics",
        professor: "Prof. Davis",
        rating: 4,
        review: "Lots of discussion-based learning which I appreciated.",
        author: "Maria Garcia",
        date: "2023-10-05",
        likes: 15,
        comments: []
      }
    ];
  
    // Filter and sort reviews
    function applyFiltersAndSort() {
      const searchTerm = searchInput.value.toLowerCase();
      
      let filteredReviews = reviews.filter(review => {
        return review.title.toLowerCase().includes(searchTerm) ||
               review.review.toLowerCase().includes(searchTerm) ||
               review.professor.toLowerCase().includes(searchTerm);
      });
  
      // Sort reviews
      filteredReviews.sort((a, b) => {
        switch (currentSort) {
          case 'newest': return new Date(b.date) - new Date(a.date);
          case 'highest': return b.rating - a.rating;
          default: return new Date(b.date) - new Date(a.date);
        }
      });
  
      updatePagination(filteredReviews.length);
      displayReviews(filteredReviews);
    }
  
    // Display reviews with pagination
    function displayReviews(filteredReviews) {
      const startIndex = (currentPage - 1) * reviewsPerPage;
      const endIndex = startIndex + reviewsPerPage;
      const currentReviews = filteredReviews.slice(startIndex, endIndex);
  
      reviewsContainer.innerHTML = currentReviews.map(review => `
        <article class="col-12 col-md-6 col-lg-4">
          <div class="card review-card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title">${review.title}</h5>
                <div class="rating-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
              </div>
              <span class="professor">${review.professor}</span>
              <p class="card-text">${review.review}</p>
              <div class="review-footer">
                <small class="review-date">${review.author} • ${review.date}</small>
                <div class="review-actions">
                  <button class="btn btn-sm btn-outline-success me-1" onclick="likeReview(${review.id})">👍 ${review.likes}</button>
                  <button class="btn btn-sm btn-outline-primary" onclick="showComments(${review.id})">💬 ${review.comments.length}</button>
                </div>
              </div>
            </div>
          </div>
        </article>
      `).join('');
    }
  
    // Update pagination
    function updatePagination(totalReviews) {
      const totalPages = Math.ceil(totalReviews / reviewsPerPage);
      
      paginationContainer.innerHTML = totalPages <= 1 ? '' : `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">&laquo;</a>
        </li>
        ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
          <li class="page-item ${page === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${page})">${page}</a>
          </li>
        `).join('')}
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">&raquo;</a>
        </li>
      `;
    }
  
    // Event Handlers
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      applyFiltersAndSort();
    });
  
    // Filter dropdown handler
    document.querySelectorAll('.dropdown-menu a').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.closest('.dropdown-menu').previousElementSibling.textContent.includes('Filter')) {
          currentFilter = e.target.textContent;
        } else {
          currentSort = e.target.textContent.includes('Newest') ? 'newest' : 'highest';
        }
        currentPage = 1;
        applyFiltersAndSort();
      });
    });
  
    // Review form handler
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formElements = reviewForm.elements;
      const newReview = {
        id: Date.now(),
        title: formElements[0].value,
        professor: formElements[1].value,
        rating: parseInt(formElements[2].value),
        review: formElements[3].value,
        author: "You",
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: []
      };
  
      if (!newReview.title || !newReview.professor || isNaN(newReview.rating) || !newReview.review) {
        showError('Please fill in all fields correctly');
        return;
      }
  
      reviews.unshift(newReview);
      localStorage.setItem('reviews', JSON.stringify(reviews));
      
      reviewForm.reset();
      bootstrap.Modal.getInstance(addReviewModal).hide();
      currentPage = 1;
      applyFiltersAndSort();
      showSuccess('Review added successfully!');
    });
  
    // Helper functions
    window.showError = function(message) {
      errorContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
    };
  
    window.showSuccess = function(message) {
      errorContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
    };
  
    window.changePage = function(page) {
      if (page < 1 || page > Math.ceil(reviews.length / reviewsPerPage)) return;
      currentPage = page;
      applyFiltersAndSort();
    };
  
    window.likeReview = function(reviewId) {
      const review = reviews.find(r => r.id === reviewId);
      if (review) {
        review.likes++;
        localStorage.setItem('reviews', JSON.stringify(reviews));
        applyFiltersAndSort();
      }
    };
  
    window.showComments = function(reviewId) {
      alert(`Showing comments for review ${reviewId}`);
    };
  
    // Initialize reviews
    function fetchReviews() {
      try {
        const storedReviews = localStorage.getItem('reviews');
        reviews = storedReviews ? JSON.parse(storedReviews) : mockReviews;
        localStorage.setItem('reviews', JSON.stringify(reviews));
        applyFiltersAndSort();
      } catch (error) {
        console.error('Error loading reviews:', error);
        reviews = mockReviews;
        applyFiltersAndSort();
        showError('Error loading reviews. Showing default data.');
      }
    }
  
    // Initial load
    fetchReviews();
  });