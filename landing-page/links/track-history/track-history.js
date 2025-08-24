async function getPastTracker(filters) {
  const res = await fetch("http://localhost:5001/api/past-tracker/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });
  const { data } = await res.json();
  console.log(data);
  const pastTrackerBody = document.getElementById("past-tracker-body");
  pastTrackerBody.innerHTML = "";
  data.forEach((pastTracker, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${pastTracker.army_no}</td>
      <td>${pastTracker.rank}</td>
      <td>${pastTracker.name}</td>
      <td>${pastTracker.coy}</td>
      <td>${pastTracker.course}</td>
      <td>${pastTracker.courseDuration}</td>
      <td>${pastTracker.grade}</td>
      <td>${pastTracker.ere}</td>
      <td>${pastTracker.remarks}</td>
    `;
    pastTrackerBody.appendChild(row);
  });
}
getPastTracker();

async function searchPastTracker(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  getPastTracker(filters);
}
