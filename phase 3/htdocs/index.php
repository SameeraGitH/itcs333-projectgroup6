

<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Campus Hub - Club Activities</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="styles.css">
  </head>

  <body class="bg-gray-100 font-sans">


    <nav class="bg-white border-b border-gray-200 shadow-md px-4 py-2">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        
        <div class="text-xl font-bold text-blue-800 ">
          Campus Hub
        </div>
    
        
            <ul class="flex-col gap-4 lg:flex lg:flex-row lg:space-x-6 lg:justify-end lg:items-center hidden lg:flex">
              <li><a class="text-gray-600 hover:text-blue-600 pointer-events-none cursor-default">Home</a></li>
              <li><a class="text-gray-600 hover:text-blue-600 pointer-events-none cursor-default">Events</a></li>
              <li><a class="text-gray-600 hover:text-blue-600 pointer-events-none cursor-default">Course Reviews</a></li>
              <li><a class="text-gray-600 hover:text-blue-600 pointer-events-none cursor-default">Course Notes</a></li>
              <li><a class="text-gray-600 hover:text-blue-600 pointer-events-none cursor-default">Campus News</a></li>
              <li><a class="text-blue-600 font-semibold pointer-events-none cursor-default">Club Activities</a></li>
              <li><a class="text-gray-600 hover:text-blue-600 pointer-events-none cursor-default">Student Marketplace</a></li>
            </ul>

      </div>
    </nav>
    
    <div class="w-full max-w-7xl mx-auto px-4 mt-2"> 
      <div class="flex flex-col gap-2 max-w-sm"> 
      <div class="flex items-center gap-2">
          
              <input type="text" id="searchInput"placeholder="Search club activities"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md shadow-md transition duration-200">
                  🔍
              </button>
          


      </div>

      
        <select 
            id="clubFilter" 
            class="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            
            <option value="">All Clubs</option>
            
        </select>
        
      </div>
    </div>
       
      <div class="text-box">
          <h1 class="text-4xl font-bold text-center text-gray-800">Club Activities</h1>
          
      </div>
      
      <div class="activity-list grid gap-6">
        <div id="activity-list"></div>


          
      </div>
      <div class="pagination flex justify-center gap-4 my-6">
        <button id="prevBtn" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</button>
        <span id="pageInfo" class="py-2">Page 1</span>
        <button id="nextBtn" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next</button>
      </div>
    

      <div class="form-button flex justify-center mt-8">
          <a href="activityCreationForm.html">
          <button class="bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-800">
            Add New Activity </button>
          </a>
      </div>

      <script src="activities.js"></script>
    <script>
      async function loadActivities() {
        const response = await fetch('/api.php');
        const data = await response.json();

        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = ''; // clearing the previous ones

        if (data.length === 0) {
          activityList.innerHTML = '<p>No activities found.</p>';
          return;
        }

        data.forEach(activity => {
          const div = document.createElement('div');
          div.innerHTML = `
            <h3>${activity.name}</h3>
            <p>${activity.description}</p>
            <p><strong>Date:</strong> ${activity.date}</p>
          `;
          activityList.appendChild(div);
        });
      }
      loadActivities();
    </script>

    <!-- Comment Section -->
    <div class="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Comments</h2>

        <!-- Comment Form -->
        <form id="commentForm" class="mb-8">
            <div class="mb-4">
                <label for="commentName" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="commentName" name="name" required
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mb-4">
                <label for="commentText" class="block text-sm font-medium text-gray-700">Your Comment</label>
                <textarea id="commentText" name="comment" rows="3" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                Post Comment
            </button>
        </form>

        <!-- Comments List here -->
        <div id="commentsContainer" class="space-y-4">
            
        </div>
    </div>

  </body>
</html>