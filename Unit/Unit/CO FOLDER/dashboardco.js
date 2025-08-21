document.addEventListener('DOMContentLoaded', async () => {
  setupTabNavigation();
  setupLogout();
  setupPDFExport();

  // Fetch and render overview data
  const overview = await fetch('/api/overview').then(res => res.json());
  document.getElementById('card-precourses').textContent = `${overview.pendingCourses} Courses Pending`;
  document.getElementById('card-progress').textContent = `${overview.avgProgress}%`;
  document.getElementById('card-attendance').textContent = `${overview.attendanceRate}%`;
  document.getElementById('card-alerts').textContent = `${overview.newAlerts} New`;
  document.getElementById('card-feedback').textContent = `${overview.feedbackCount} Received`;

  renderAlerts(overview.alerts);
  renderFeedback(overview.feedback);
  renderChart('progressChart', overview.trends.dates, overview.trends.progress, 'Progress %');
  renderChart('attendanceChart', overview.trends.dates, overview.trends.attendance, 'Attendance %');

  // Fetch and render events & attendance
  const events = await fetch('/api/events').then(res => res.json());
  populateTable('events-table', events);
  const attendance = await fetch('/api/attendance').then(res => res.json());
  populateTable('attendance-table', attendance);
});

function setupTabNavigation() {
  const tabs = document.querySelectorAll('.sidebar nav li');
  const sections = document.querySelectorAll('.tab-section');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      sections.forEach(sec => {
        sec.classList.toggle('hidden', sec.id !== target);
      });
    });
  });
}

function setupLogout() {
  document.getElementById('btn-logout').addEventListener('click', () => {
    // clear session, redirect to login
    window.location.href = 'index.html';
  });
}

function renderAlerts(alerts) {
  const ul = document.getElementById('alerts-list');
  ul.innerHTML = '';
  alerts.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="alert-date">${a.date}</span> ${a.message}`;
    ul.appendChild(li);
  });
}

function renderFeedback(feedback) {
  const tbody = document.querySelector('#feedback-table tbody');
  tbody.innerHTML = '';
  feedback.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${f.trainee}</td>
      <td>${f.course}</td>
      <td>${f.rating}/5</td>
      <td>${f.comments}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderChart(canvasId, labels, data, label) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label, data, backgroundColor: 'rgba(112,142,82,0.4)', borderColor: '#708E52', fill: true }] },
    options: { scales: { y: { beginAtZero: true, max: 100 } } }
  });
}

function populateTable(tableId, rows) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    Object.values(r).forEach(val => {
      const td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function setupPDFExport() {
  document.getElementById('btn-export-pdf').addEventListener('click', () => {
    import('jspdf').then(jsPDF => {
      const { jsPDF: PDF } = jsPDF;
      const doc = new PDF({ unit: 'pt' });
      doc.setFontSize(14);
      doc.text('Feedback & Roster Report', 40, 40);
      // Example: export feedback table
      doc.autoTable({ html: '#feedback-table', startY: 60 });
      // Example: export attendance table
      doc.autoTable({ html: '#attendance-table', startY: doc.lastAutoTable.finalY + 20 });
      doc.save('report.pdf');
    });
  });
}
