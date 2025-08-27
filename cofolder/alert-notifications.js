const alertNotifications = [
  {
    course: "SEC Cdr",
    venue: "Inf school, Mhow",
    daysLeft: 20,
  },
  {
    course: "ITCA",
    venue: "Inf school, Mhow",
    daysLeft: 13,
  },
  {
    course: "NNG",
    venue: "Inf school, Mhow",
    daysLeft: 10,
  },
  {
    course: "MW",
    venue: "Gulmarg, Kashmir",
    daysLeft: 14,
  },
  {
    course: "CLC",
    venue: "NCO Academy, Dhana",
    daysLeft: 20,
  },
  // copy paste below sections for more alerts with comma
  {
    course: "Sniper",
    venue: "Inf school, Mhow",
    daysLeft: 12,
  },
  {
    course: "Sniper 1",
    venue: "Inf school, Mhow",
    daysLeft: 12,
  },
  {
    course: "Sniper 2",
    venue: "Inf school, Mhow",
    daysLeft: 16,
  },
];

function renderAlertNotifications(alerts) {
  const alertNotificationsTableBody = document.getElementById(
    "alert-notifications-table-body"
  );
  alertNotificationsTableBody.innerHTML = "";
  alerts.forEach((alert, index) => {
    const alertNotification = document.createElement("tr");
    alertNotification.innerHTML = `
      <td>${index + 1}</td>
      <td>${alert.course}</td>
      <td>${alert.venue}</td>
      <td>${alert.daysLeft}</td>
    `;
    alertNotificationsTableBody.appendChild(alertNotification);
  });

  const newAlerts = alerts.filter((alert) => alert.daysLeft <= 15).length;
  const alertChip = document.getElementById("alert-chip");
  alertChip.textContent = newAlerts;
  const cardAlerts = document.getElementById("card-alerts");
  cardAlerts.textContent = `${newAlerts} New`;
}

renderAlertNotifications(alertNotifications);
