// Alternative Dashboard App
(() => {
  const API_URL = "http://localhost:3001/api";
  
  // API helper function
  async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "login.html";
          return;
        }
        throw new Error(data.message || "API request failed");
      }
      
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Get current user
  function getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check authentication
  function checkAuth() {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();
    
    if (!token || !user) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  let currentUser = null;

  // Initialize
  async function init() {
    if (!checkAuth()) return;
    
    currentUser = getCurrentUser();
    
    // Update user label
    const userLabel = document.getElementById('userLabel');
    if (userLabel) {
      userLabel.textContent = `${currentUser.name} (${currentUser.role})`;
    }

    // Set up logout
    document.getElementById('btnLogout')?.addEventListener('click', logout);

    // Set up navigation
    setupNavigation();
    
    // Show role-specific navigation
    showRoleNavigation();
    
    // Load default view
    loadView('classes');
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }

  function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.target.getAttribute('data-view');
        loadView(view);
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  function showRoleNavigation() {
    if (currentUser.role === 'teacher') {
      document.getElementById('teacherLinks')?.classList.remove('hidden');
    }
    if (currentUser.role === 'admin') {
      document.getElementById('adminLinks')?.classList.remove('hidden');
    }
  }

  async function loadView(viewName) {
    const contentArea = document.getElementById('content-area');
    
    try {
      switch (viewName) {
        case 'classes':
          await loadClassesView(contentArea);
          break;
        case 'assignments':
          await loadAssignmentsView(contentArea);
          break;
        case 'teacher-classes':
          await loadTeacherClassesView(contentArea);
          break;
        case 'admin-users':
          await loadAdminUsersView(contentArea);
          break;
        default:
          contentArea.innerHTML = '<p>View not found</p>';
      }
    } catch (error) {
      contentArea.innerHTML = `<p class="error">Error loading view: ${error.message}</p>`;
    }
  }

  async function loadClassesView(container) {
    container.innerHTML = '<p>Loading classes...</p>';
    
    const classes = await apiCall('/classes');
    
    let html = '<h3>My Classes</h3>';
    
    if (classes.length === 0) {
      html += '<p class="muted">No classes found.</p>';
      if (currentUser.role === 'student') {
        html += `
          <div class="mt-2">
            <input id="joinCode" placeholder="Enter class code" />
            <button onclick="joinClass()" class="btn">Join Class</button>
          </div>
        `;
      }
    } else {
      html += '<ul class="list">';
      classes.forEach(cls => {
        html += `
          <li>
            <div>
              <strong>${cls.title}</strong>
              <div class="muted small">Code: ${cls.code}</div>
            </div>
            <div>
              <button onclick="viewClass('${cls._id}')" class="btn subtle">View</button>
            </div>
          </li>
        `;
      });
      html += '</ul>';
    }
    
    container.innerHTML = html;
  }

  async function loadAssignmentsView(container) {
    container.innerHTML = '<h3>My Submissions</h3><p class="muted">Submissions view coming soon...</p>';
  }

  async function loadTeacherClassesView(container) {
    container.innerHTML = '<p>Loading teacher classes...</p>';
    
    const classes = await apiCall('/classes');
    
    let html = '<h3>My Classes (Teacher View)</h3>';
    html += `<button onclick="createClass()" class="btn mb-2">Create New Class</button>`;
    
    if (classes.length === 0) {
      html += '<p class="muted">No classes created yet.</p>';
    } else {
      html += '<ul class="list">';
      classes.forEach(cls => {
        html += `
          <li>
            <div>
              <strong>${cls.title}</strong>
              <div class="muted small">Code: ${cls.code} • Members: ${cls.members?.length || 0}</div>
            </div>
            <div>
              <button onclick="manageClass('${cls._id}')" class="btn subtle">Manage</button>
            </div>
          </li>
        `;
      });
      html += '</ul>';
    }
    
    container.innerHTML = html;
  }

  async function loadAdminUsersView(container) {
    container.innerHTML = '<h3>User Management</h3><p class="muted">Admin user management coming soon...</p>';
  }

  // Global functions for button clicks
  window.joinClass = async function() {
    const code = document.getElementById('joinCode').value.trim();
    if (!code) return alert('Enter class code');
    
    try {
      await apiCall('/classes/join', {
        method: 'POST',
        body: JSON.stringify({ code })
      });
      alert('Joined class successfully!');
      loadView('classes');
    } catch (error) {
      alert('Error joining class: ' + error.message);
    }
  };

  window.viewClass = function(classId) {
    alert(`View class ${classId} - Feature coming soon!`);
  };

  window.createClass = function() {
    const title = prompt('Class title:');
    const code = prompt('Class code:');
    
    if (title && code) {
      apiCall('/classes', {
        method: 'POST',
        body: JSON.stringify({ title, code })
      }).then(() => {
        alert('Class created successfully!');
        loadView('teacher-classes');
      }).catch(error => {
        alert('Error creating class: ' + error.message);
      });
    }
  };

  window.manageClass = function(classId) {
    alert(`Manage class ${classId} - Feature coming soon!`);
  };

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();