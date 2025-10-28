// Real API-connected version of the classroom portal
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
                    // Token expired, redirect to login
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

    // Get current user from localStorage
    function getCurrentUser() {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    }

    // Check if user is logged in
    function checkAuth() {
        const token = localStorage.getItem("token");
        const user = getCurrentUser();

        if (!token || !user) {
            window.location.href = "login.html";
            return false;
        }
        return true;
    }

    // DOM helpers
    const $ = (s) => document.querySelector(s);
    const show = el => el && el.classList.remove('hidden');
    const hide = el => el && el.classList.add('hidden');
    const formatDate = d => new Date(d).toLocaleString();

    // State
    let CURRENT_USER = null;
    let CURRENT_CLASS = null;
    let CURRENT_ASSIGNMENT = null;
    let PAGE = 1;
    const PAGE_SIZE = 5;

    // Initialize app
    async function init() {
        if (!checkAuth()) return;

        CURRENT_USER = getCurrentUser();

        // Set up role selector to show current user's role
        const roleSelect = $('#roleSelect');
        if (roleSelect) {
            roleSelect.value = CURRENT_USER.role;
            roleSelect.disabled = true; // Can't change role in real app
        }

        // Set up logout
        $('#logoutBtn')?.addEventListener('click', logout);

        // Load dashboard based on user role
        await renderDashboard();
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "login.html";
    }

    // Render dashboard based on user role
    async function renderDashboard() {
        hideAllPages();

        try {
            if (CURRENT_USER.role === 'student') {
                await renderStudentDashboard();
                show($('#studentDashboard'));
            } else if (CURRENT_USER.role === 'teacher') {
                await renderTeacherDashboard();
                show($('#teacherDashboard'));
            } else if (CURRENT_USER.role === 'admin') {
                await renderAdminDashboard();
                show($('#adminDashboard'));
            }
        } catch (error) {
            alert("Error loading dashboard: " + error.message);
        }
    }

    // Student Dashboard
    async function renderStudentDashboard() {
        try {
            // Load student's classes
            const classes = await apiCall('/classes');
            const ul = $('#studentClassesList');
            if (ul) {
                ul.innerHTML = '';
                classes.forEach(c => {
                    const li = document.createElement('li');
                    li.innerHTML = `
            <div>
              <strong>${c.title}</strong>
              <div class="muted small">Code: ${c.code}</div>
            </div>
            <div>
              <button class="btn subtle" onclick="openClass('${c._id}')">Open</button>
            </div>
          `;
                    ul.appendChild(li);
                });
            }

            // Set up join class functionality
            $('#joinClassBtn')?.addEventListener('click', async () => {
                const code = $('#joinCodeInput').value.trim();
                if (!code) return alert('Enter join code');

                try {
                    await apiCall('/classes/join', {
                        method: 'POST',
                        body: JSON.stringify({ code })
                    });
                    alert('Joined class successfully!');
                    renderStudentDashboard();
                } catch (error) {
                    alert('Error joining class: ' + error.message);
                }
            });

        } catch (error) {
            console.error('Error rendering student dashboard:', error);
        }
    }

    // Teacher Dashboard
    async function renderTeacherDashboard() {
        try {
            // Load teacher's classes
            const classes = await apiCall('/classes');
            const ul = $('#teacherClassesList');
            if (ul) {
                ul.innerHTML = '';
                classes.forEach(c => {
                    const li = document.createElement('li');
                    li.innerHTML = `
            <div>
              <strong>${c.title}</strong>
              <div class="muted small">Code: ${c.code}</div>
            </div>
            <div>
              <button class="btn subtle" onclick="openClass('${c._id}')">Open</button>
            </div>
          `;
                    ul.appendChild(li);
                });
            }

            // Set up create class functionality
            $('#teacherCreateClassBtn')?.addEventListener('click', () => {
                openModal('Create Class', `
          <div>
            <label>Title</label><input id="m_title" />
            <label>Code</label><input id="m_code" />
          </div>
        `, async () => {
                    const title = $('#m_title').value.trim();
                    const code = $('#m_code').value.trim();
                    if (!title || !code) return alert('Fill both fields');

                    try {
                        await apiCall('/classes', {
                            method: 'POST',
                            body: JSON.stringify({ title, code })
                        });
                        closeModal();
                        renderTeacherDashboard();
                    } catch (error) {
                        alert('Error creating class: ' + error.message);
                    }
                });
            });

        } catch (error) {
            console.error('Error rendering teacher dashboard:', error);
        }
    }

    // Admin Dashboard
    async function renderAdminDashboard() {
        try {
            // Load all classes for admin
            const classes = await apiCall('/classes');
            const ul = $('#adminClassesList');
            if (ul) {
                ul.innerHTML = '';
                classes.forEach(c => {
                    const li = document.createElement('li');
                    li.innerHTML = `
            <div>
              <strong>${c.title}</strong>
              <div class="muted small">Teacher: ${c.teacherId?.name || 'Unknown'}</div>
            </div>
            <div>
              <button class="btn subtle" onclick="openClass('${c._id}')">Open</button>
            </div>
          `;
                    ul.appendChild(li);
                });
            }

            // Admin create class functionality
            $('#adminCreateClassBtn')?.addEventListener('click', () => {
                openModal('Create Class (Admin)', `
          <div>
            <label>Title</label><input id="m_title" />
            <label>Code</label><input id="m_code" />
          </div>
        `, async () => {
                    const title = $('#m_title').value.trim();
                    const code = $('#m_code').value.trim();
                    if (!title || !code) return alert('Fill both fields');

                    try {
                        await apiCall('/classes', {
                            method: 'POST',
                            body: JSON.stringify({ title, code })
                        });
                        closeModal();
                        renderAdminDashboard();
                    } catch (error) {
                        alert('Error creating class: ' + error.message);
                    }
                });
            });

        } catch (error) {
            console.error('Error rendering admin dashboard:', error);
        }
    }

    // Open class page
    async function openClass(classId) {
        try {
            // This would need a specific API endpoint to get class details
            // For now, we'll use the classes list and find the specific class
            const classes = await apiCall('/classes');
            const cls = classes.find(c => c._id === classId);

            if (!cls) {
                alert('Class not found');
                return;
            }

            CURRENT_CLASS = cls;

            // Update class page UI
            $('#classTitle').textContent = cls.title;
            $('#classCode').textContent = `Code: ${cls.code}`;

            // Show/hide create assignment button for teachers
            if (CURRENT_USER.role === 'teacher') {
                show($('#createAssignmentBtn'));
            } else {
                hide($('#createAssignmentBtn'));
            }

            // Set up navigation
            $('#backToDashboardBtn').onclick = renderDashboard;
            $('#createAssignmentBtn').onclick = openCreateAssignmentModal;

            // Load assignments for this class
            await loadClassAssignments(classId);

            hideAllPages();
            show($('#classPage'));

        } catch (error) {
            alert('Error opening class: ' + error.message);
        }
    }

    // Load assignments for a class
    async function loadClassAssignments(classId) {
        try {
            const assignments = await apiCall(`/assignments/class/${classId}`);
            const ul = $('#assignmentsList');

            if (ul) {
                ul.innerHTML = '';
                assignments.forEach(a => {
                    const li = document.createElement('li');
                    li.innerHTML = `
            <div>
              <strong>${a.title}</strong>
              <div class="muted small">Due: ${formatDate(a.dueAt)}</div>
            </div>
            <div>
              <button class="btn subtle" onclick="openAssignment('${a._id}')">Open</button>
            </div>
          `;
                    ul.appendChild(li);
                });
            }
        } catch (error) {
            console.error('Error loading assignments:', error);
        }
    }

    // Modal helpers
    function openModal(title, html, onSave) {
        $('#modalTitle').textContent = title;
        $('#modalBody').innerHTML = html;
        show($('#modal'));
        $('#modalSave').onclick = onSave || closeModal;
        $('#modalClose').onclick = closeModal;
    }

    function closeModal() {
        hide($('#modal'));
        $('#modalBody').innerHTML = '';
    }

    function hideAllPages() {
        document.querySelectorAll('.page').forEach(el => hide(el));
    }

    // Create assignment modal
    function openCreateAssignmentModal() {
        openModal('Create Assignment', `
      <div>
        <label>Title</label><input id="m_title" />
        <label>Description</label><textarea id="m_desc"></textarea>
        <label>Due Date</label><input id="m_due" type="datetime-local" />
      </div>
    `, async () => {
            const title = $('#m_title').value.trim();
            const description = $('#m_desc').value.trim();
            const dueAt = $('#m_due').value;

            if (!title || !dueAt) return alert('Title and due date are required');

            try {
                await apiCall('/assignments', {
                    method: 'POST',
                    body: JSON.stringify({
                        title,
                        description,
                        dueAt: new Date(dueAt).toISOString(),
                        classId: CURRENT_CLASS._id
                    })
                });
                closeModal();
                loadClassAssignments(CURRENT_CLASS._id);
            } catch (error) {
                alert('Error creating assignment: ' + error.message);
            }
        });
    }

    // Make functions globally available
    window.openClass = openClass;
    window.openAssignment = (assignmentId) => {
        // TODO: Implement assignment detail view
        alert('Assignment detail view not implemented yet');
    };

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();