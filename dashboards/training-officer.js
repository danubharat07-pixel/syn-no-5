async function getMaterials() {
  const res = await fetch(
    "http://localhost:5001/api/materials?forRole=TrgOffr"
  );
  const { data } = await res.json();
  console.log(data);
  const materialSelect = document.getElementById("materialSelect");
  materialSelect.innerHTML = "";
  data.forEach((material) => {
    const materialCard = document.createElement("button");
    materialCard.className = "material-card btn btn--info";
    materialCard.innerHTML =
      material.title +
      " - " +
      new Date(material.createdAt).toLocaleDateString();
    materialCard.onclick = () => {
      window.open(`http://localhost:5001/${material.link}`, "_blank");
    };
    materialSelect.appendChild(materialCard);
  });
}

getMaterials();

async function addSticky(event, role) {
  try {
    event.preventDefault();
    const form = event.target;
    const content = form.noteInput.value;
    const res = await fetch("http://localhost:5001/api/sticky", {
      method: "POST",
      body: JSON.stringify({ content, role }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    form.noteInput.value = "";
  } catch (error) {
    console.error(error);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}

async function submitFeedback(event) {
  event.preventDefault();

  const feedbackStatus = document.getElementById("feedback-status");

  try {
    feedbackStatus.textContent = "Submitting feedback...";
    feedbackStatus.style.color = "#666";

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData(event.target);
    const feedbackData = {
      forRole: formData.get("forRole"),
      feedback: formData.get("feedback"),
      howToImprove: formData.get("howToImprove"),
      rating: parseInt(formData.get("rating")),
      isAnonymous: formData.get("isAnonymous") === "on",
    };

    const res = await fetch("http://localhost:5001/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(feedbackData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Submission failed: ${res.status}`);
    }

    const { data } = await res.json();
    console.log("Feedback submitted:", data);

    // Show success message
    feedbackStatus.textContent = "Feedback submitted successfully!";
    feedbackStatus.style.color = "#51cf66";

    // Reset form
    event.target.reset();

    // Refresh the feedback list to show the new feedback
    loadMyFeedback();

    // Clear status message after 3 seconds
    setTimeout(() => {
      feedbackStatus.textContent = "";
    }, 3000);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    feedbackStatus.textContent = `Submission failed: ${error.message}`;
    feedbackStatus.style.color = "#ff6b6b";

    // Clear error message after 5 seconds
    setTimeout(() => {
      feedbackStatus.textContent = "";
    }, 5000);
  }
}

async function getAllCourses() {
  const res = await fetch("http://localhost:5001/api/courses/getAllCourses");
  const { data } = await res.json();
  console.log(data);
  const courseSelect = document.getElementById("course-select");
  courseSelect.innerHTML = "";
  const courseSelectAddSchedule = document.getElementById(
    "course-select-add-schedule"
  );
  courseSelectAddSchedule.innerHTML = "";
  [{ _id: "", courseName: "Select course" }, ...data].forEach((course) => {
    const option = document.createElement("option");
    option.value = course._id;
    option.textContent = course.courseName;
    courseSelect.appendChild(option);
  });
  [{ _id: "", courseName: "Select course" }, ...data].forEach((course) => {
    const option = document.createElement("option");
    option.value = course._id;
    option.textContent = course.courseName;
    courseSelectAddSchedule.appendChild(option);
  });
}

getAllCourses();

async function submitSummary(event) {
  event.preventDefault();
  try {
    const form = event.target;
    const formData = new FormData(form);

    const res = await fetch("http://localhost:5001/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Submission failed: ${res.status}`);
    }

    const { data } = await res.json();
    console.log("Summary submitted:", data);

    // Show success message
    const summaryStatus = document.getElementById("summary-status");
    summaryStatus.textContent = "Summary submitted successfully!";
    summaryStatus.style.color = "#51cf66";

    // Reset form
    form.reset();

    // Clear status message after 3 seconds
    setTimeout(() => {
      summaryStatus.textContent = "";
    }, 3000);
  } catch (error) {
    console.error("Error submitting summary:", error);
    const summaryStatus = document.getElementById("summary-status");
    summaryStatus.textContent = `Submission failed: ${error.message}`;
    summaryStatus.style.color = "#ff6b6b";

    // Clear error message after 5 seconds
    setTimeout(() => {
      summaryStatus.textContent = "";
    }, 5000);
  }
}

async function getDailySchedule(event) {
  try {
    event?.preventDefault();
    const date =
      event?.target?.date?.value ||
      document.getElementById("date-filter")?.value ||
      new Date().toISOString().split("T")[0];
    const res = await fetch(
      `http://localhost:5001/api/daily-schedule?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const { data } = await res.json();
    console.log(data);
    const dailySchedule = document.getElementById("daily-schedule");
    dailySchedule.innerHTML = data
      .map((schedule, index) => {
        return `<tr>
          <td>${index + 1}</td>
          <td>${new Date(schedule.date).toLocaleDateString()}</td>
          <td>${schedule.time}</td>
          <td>${schedule.course?.courseName || "N/A"}</td>
          <td>${schedule.activity}</td>
          <td>${schedule.instructor}</td>
          <td>
            <button class="btn btn--danger" onclick="deleteSchedule('${
              schedule._id
            }')">
              Delete
            </button>
          </td>
        </tr>`;
      })
      .join("");
  } catch (error) {
    console.error(error);
  }
}

getDailySchedule();

async function addSchedule(event) {
  try {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Convert FormData to JSON object
    const scheduleData = {};
    formData.forEach((value, key) => {
      scheduleData[key] = value;
    });

    // Combine timeFrom and timeTo into a single time field
    if (scheduleData.timeFrom && scheduleData.timeTo) {
      scheduleData.time = `${scheduleData.timeFrom} - ${scheduleData.timeTo}`;
      delete scheduleData.timeFrom;
      delete scheduleData.timeTo;
    }

    console.log("Submitting schedule data:", scheduleData);

    const res = await fetch("http://localhost:5001/api/daily-schedule", {
      method: "POST",
      body: JSON.stringify(scheduleData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Submission failed: ${res.status}`);
    }

    const { data } = await res.json();
    console.log("Schedule added:", data);

    // Close the modal
    $("#addScheduleModal").modal("hide");

    // Reset the form
    form.reset();

    // Refresh the schedule list
    getDailySchedule();
  } catch (error) {
    console.error("Error adding schedule:", error);
    alert("Failed to add schedule: " + error.message);
  }
}

async function deleteSchedule(scheduleId) {
  const res = await fetch(
    `http://localhost:5001/api/daily-schedule?scheduleId=${scheduleId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Deletion failed: ${res.status}`);
  }
  getDailySchedule();
}

// Populate course dropdown in the add schedule modal
function populateAddScheduleCourses() {
  getAllCourses().then(() => {
    const mainCourseSelect = document.getElementById("course-select");
    const modalCourseSelect = document.getElementById(
      "course-select-add-schedule"
    );

    if (mainCourseSelect && modalCourseSelect) {
      // Copy options from main course select to modal course select
      modalCourseSelect.innerHTML = mainCourseSelect.innerHTML;
      modalCourseSelect.classList.add("form-control"); // Add Bootstrap styling
    }
  });
}

// Call this when the modal opens
$(document).ready(function () {
  $("#addScheduleModal").on("show.bs.modal", function () {
    populateAddScheduleCourses();
  });
});
