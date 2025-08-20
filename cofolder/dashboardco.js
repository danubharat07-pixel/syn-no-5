document.addEventListener("DOMContentLoaded", async () => {
  setupTabNavigation();
  setupLogout();
  setupPDFExport();
  loadFeedback();

  // Initialize feedback functionality
  initializeFeedback();

  // Fetch and render overview data
  document.getElementById(
    "card-precourses"
  ).textContent = `${overview.pendingCourses} Courses Pending`;
  document.getElementById(
    "card-progress"
  ).textContent = `${overview.avgProgress}%`;
  document.getElementById(
    "card-attendance"
  ).textContent = `${overview.attendanceRate}%`;
  document.getElementById(
    "card-alerts"
  ).textContent = `${overview.newAlerts} New`;
  document.getElementById(
    "card-feedback"
  ).textContent = `${overview.feedbackCount} Received`;

  // renderAlerts(overview.alerts);
  // renderFeedback(overview.feedback);
  // renderChart('progressChart', overview.trends.dates, overview.trends.progress, 'Progress %');
  // renderChart('attendanceChart', overview.trends.dates, overview.trends.attendance, 'Attendance %');

  // // Fetch and render events & attendance
  // const events = await fetch('/api/events').then(res => res.json());
  // populateTable('events-table', events);
  // const attendance = await fetch('/api/attendance').then(res => res.json());
  // populateTable('attendance-table', attendance);
});

function setupTabNavigation() {
  const tabs = document.querySelectorAll(".sidebar nav li");
  const sections = document.querySelectorAll(".tab-section");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      sections.forEach((sec) => {
        sec.classList.toggle("hidden", sec.id !== target);
      });
    });
  });
}

function setupLogout() {
  document.getElementById("btn-logout").addEventListener("click", () => {
    // clear session, redirect to login
    window.location.href = "index.html";
  });
}

function renderAlerts(alerts) {
  const ul = document.getElementById("alerts-list");
  ul.innerHTML = "";
  alerts.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="alert-date">${a.date}</span> ${a.message}`;
    ul.appendChild(li);
  });
}

function renderFeedback(feedback) {
  console.log("feedback: ", feedback);
  const tbody = document.querySelector("#feedback-table tbody");
  const tbody2 = document.querySelector("#feedback-table-body");
  tbody.innerHTML = "";
  tbody2.innerHTML = "";
  feedback.forEach((f) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.trainee}</td>
      <td>${f.rating}/5</td>
      <td>${f.comments}</td>
      <td>${f.howToImprove}</td>
    `;
    tbody.appendChild(tr);
  });
  feedback.forEach((f) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.trainee}</td>
      <td>${f.rating}/5</td>
      <td>${f.comments}</td>
      <td>${f.howToImprove}</td>
    `;
    tbody2.appendChild(tr);
  });
}

function renderChart(canvasId, labels, data, label) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: "rgba(112,142,82,0.4)",
          borderColor: "#708E52",
          fill: true,
        },
      ],
    },
    options: { scales: { y: { beginAtZero: true, max: 100 } } },
  });
}

function populateTable(tableId, rows) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    Object.values(r).forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function setupPDFExport() {
  document.getElementById("btn-export-pdf").addEventListener("click", () => {
    import("jspdf").then((jsPDF) => {
      const { jsPDF: PDF } = jsPDF;
      const doc = new PDF({ unit: "pt" });
      doc.setFontSize(14);
      doc.text("Feedback & Roster Report", 40, 40);
      // Example: export feedback table
      doc.autoTable({ html: "#feedback-table", startY: 60 });
      // Example: export attendance table
      doc.autoTable({
        html: "#attendance-table",
        startY: doc.lastAutoTable.finalY + 20,
      });
      doc.save("report.pdf");
    });
  });
}

// Feedback Management Functions
function initializeFeedback() {
  // Load feedback when the feedback tab is first clicked
  const feedbackTab = document.querySelector('[data-tab="feedback"]');
  if (feedbackTab) {
    feedbackTab.addEventListener("click", loadFeedback);
  }
}

async function loadFeedback() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    // Load feedback statistics
    const statsResponse = await fetch(
      "http://localhost:5001/api/feedback/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (statsResponse.ok) {
      const { data: stats } = await statsResponse.json();
      updateFeedbackStats(stats);
    }

    // Load all feedback
    const feedbackResponse = await fetch("http://localhost:5001/api/feedback", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (feedbackResponse.ok) {
      const { data: feedbacks } = await feedbackResponse.json();
      displayFeedbackTable(feedbacks);
    }
  } catch (error) {
    console.error("Error loading feedback:", error);
  }
}

function updateFeedbackStats(stats) {
  const totalFeedback = stats.totalFeedback || 0;
  const coFeedback = stats.byRole?.find((r) => r._id === "CO")?.count || 0;
  const avgRating =
    stats.byRole?.reduce((sum, role) => sum + (role.averageRating || 0), 0) /
    (stats.byRole?.length || 1);

  document.getElementById("total-feedback").textContent = totalFeedback;
  document.getElementById("avg-rating").textContent = avgRating.toFixed(1);
}

function displayFeedbackTable(feedbacks) {
  const tableBody = document.querySelector("#feedback-table tbody");
  const tableBody2 = document.querySelector("#feedback-table-body");
  tableBody.innerHTML = "";
  tableBody2.innerHTML = "";
  feedbacks.forEach((feedback) => {
    const row = document.createElement("tr");

    const studentName = feedback.isAnonymous
      ? "Anonymous"
      : feedback.userId
      ? `${feedback.userId.rank} ${feedback.userId.name}`
      : "Unknown";

    const date = new Date(feedback.createdAt).toLocaleDateString();

    row.innerHTML = `
      <td>${feedback.isAnonymous ? "Anonymous" : studentName}</td>
      <td>${feedback.forRole}</td>
      <td>⭐ ${feedback.rating}/5</td>
      <td>${feedback.feedback}</td>
      <td>${feedback.howToImprove}</td>
      <td>${date}</td>
      <td>${feedback.isAnonymous ? "Yes" : "No"}</td>
    `;

    tableBody.appendChild(row);

    const row2 = document.createElement("tr");
    row2.innerHTML = `
      <td>${feedback.isAnonymous ? "Anonymous" : studentName}</td>
      <td>${feedback.forRole}</td>
      <td>⭐ ${feedback.rating}/5</td>
      <td>${feedback.feedback}</td>
      <td>${feedback.howToImprove}</td>
      <td>${date}</td>
      <td>${feedback.isAnonymous ? "Yes" : "No"}</td>
    `;
    tableBody2.appendChild(row2);
  });
}

async function filterFeedback() {
  const roleFilter = document.getElementById("role-filter").value;

  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    let url = "http://localhost:5001/api/feedback";
    if (roleFilter) {
      url = `http://localhost:5001/api/feedback/role/${roleFilter}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const { data: feedbacks } = await response.json();
      displayFeedbackTable(feedbacks);
    }
  } catch (error) {
    console.error("Error filtering feedback:", error);
  }
}
