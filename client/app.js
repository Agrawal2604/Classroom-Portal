// ...existing code...
/* app.js
 A simple client-side demo app with mock data and simulated flows.
 Replace mock functions (DATASTORE.*) with real API fetch calls in your project.
*/

(() => {
  // Simple in-memory datastore (mock)
  const DATASTORE = {
    users: [
      { id: 'u-st1', name: 'Alice Student', role: 'student', email: 'alice@example.com' },
      { id: 'u-t1', name: 'Tom Teacher', role: 'teacher', email: 'tom@example.com' },
      { id: 'u-admin', name: 'Ada Admin', role: 'admin', email: 'ada@school.com' }
    ],
    classes: [
      { id: 'c1', title: 'CS 101', code: 'CS101', teacherId: 'u-t1', members: ['u-st1'], assignments: [] }
    ],
    assignments: [],
    submissions: []
  };

  // small helpers
  const $ = (s) => document.querySelector(s);
  const show = el => el.classList.remove('hidden');
  const hide = el => el.classList.add('hidden');
  const formatDate = d => new Date(d).toLocaleString();

  // state
  let ROLE = 'student'; // default
  let CURRENT_CLASS = null;
  let CURRENT_ASSIGNMENT = null;
  let PAGE = 1;
  const PAGE_SIZE = 5;

  // init
  function init() {
    // bind role selection
    const roleSelect = $('#roleSelect');
    roleSelect.value = ROLE;
    roleSelect.addEventListener('change', (e) => {
      ROLE = e.target.value;
      renderDashboard();
    });

    $('#logoutBtn').addEventListener('click', () => {
      // simulated logout - reset to student
      ROLE = 'student';
      $('#roleSelect').value = ROLE;
      alert('Logged out (simulated)');
      renderDashboard();
    });

    // seed sample data
    $('#adminSeedBtn')?.addEventListener('click', () => { seedSample(); renderDashboard(); });

    // student joins
    $('#joinClassBtn')?.addEventListener('click', () => {
      const code = $('#joinCodeInput').value.trim();
      if (!code) return alert('Enter join code');
      const cls = DATASTORE.classes.find(c => c.code === code);
      if (!cls) return alert('Invalid code');
      const userId = DATASTORE.users.find(u => u.role === 'student').id; // demo: single student
      if (!cls.members.includes(userId)) cls.members.push(userId);
      alert('Joined class!');
      renderDashboard();
    });

    // teacher create class (modal)
    $('#teacherCreateClassBtn')?.addEventListener('click', () => openModal('Create Class', `
      <div>
        <label>Title</label><input id="m_title" />
        <label>Code</label><input id="m_code" />
      </div>
    `, () => {
      const title = $('#m_title').value.trim();
      const code = $('#m_code').value.trim();
      if (!title || !code) return alert('Fill both fields');
      const teacherId = DATASTORE.users.find(u => u.role === 'teacher').id;
      const newClass = { id: 'c' + (DATASTORE.classes.length + 1), title, code, teacherId, members: [], assignments: [] };
      DATASTORE.classes.push(newClass);
      closeModal();
      renderDashboard();
    }));

    // admin create class
    $('#adminCreateClassBtn')?.addEventListener('click', () => openModal('Create Class (Admin)', `
      <div><label>Title</label><input id="m_title" /><label>Code</label><input id="m_code" /></div>
    `, () => {
      const title = $('#m_title').value.trim();
      const code = $('#m_code').value.trim();
      if (!title || !code) return alert('Fill both fields');
      const adminTeacher = DATASTORE.users.find(u => u.role === 'teacher')?.id || DATASTORE.users[0].id;
      DATASTORE.classes.push({ id: 'c' + (DATASTORE.classes.length + 1), title, code, teacherId: adminTeacher, members: [], assignments: [] });
      closeModal();
      renderDashboard();
    }));

    // seed initially
    if (DATASTORE.assignments.length === 0) seedSample();
    attachClassPageButtons();
    renderDashboard();
  }

  function seedSample() {
    DATASTORE.assignments = [];
    DATASTORE.submissions = [];
    // create an assignment
    const due1 = new Date(); due1.setDate(due1.getDate() + 3);
    createAssignment('c1', { title: 'Assignment 1: Intro', description: 'Do the exercises', dueAt: due1.toISOString() });
    const due2 = new Date(); due2.setDate(due2.getDate() - 2);
    createAssignment('c1', { title: 'Assignment 0: Warmup', description: 'Warmup tasks', dueAt: due2.toISOString() });
    // create a submission to show grading
    const a0 = DATASTORE.assignments[0];
    DATASTORE.submissions.push({
      id: 's1', assignmentId: a0.id, studentId: 'u-st1', linkOrFiles: [{ type: 'link', url: 'https://github.com/alice/proj' }],
      submittedAt: new Date().toISOString(), late: false, status: 'submitted', grade: null, feedback: null
    });
  }

  // CRUD (mock)
  function createAssignment(classId, { title, description, dueAt }) {
    const id = 'a' + (DATASTORE.assignments.length + 1);
    const assn = { id, classId, title, description, dueAt, attachments: [], createdBy: 'u-t1', visibility: 'class' };
    DATASTORE.assignments.push(assn);
    const cls = DATASTORE.classes.find(c => c.id === classId);
    if (cls) cls.assignments.push(id);
    return assn;
  }

  function createSubmission(assignmentId, { studentId, link, fileMeta }) {
    const id = 'sub' + (DATASTORE.submissions.length + 1);
    const now = new Date();
    const asg = DATASTORE.assignments.find(a => a.id === assignmentId);
    const due = new Date(asg.dueAt);
    const late = now > due;
    const submission = {
      id,
      assignmentId,
      studentId,
      linkOrFiles: [],
      submittedAt: now.toISOString(),
      late,
      status: 'submitted',
      grade: null,
      feedback: null
    };
    if (link) submission.linkOrFiles.push({ type: 'link', url: link });
    if (fileMeta) submission.linkOrFiles.push({ type: 'file', meta: fileMeta });
    DATASTORE.submissions.push(submission);
    return submission;
  }

  function gradeSubmission(subId, { score, feedback }) {
    const s = DATASTORE.submissions.find(x => x.id === subId);
    if (!s) return null;
    s.grade = { score, max: 100 };
    s.feedback = feedback;
    s.status = 'graded';
    s.gradedAt = new Date().toISOString();
    return s;
  }

  // Render dashboards per role
  function renderDashboard() {
    // hide all
    document.querySelectorAll('.page').forEach(el => hide(el));
    CURRENT_CLASS = null;
    CURRENT_ASSIGNMENT = null;

    if (ROLE === 'student') {
      renderStudent();
      show($('#studentDashboard'));
    } else if (ROLE === 'teacher') {
      renderTeacher();
      show($('#teacherDashboard'));
    } else if (ROLE === 'admin') {
      renderAdmin();
      show($('#adminDashboard'));
    }
  }

  // STUDENT
  function renderStudent() {
    const student = DATASTORE.users.find(u => u.role === 'student');
    const classes = DATASTORE.classes.filter(c => c.members.includes(student.id));
    const ul = $('#studentClassesList'); ul.innerHTML = '';
    classes.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${c.title}</strong><div class="muted small">Code: ${c.code}</div></div>
                      <div><button class="btn subtle" data-cid="${c.id}">Open</button></div>`;
      ul.appendChild(li);
    });
    ul.querySelectorAll('button').forEach(b => b.addEventListener('click', e => openClass(e.target.dataset.cid)));

    // my submissions
    const subs = DATASTORE.submissions.filter(s => s.studentId === student.id);
    const mys = $('#mySubmissionsList'); mys.innerHTML = '';
    subs.forEach(s => {
      const asg = DATASTORE.assignments.find(a => a.id === s.assignmentId);
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${asg.title}</strong><div class="muted small">Status: ${s.status} • Submitted: ${formatDate(s.submittedAt)}</div></div>
                      <div><button class="btn subtle" data-sid="${s.id}">View</button></div>`;
      mys.appendChild(li);
    });
    mys.querySelectorAll('button').forEach(b => b.addEventListener('click', e => openSubmissionDetail(e.target.dataset.sid)));
  }

  // TEACHER
  function renderTeacher() {
    const teacher = DATASTORE.users.find(u => u.role === 'teacher');
    const classes = DATASTORE.classes.filter(c => c.teacherId === teacher.id);
    const ul = $('#teacherClassesList'); ul.innerHTML = '';
    classes.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${c.title}</strong><div class="muted small">Code: ${c.code}</div></div>
                      <div><button class="btn subtle" data-cid="${c.id}">Open</button></div>`;
      ul.appendChild(li);
    });
    ul.querySelectorAll('button').forEach(b => b.addEventListener('click', e => openClass(e.target.dataset.cid)));

    const recent = DATASTORE.assignments.slice(-5).reverse();
    const ra = $('#teacherAssignmentsList'); ra.innerHTML = '';
    recent.forEach(a => {
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${a.title}</strong><div class="muted small">Due: ${new Date(a.dueAt).toLocaleString()}</div></div>
                      <div><button class="btn subtle" data-aid="${a.id}">Open</button></div>`;
      ra.appendChild(li);
    });
    ra.querySelectorAll('button').forEach(b => b.addEventListener('click', e => openAssignment(e.target.dataset.aid)));
  }

  // ADMIN
  function renderAdmin() {
    const ul = $('#adminUsersList'); ul.innerHTML = '';
    DATASTORE.users.forEach(u => {
      const li = document.createElement('li');
      li.innerHTML = `<div>${u.name} <div class="muted small">${u.email} • ${u.role}</div></div>
                      <div><select data-uid="${u.id}" class="roleChange">
                        <option value="student" ${u.role==='student'?'selected':''}>student</option>
                        <option value="teacher" ${u.role==='teacher'?'selected':''}>teacher</option>
                        <option value="admin" ${u.role==='admin'?'selected':''}>admin</option>
                      </select></div>`;
      ul.appendChild(li);
    });
    ul.querySelectorAll('.roleChange').forEach(sel => sel.addEventListener('change', e => {
      const id = e.target.dataset.uid; const val = e.target.value;
      const user = DATASTORE.users.find(x => x.id === id); if (user) user.role = val;
      alert('Role updated (simulated)');
      renderDashboard();
    }));

    const cu = $('#adminClassesList'); cu.innerHTML = '';
    DATASTORE.classes.forEach(c => {
      const teacher = DATASTORE.users.find(u => u.id === c.teacherId);
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${c.title}</strong><div class="muted small">Teacher: ${teacher?.name || '-'}</div></div>
                      <div><button class="btn subtle" data-cid="${c.id}">Open</button></div>`;
      cu.appendChild(li);
    });
    cu.querySelectorAll('button').forEach(b => b.addEventListener('click', e => openClass(e.target.dataset.cid)));
  }

  // OPEN CLASS
  function openClass(classId) {
    const cls = DATASTORE.classes.find(c => c.id === classId);
    if (!cls) return alert('Class not found');
    CURRENT_CLASS = cls;
    // header
    $('#classTitle').textContent = cls.title;
    $('#classTeacher').textContent = `Teacher: ${DATASTORE.users.find(u=>u.id===cls.teacherId)?.name || '-'}`;
    $('#classCode').textContent = `Code: ${cls.code}`;
    // show/hide create assignment btn only for teacher
    if (ROLE === 'teacher') show($('#createAssignmentBtn')); else hide($('#createAssignmentBtn'));
    // bindings
    $('#createAssignmentBtn').onclick = () => openCreateAssignmentModal();
    $('#backToDashboardBtn').onclick = () => renderDashboard();

    // assignments list with pagination & search
    $('#assignSearch').value = '';
    $('#assignFilter').value = 'all';
    PAGE = 1;
    renderAssignments();
    hideAllPages();
    show($('#classPage'));
  }

  function hideAllPages() {
    document.querySelectorAll('.page').forEach(el => hide(el));
  }

  // ASSIGNMENTS list render
  function renderAssignments() {
    const q = $('#assignSearch').value.trim().toLowerCase();
    const filter = $('#assignFilter').value;
    const ids = CURRENT_CLASS.assignments || [];
    let list = DATASTORE.assignments.filter(a => ids.includes(a.id));
    if (q) list = list.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    if (filter === 'upcoming') list = list.filter(a => new Date(a.dueAt) > new Date());
    if (filter === 'overdue') list = list.filter(a => new Date(a.dueAt) < new Date());

    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    PAGE = Math.min(PAGE, pages);
    const start = (PAGE - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);

    const ul = $('#assignmentsList'); ul.innerHTML = '';
    pageItems.forEach(a => {
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${a.title}</strong><div class="muted small">Due: ${new Date(a.dueAt).toLocaleString()}</div></div>
                      <div><button class="btn subtle" data-aid="${a.id}">Open</button></div>`;
      ul.appendChild(li);
    });
    ul.querySelectorAll('button').forEach(b => b.addEventListener('click', e => openAssignment(e.target.dataset.aid)));

    $('#pageInfo').textContent = `${PAGE} / ${pages}`;
    $('#prevPage').onclick = () => { PAGE = Math.max(1, PAGE - 1); renderAssignments(); };
    $('#nextPage').onclick = () => { PAGE = Math.min(pages, PAGE + 1); renderAssignments(); };
    $('#assignSearch').oninput = debounce(() => { PAGE = 1; renderAssignments(); }, 300);
    $('#assignFilter').onchange = () => { PAGE = 1; renderAssignments(); };
  }

  // OPEN ASSIGNMENT
  function openAssignment(assignmentId) {
    const a = DATASTORE.assignments.find(x => x.id === assignmentId);
    if (!a) return alert('Assignment not found');
    CURRENT_ASSIGNMENT = a;
    $('#assignmentTitle').textContent = a.title;
    $('#assignmentDesc').textContent = a.description;
    $('#assignmentDue').textContent = new Date(a.dueAt).toLocaleString();
    const due = new Date(a.dueAt);
    $('#assignmentStatus').textContent = (new Date() > due) ? 'Overdue' : 'Open';

    // submission area - show student's submission or empty
    const student = DATASTORE.users.find(u => u.role === 'student');
    const mySub = DATASTORE.submissions.find(s => s.assignmentId === a.id && s.studentId === student.id);
    const subArea = $('#submissionArea'); subArea.innerHTML = '';
    if (mySub) {
      let gradeHtml = '';
      if (mySub.grade) gradeHtml = `<div class="muted small">Score: ${mySub.grade.score}</div><div class="muted small">Feedback: ${mySub.feedback}</div>`;
      subArea.innerHTML = `<div><strong>Your submission</strong>
        <div class="muted small">${mySub.linkOrFiles.map(x=> x.type==='link' ? x.url : '[file]').join(', ')}</div>
        <div class="muted small">Submitted: ${formatDate(mySub.submittedAt)} • Late: ${mySub.late ? 'Yes' : 'No'}</div>
        <div class="muted small">Status: ${mySub.status}</div>
        ${gradeHtml}
      </div>`;
    } else {
      subArea.innerHTML = `<div class="muted small">You haven't submitted yet.</div>`;
    }

    // show/hide submit form based on role and deadline
    const deadlinePassed = new Date() > new Date(a.dueAt);
    if (ROLE === 'student') {
      show($('#submitForm'));
      $('#submissionLink').value = '';
      $('#submissionFile').value = '';
      $('#submitBtn').onclick = async () => {
        // gather link and file metadata
        const link = $('#submissionLink').value.trim();
        const f = $('#submissionFile').files[0];
        if (!link && !f) return alert('Provide a link or a file');
        let fileMeta = null;
        if (f) fileMeta = { name: f.name, size: f.size, type: f.type };
        const studentId = DATASTORE.users.find(u => u.role === 'student').id;
        createSubmission(a.id, { studentId, link: link || null, fileMeta });
        alert('Submitted (simulated).');
        openAssignment(a.id); // refresh
      };
      if (deadlinePassed) {
        // demo: we still allow submit but mark late. Could be blocked in production
        // show note
        $('#submitForm').insertAdjacentHTML('beforeend', '<div class="muted small">Note: this will be marked late.</div>');
      }
    } else {
      hide($('#submitForm'));
    }

    // Submissions queue for teacher view
    const queue = $('#submissionsQueue'); queue.innerHTML = '';
    const subs = DATASTORE.submissions.filter(s => s.assignmentId === a.id);
    subs.forEach(s => {
      const student = DATASTORE.users.find(u => u.id === s.studentId);
      const li = document.createElement('li');
      const scoreText = s.grade ? ` • Score: ${s.grade.score}` : '';
      const openBtn = ROLE==='teacher' ? `<button class="btn subtle" data-sub="${s.id}">Open</button>` : '';
      li.innerHTML = `<div><strong>${student?.name}</strong><div class="muted small">${s.linkOrFiles.map(x=> x.type==='link'?x.url:'[file]').join(', ')} • ${s.status}${scoreText}</div></div>
                      <div>
                        ${openBtn}
                        <button class="btn subtle" data-subview="${s.id}">View</button>
                      </div>`;
      queue.appendChild(li);
    });

    queue.querySelectorAll('[data-sub]').forEach(b => b.addEventListener('click', e => openTeacherGradePanel(e.target.dataset.sub)));
    queue.querySelectorAll('[data-subview]').forEach(b => b.addEventListener('click', e => openSubmissionDetail(e.target.dataset.subview)));

    // grading panel hidden initially
    hide($('#gradePanel'));
    $('#saveGradeBtn').onclick = () => {};
    hideAllPages();
    show($('#assignmentPage'));
  }

  // open submission detail (student or teacher view)
  function openSubmissionDetail(subId) {
    const s = DATASTORE.submissions.find(x => x.id === subId);
    if (!s) return alert('Submission not found');
    const asg = DATASTORE.assignments.find(a => a.id === s.assignmentId);
    const student = DATASTORE.users.find(u => u.id === s.studentId);
    const linksHtml = s.linkOrFiles.map(x => {
      if (x.type === 'link') return `<a href="${x.url}" target="_blank">${x.url}</a>`;
      return x.meta?.name || '[file]';
    }).join(', ');
    openModal(`Submission - ${asg.title}`, `
      <div>
        <p><strong>Student:</strong> ${student?.name}</p>
        <p><strong>Submitted:</strong> ${formatDate(s.submittedAt)} • Late: ${s.late ? 'Yes' : 'No'}</p>
        <p><strong>Files/Links:</strong> ${linksHtml}</p>
        <p><strong>Status:</strong> ${s.status}</p>
        <p><strong>Score:</strong> ${s.grade ? s.grade.score : 'Not graded'}</p>
        <p><strong>Feedback:</strong> ${s.feedback || '-'}</p>
      </div>
    `, () => closeModal());
  }

  // teacher grade panel
  function openTeacherGradePanel(subId) {
    const sub = DATASTORE.submissions.find(x => x.id === subId);
    if (!sub) return alert('Not found');
    show($('#gradePanel'));
    $('#gradeScore').value = sub.grade ? sub.grade.score : '';
    $('#gradeFeedback').value = sub.feedback || '';
    $('#saveGradeBtn').onclick = () => {
      const score = Number($('#gradeScore').value);
      const feedback = $('#gradeFeedback').value.trim();
      if (isNaN(score) || score < 0 || score > 100) return alert('Invalid score');
      gradeSubmission(subId, { score, feedback });
      alert('Saved grade (simulated).');
      openAssignment(sub.assignmentId);
    };
  }

  // open class create assignment modal (teacher)
  function openCreateAssignmentModal() {
    openModal('Create Assignment', `
      <div>
        <label>Title</label><input id="m_title" />
        <label>Description</label><textarea id="m_desc"></textarea>
        <label>Due at (ISO datetime)</label><input id="m_due" placeholder="${new Date().toISOString()}" />
      </div>
    `, () => {
      const title = $('#m_title').value.trim();
      const desc = $('#m_desc').value.trim();
      const due = $('#m_due').value.trim();
      if (!title || !due) return alert('Title and due date required');
      const a = createAssignment(CURRENT_CLASS.id, { title, description: desc, dueAt: new Date(due).toISOString() });
      closeModal(); openClass(CURRENT_CLASS.id);
    });
  }

  // modal helpers
  function openModal(title, html, onSave) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = html;
    show($('#modal'));
    $('#modalSave').onclick = onSave || (() => closeModal());
    $('#modalClose').onclick = closeModal;
  }
  function closeModal() { hide($('#modal')); $('#modalBody').innerHTML = ''; }

  function attachClassPageButtons(){
    $('#backToDashboardBtn').addEventListener('click', () => renderDashboard());
    $('#backToClassBtn').addEventListener('click', () => openClass(CURRENT_CLASS?.id));
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
  }

  // Expose a function to open a class (used in some list buttons)
  window.openClass = openClass;

  // Initialize
  init();

})();
// ...existing code...