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
      <td>${pastTracker.user.army_no}</td>
      <td>${pastTracker.user.rank}</td>
      <td>${pastTracker.user.name}</td>
      <td>${pastTracker.course.courseName}</td>
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

async function getAllCourses() {
  try {
    const res = await fetch("http://localhost:5001/api/courses/getAllCourses");
    const { data } = await res.json();
    console.log(data);
    courses = data;
    // update course select with the data
    const courseSelectPastTracker = document.getElementById(
      "course-select-past-tracker"
    );
    courseSelectPastTracker.innerHTML = "";
    [{ _id: "", courseName: "Select Course" }, ...courses].forEach((course) => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = course.courseName;
      courseSelectPastTracker.appendChild(option);
    });
  } catch (err) {
    console.log(err);
  }
}
getAllCourses();
